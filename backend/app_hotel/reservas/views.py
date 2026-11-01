from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView as ApiView

from .models import EstadoReserva, Reserva, ReservaHabitacion, ReservaServicio
from .serializers import (EstadoReservaSerializer, ReservaSerializer, ReservaHabitacionSerializer, ReservaServicioSerializer)


# ===== Estado Reserva =====

class EstadoReservaView(ApiView):

    def get(self, request):
        estados = EstadoReserva.objects.all()
        serializer = EstadoReservaSerializer(estados, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# ===== Reserva =====

class ReservaView(ApiView):

    def get(self, request):
        reservas = Reserva.objects.all()
        serializer = ReservaSerializer(reservas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ReservaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ===== Reserva Habitación =====

class ReservaHabitacionView(ApiView):

    def get(self, request):
        reservas_habitacion = ReservaHabitacion.objects.all()
        serializer = ReservaHabitacionSerializer(reservas_habitacion, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ReservaHabitacionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ===== Reserva Servicio =====
class ReservaServicioView(ApiView):

    def get(self, request):
        reservas_servicio = ReservaServicio.objects.all()
        serializer = ReservaServicioSerializer(reservas_servicio, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ReservaServicioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

