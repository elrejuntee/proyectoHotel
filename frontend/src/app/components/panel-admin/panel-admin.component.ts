import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type EstadoDisponibilidad = 'disponible' | 'ocupado' | 'mantenimiento';
export type Vista = 'habitaciones' | 'servicios' | 'reservas';

export interface Habitacion {
  id: string;
  imagen: string;
  nombre: string;
  subtitulo: string; // ej: "Habitación 101"
  categoriaSlug: 'suite' | 'deluxe';
  categoriaLabel: string;
  precio: number;
  estado: EstadoDisponibilidad;
  estadoTexto: string;
  ocupacionPorcentaje: number;
}

export interface Servicio {
  id: string;
  imagen: string;
  nombre: string;
  subtitulo: string; // ej: "Piso 1"
  categoriaLabel: string;
  precio: number;
  estado: EstadoDisponibilidad;
  estadoTexto: string;
  ocupacionPorcentaje: number;
}

export interface Reserva {
  id: string;
  imagen: string;
  itemNombre: string;
  itemSubtitulo: string;
  huesped: string;
  fechaInicio: string;
  fechaFin: string;
  precio: number;
  estadoTexto: string;
}

interface FormularioHabitacion {
  piso: string;
  numero: string;
  tipo: string;
  precio: number | null;
  descripcion: string;
  estado: EstadoDisponibilidad;
}

interface FormularioServicio {
  piso: string;
  nombre: string;
  tipo: string;
  precio: number | null;
  descripcion: string;
  estado: EstadoDisponibilidad;
}

type ModalActivo =
  | { tipo: 'ver'; item: Habitacion | Servicio }
  | { tipo: 'estado'; item: Habitacion | Servicio }
  | { tipo: 'verReserva'; reserva: Reserva }
  | { tipo: 'estadoReserva'; reserva: Reserva }
  | { tipo: 'agregarHabitacion' }
  | { tipo: 'agregarServicio' }
  | null;

@Component({
  selector: 'app-panel-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css'
})
export class PanelAdminComponent {

  // ===== Estado de la pestaña activa (reemplaza los <input type="radio">) =====
  vistaActiva = signal<Vista>('habitaciones');

  // ===== Estado del dropdown de acciones abierto (reemplaza los checkbox .acciones-toggle) =====
  dropdownAbiertoId = signal<string | null>(null);

  // ===== Estado del modal abierto (reemplaza los .modal:target) =====
  modal = signal<ModalActivo>(null);

  // ===== Datos =====
  habitaciones: Habitacion[] = [
    {
      id: 'hab101', imagen: 'imagenes/premier.webp', nombre: 'Suite Premier Jardín',
      subtitulo: 'Habitación 101', categoriaSlug: 'suite', categoriaLabel: 'Suite',
      precio: 280, estado: 'disponible', estadoTexto: 'Disponible', ocupacionPorcentaje: 0
    },
    {
      id: 'hab102', imagen: 'imagenes/premium.webp', nombre: 'Habitación Superior',
      subtitulo: 'Habitación 102', categoriaSlug: 'deluxe', categoriaLabel: 'Deluxe',
      precio: 190, estado: 'ocupado', estadoTexto: 'Ocupada', ocupacionPorcentaje: 100
    }
  ];

  servicios: Servicio[] = [
    {
      id: 'servConf', imagen: 'imagenes/premier.webp', nombre: 'Sala conferencia',
      subtitulo: 'Piso 1', categoriaLabel: 'Espacio de reuniones',
      precio: 60, estado: 'disponible', estadoTexto: 'Disponible', ocupacionPorcentaje: 0
    },
    {
      id: 'servComedor', imagen: 'imagenes/premium.webp', nombre: 'Comedor',
      subtitulo: 'Piso 1', categoriaLabel: 'Gastronomía',
      precio: 40, estado: 'ocupado', estadoTexto: 'Ocupado', ocupacionPorcentaje: 100
    },
    {
      id: 'servPrivada', imagen: 'imagenes/premier.webp', nombre: 'Sala privada',
      subtitulo: 'Piso 2', categoriaLabel: 'Espacio de reuniones',
      precio: 75, estado: 'disponible', estadoTexto: 'Disponible', ocupacionPorcentaje: 0
    },
    {
      id: 'servCoworking', imagen: 'imagenes/premium.webp', nombre: 'Co-working',
      subtitulo: 'Piso 2', categoriaLabel: 'Espacio de trabajo',
      precio: 25, estado: 'disponible', estadoTexto: 'Disponible', ocupacionPorcentaje: 0
    }
  ];

