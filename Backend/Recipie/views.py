from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib import messages
from django.shortcuts import render
from django.db.models import Avg, Count
from .models import Recipe, Category, MealType, Cuisine, DietaryRestriction, Ingredient, Instruction, Rating
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.middleware.csrf import get_token

def signup_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        # Validation checks
        if password != confirm_password:
            messages.error(request, 'Passwords do not match!')
            return redirect('signup')

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists!')
            return redirect('signup')

        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already registered!')
            return redirect('signup')

        # Create new user
        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            # Log the user in after signup
            auth_login(request, user)
            messages.success(request, 'Account created successfully!')
            return redirect('home')
        except Exception as e:
            messages.error(request, f'Error creating account: {str(e)}')
            return redirect('signup')

    return render(request, 'signup.html')

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            # Get username from email
            user = User.objects.get(email=email)
            # Authenticate using username
            authenticated_user = authenticate(request, username=user.username, password=password)
            
            if authenticated_user is not None:
                auth_login(request, authenticated_user)
                messages.success(request, 'Login successful!')
                return redirect('home')
            else:
                messages.error(request, 'Invalid credentials!')
        except User.DoesNotExist:
            messages.error(request, 'No account found with this email!')
        except Exception as e:
            messages.error(request, f'Error during login: {str(e)}')

    return render(request, 'login.html')

def viewrecipie(request):
    # Get all recipes with related data
    recipes_queryset = Recipe.objects.select_related('author').prefetch_related(
        'ingredients',
        'instructions',
        'meal_types',
        'cuisines',
        'dietary_restrictions'
    ).all()

    # Transform database data to match frontend format
    recipes = []
    for recipe in recipes_queryset:
        # Get categories and other related data
        meal_types = [mt.name for mt in recipe.meal_types.all()]
        cuisines = [c.name for c in recipe.cuisines.all()]
        dietary_restrictions = [dr.name for dr in recipe.dietary_restrictions.all()]
        
        # Calculate time category
        cook_time_mins = recipe.prep_time
        if cook_time_mins < 15:
            time_category = 'under-15-mins'
        elif cook_time_mins < 30:
            time_category = '15-30-mins'
        elif cook_time_mins < 60:
            time_category = '30-60-mins'
        else:
            time_category = 'over-60-mins'

        # Format ingredients
        ingredients = []
        for ingredient in recipe.ingredients.all().order_by('order'):
            ingredients.append(
                f"{ingredient.quantity} {ingredient.unit} {ingredient.name}"
            )

        # Format recipe data
        recipe_data = {
            'id': recipe.id,
            'title': recipe.title,
            'rating': recipe.rating,
            'description': recipe.description,
            'time': f"{recipe.prep_time} mins",
            'time_category': time_category,
            'servings': recipe.servings,
            'calories': recipe.calories,
            'image': recipe.image.url if recipe.image else None,
            'meal_types': meal_types,
            'cuisines': cuisines,
            'dietary_restrictions': dietary_restrictions,
            'difficulty': recipe.difficulty,
            'ingredients': ingredients,
            'instructions': [
                instruction.description 
                for instruction in recipe.instructions.all().order_by('step_number')
            ],
            'user': {
                'id': recipe.author.id,
                'username': recipe.author.username,
                'email': recipe.author.email
            },
            'created_at': recipe.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            'updated_at': recipe.updated_at.strftime("%Y-%m-%d %H:%M:%S")
        }
        recipes.append(recipe_data)

    # Get filter options
    filter_options = {
        'meal_type': list(MealType.objects.values_list('name', flat=True)),
        'cuisine': list(Cuisine.objects.values_list('name', flat=True)),
        'dietary_restrictions': list(DietaryRestriction.objects.values_list('name', flat=True)),
        'cooking_time': [
            'under-15-mins',
            '15-30-mins',
            '30-60-mins',
            'over-60-mins'
        ],
        'difficulty': [choice[0] for choice in Recipe.DIFFICULTY_CHOICES]
    }

    # Calculate statistics
    stats = {
        'total_recipes': Recipe.objects.count(),
        'avg_rating': round(Recipe.objects.aggregate(Avg('rating'))['rating__avg'] or 0, 1),
        'avg_time': round(Recipe.objects.aggregate(Avg('prep_time'))['prep_time__avg'] or 0),
    }

    # Convert recipes to JSON for JavaScript
    from django.core.serializers.json import DjangoJSONEncoder
    import json
    recipes_json = json.dumps(recipes, cls=DjangoJSONEncoder)

    context = {
        'recipes': recipes,
        'recipes_json': recipes_json,
        'filter_options': filter_options,  # Changed from 'categories' to 'filter_options'
        'stats': stats
    }

    return render(request, 'viewrecipie.html', context)

