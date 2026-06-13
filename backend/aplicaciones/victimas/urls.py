from rest_framework.routers import DefaultRouter
from .views import VictimaViewSet, SeguimientoViewSet

router = DefaultRouter(trailing_slash=True)
router.register(r'victimas', VictimaViewSet, basename='victima')
router.register(r'seguimientos', SeguimientoViewSet, basename='seguimiento')

urlpatterns = router.urls