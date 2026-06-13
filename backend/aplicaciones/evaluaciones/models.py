from django.db import models
from aplicaciones.victimas.models import Victima
from aplicaciones.usuarios.models import PersonalFube

class Sesion(models.Model):
    victima = models.ForeignKey(Victima, on_delete=models.CASCADE, related_name='sesiones')
    psicologa = models.ForeignKey(PersonalFube, on_delete=models.SET_NULL, null=True, related_name='sesiones')
    numero_sesion = models.PositiveIntegerField()
    fecha = models.DateField()
    escala_escucha = models.IntegerField(choices=[(i, i) for i in range(11)])
    escala_importancia = models.IntegerField(choices=[(i, i) for i in range(11)])
    recomendacion_agente = models.TextField(blank=True, null=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def evaluar_agente(self):
        e = self.escala_escucha
        i = self.escala_importancia
        if e <= 3 and i <= 3:
            return "Sesión crítica. El NNA no sintió escucha ni encontró importancia en la sesión. Se recomienda revisar urgentemente el enfoque terapéutico."
        elif e <= 3 and 4 <= i <= 6:
            return "El NNA valoró moderadamente la sesión pero no sintió que fue escuchado. Se recomienda mejorar la escucha activa y el vínculo terapéutico."
        elif e <= 3 and i >= 7:
            return "El NNA considera importante la sesión pero no se sintió escuchado. Se recomienda trabajar en la comunicación y escucha activa."
        elif 4 <= e <= 6 and i <= 3:
            return "El NNA sintió escucha moderada pero no encontró importancia en la sesión. Se recomienda revisar los temas y actividades trabajados."
        elif 4 <= e <= 6 and 4 <= i <= 6:
            return "Sesión aceptable. Ambas escalas en rango moderado. Se recomienda mantener seguimiento y buscar mejorar el vínculo."
        elif 4 <= e <= 6 and i >= 7:
            return "Buena sesión con alta importancia percibida. Se recomienda continuar y mejorar la escucha activa para potenciar los resultados."
        elif e >= 7 and i <= 3:
            return "El NNA se sintió escuchado pero no encontró importancia en la sesión. Se recomienda revisar los objetivos terapéuticos trabajados."
        elif e >= 7 and 4 <= i <= 6:
            return "Buena escucha percibida con importancia moderada. Se recomienda reforzar la relevancia de los temas trabajados."
        else:
            return "Sesión muy exitosa. El NNA se sintió escuchado y encontró alta importancia en la sesión. Continuar con el mismo enfoque terapéutico."

    def save(self, *args, **kwargs):
        self.recomendacion_agente = self.evaluar_agente()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Sesión #{self.numero_sesion} - {self.victima}"

    class Meta:
        verbose_name = 'Sesión'
        verbose_name_plural = 'Sesiones'
        ordering = ['-fecha']


class EvaluacionTrimestral(models.Model):
    TRIMESTRE_CHOICES = [
        (1, 'Primer trimestre'),
        (2, 'Segundo trimestre'),
        (3, 'Tercer trimestre'),
        (4, 'Cuarto trimestre'),
    ]
    victima = models.ForeignKey(Victima, on_delete=models.CASCADE, related_name='evaluaciones_trimestrales')
    psicologa = models.ForeignKey(PersonalFube, on_delete=models.SET_NULL, null=True, related_name='evaluaciones_trimestrales')
    trimestre = models.IntegerField(choices=TRIMESTRE_CHOICES)
    anio = models.IntegerField()
    fecha = models.DateField(auto_now_add=True)
    puntaje_total_terapeuta = models.IntegerField(default=0)
    puntaje_total_cuidador = models.IntegerField(default=0)
    puntaje_total_nna = models.IntegerField(default=0)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Evaluación T{self.trimestre} {self.anio} - {self.victima}"

    class Meta:
        verbose_name = 'Evaluación trimestral'
        verbose_name_plural = 'Evaluaciones trimestrales'
        unique_together = ['victima', 'trimestre', 'anio']
        ordering = ['-anio', '-trimestre']


class RespuestaIndicador(models.Model):
    SECCION_CHOICES = [
        ('comportamiento', 'A) Efectos en el comportamiento'),
        ('cuerpo', 'B) Efectos en el cuerpo'),
        ('emocional', 'C) Efectos en la vida emocional'),
        ('cognitivo', 'D) Efectos cognitivos'),
        ('relaciones_familia', 'E) Relaciones con familia y pares'),
        ('nutricion_sueno', 'F) Nutrición física y sueño'),
        ('valoracion_corporal', 'G) Valoración corporal'),
        ('autoestima', 'H) Autoestima'),
        ('autoeficacia', 'I) Autoeficacia'),
    ]

    evaluacion = models.ForeignKey(EvaluacionTrimestral, on_delete=models.CASCADE, related_name='respuestas')
    seccion = models.CharField(max_length=30, choices=SECCION_CHOICES)
    numero_indicador = models.IntegerField()
    indicador = models.CharField(max_length=500)
    es_inverso = models.BooleanField(default=False)

    # Respuestas por quien responde
    valor_terapeuta = models.IntegerField(null=True, blank=True)
    valor_cuidador = models.IntegerField(null=True, blank=True)
    valor_nna = models.IntegerField(null=True, blank=True)

    def puntaje_terapeuta(self):
        if self.valor_terapeuta is None:
            return 0
        if self.es_inverso:
            return 0 if self.valor_terapeuta == 1 else 1
        return self.valor_terapeuta

    def puntaje_cuidador(self):
        if self.valor_cuidador is None:
            return 0
        if self.es_inverso:
            return 0 if self.valor_cuidador == 1 else 1
        return self.valor_cuidador

    def puntaje_nna(self):
        if self.valor_nna is None:
            return 0
        if self.es_inverso:
            return 0 if self.valor_nna == 1 else 1
        return self.valor_nna

    def __str__(self):
        return f"{self.seccion} - {self.numero_indicador}"

    class Meta:
        verbose_name = 'Respuesta de indicador'
        verbose_name_plural = 'Respuestas de indicadores'
        ordering = ['seccion', 'numero_indicador']