from rest_framework import serializers
from .models import Fund, Expense, ExpenseHead
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password


class FundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fund
        fields = ['id', 'deposit_date', 'fund_description', 'deposited_by', 'deposit_amount']


class ExpenseSerializer(serializers.ModelSerializer):
    head_name = serializers.CharField(source='expense_head.head_name', read_only=True)

    class Meta:
        model = Expense
        fields = ['id', 'expense_date', 'expense_head', 'head_name', 'expense_amount']

class ExpenseHeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseHead
        fields = ['id', 'head_name']

User = get_user_model()
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'role']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user