@login_required
def add_recipe(request):
    if request.method == 'POST':
        try:
            # Create recipe
            recipe = Recipe.objects.create(
                title=request.POST['title'],
                description=request.POST['description'],
                servings=int(request.POST['servings']),
                prep_time=int(request.POST['prep_time']),
                calories=int(request.POST['calories']),
                difficulty=request.POST['difficulty'],
                image=request.FILES['image'],
                author=request.user
            )

            # Add categories (handle multiple selections)
            meal_types = request.POST.getlist('meal_type')
            cuisines = request.POST.getlist('cuisine')
            dietary_restrictions = request.POST.getlist('dietary_restrictions')

            recipe.meal_types.set(meal_types)
            recipe.cuisines.set(cuisines)
            recipe.dietary_restrictions.set(dietary_restrictions)

            # Add ingredients
            ingredient_names = request.POST.getlist('ingredient_name[]')
            ingredient_quantities = request.POST.getlist('ingredient_quantity[]')
            ingredient_units = request.POST.getlist('ingredient_unit[]')

            for i in range(len(ingredient_names)):
                if ingredient_names[i].strip():  # Only create if name is not empty
                    Ingredient.objects.create(
                        recipe=recipe,
                        name=ingredient_names[i],
                        quantity=ingredient_quantities[i],
                        unit=ingredient_units[i],
                        order=i+1
                    )

            # Add instructions
            instructions = request.POST.getlist('instructions[]')
            for i, instruction in enumerate(instructions, 1):
                if instruction.strip():  # Only create if instruction is not empty
                    Instruction.objects.create(
                        recipe=recipe,
                        step_number=i,
                        description=instruction
                    )

            messages.success(request, 'Recipe added successfully!')
            return redirect('viewrecipie')

        except Exception as e:
            print("Error:", str(e))  # For debugging
            messages.error(request, f'Error adding recipe: {str(e)}')
            return redirect('add_recipe')

    # GET request - show form
    context = {
        'meal_types': MealType.objects.all(),
        'cuisines': Cuisine.objects.all(),
        'dietary_restrictions': DietaryRestriction.objects.all(),
    }
    return render(request, 'add_recipe.html', context)

@login_required
def home(request):
    # Get all recipes for the current user with related data
    user_recipes = Recipe.objects.filter(author=request.user).select_related('author').prefetch_related(
        'ingredients',
        'instructions',
        'meal_types',
        'cuisines',
        'dietary_restrictions'
    ).order_by('-created_at')  # Most recent first

    # Transform recipe data for the template
    recipes = []
    total_likes = 0  # Initialize total likes counter

    for recipe in user_recipes:
        # Get categories
        categories = []
        categories.extend([mt.name for mt in recipe.meal_types.all()])
        categories.extend([c.name for c in recipe.cuisines.all()])
        categories.extend([dr.name for dr in recipe.dietary_restrictions.all()])

        # Format ingredients
        ingredients = []
        for ingredient in recipe.ingredients.all().order_by('order'):
            ingredients.append(
                f"{ingredient.quantity} {ingredient.unit} {ingredient.name}"
            )

        # Format recipe data
        recipe_data = {
            'id': recipe.id,
            'title': recipe.title,
            'description': recipe.description,
            'time': f"{recipe.prep_time} mins",
            'servings': recipe.servings,
            'calories': recipe.calories,
            'rating': recipe.rating if hasattr(recipe, 'rating') else 0,
            'image': recipe.image.url if recipe.image else None,
            'categories': categories,
            'ingredients': ingredients,
            'instructions': [
                instruction.description 
                for instruction in recipe.instructions.all().order_by('step_number')
            ],
            'created_at': recipe.created_at,
            'updated_at': recipe.updated_at,
            'likes': getattr(recipe, 'likes_count', 0)  # Assuming you have a likes field or related model
        }
        
        recipes.append(recipe_data)
        total_likes += recipe_data['likes']

    # Get user stats
    user_stats = {
        'total_recipes': len(recipes),
        'total_likes': total_likes,
        'avg_rating': sum(r['rating'] for r in recipes) / len(recipes) if recipes else 0,
        'member_since': request.user.date_joined.strftime("%B %Y")
    }

    context = {
        'user': request.user,
        'recipes': recipes,
        'total_likes': total_likes,
        'stats': user_stats
    }

    return render(request, 'home.html', context)

@login_required
@require_http_methods(["DELETE"])
def delete_recipe(request, recipe_id):
    try:
        recipe = Recipe.objects.get(id=recipe_id, author=request.user)
        recipe.delete()
        return JsonResponse({
            'status': 'success',
            'message': 'Recipe deleted successfully'
        })
    except Recipe.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Recipe not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

