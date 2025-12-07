from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import Product,Cart, OrderItems, Order
# Register your models here.
class CustUserAdmin(UserAdmin):
    search_fields = ('username', )

class OrderItemsInline(admin.TabularInline):
    model = OrderItems

class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemsInline, ]

# class OrderAdmin(admin.ModelAdmin):
#     fields = ( 'status','items')
#     # list_display = ('id', 'items')

#     def items(self, obj):
#         return ",".join([f'{k.product}({k.quantity})' for k in obj.orderitems_set.all()])

admin.site.register(get_user_model(), CustUserAdmin)
admin.site.register(Cart)
admin.site.register(Product)

admin.site.register(Order, OrderAdmin)