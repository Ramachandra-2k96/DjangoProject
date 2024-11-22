from django.urls import path
from . import views
from django.views.generic import TemplateView

urlpatterns = [
    path('', TemplateView.as_view(template_name="index.html")),
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('viewrecipie/', views.viewrecipie, name='viewrecipie'),
    path('add-recipe/', views.add_recipe, name='add_recipe'),
    path('home/', views.home, name='home'),
    path('delete-recipe/<int:recipe_id>/', views.delete_recipe, name='delete_recipe'),
    path('edit-recipe/<int:recipe_id>/', views.edit_recipe, name='edit_recipe'),
    path('recipe/<int:recipe_id>/rate/', views.rate_recipe, name='rate_recipe'),
]
