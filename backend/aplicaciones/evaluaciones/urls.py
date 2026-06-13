from rest_framework.routers import DefaultRouter
from .views import SesionViewSet, EvaluacionTrimestralViewSet, RespuestaIndicadorViewSet

router = DefaultRouter(trailing_slash=True)
router.register(r'sesiones', SesionViewSet, basename='sesion')
router.register(r'evaluaciones-trimestrales', EvaluacionTrimestralViewSet, basename='evaluacion-trimestral')
router.register(r'respuestas-indicadores', RespuestaIndicadorViewSet, basename='respuesta-indicador')

urlpatterns = router.urls