@login_required
def edit_recipe(request, recipe_id):
    try:
        recipe = Recipe.objects.get(id=recipe_id, author=request.user)
    except Recipe.DoesNotExist:
        messages.error(request, 'Recipe not found!')
        return redirect('home')

    if request.method == 'POST':
        try:
            # Update basic recipe information
            recipe.title = request.POST.get('title')
            recipe.description = request.POST.get('description')
            recipe.servings = request.POST.get('servings')
            recipe.prep_time = request.POST.get('prep_time')
            recipe.calories = request.POST.get('calories')
            recipe.difficulty = request.POST.get('difficulty')

            # Handle image update
            if 'image' in request.FILES:
                recipe.image = request.FILES['image']

            recipe.save()

            # Update categories
            recipe.meal_types.set(request.POST.getlist('meal_type'))
            recipe.cuisines.set(request.POST.getlist('cuisine'))
            recipe.dietary_restrictions.set(request.POST.getlist('dietary_restrictions'))

            # Update ingredients
            recipe.ingredients.all().delete()  # Remove old ingredients
            ingredient_names = request.POST.getlist('ingredient_name[]')
            ingredient_quantities = request.POST.getlist('ingredient_quantity[]')
            ingredient_units = request.POST.getlist('ingredient_unit[]')

            for i in range(len(ingredient_names)):
                if ingredient_names[i].strip():
                    Ingredient.objects.create(
                        recipe=recipe,
                        name=ingredient_names[i],
                        quantity=ingredient_quantities[i],
                        unit=ingredient_units[i],
                        order=i+1
                    )

            # Update instructions
            recipe.instructions.all().delete()  # Remove old instructions
            instructions = request.POST.getlist('instructions[]')
            for i, instruction in enumerate(instructions, 1):
                if instruction.strip():
                    Instruction.objects.create(
                        recipe=recipe,
                        step_number=i,
                        description=instruction
                    )

            messages.success(request, 'Recipe updated successfully!')
            return redirect('home')

        except Exception as e:
            print("Error:", str(e))  # For debugging
            messages.error(request, f'Error updating recipe: {str(e)}')
            return redirect('edit_recipe', recipe_id=recipe_id)

    # GET request - show form with existing data
    context = {
        'recipe': recipe,
        'meal_types': MealType.objects.all(),
        'cuisines': Cuisine.objects.all(),
        'dietary_restrictions': DietaryRestriction.objects.all(),
        'selected_meal_types': [mt.id for mt in recipe.meal_types.all()],
        'selected_cuisines': [c.id for c in recipe.cuisines.all()],
        'selected_restrictions': [dr.id for dr in recipe.dietary_restrictions.all()],
        'ingredients': recipe.ingredients.all().order_by('order'),
        'instructions': recipe.instructions.all().order_by('step_number'),
    }
    return render(request, 'edit_recipe.html', context)

@login_required
def rate_recipe(request, recipe_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid method'}, status=405)
    
    try:
        recipe = Recipe.objects.get(id=recipe_id)
        rating_value = int(request.POST.get('rating'))
        
        if not 1 <= rating_value <= 5:
            return JsonResponse({'error': 'Rating must be between 1 and 5'}, status=400)
        
        # Update or create rating
        rating, created = Rating.objects.update_or_create(
            recipe=recipe,
            user=request.user,
            defaults={'value': rating_value}
        )
        
        # Calculate new average rating
        avg_rating = Rating.objects.filter(recipe=recipe).aggregate(Avg('value'))['value__avg']
        recipe.rating = round(avg_rating or 0, 1)
        recipe.save()
        
        return JsonResponse({
            'success': True,
            'user_rating': rating_value,  # Add user's rating
            'new_rating': recipe.rating,
            'total_ratings': Rating.objects.filter(recipe=recipe).count()
        })
        
    except Recipe.DoesNotExist:
        return JsonResponse({'error': 'Recipe not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# Add this function to get recipe details including user's rating
def get_recipe_rating(request, recipe_id):
    try:
        recipe = Recipe.objects.get(id=recipe_id)
        user_rating = None
        if request.user.is_authenticated:
            rating_obj = Rating.objects.filter(recipe=recipe, user=request.user).first()
            if rating_obj:
                user_rating = rating_obj.value
                
        return JsonResponse({
            'success': True,
            'user_rating': user_rating,
            'avg_rating': recipe.rating,
            'total_ratings': Rating.objects.filter(recipe=recipe).count()
        })
    except Recipe.DoesNotExist:
        return JsonResponse({'error': 'Recipe not found'}, status=404)