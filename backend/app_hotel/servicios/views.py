from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import TipoServicio, Servicio
from .serializers import TipoServicioSerializer, ServicioSerializer

class TipoServicioAPIView(APIView):
    # Método GET para traer todos los tipos de servicios (Retorna 200 OK)
    def get(self, request):
        tipos = TipoServicio.objects.all()
        serializer = TipoServicioSerializer(tipos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Método POST para crear un nuevo tipo de servicio (Retorna 201 o 400)
    def post(self, request):
        serializer = TipoServicioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ServicioAPIView(APIView):
    def get(self, request):
        servicios = Servicio.objects.all()
        serializer = ServicioSerializer(servicios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ServicioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ServicioDetailAPIView(APIView):
    def get(self, request, pk):
        servicio = get_object_or_404(Servicio, pk=pk)
        serializer = ServicioSerializer(servicio)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TipoServicioDetailAPIView(APIView):
    def get(self, request, pk):
        tipo = get_object_or_404(TipoServicio, pk=pk)
        serializer = TipoServicioSerializer(tipo)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Create your views here.
