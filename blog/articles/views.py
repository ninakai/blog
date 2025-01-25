from rest_framework.permissions import IsAuthenticated
from .models import Articles
from .serializers import ArticlesSerializer
from rest_framework.viewsets import ModelViewSet
class ArticlesViewSet(ModelViewSet):
    # Класс сериализатора, который следует использовать для проверки
    # и десериализации входных данных, а также для сериализации выходных данных.
    serializer_class = ArticlesSerializer
    # QuerySet представляет набор запросов к базе данных,
    # а его методы создают подобные запросы.
    queryset = Articles.objects.all()
    # разрешаем доступ только зарегистрированным пользователям
    permission_classes = (IsAuthenticated,)
    # отображаем элементы принадлежащие только текущему юзеру,
    # для админа разрешаем все
    def get_queryset(self):
        return Articles.objects.all()
