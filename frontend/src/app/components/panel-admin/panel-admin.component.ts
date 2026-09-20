import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  EstadoHabitacionApi,
  HabitacionApi,
  HabitacionesService,
  TipoHabitacionApi
} from '../../services/habitaciones/habitaciones.service';

export type EstadoDisponibilidad = 'disponible' | 'ocupado' | 'mantenimiento';
export type Vista = 'habitaciones' | 'servicios' | 'reservas';

/** Imagen que se muestra cuando la habitación no tiene imagen_principal en db.json. */
const IMAGEN_POR_DEFECTO = 'imagenes/premium.webp';

export interface Habitacion {
  id: string;             
  idApi: number | string; 
  imagen: string;
  nombre: string;
  subtitulo: string; 
  categoriaSlug: 'suite' | 'deluxe';
  categoriaLabel: string;
  precio: number;
  estado: EstadoDisponibilidad;
  estadoTexto: string;
  ocupacionPorcentaje: number;
  original: HabitacionApi; 
}

export interface Servicio {
  id: string;
  imagen: string;
  nombre: string;
  subtitulo: string; 
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
  | { tipo: 'editarHabitacion'; item: Habitacion }
  | { tipo: 'agregarServicio' }
  | null;

@Component({
  selector: 'app-panel-admin',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css'
})
export class PanelAdminComponent {

  // ===== Estado de la pestaña activa  =====
  vistaActiva = signal<Vista>('habitaciones');

  // ===== Estado del dropdown de acciones abierto  =====
  dropdownAbiertoId = signal<string | null>(null);

  // ===== Estado del modal abierto  =====
  modal = signal<ModalActivo>(null);

  // ===== Habitaciones: vienen de json-server a través de HabitacionesService =====
  habitaciones: Habitacion[] = [];
  get totalHabitaciones(): number {
  return this.habitaciones.length;
  }

  get totalDisponibles(): number {
    return this.habitaciones.filter(h => h.estado === 'disponible').length;
  }

  get totalOcupadas(): number {
    return this.habitaciones.filter(h => h.estado === 'ocupado').length;
  }

  get totalMantenimiento(): number {
    return this.habitaciones.filter(h => h.estado === 'mantenimiento').length;
  }
  tiposHabitacion: TipoHabitacionApi[] = [];
  estadosHabitacion: EstadoHabitacionApi[] = [];
  errorHabitaciones: string | null = null;
  errorFormularioHabitacion: string | null = null;
  guardandoHabitacion: boolean = false;

  // Formulario reactivo de agregar / editar habitación
  formHabitacion: FormGroup;

  // ===== Datos (servicios y reservas: sin cambios) =====
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

  // ===== Formulario del modal "Agregar servicio" (ngModel) =====
  nuevoServicio: FormularioServicio = this.servicioVacio();

  // Se inyectan el FormBuilder y el servicio en el constructor
  constructor(private formBuilder: FormBuilder, private habitacionesService: HabitacionesService) {
    this.formHabitacion = this.crearFormularioHabitacion('', '', '', '', '', '');
    this.cargarCatalogosYHabitaciones();
  }

  // ===== Getters para acceder a los form controls desde la vista =====
  get Piso() { return this.formHabitacion.get('piso'); }
  get Numero() { return this.formHabitacion.get('numero'); }
  get Tipo() { return this.formHabitacion.get('tipo'); }
  get Precio() { return this.formHabitacion.get('precio'); }
  get Capacidad() { return this.formHabitacion.get('capacidad'); }
  get Estado() { return this.formHabitacion.get('estado'); }

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

  get modalEditarHabitacion(): Habitacion | null {
    const m = this.modal();
    return m?.tipo === 'editarHabitacion' ? m.item : null;
  }

  /** El mismo modal/formulario sirve para agregar y para editar. */
  get mostrarFormularioHabitacion(): boolean {
    const tipo = this.modal()?.tipo;
    return tipo === 'agregarHabitacion' || tipo === 'editarHabitacion';
  }

