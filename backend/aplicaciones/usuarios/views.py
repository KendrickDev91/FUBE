from rest_framework import viewsets, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import PersonalFube, Rol, Permiso
from .serializers import PersonalFubeSerializer, CustomTokenObtainPairSerializer, RolSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class PersonalFubeViewSet(viewsets.ModelViewSet):
    queryset = PersonalFube.objects.all()
    serializer_class = PersonalFubeSerializer
    permission_classes = [permissions.IsAuthenticated]

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    permission_classes = [permissions.IsAuthenticated]