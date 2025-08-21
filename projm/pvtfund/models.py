from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('viewer', 'Viewer'),
    ]

    role = models.CharField(max_length=100, choices=ROLE_CHOICES)

class ExpenseHead(models.Model):
    head_name = models.CharField(max_length=100)

    def __str__(self):
        return self.head_name


class Fund(models.Model):
    deposit_date = models.DateField()
    deposited_by = models.CharField(max_length=100, default="Admin JCO")
    fund_description = models.CharField(max_length=400, default="Income from Unit Canteen")
    deposit_amount = models.IntegerField()

    def __str__(self):
        return f"{self.deposit_date} - {self.deposit_amount}"


class Expense(models.Model):
    expense_date = models.DateField(auto_now_add=True)
    expense_head = models.ForeignKey(ExpenseHead, on_delete=models.CASCADE, related_name='expenses')
    expense_amount = models.IntegerField()

    def __str__(self):
        return f"{self.expense_date} - {self.expense_amount}"
