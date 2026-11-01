import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Reserva {
  id: number;
  id_usuario: number;
  id_estado_reserva: number;
  numero_reserva: number;
  fecha_reserva: string;
}

export interface ReservaHabitacion {
  id: number;
  id_reserva: number;
  id_habitacion: number;
  pago_acordado: number;
  fecha_checkin: string;
  fecha_checkout: string;
}

export interface Habitacion {
  id: number;
  id_tipo_habitacion: number;
  id_estado_habitacion: number;
  numero: number;
  piso: number;
  precio: number;
  capacidad: number;
}

export interface TipoHabitacion {
  id: number;
  nombre: string;
  cant_cama: number;
  descripcion: string;
}

export interface ReservaServicio {
  id: number;
  id_reserva: number;
  id_servicio: number;
  capacidad_invitados: number;
  pago_acordado: number;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface Servicio {
  id: number;
  id_tipo_servicio: number;
  precio: number;
  capacidad_maxima: number;
}

export interface TipoServicio {
  id: number;
  nombre_servicio: string;
}


@Injectable({
  providedIn: 'root'
})
export class HistorialReservasService {
  private apiUrl = 'http://localhost:8000/api';
  private httpClient = inject(HttpClient);

  obtenerReservas(): Observable<Reserva[]> {
    return this.httpClient.get<Reserva[]>(
      this.apiUrl + '/reservas/'
    );
  }

  obtenerReservasHabitacion(): Observable<ReservaHabitacion[]> {
    return this.httpClient.get<ReservaHabitacion[]>(
      this.apiUrl + '/reservas-habitacion/'
    );
  }

  obtenerHabitaciones(): Observable<Habitacion[]> {
    return this.httpClient.get<Habitacion[]>(
      this.apiUrl + '/habitaciones/'
    );
  }

  obtenerTiposHabitacion(): Observable<TipoHabitacion[]> {
    return this.httpClient.get<TipoHabitacion[]>(
      this.apiUrl + '/tipos-habitaciones/'
    );
  }

  obtenerReservasServicio(): Observable<ReservaServicio[]> {
    return this.httpClient.get<ReservaServicio[]>(
      this.apiUrl + '/reservas-servicio/'
    );
  }

  obtenerServicios(): Observable<Servicio[]> {
    return this.httpClient.get<Servicio[]>(
      this.apiUrl + '/servicios/'
    );
  }

  obtenerTiposServicio(): Observable<TipoServicio[]> {
    return this.httpClient.get<TipoServicio[]>(
      this.apiUrl + '/tipo-servicios/'
    );
  }
}
