from rest_framework import serializers

from .fields import HyperlinkedSorlImageField
from .models import Cart,Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ("id", "category", "title","description", "image",'price','thumbnail')
    # https://github.com/dessibelle/sorl-thumbnail-serializer-field/tree/master#example-usage
    thumbnail = HyperlinkedSorlImageField(
        '128x128',
        options={"crop": "center"},
        source='image',
        read_only=True
    )


class CartSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')
    product_title = serializers.ReadOnlyField(source='product.title')
    # product_image = serializers.ReadOnlyField(source='product.image')
    product_unit = serializers.ReadOnlyField(source='product.unit')
    product_price = serializers.ReadOnlyField(source='product.price')
    class Meta:
        model = Cart
        fields = ['id','product','quantity','user_name', # 'product_image',
            'product_title','product_unit','product_price']
    