from rest_framework import serializers
from .models import Victima, Seguimiento

class VictimaSerializer(serializers.ModelSerializer):
    edad_actual = serializers.SerializerMethodField()
    numero_caso = serializers.CharField(required=False, read_only=False, allow_blank=True)

    class Meta:
        model = Victima
        fields = '__all__'

    def get_edad_actual(self, obj):
        return obj.edad_actual()

class SeguimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seguimiento
        fields = '__all__'