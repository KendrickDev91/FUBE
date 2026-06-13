from rest_framework import viewsets, permissions
from .models import Victima, Seguimiento
from .serializers import VictimaSerializer, SeguimientoSerializer

class VictimaViewSet(viewsets.ModelViewSet):
    queryset = Victima.objects.all()
    serializer_class = VictimaSerializer
    permission_classes = [permissions.IsAuthenticated]

class SeguimientoViewSet(viewsets.ModelViewSet):
    queryset = Seguimiento.objects.all()
    serializer_class = SeguimientoSerializer
    permission_classes = [permissions.IsAuthenticated]