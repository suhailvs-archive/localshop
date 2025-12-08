import requests
from django.shortcuts import render
from django.db.models import Sum
from django.conf import settings
# Create your views here.
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Product,Cart, Order, OrderItems
from .serializers import CartSerializer, ProductsSerializer

class ProductReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    # permission_classes = [IsAuthenticated]
    serializer_class = ProductsSerializer

    def get_queryset(self):
        return Product.objects.order_by('-created_at')
    
class CartListAPIView(viewsets.ModelViewSet):
    queryset = Cart.objects.order_by('-created_at')
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        # import time
        # time.sleep(2)
        
        product = serializer.validated_data['product']
        req = serializer.context['request']
        print(Cart.objects.filter(user=req.user))
        if not Cart.objects.filter(product=product,user=req.user):
            serializer.save(user=req.user)

class OrderListAPIView(APIView):
    """
    List all orders, or create a new order.
    """
    def send_telegram_message(self,order):
        """
        Telegram Bot doc
        ----------------
        https://stackoverflow.com/a/38388851/2351696 

        To get TELEGRAM_TOKEN visit:
        ----------------------------
        https://web.telegram.im/#/im?p=@BotFather
        """
        url = f"https://api.telegram.org/bot{settings.TELEGRAM_TOKEN}/"
        params = {'chat_id':-595052915, 'text': f'new order:{order.id} by {order.user.first_name}({order.user.username})'}
        response = requests.post(url + 'sendMessage', data=params)

    def get(self, request, format=None):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        return Response([{'date':order.created_at,'id':order.id,
            'total':OrderItems.objects.filter(order=order).aggregate(s=Sum('amount'))['s'] or 0,
            'status':order.status,
            'items':[{
                'product':item.product,
                'quantity':item.quantity
            } for item in order.orderitems_set.all()]} for order in orders])

    def post(self, request, format=None):
        carts = Cart.objects.filter(user=request.user)
        if carts:
            order = Order.objects.create(user=request.user)
            for cart in carts:
                OrderItems.objects.create(order=order,product=cart.product,quantity=cart.quantity)
                cart.delete()
            self.send_telegram_message(order)
        return Response('', status=status.HTTP_201_CREATED)