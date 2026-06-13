from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Sesion, EvaluacionTrimestral, RespuestaIndicador
from .serializers import SesionSerializer, EvaluacionTrimestralSerializer, RespuestaIndicadorSerializer

class SesionViewSet(viewsets.ModelViewSet):
    queryset = Sesion.objects.all()
    serializer_class = SesionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        victima_id = self.request.query_params.get('victima')
        if victima_id:
            return Sesion.objects.filter(victima=victima_id)
        return Sesion.objects.all()

    def perform_create(self, serializer):
        victima_id = serializer.validated_data['victima'].id
        ultimo = Sesion.objects.filter(victima=victima_id).count()
        serializer.save(numero_sesion=ultimo + 1)

class EvaluacionTrimestralViewSet(viewsets.ModelViewSet):
    queryset = EvaluacionTrimestral.objects.all()
    serializer_class = EvaluacionTrimestralSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        victima_id = self.request.query_params.get('victima')
        if victima_id:
            return EvaluacionTrimestral.objects.filter(victima=victima_id)
        return EvaluacionTrimestral.objects.all()

class RespuestaIndicadorViewSet(viewsets.ModelViewSet):
    queryset = RespuestaIndicador.objects.all()
    serializer_class = RespuestaIndicadorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        evaluacion_id = self.request.query_params.get('evaluacion')
        if evaluacion_id:
            return RespuestaIndicador.objects.filter(evaluacion=evaluacion_id)
        return RespuestaIndicador.objects.all()