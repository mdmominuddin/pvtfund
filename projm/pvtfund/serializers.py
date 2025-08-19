from rest_framework import serializers
from .models import Fund, Expense, ExpenseHead


class FundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fund
        fields = "__all__"



class ExpenseSerializer(serializers.ModelSerializer):
    head_name = serializers.CharField(source='expense_head.head_name', read_only=True)

    class Meta:
        model = Expense
        fields = ['id', 'expense_date', 'expense_head', 'head_name', 'expense_amount']

class ExpenseHeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseHead
        fields = ['id', 'head_name']
