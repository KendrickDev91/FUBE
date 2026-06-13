from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from aplicaciones.usuarios.views import CustomTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('aplicaciones.victimas.urls')),
    path('api/', include('aplicaciones.usuarios.urls')),
    path('api/', include('aplicaciones.evaluaciones.urls')),
    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('aplicaciones.evaluaciones.urls')),
    
]