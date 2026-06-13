from rest_framework.routers import DefaultRouter
from .views import PersonalFubeViewSet, RolViewSet

router = DefaultRouter(trailing_slash=True)
router.register(r'usuarios', PersonalFubeViewSet, basename='usuario')
router.register(r'roles', RolViewSet, basename='rol')

urlpatterns = router.urls