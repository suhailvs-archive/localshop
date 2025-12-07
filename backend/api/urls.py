from rest_framework import routers
from django.urls import path,include

from .views import CartListAPIView, OrderListAPIView, ProductReadOnlyViewSet

router = routers.DefaultRouter()
router.register('cart', CartListAPIView)
router.register('products', ProductReadOnlyViewSet,basename='productsreadonly-api')

app_name='api'

urlpatterns = [
    path('', include(router.urls)),
    path('orders/', OrderListAPIView.as_view()),
    # path('products/', ProductListAPIView.as_view()),
]