  reservas: Reserva[] = [
    {
      id: 'res1', imagen: 'imagenes/premier.webp', itemNombre: 'Suite Premier Jardín',
      itemSubtitulo: 'Habitación 101', huesped: 'Martina Gómez',
      fechaInicio: '05/09/2026', fechaFin: '10/09/2026', precio: 280, estadoTexto: 'Confirmada'
    },
    {
      id: 'res2', imagen: 'imagenes/premium.webp', itemNombre: 'Habitación Superior',
      itemSubtitulo: 'Habitación 102', huesped: 'Ezequiel Torres',
      fechaInicio: '12/09/2026', fechaFin: '15/09/2026', precio: 190, estadoTexto: 'Confirmada'
    }
  ];

  // ===== Formularios de los modales "Agregar" (ngModel) =====
  nuevaHabitacion: FormularioHabitacion = this.habitacionVacia();
  nuevoServicio: FormularioServicio = this.servicioVacio();

  // ===== Getters usados por el template para saber qué modal mostrar =====
  get modalVerItem(): Habitacion | Servicio | null {
    const m = this.modal();
    return m?.tipo === 'ver' ? m.item : null;
  }

  get modalEstadoItem(): Habitacion | Servicio | null {
    const m = this.modal();
    return m?.tipo === 'estado' ? m.item : null;
  }

  get modalVerReserva(): Reserva | null {
    const m = this.modal();
    return m?.tipo === 'verReserva' ? m.reserva : null;
  }

  get modalEstadoReserva(): Reserva | null {
    const m = this.modal();
    return m?.tipo === 'estadoReserva' ? m.reserva : null;
  }

  get mostrarAgregarHabitacion(): boolean {
    return this.modal()?.tipo === 'agregarHabitacion';
  }

  get mostrarAgregarServicio(): boolean {
    return this.modal()?.tipo === 'agregarServicio';
  }

  // ===== Pestañas =====
  cambiarVista(v: Vista): void {
    this.vistaActiva.set(v);
    this.cerrarDropdown();
  }

  // ===== Dropdown de acciones por fila =====
  toggleDropdown(id: string): void {
    this.dropdownAbiertoId.update(actual => (actual === id ? null : id));
  }

  cerrarDropdown(): void {
    this.dropdownAbiertoId.set(null);
  }

  // ===== Modales: Ver / Cambiar estado (habitaciones y servicios) =====
  verItem(item: Habitacion | Servicio): void {
    this.cerrarDropdown();
    this.modal.set({ tipo: 'ver', item });
  }

  cambiarEstadoItem(item: Habitacion | Servicio): void {
    this.cerrarDropdown();
    this.modal.set({ tipo: 'estado', item });
  }

  guardarNuevoEstado(nuevoEstado: string): void {
    const estado = nuevoEstado as EstadoDisponibilidad;
    const textos: Record<EstadoDisponibilidad, string> = {
      disponible: 'Disponible',
      ocupado: 'Ocupado',
      mantenimiento: 'En mantenimiento'
    };
    const m = this.modal();
    if (m?.tipo === 'estado') {
      m.item.estado = estado;
      m.item.estadoTexto = textos[estado];
    }
    this.cerrarModal();
  }

  // ===== Modales: Ver / Cambiar estado (reservas) =====
  verReserva(reserva: Reserva): void {
    this.cerrarDropdown();
    this.modal.set({ tipo: 'verReserva', reserva });
  }

  cambiarEstadoReserva(reserva: Reserva): void {
    this.cerrarDropdown();
    this.modal.set({ tipo: 'estadoReserva', reserva });
  }

  // ===== Modales: Agregar habitación / servicio =====
  abrirModalAgregarHabitacion(): void {
    this.nuevaHabitacion = this.habitacionVacia();
    this.modal.set({ tipo: 'agregarHabitacion' });
  }

  abrirModalAgregarServicio(): void {
    this.nuevoServicio = this.servicioVacio();
    this.modal.set({ tipo: 'agregarServicio' });
  }

  guardarHabitacion(): void {
    // TODO: conectar con el servicio/API real, ej:
    // this.habitacionesService.crear(this.nuevaHabitacion).subscribe(...)
    this.cerrarModal();
  }

  guardarServicio(): void {
    // TODO: conectar con el servicio/API real
    this.cerrarModal();
  }

  cerrarModal(): void {
    this.modal.set(null);
  }

  private habitacionVacia(): FormularioHabitacion {
    return { piso: '', numero: '', tipo: '', precio: null, descripcion: '', estado: 'disponible' };
  }

  private servicioVacio(): FormularioServicio {
    return { piso: '', nombre: '', tipo: '', precio: null, descripcion: '', estado: 'disponible' };
  }
}