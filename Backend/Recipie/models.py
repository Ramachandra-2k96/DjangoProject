from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models.signals import post_delete
from django.dispatch import receiver
import os

class Recipe(models.Model):
    # Basic Information
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Recipe Details
    servings = models.PositiveIntegerField(
        validators=[MinValueValidator(1)]
    )
    prep_time = models.PositiveIntegerField(  # in minutes
        validators=[MinValueValidator(1)]
    )
    calories = models.PositiveIntegerField(
        validators=[MinValueValidator(1)]
    )
    rating = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        default=0
    )
    
    # Image
    image = models.ImageField(upload_to='recipe_images/')
    
    # User Relationship
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='recipes'
    )

    # Categories and Difficulty
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard')
    ]

    difficulty = models.CharField(
        max_length=10,
        choices=DIFFICULTY_CHOICES,
        default='medium'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

@receiver(post_delete, sender=Recipe)
def delete_recipe_image(sender, instance, **kwargs):
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    
    class Meta:
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return self.name

class RecipeCategory(models.Model):
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='categories'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='recipes'
    )

    class Meta:
        unique_together = ('recipe', 'category')

class Ingredient(models.Model):
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='ingredients'
    )
    name = models.CharField(max_length=200)
    quantity = models.CharField(max_length=50)
    unit = models.CharField(max_length=50, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        if self.unit:
            return f"{self.quantity} {self.unit} {self.name}"
        return f"{self.quantity} {self.name}"

class Instruction(models.Model):
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='instructions'
    )
    step_number = models.PositiveIntegerField()
    description = models.TextField()

    class Meta:
        ordering = ['step_number']
        unique_together = ('recipe', 'step_number')

    def __str__(self):
        return f"Step {self.step_number}: {self.description[:50]}..."

# Filter-related models
class MealType(models.Model):
    name = models.CharField(max_length=50, unique=True)
    recipes = models.ManyToManyField(Recipe, related_name='meal_types')

    def __str__(self):
        return self.name

class Cuisine(models.Model):
    name = models.CharField(max_length=50, unique=True)
    recipes = models.ManyToManyField(Recipe, related_name='cuisines')

    def __str__(self):
        return self.name

class DietaryRestriction(models.Model):
    name = models.CharField(max_length=50, unique=True)
    recipes = models.ManyToManyField(Recipe, related_name='dietary_restrictions')

    def __str__(self):
        return self.name

# Rating system
class Rating(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    value = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('recipe', 'user')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update recipe's average rating
        avg_rating = Rating.objects.filter(recipe=self.recipe).aggregate(
            models.Avg('value')
        )['value__avg']
        self.recipe.rating = avg_rating or 0
        self.recipe.save()
