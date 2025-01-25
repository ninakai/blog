from django.contrib.auth.models import User
from django.db import models

class Articles(models.Model):
    title = models.TextField(blank=True, default='')
    picture = models.TextField(blank=True, default='')
    text = models.TextField(blank=True, default='')
    author = models.TextField(null=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # В class Meta мы указываем имя таблицы в БД для данной модели.
    class Meta:
        db_table = 'articles'
