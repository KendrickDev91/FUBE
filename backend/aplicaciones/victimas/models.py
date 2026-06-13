from django.db import models
from aplicaciones.usuarios.models import PersonalFube

class Victima(models.Model):
    GENERO_CHOICES = [
        ('masculino', 'Masculino'),
        ('femenino', 'Femenino'),
        ('otro', 'Otro'),
    ]
    ESTADO_CASO_CHOICES = [
        ('activo', 'Activo'),
        ('cerrado', 'Cerrado'),
        ('derivado', 'Derivado'),
    ]
    TIPO_CASO_CHOICES = [
    ('agresion_clara', 'Agresión clara'),
    ('sospecha', 'Sospecha'),
    ('poco_probable', 'Poco probable'),
    ]

    numero_caso = models.CharField(max_length=50, unique=True, blank=True)
    tipo_caso = models.CharField(max_length=100, choices=TIPO_CASO_CHOICES)
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField()
    carnet_identidad = models.CharField(max_length=20, unique=True)
    genero = models.CharField(max_length=20, choices=GENERO_CHOICES)
    con_quien_vive = models.CharField(max_length=150, blank=True, null=True)
    telefono_nna = models.CharField(max_length=15, blank=True, null=True)
    fecha_ingreso = models.DateField(auto_now_add=False, default=None, null=True, blank=True)
    fecha_cierre_caso = models.DateField(blank=True, null=True)
    estado_caso = models.CharField(max_length=20, choices=ESTADO_CASO_CHOICES, default='activo')

    def save(self, *args, **kwargs):
        if not self.numero_caso:
            from datetime import date
            anio = date.today().year
            prefijos = {
                'agresion_clara': 'AC',
                'sospecha': 'S',
                'poco_probable': 'P',
            }
            prefijo = prefijos.get(self.tipo_caso, 'C')
            ultimo = Victima.objects.filter(numero_caso__startswith=prefijo).count()
            self.numero_caso = f"{prefijo}-{str(ultimo + 1).zfill(3)}/{anio}"
        super().save(*args, **kwargs)

    def edad_actual(self):
        from datetime import date
        hoy = date.today()
        return hoy.year - self.fecha_nacimiento.year - (
            (hoy.month, hoy.day) < (self.fecha_nacimiento.month, self.fecha_nacimiento.day)
        )

    def __str__(self):
        return f"{self.nombres} {self.apellidos} - {self.numero_caso}"

    class Meta:
        verbose_name = 'Víctima'
        verbose_name_plural = 'Víctimas'
        ordering = ['-fecha_ingreso']


class Seguimiento(models.Model):
    personal = models.ForeignKey(PersonalFube, on_delete=models.SET_NULL, null=True, related_name='seguimientos')
    victima = models.ForeignKey(Victima, on_delete=models.CASCADE, related_name='seguimientos')
    fecha_asignacion = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.personal} → {self.victima}"

    class Meta:
        verbose_name = 'Seguimiento'
        verbose_name_plural = 'Seguimientos'
        unique_together = ['personal', 'victima']