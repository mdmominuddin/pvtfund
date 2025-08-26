from django.urls import path
from . import views
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView

urlpatterns = [
   
    path('funds/', views.pfund, name='fund-list-create'),  
    path('funds/<int:pk>/', views.fund_detail, name='fund-detail'),  
    path('expenses/', views.pexpense, name='expense-list-create'),  
    path('expenses/<int:pk>/', views.expense_detail, name='expense-detail'),
    path('expense-heads/', views.expense_heads),  
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('validate/', views.validate_user, name='validate'),

]


