from rest_framework import serializers
from .fields import HyperlinkedSorlImageField
from .models import Cart,Product


class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ("id", "category", "title", "image",'price','thumbnail')
    # https://github.com/dessibelle/sorl-thumbnail-serializer-field/tree/master#example-usage
    thumbnail = HyperlinkedSorlImageField(
        '128x128',
        options={"crop": "center"},
        source='image',
        read_only=True
    )


class CartSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Cart
        fields = ['id','product','quantity','user_name'] #'__all__' #['id', 'firstName', 'email', 'lastName']