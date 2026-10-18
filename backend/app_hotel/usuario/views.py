from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView as ApiView
from .models import RolUsuario, Usuario
from .serializers import RolUsuarioSerializer, UsuarioSerializer


class RolUsuarioView(ApiView):

  def get(self, request):
    roles = RolUsuario.objects.all()
    serializer = RolUsuarioSerializer(roles, many=True)
    return Response(serializer.data)

  def post(self, request):
    serializer = RolUsuarioSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


class UsuarioView(ApiView):

  def get(self, request):
    usuarios = Usuario.objects.all()
    serializer = UsuarioSerializer(usuarios, many=True)
    return Response(serializer.data)

  def post(self, request):
    serializer = UsuarioSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

class UsuarioDetailView(ApiView):
  """Vista para manejar un usuario específico mediante su ID (PUT, GET individual, DELETE)"""

  def put(self, request, pk):
    try:
      usuario = Usuario.objects.get(pk=pk)
    except Usuario.DoesNotExist:
      return Response(
          {"error": "El usuario no existe"}, status=status.HTTP_404_NOT_FOUND
      )

    # partial=True permite actualizar solo los campos enviados (ej: nombre, apellido, email)
    serializer = UsuarioSerializer(usuario, data=request.data, partial=True)

    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
