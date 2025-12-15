from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass

class Product(models.Model):
    CATEGORY_CHOICES = (
        ("mobile","Mobile Phone"),
        ("monitor","Monitor"),
        ("പലചരക്ക്","പലചരക്ക്"),
    )
    category = models.CharField(max_length=50,choices=CATEGORY_CHOICES,default="mobile")
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.IntegerField()
    unit = models.CharField(max_length=100, blank=True) # kg, litre, pc, gram
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='offering/%Y/%m/%d/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    # ResizedImageField(size=[500, 300],quality=25,upload_to="offering/%Y/%m/%d/",null=True,blank=True,)
    def __str__(self):
        return f"{self.id}: {self.title}({self.description[:30]}...)"


class Cart(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def total_for_user(user):
        from django.db.models import F, Sum, FloatField, ExpressionWrapper
        return Cart.objects.filter(user=user).aggregate(
            total=Sum(
                ExpressionWrapper(
                    F('quantity') * F('product__price'),
                    output_field=FloatField()
                )
            )
        )['total'] or 0

class OrderItems(models.Model):
    order = models.ForeignKey('Order', on_delete=models.CASCADE)
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    price = models.IntegerField(default=0)

class Order(models.Model): 
    STATUS_CHOICES =(
        ('processing','Processing'),
        ('packing','Packing'),
        ('out_for_delivery','Out for Delivery'),     
        ('delivered','Delivered'),
    )   
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='processing')
    created_at = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    total = models.FloatField(default=0)
    def __str__(self):
        order_date = self.created_at.strftime('%I:%M%p %d/%b/%y')
        return f'#{self.id} {self.user.username}({order_date})'


