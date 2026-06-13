from django.contrib import admin
from .models import Sesion

@admin.register(Sesion)
class SesionAdmin(admin.ModelAdmin):
    list_display = ['victima', 'psicologa', 'numero_sesion', 'fecha', 'escala_escucha', 'escala_importancia']
    list_filter = ['fecha']