from django.urls import path
from . import views

urlpatterns = [
   
    path('funds/', views.pfund, name='fund-list-create'),  
    path('funds/<int:pk>/', views.fund_detail, name='fund-detail'),  
    path('expenses/', views.pexpense, name='expense-list-create'),  
    path('expenses/<int:pk>/', views.expense_detail, name='expense-detail'),
    path('expense-heads/', views.expense_heads)  
]
