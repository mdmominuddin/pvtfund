# your_app_name/views.py
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from .models import Fund, Expense
from .serializers import FundSerializer, ExpenseSerializer


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
