from django.contrib import admin
from .models import Victima, Seguimiento

@admin.register(Victima)
class VictimaAdmin(admin.ModelAdmin):
    list_display = ['numero_caso', 'nombres', 'apellidos', 'tipo_caso', 'estado_caso', 'fecha_ingreso']
    search_fields = ['nombres', 'apellidos', 'numero_caso', 'carnet_identidad']
    list_filter = ['tipo_caso', 'estado_caso', 'genero']

@admin.register(Seguimiento)
class SeguimientoAdmin(admin.ModelAdmin):
    list_display = ['personal', 'victima', 'fecha_asignacion']
    list_filter = ['fecha_asignacion']