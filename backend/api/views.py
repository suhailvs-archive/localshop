import requests
from django.conf import settings
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Product,Cart, Order, OrderItems
from .serializers import CartSerializer, ProductSerializer

class ProductReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    # permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.order_by('-created_at')
    
class CartListAPIView(viewsets.ModelViewSet):
    queryset = Cart.objects.order_by('-created_at')
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def partial_update(self, request, *args, **kwargs):        
        response = super().partial_update(request, *args, **kwargs)
        if response.data['quantity'] == 0:
            # if zero, then delete the cart item
            Cart.objects.filter(id=response.data['id']).delete()
        response.data["cart_total"] = Cart.total_for_user(request.user)
        return response
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        req = serializer.context['request']
        if not self.queryset.filter(product=serializer.validated_data['product']):
            serializer.save(user=req.user)

class OrderAPIView(APIView):
    """
    List all orders, or create a new order.
    """
    permission_classes = [IsAuthenticated]
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
        print(response)
    def get(self, request, format=None):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        return Response([{'created_at':order.created_at,'id':order.id,
            'total':order.total,'status':order.status} for order in orders])

    def post(self, request, format=None):
        carts = Cart.objects.filter(user=request.user)
        if carts:
            order = Order.objects.create(user=request.user, total=Cart.total_for_user(request.user))
            for cart in carts:
                OrderItems.objects.create(order=order,product=cart.product,quantity=cart.quantity)
                cart.delete()
            self.send_telegram_message(order)
        return Response('', status=status.HTTP_201_CREATED)



class AjaxAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        purpose = request.GET.get('purpose')
        if purpose=='cart_total':return Response(Cart.total_for_user(request.user))
        if purpose=='test':return Response(1)
