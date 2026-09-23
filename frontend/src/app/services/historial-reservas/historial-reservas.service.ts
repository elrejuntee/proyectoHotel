import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Reserva {
  id: string;
  id_usuario: string;
  id_estado_reserva: string;
  numero_reserva: number;
  fecha_hora_reserva: string;
}

export interface ReservaHabitacion {
  id: string;
  id_reserva: string;
  id_habitacion: string;
  pago_acordado: number;
  fecha_hora_checkin: string;
  fecha_hora_checkout: string;
}

export interface Habitacion {
  id: string;
  id_tipo_habitacion: string;
  id_estado_habitacion: string;
  numero: number;
  piso: number;
  precio: number;
  capacidad: number;
}

export interface TipoHabitacion {
  id: string;
  nombre: string;
  cant_cama: number;
  descripcion: string;
}

export interface ReservaServicio {
  id: string;
  id_reserva: string;
  id_servicio: string;
  capacidad_invitados: number;
  pago_acordado: number;
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
}

export interface Servicio {
  id: string;
  id_tipo_servicio: string;
  precio: number;
  capacidad_maxima: number;
}

export interface TipoServicio {
  id: string;
  nombre_servicio: string;
}


@Injectable({
  providedIn: 'root'
})
export class HistorialReservasService {
   private apiUrl = 'http://localhost:3000';

  private httpClient = inject(HttpClient);

  obtenerReservas(): Observable<Reserva[]> {
    return this.httpClient.get<Reserva[]>(
      this.apiUrl + '/reservas'
    );
  }

  obtenerReservasHabitacion(): Observable<ReservaHabitacion[]> {
    return this.httpClient.get<ReservaHabitacion[]>(
      this.apiUrl + '/reservas_habitacion'
    );
  }

  obtenerHabitaciones(): Observable<Habitacion[]> {
    return this.httpClient.get<Habitacion[]>(
      this.apiUrl + '/habitaciones'
    );
  }

  obtenerTiposHabitacion(): Observable<TipoHabitacion[]> {
    return this.httpClient.get<TipoHabitacion[]>(
      this.apiUrl + '/tipos_habitacion'
    );
  }

  obtenerReservasServicio(): Observable<ReservaServicio[]> {
    return this.httpClient.get<ReservaServicio[]>(
      this.apiUrl + '/reservas_servicio'
    );
  }

  obtenerServicios(): Observable<Servicio[]> {
    return this.httpClient.get<Servicio[]>(
      this.apiUrl + '/servicios'
    );
  }

  obtenerTiposServicio(): Observable<TipoServicio[]> {
    return this.httpClient.get<TipoServicio[]>(
      this.apiUrl + '/tipos_servicio'
    );
  }
}
