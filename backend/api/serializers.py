from rest_framework import serializers
from .models import(State,
    District,
    Mandal,
    GramPanchayat)

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id', 'name']

class StateSerializer(LocationSerializer):
    class Meta(LocationSerializer.Meta):
        model = State
        fields = ['id', 'state_name']

class DistrictSerializer(LocationSerializer):
    class Meta(LocationSerializer.Meta):
        model = District
        fields = ['id', 'district_name']

class MandalSerializer(LocationSerializer):
    class Meta(LocationSerializer.Meta):
        model = Mandal
        fields = ['id', 'mandal_name']

class GramPanchayatSerializer(LocationSerializer):
    class Meta(LocationSerializer.Meta):
        model = GramPanchayat
        fields = ['id', 'gram_panchayat_name']
