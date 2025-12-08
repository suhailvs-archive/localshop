from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from django.urls import path,include

from .views import CartListAPIView, OrderAPIView, ProductReadOnlyViewSet, AjaxAPIView
from .models import Cart
router = routers.DefaultRouter()
router.register('cart', CartListAPIView)
router.register('products', ProductReadOnlyViewSet,basename='productsreadonly-api')

app_name='api'

urlpatterns = [
    path('', include(router.urls)),
    path('orders/', OrderAPIView.as_view()),
    path('ajax_views/',AjaxAPIView.as_view()),
    path('api-token-auth/', obtain_auth_token),
]