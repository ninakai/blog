from rest_framework import routers
from articles.views import ArticlesViewSet
# создаем маршруты по умолчанию и убираем слеш в конце
router = routers.DefaultRouter(trailing_slash=False)
# регистрируем маршрут и привязываем контроллер
router.register('articles', viewset=ArticlesViewSet)
# добавляем сгенерированные маршруты в коллекцию urlpatterns
urlpatterns = router.urls
