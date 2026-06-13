from rest_framework import serializers
from .models import Sesion, EvaluacionTrimestral, RespuestaIndicador

class SesionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sesion
        fields = '__all__'
        read_only_fields = ['recomendacion_agente', 'numero_sesion']

class RespuestaIndicadorSerializer(serializers.ModelSerializer):
    puntaje_terapeuta = serializers.SerializerMethodField()
    puntaje_cuidador = serializers.SerializerMethodField()
    puntaje_nna = serializers.SerializerMethodField()

    class Meta:
        model = RespuestaIndicador
        fields = '__all__'

    def get_puntaje_terapeuta(self, obj):
        return obj.puntaje_terapeuta()

    def get_puntaje_cuidador(self, obj):
        return obj.puntaje_cuidador()

    def get_puntaje_nna(self, obj):
        return obj.puntaje_nna()

class EvaluacionTrimestralSerializer(serializers.ModelSerializer):
    respuestas = RespuestaIndicadorSerializer(many=True, read_only=True)

    class Meta:
        model = EvaluacionTrimestral
        fields = '__all__'