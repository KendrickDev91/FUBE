from django.contrib.auth.models import AbstractUser
from django.db import models

class Rol(models.Model):
    ROLES = [
        ('administrador', 'Administrador'),
        ('ceo', 'CEO / Coordinadora'),
        ('psicologa_encargada', 'Psicóloga Encargada'),
        ('psicologa', 'Psicóloga'),
        ('trabajadora_social', 'Trabajadora Social'),
        ('abogada', 'Abogada'),
    ]
    nombre_rol = models.CharField(max_length=50, choices=ROLES, unique=True)

    def __str__(self):
        return self.get_nombre_rol_display()

    class Meta:
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'


class Permiso(models.Model):
    modulo = models.CharField(max_length=50)
    acciones = models.CharField(max_length=100)
    alcance = models.CharField(max_length=50)
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE, related_name='permisos')

    def __str__(self):
        return f"{self.rol} - {self.modulo} - {self.acciones}"

    class Meta:
        verbose_name = 'Permiso'
        verbose_name_plural = 'Permisos'


class PersonalFube(AbstractUser):
    rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True, blank=True, related_name='personal')
    estado = models.CharField(max_length=20, choices=[
        ('activo', 'Activo'),
        ('inactivo', 'Inactivo'),
    ], default='activo')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.get_full_name()} - {self.rol}"

    class Meta:
        verbose_name = 'Personal FUBE'
        verbose_name_plural = 'Personal FUBE'