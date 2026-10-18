from django.urls import path

from habitaciones.views import HabitacionesView

urlpatterns = [
    path('habitaciones/', HabitacionesView.as_view(), name='habitaciones')
]