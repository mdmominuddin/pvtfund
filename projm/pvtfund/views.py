# your_app_name/views.py
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from .models import Fund, Expense
from .serializers import FundSerializer, ExpenseSerializer
from django.utils.dateparse import parse_date
from django.utils import timezone
from django.db.models import Sum


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def pfund(request):
    """
    List all funds or create a new fund.
    """
    if request.method == 'GET':
        # Get all Fund objects, ordered by deposit date
        funds = Fund.objects.all().order_by('-deposit_date')
        # Serialize the queryset (many=True since we are serializing a list)
        serializer = FundSerializer(funds, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # Create a new serializer instance with the request data
        serializer = FundSerializer(data=request.data)
        # Validate the data
        if serializer.is_valid():
            # Save the new object
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # If data is not valid, return error response
        print("Incoming data:", request.data)
        print("Serializer errors:", serializer.errors) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Fund Detail, Update, and Delete View
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def fund_detail(request, pk):
    """
    Retrieve, update, or delete a fund instance.
    """
    # Get the object, or return a 404 error if it doesn't exist
    fund = get_object_or_404(Fund, pk=pk)

    if request.method == 'GET':
        # Serialize the single object
        serializer = FundSerializer(fund)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Update the existing object with new data
        serializer = FundSerializer(fund, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        fund.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Expense List and Create View
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def pexpense(request):
    """
    List all expenses or create a new expense.
    """
    if request.method == 'GET':
        expenses = Expense.objects.all().order_by('-expense_date')
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ExpenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Expense Detail, Update, and Delete View
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def expense_detail(request, pk):
    """
    Retrieve, update, or delete an expense instance.
    """
    expense = get_object_or_404(Expense, pk=pk)

    if request.method == 'GET':
        serializer = ExpenseSerializer(expense)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ExpenseSerializer(expense, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        expense.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

from .models import ExpenseHead
from .serializers import ExpenseHeadSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def expense_heads(request):
    heads = ExpenseHead.objects.all().order_by('head_name')
    serializer = ExpenseHeadSerializer(heads, many=True)
    return Response(serializer.data)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def validate_user(request):
    username = request.data.get("username")
    email = request.data.get("email")

    if username and User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=400)
    if email and User.objects.filter(email=email).exists():
        return Response({"error": "Email already used"}, status=400)

    return Response({"message": "Valid"}, status=200)


# for custom account statement

class FundStatementView(APIView):
    def get(self, request):
        # Parse date range from query params
        start_date = parse_date(request.query_params.get('start_date'))  # e.g., "2025-08-10"
        end_date = parse_date(request.query_params.get('end_date'))      # e.g., "2025-09-04"
        today = timezone.now().date()

        # Opening balance (before start_date)
        fund_before = Fund.objects.filter(deposit_date__lt=start_date).aggregate(Sum('deposit_amount'))['deposit_amount__sum'] or 0
        expense_before = Expense.objects.filter(expense_date__lt=start_date).aggregate(Sum('expense_amount'))['expense_amount__sum'] or 0
        opening_balance = fund_before - expense_before

        # Closing balance (up to end_date)
        fund_until_end = Fund.objects.filter(deposit_date__lte=end_date).aggregate(Sum('deposit_amount'))['deposit_amount__sum'] or 0
        expense_until_end = Expense.objects.filter(expense_date__lte=end_date).aggregate(Sum('expense_amount'))['expense_amount__sum'] or 0
        closing_balance = fund_until_end - expense_until_end

        # Present balance (up to today)
        fund_today = Fund.objects.filter(deposit_date__lte=today).aggregate(Sum('deposit_amount'))['deposit_amount__sum'] or 0
        expense_today = Expense.objects.filter(expense_date__lte=today).aggregate(Sum('expense_amount'))['expense_amount__sum'] or 0
        present_balance = fund_today - expense_today

        # Transactions in range
        funds = Fund.objects.filter(deposit_date__gte=start_date, deposit_date__lte=end_date)
        expenses = Expense.objects.filter(expense_date__gte=start_date, expense_date__lte=end_date)

        # Serialize and tag each transaction
        fund_data = FundSerializer(funds, many=True).data
        for f in fund_data:
            f['type'] = 'income'
            f['date'] = f.pop('deposit_date')
            f['amount'] = f.pop('deposit_amount') 

        expense_data = ExpenseSerializer(expenses, many=True).data
        for e in expense_data:
            e['type'] = 'expense'
            e['date'] = e.pop('expense_date')
            e['amount'] = e.pop('expense_amount')  

        # Merge and sort transactions
        transactions = sorted(fund_data + expense_data, key=lambda x: x['date'])

        return Response({
            "opening_balance": opening_balance,
            "closing_balance": closing_balance,
            "present_balance": present_balance,
            "transactions": transactions
        })
