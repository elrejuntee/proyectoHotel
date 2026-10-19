from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView as ApiView
from .models import EstadoReserva, Reserva, ReservaHabitacion
from .serializers import (EstadoReservaSerializer, ReservaSerializer, ReservaHabitacionSerializer,)


# ===== Estado Reserva =====

class EstadoReservaView(ApiView):

    def get(self, request):
        estados = EstadoReserva.objects.all()
        serializer = EstadoReservaSerializer(estados, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = EstadoReservaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class EstadoReservaDetailView(ApiView):

    def get(self, request, pk):
        estado = get_object_or_404(EstadoReserva, pk=pk)
        serializer = EstadoReservaSerializer(estado)
        return Response(serializer.data)

    def put(self, request, pk):
        estado = get_object_or_404(EstadoReserva, pk=pk)
        serializer = EstadoReservaSerializer(estado, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        estado = get_object_or_404(EstadoReserva, pk=pk)
        estado.delete()
        return Response(status=204)


# ===== Reserva =====

class ReservaView(ApiView):

    def get(self, request):
        reservas = Reserva.objects.all()
        serializer = ReservaSerializer(reservas, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ReservaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class ReservaDetailView(ApiView):

    def get(self, request, pk):
        reserva = get_object_or_404(Reserva, pk=pk)
        serializer = ReservaSerializer(reserva)
        return Response(serializer.data)

    def put(self, request, pk):
        reserva = get_object_or_404(Reserva, pk=pk)
        serializer = ReservaSerializer(reserva, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        reserva = get_object_or_404(Reserva, pk=pk)
        reserva.delete()
        return Response(status=204)


# ===== Reserva Habitación =====

class ReservaHabitacionView(ApiView):

    def get(self, request):
        reservas_habitacion = ReservaHabitacion.objects.all()
        serializer = ReservaHabitacionSerializer(reservas_habitacion, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ReservaHabitacionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class ReservaHabitacionDetailView(ApiView):

    def get(self, request, pk):
        reserva_habitacion = get_object_or_404(ReservaHabitacion, pk=pk)
        serializer = ReservaHabitacionSerializer(reserva_habitacion)
        return Response(serializer.data)

    def put(self, request, pk):
        reserva_habitacion = get_object_or_404(ReservaHabitacion, pk=pk)
        serializer = ReservaHabitacionSerializer(reserva_habitacion, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        reserva_habitacion = get_object_or_404(ReservaHabitacion, pk=pk)
        reserva_habitacion.delete()
        return Response(status=204)