  get esEdicionHabitacion(): boolean {
    return this.modal()?.tipo === 'editarHabitacion';
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

  // ===== Habitaciones: carga desde json-server (el componente se suscribe al observable del servicio) =====
  cargarCatalogosYHabitaciones(): void {
    this.errorHabitaciones = null;

    this.habitacionesService.obtenerTiposHabitacion().subscribe({
      next: (tipos) => {
        this.tiposHabitacion = tipos;

        this.habitacionesService.obtenerEstadosHabitacion().subscribe({
          next: (estados) => {
            this.estadosHabitacion = estados;
            this.cargarHabitaciones();
          },
          error: (error) => {
            this.errorHabitaciones = error.message;
          }
        });
      },
      error: (error) => {
        this.errorHabitaciones = error.message;
      }
    });
  }

  cargarHabitaciones(): void {
    this.habitacionesService.obtenerHabitaciones().subscribe({
      next: (lista) => {
        this.habitaciones = lista.map(h => this.aVistaHabitacion(h));
      },
      error: (error) => {
        this.errorHabitaciones = error.message;
      }
    });
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

  darDeBaja(hab: Habitacion): void {
  this.cerrarDropdown();
  const estadoInactiva = this.estadosHabitacion.find(
    e => e.nombre.toLowerCase() === 'inactiva'
  );
  if (estadoInactiva) {
    const cuerpo: HabitacionApi = {
      ...hab.original,
      id_estado_habitacion: this.aIdApi(estadoInactiva.id)
    };
    this.habitacionesService.actualizarHabitacion(hab.idApi, cuerpo).subscribe({
      next: () => this.cargarHabitaciones(),
      error: (error) => this.errorHabitaciones = error.message
    });
  }
}

  guardarNuevoEstado(nuevoEstado: string): void {
    console.log('nuevoEstado recibido:', nuevoEstado);
    console.log('estadosHabitacion:', this.estadosHabitacion);
    console.log('modal:', this.modal());
    const m = this.modal();
    if (m?.tipo !== 'estado') { 
      this.cerrarModal(); 
      return; 
    }

    const item = m.item;

    if ('idApi' in item) {
      // Es una habitación — persistir en db.json
      const estadoApi = this.estadosHabitacion.find(
        e => this.estadoSlug(e.nombre) === nuevoEstado
      );
      if (estadoApi) {
        const cuerpo: HabitacionApi = {
          ...item.original,
          id_estado_habitacion: this.aIdApi(estadoApi.id)
        };
        this.habitacionesService.actualizarHabitacion(item.idApi, cuerpo).subscribe({
          next: () => {
            this.cerrarModal();
            this.cargarHabitaciones();
          },
          error: (error) => {
            this.errorHabitaciones = error.message;
            this.cerrarModal();
          }
        });
      }
    } else {
      // Es un servicio — solo en memoria por ahora
      const textos: Record<EstadoDisponibilidad, string> = {
        disponible: 'Disponible',
        ocupado: 'Ocupado',
        mantenimiento: 'En mantenimiento',
      };
      item.estado = nuevoEstado as EstadoDisponibilidad;
      item.estadoTexto = textos[nuevoEstado as EstadoDisponibilidad];
      this.cerrarModal();
    }
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

  // ===== Modales: Agregar / Editar habitación =====
  abrirModalAgregarHabitacion(): void {
    let estadoInicial: number | string = '';
    const disponible = this.estadosHabitacion.find(e => this.estadoSlug(e.nombre) === 'disponible');
    if (disponible) {
      estadoInicial = disponible.id;
    }
    this.formHabitacion = this.crearFormularioHabitacion('', '', '', '', '', estadoInicial);
    this.errorFormularioHabitacion = null;
    this.modal.set({ tipo: 'agregarHabitacion' });
  }

  editarHabitacion(hab: Habitacion): void {
    this.cerrarDropdown();
    const h = hab.original;
    this.formHabitacion = this.crearFormularioHabitacion(
      h.piso, h.numero, h.id_tipo_habitacion, h.precio, h.capacidad, h.id_estado_habitacion
    );
    this.errorFormularioHabitacion = null;
    this.modal.set({ tipo: 'editarHabitacion', item: hab });
  }

  
  alCambiarTipoHabitacion(idTipo: string): void {
    this.errorFormularioHabitacion = null;

    let precio: number | string = '';
    let capacidad: number | string = '';

    const editando = this.modalEditarHabitacion;
    if (editando && this.mismoId(editando.original.id_tipo_habitacion, idTipo)) {
      precio = editando.original.precio;
      capacidad = editando.original.capacidad;
    } else {
      const referencia = this.habitaciones.find(h => this.mismoId(h.original.id_tipo_habitacion, idTipo));
      if (referencia) {
        precio = referencia.original.precio;
        capacidad = referencia.original.capacidad;
      } else {
        this.errorFormularioHabitacion = 'No hay ninguna habitación de este tipo en la base de datos de la cual tomar precio y capacidad.';
      }
    }

    this.Precio?.setValue(precio);
    this.Capacidad?.setValue(capacidad);
  }

  /** Guarda el formulario */
  guardarHabitacion(): void {
    if (this.guardandoHabitacion) {
      return;
    }

    if (this.formHabitacion.valid) {
      const f = this.formHabitacion.value;
      const editando = this.modalEditarHabitacion;

      
      const cuerpo: HabitacionApi = editando
        ? { ...editando.original }
        : { id_tipo_habitacion: '', id_estado_habitacion: '', numero: 0, piso: 0, precio: 0, capacidad: 0 };
      cuerpo.id_tipo_habitacion = this.aIdApi(f.tipo);
      cuerpo.id_estado_habitacion = this.aIdApi(f.estado);
      cuerpo.numero = Number(f.numero);
      cuerpo.piso = Number(f.piso);
      cuerpo.precio = Number(f.precio);
      cuerpo.capacidad = Number(f.capacidad);

      const peticion = editando
        ? this.habitacionesService.actualizarHabitacion(editando.idApi, cuerpo)
        : this.habitacionesService.crearHabitacion(cuerpo);

      this.guardandoHabitacion = true;
      this.errorFormularioHabitacion = null;

      peticion.subscribe({
        next: () => {
          this.guardandoHabitacion = false;
          this.cerrarModal();
          this.cargarHabitaciones(); 
        },
        error: (error) => {
          this.guardandoHabitacion = false;
          this.errorFormularioHabitacion = error.message;
        }
      });
    }
    else {
      this.formHabitacion.markAllAsTouched();
    }
  }

  // ===== Modales: Agregar servicio =====
  abrirModalAgregarServicio(): void {
    this.nuevoServicio = this.servicioVacio();
    this.modal.set({ tipo: 'agregarServicio' });
  }

  guardarServicio(): void {
    // TODO: conectar con el servicio/API real
    this.cerrarModal();
  }

  cerrarModal(): void {
    this.modal.set(null);
  }

  // ===== Helpers privados =====

  private crearFormularioHabitacion(
    piso: number | string, numero: number | string, tipo: number | string,
    precio: number | string, capacidad: number | string, estado: number | string
  ): FormGroup {
    return this.formBuilder.group({
      piso: [piso, [Validators.required, Validators.min(0)]],
      numero: [numero, [Validators.required, Validators.min(1)]],
      tipo: [tipo, [Validators.required]],
      precio: [precio, [Validators.required]],
      capacidad: [capacidad, [Validators.required]],
      estado: [estado, [Validators.required]]
    });
  }

  private aVistaHabitacion(h: HabitacionApi): Habitacion {
    const tipo = this.tiposHabitacion.find(t => this.mismoId(t.id, h.id_tipo_habitacion));
    const estadoApi = this.estadosHabitacion.find(e => this.mismoId(e.id, h.id_estado_habitacion));
    const estado = this.estadoSlug(estadoApi ? estadoApi.nombre : '');
    const tipoNombre = tipo ? tipo.nombre : 'Sin tipo';

    return {
      id: 'hab' + h.id,
      idApi: h.id as number | string,
      imagen: h.imagen_principal ?? IMAGEN_POR_DEFECTO,
      nombre: tipoNombre,
      subtitulo: `Habitación ${h.numero}`,
      categoriaSlug: tipoNombre.toLowerCase().includes('suite') ? 'suite' : 'deluxe',
      categoriaLabel: tipoNombre,
      precio: h.precio,
      estado,
      estadoTexto: estadoApi ? estadoApi.nombre : '',
      ocupacionPorcentaje: estado === 'ocupado' ? 100 : 0,
      original: h
    };
  }

  /** json-server 1.x devuelve los ids como texto y en db.json hay claves numéricas: se comparan como texto. */
  private mismoId(a: number | string, b: number | string): boolean {
    return String(a) === String(b);
  }

  /** Al guardar, las claves foráneas se envían como número (formato original de db.json). */
  private aIdApi(valor: number | string): number | string {
    const n = Number(valor);
    return isNaN(n) ? valor : n;
  }

  /** Traduce el nombre de estados_habitacion ("Ocupada", etc.) al slug usado para las clases CSS. */
  private estadoSlug(nombre: string): EstadoDisponibilidad {
    const n = nombre.toLowerCase();
    if (n.startsWith('ocup')) return 'ocupado';
    if (n.startsWith('mant')) return 'mantenimiento';
    return 'disponible';
  }

  private servicioVacio(): FormularioServicio {
    return { piso: '', nombre: '', tipo: '', precio: null, descripcion: '', estado: 'disponible' };
  }
}