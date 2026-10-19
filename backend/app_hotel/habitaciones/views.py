from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .models import Habitacion, EstadoHabitacion, Comodidad, TipoHabitacion
from .serializers import HabitacionSerializer, EstadoHabitacionSerializer, ComodidadSerializer, TipoHabitacionSerializer

class HabitacionesView(APIView):
    def get(self, request):
        habitaciones = Habitacion.objects.all()
        serializer = HabitacionSerializer(habitaciones, many=True)
        return Response(serializer.data, status = status.HTTP_200_OK)

    def post(self, request):
        serializer = HabitacionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)

    def patch(self, request, id): 
        habitacion = get_object_or_404(Habitacion, id=id)
        serializer = HabitacionSerializer(habitacion, data=request.data, partial=True)
    
        if serializer.is_valid():
            serializer.save() 
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EstadoHabitacionView(APIView):
    def get(self, request):
        estados_habitaciones = EstadoHabitacion.objects.all()
        serializer = EstadoHabitacionSerializer(estados_habitaciones, many = True)
        return Response(serializer.data, status = status.HTTP_200_OK)


class ComodidadView(APIView):
    def get(self, request):
        comodidades = Comodidad.objects.all()
        serializer = ComodidadSerializer(comodidades, many = True)
        return Response(serializer.data, status = status.HTTP_200_OK)
    
class TipoHabitacionAPIView(APIView):
    def get(self, request):
        tipos = TipoHabitacion.objects.all()
        serializer = TipoHabitacionSerializer(tipos, many=True)
        return Response(serializer.data)