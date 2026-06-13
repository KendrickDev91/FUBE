from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import PersonalFube, Rol, Permiso

@admin.register(PersonalFube)
class PersonalFubeAdmin(UserAdmin):
    list_display = ['email', 'get_full_name', 'rol', 'estado']
    list_filter = ['rol', 'estado']
    fieldsets = UserAdmin.fieldsets + (
        ('Datos FUBE', {'fields': ('rol', 'estado')}),
    )

@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ['nombre_rol']

@admin.register(Permiso)
class PermisoAdmin(admin.ModelAdmin):
    list_display = ['rol', 'modulo', 'acciones', 'alcance']
    list_filter = ['rol']