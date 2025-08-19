from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import ExpenseHead, Fund, Expense

# Register your models here.
# By creating a ModelAdmin class, we can customize how the model is
# displayed and interacted with in the Django admin site.

@admin.register(ExpenseHead)
class ExpenseHeadAdmin(admin.ModelAdmin):
    """
    Admin configuration for the ExpenseHead model.
    Displays the head_name in the list view.
    """
    list_display = ('head_name',)
    list_display_links = ('head_name',)


@admin.register(Fund)
class FundAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Fund model.
    Displays key fields in the list view for easy at-a-glance information.
    Adds a date hierarchy for navigating by date.
    """
    list_display = ('deposit_date', 'deposited_by', 'deposit_amount',)
    list_filter = ('deposit_date', 'deposited_by',)
    search_fields = ('deposited_by', 'fund_description',)
    date_hierarchy = 'deposit_date'


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Expense model.
    Displays the expense details, including the linked ExpenseHead, in the list view.
    Adds a date hierarchy for navigating by date.
    """
    list_display = ('expense_date', 'expense_head', 'expense_amount',)
    list_filter = ('expense_date', 'expense_head',)
    search_fields = ('expense_head__head_name',) # Allows searching by the related head_name
    date_hierarchy = 'expense_date'