import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { EstadoHabitacion, EstadoReserva, Habitacion, Reserva, ReservaHabitacion, TipoHabitacion } from '../../models';
import { ErrorApi, HabitacionesService } from '../../services/habitaciones/habitaciones.service';
import { ReservasService } from '../../services/reservas/reservas.service';

@Component({
  selector: 'app-habitaciones-admin',
  imports: [NgClass, FormsModule, ReactiveFormsModule],
  templateUrl: './habitaciones-admin.component.html',
  styleUrl: './habitaciones-admin.component.css'
})
export class HabitacionesAdminComponent {

  // ===== Datos: vienen del backend a través de los servicios =====
  habitaciones: Habitacion[] = [];
  tiposHabitacion: TipoHabitacion[] = [];
  estadosHabitacion: EstadoHabitacion[] = [];
  reservas: Reserva[] = [];
  reservasHabitacion: ReservaHabitacion[] = [];
  estadosReserva: EstadoReserva[] = [];
  errorHabitaciones: string | null = null;

  // ===== Filtros de la tabla =====
  numeroBuscado: string = '';
  idTipoFiltro: string = '';
  estadoFiltro: string = '';

  // ===== Menú de acciones abierto (número de fila de la tabla) =====
  dropdownAbiertoIndice: number | null = null;

  // ===== Modal abierto + habitación sobre la que se está trabajando =====
  modalActivo: 'ver' | 'estado' | 'formulario' | null = null;
  habitacionSeleccionada: Habitacion | null = null;

  // ===== Modal "Cambiar estado" =====
  idNuevoEstado: string = '';

  // ===== Modal "Agregar / Editar" (formulario reactivo) =====
  formHabitacion: FormGroup;
  errorFormularioHabitacion: string | null = null;
  // Errores que devuelve el backend por cada campo (ej.: { capacidad: ['...'] })
  erroresBackend: { [campo: string]: string[] } = {};
  guardandoHabitacion: boolean = false;

  // Se inyectan el FormBuilder y los servicios en el constructor
  constructor(
    private formBuilder: FormBuilder,
    private habitacionesService: HabitacionesService,
    private reservasService: ReservasService
  ) {
    this.formHabitacion = this.crearFormularioHabitacion('', '', '', '', '', '');
    this.cargarTiposHabitacion();
    this.cargarEstadosHabitacion();
    this.cargarHabitaciones();
    this.cargarReservas();
    this.cargarReservasHabitacion();
    this.cargarEstadosReserva();
  }

  // ===== Getters para acceder a los form controls desde la vista =====
  get Piso() { return this.formHabitacion.get('piso'); }
  get Numero() { return this.formHabitacion.get('numero'); }
  get Tipo() { return this.formHabitacion.get('tipo'); }
  get Precio() { return this.formHabitacion.get('precio'); }
  get Capacidad() { return this.formHabitacion.get('capacidad'); }
  get Estado() { return this.formHabitacion.get('estado'); }

  // ===== Getters de las tarjetas de estadísticas =====
  get totalHabitaciones(): number {
    return this.habitaciones.length;
  }

  get totalDisponibles(): number {
    return this.habitaciones.filter(habitacion => this.obtenerSlugEstado(habitacion) === 'disponible').length;
  }

  get totalOcupadas(): number {
    return this.habitaciones.filter(habitacion => this.obtenerSlugEstado(habitacion) === 'ocupado').length;
  }

  get totalReservadas(): number {
    return this.habitaciones.filter(habitacion => this.obtenerSlugEstado(habitacion) === 'reservada').length;
  }

  get totalMantenimiento(): number {
    return this.habitaciones.filter(habitacion => this.obtenerSlugEstado(habitacion) === 'mantenimiento').length;
  }

  // ===== Getter de los filtros =====
  /** Habitaciones que cumplen los tres filtros a la vez: número, tipo y estado. */
  get habitacionesFiltradas(): Habitacion[] {
    return this.habitaciones.filter(habitacion => {
      const coincideNumero = habitacion.numero.toString().includes(this.numeroBuscado.trim());
      const coincideTipo = this.idTipoFiltro === '' || habitacion.id_tipo_habitacion === Number(this.idTipoFiltro);
      const coincideEstado = this.estadoFiltro === '' || this.obtenerNombreEstado(habitacion) === this.estadoFiltro;
      return coincideNumero && coincideTipo && coincideEstado;
    });
  }

  // ===== Getter del modal Agregar / Editar =====
  /** El mismo modal sirve para agregar (sin habitación seleccionada) y para editar. */
  get esEdicion(): boolean {
    return this.habitacionSeleccionada !== null;
  }

  // ===== Carga de datos: el componente se suscribe al observable del servicio =====
  cargarTiposHabitacion(): void {
    this.habitacionesService.obtenerTiposHabitacion().subscribe({
      next: (tiposHabitacion) => {
        this.tiposHabitacion = tiposHabitacion;
      },
      error: (error) => {
        this.errorHabitaciones = error.message;
      }
    });
  }

  cargarEstadosHabitacion(): void {
    this.habitacionesService.obtenerEstadosHabitacion().subscribe({
      next: (estadosHabitacion) => {
        this.estadosHabitacion = estadosHabitacion;
      },
      error: (error) => {
        this.errorHabitaciones = error.message;
      }
    });
  }

  cargarHabitaciones(): void {
    this.habitacionesService.obtenerHabitaciones().subscribe({
      next: (habitaciones) => {
        this.habitaciones = habitaciones;
      },
      error: (error) => {
        this.errorHabitaciones = error.message;
      }
    });
  }

  cargarReservas(): void {
    this.reservasService.obtenerReservas().subscribe({
      next: (reservas) => {
        this.reservas = reservas;
      },
      error: (error) => {
        this.errorHabitaciones = error.message;
      }
    });
  }

  cargarReservasHabitacion(): void {
    this.reservasService.obtenerReservasHabitacion().subscribe({
      next: (reservasHabitacion) => {
        this.reservasHabitacion = reservasHabitacion;
      },
      error: (error) => {
        this.errorHabitaciones = error.message;
      }
    });
  }

  cargarEstadosReserva(): void {
    this.reservasService.obtenerEstadosReserva().subscribe({
      next: (estadosReserva) => {
        this.estadosReserva = estadosReserva;
      },
      error: (error) => {
        this.errorHabitaciones = error.message;
      }
    });
  }

  // ===== Datos derivados de cada habitación (se consultan desde la vista) =====
  obtenerNombreTipo(habitacion: Habitacion): string {
    const tipoEncontrado = this.tiposHabitacion.find(tipoHabitacion => tipoHabitacion.id === habitacion.id_tipo_habitacion);
    return tipoEncontrado ? tipoEncontrado.nombre : '';
  }

  /**
   * Estado que se muestra de la habitación:
   *  - Mantenimiento: siempre manda el estado guardado.
   *  - Con una reserva confirmada que ya empezó: Ocupada.
   *  - Con una reserva confirmada cuyo check-in todavía no llegó: Reservada.
   *  - Si no, el estado guardado (Disponible).
   */
  obtenerNombreEstado(habitacion: Habitacion): string {
    const nombreGuardado = this.obtenerNombreEstadoGuardado(habitacion);

    if (nombreGuardado === 'Mantenimiento') {
      return nombreGuardado;
    }

    const reservaVigente = this.obtenerReservaVigente(habitacion);
    if (reservaVigente) {
      return reservaVigente.fecha_checkin.slice(0, 10) <= this.obtenerHoy() ? 'Ocupada' : 'Reservada';
    }

    return nombreGuardado;
  }

  obtenerClaseEstado(habitacion: Habitacion): string {
    return 'etiqueta-' + this.obtenerSlugEstado(habitacion);
  }

  obtenerClaseCategoria(habitacion: Habitacion): string {
    return this.obtenerNombreTipo(habitacion).toLowerCase().includes('suite') ? 'etiqueta-suite' : 'etiqueta-deluxe';
  }

  obtenerOcupacion(habitacion: Habitacion): number {
    return this.obtenerSlugEstado(habitacion) === 'ocupado' ? 100 : 0;
  }

  obtenerImagen(habitacion: Habitacion): string {
    return this.habitacionesService.obtenerImagenPrincipal(habitacion.id_tipo_habitacion);
  }

  /** Reserva confirmada de la habitación que está en curso o es la próxima (undefined si no tiene). */
  obtenerReservaVigente(habitacion: Habitacion): ReservaHabitacion | undefined {
    const hoy = this.obtenerHoy();
    const estadoConfirmada = this.estadosReserva.find(estadoReserva => estadoReserva.estado_reserva === 'Confirmada');

    const idsConfirmadas = this.reservas
      .filter(reserva => estadoConfirmada && reserva.id_estado_reserva === estadoConfirmada.id)
      .map(reserva => reserva.id);

    // Solo las reservas que todavía no terminaron, la que empieza primero va primera
    return this.reservasHabitacion
      .filter(reservaHabitacion => reservaHabitacion.id_habitacion === habitacion.id)
      .filter(reservaHabitacion => idsConfirmadas.includes(reservaHabitacion.id_reserva))
      .filter(reservaHabitacion => reservaHabitacion.fecha_checkout.slice(0, 10) > hoy)
      .sort((reservaA, reservaB) => reservaA.fecha_checkin.localeCompare(reservaB.fecha_checkin))[0];
  }

  /** Fechas de la reserva vigente con formato dd/mm/aaaa ('' si la habitación no tiene reserva). */
  obtenerFechasReserva(habitacion: Habitacion): string {
    const reservaVigente = this.obtenerReservaVigente(habitacion);
    if (!reservaVigente) {
      return '';
    }
    return this.formatearFecha(reservaVigente.fecha_checkin) + ' al ' + this.formatearFecha(reservaVigente.fecha_checkout);
  }

  // ===== Menú de acciones por fila =====
  toggleDropdown(indice: number): void {
    this.dropdownAbiertoIndice = this.dropdownAbiertoIndice === indice ? null : indice;
  }

  cerrarDropdown(): void {
    this.dropdownAbiertoIndice = null;
  }

  // ===== Modal: Ver =====
  verHabitacion(habitacion: Habitacion): void {
    this.cerrarDropdown();
    this.habitacionSeleccionada = habitacion;
    this.modalActivo = 'ver';
  }

  // ===== Modal: Cambiar estado =====
  cambiarEstadoHabitacion(habitacion: Habitacion): void {
    this.cerrarDropdown();
    this.habitacionSeleccionada = habitacion;
    this.idNuevoEstado = String(habitacion.id_estado_habitacion);
    this.modalActivo = 'estado';
  }

  guardarNuevoEstado(): void {
    const habitacion = this.habitacionSeleccionada;

    if (!habitacion || this.idNuevoEstado === '') {
      this.cerrarModal();
      return;
    }

    const habitacionActualizada: Habitacion = {
      ...habitacion,
      id_estado_habitacion: Number(this.idNuevoEstado)
    };

    this.habitacionesService.actualizarHabitacion(habitacion.id, habitacionActualizada).subscribe({
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

  // ===== Modal: Agregar / Editar =====
  abrirModalAgregar(): void {
    // "Disponible" queda preseleccionado como valor inicial; el resto de los campos arranca vacío
    const estadoDisponible = this.estadosHabitacion.find(estadoHabitacion => estadoHabitacion.estado_habitacion === 'Disponible');

    this.habitacionSeleccionada = null;
    this.formHabitacion = this.crearFormularioHabitacion('', '', '', '', '', estadoDisponible ? estadoDisponible.id : '');
    this.errorFormularioHabitacion = null;
    this.erroresBackend = {};
    this.modalActivo = 'formulario';
  }

  editarHabitacion(habitacion: Habitacion): void {
    this.cerrarDropdown();
    // Se guarda primero la habitación: el validador asíncrono la necesita para ignorarse a sí misma
    this.habitacionSeleccionada = habitacion;
    this.formHabitacion = this.crearFormularioHabitacion(
      habitacion.piso, habitacion.numero, habitacion.id_tipo_habitacion,
      habitacion.precio, habitacion.capacidad, habitacion.id_estado_habitacion
    );
    this.errorFormularioHabitacion = null;
    this.erroresBackend = {};
    this.modalActivo = 'formulario';
  }

  guardarHabitacion(): void {
    if (this.guardandoHabitacion) {
      return;
    }

    // Mientras el validador asíncrono está consultando, el formulario no es válido todavía
    if (!this.formHabitacion.valid) {
      this.formHabitacion.markAllAsTouched();
      return;
    }

    const formulario = this.formHabitacion.value;

    // Los inputs numéricos ya entregan números; solo los selects entregan el id como texto
    const datosHabitacion = {
      id_tipo_habitacion: Number(formulario.tipo),
      id_estado_habitacion: Number(formulario.estado),
      numero: formulario.numero,
      piso: formulario.piso,
      precio: formulario.precio,
      capacidad: formulario.capacidad
    };

    // El mismo modal agrega (sin habitación seleccionada) o edita (con una seleccionada)
    const peticion = this.habitacionSeleccionada
      ? this.habitacionesService.actualizarHabitacion(
          this.habitacionSeleccionada.id,
          { ...datosHabitacion, id: this.habitacionSeleccionada.id }
        )
      : this.habitacionesService.crearHabitacion(datosHabitacion);

    this.guardandoHabitacion = true;
    this.errorFormularioHabitacion = null;
    this.erroresBackend = {};

    peticion.subscribe({
      next: () => {
        this.guardandoHabitacion = false;
        this.cerrarModal();
        this.cargarHabitaciones();
      },
      error: (error: ErrorApi) => {
        this.guardandoHabitacion = false;
        this.errorFormularioHabitacion = error.message;
        this.erroresBackend = error.errores;
      }
    });
  }

  /** Primer error que el backend devolvió para un campo (o '' si no hay), para mostrarlo debajo del campo. */
  obtenerErrorBackend(campo: string): string {
    const mensajes = this.erroresBackend[campo];
    return mensajes ? mensajes[0] : '';
  }

  // ===== Cierre de cualquier modal =====
  cerrarModal(): void {
    this.modalActivo = null;
    this.habitacionSeleccionada = null;
  }

  // ===== Validación asíncrona =====

  /**
   * Validador asíncrono del campo "número": consulta al backend y verifica que
   * ninguna otra habitación use ya ese número.
   * Es un Observable propio (como en el PDF): emite un valor con next() y termina con complete().
   *  - emite null                  -> el número está libre (válido)
   *  - emite { numeroEnUso: true } -> el número ya existe (inválido)
   */
  validarNumeroDisponible = (control: AbstractControl): Observable<ValidationErrors | null> => {
    const numero = control.value;

    return new Observable<ValidationErrors | null>(observer => {
      const consulta = this.habitacionesService.obtenerHabitaciones().subscribe({
        next: (habitaciones) => {
          // Se traen todas las habitaciones y se busca una con el mismo número.
          // Al editar, se ignora la propia habitación para que no se marque a sí misma.
          const habitacionRepetida = habitaciones.find(habitacion =>
            habitacion.numero === numero &&
            habitacion.id !== this.habitacionSeleccionada?.id
          );
          observer.next(habitacionRepetida ? { numeroEnUso: true } : null);
          observer.complete();
        },
        error: () => {
          // Si el backend no responde no se bloquea el formulario: ya se avisará al guardar
          observer.next(null);
          observer.complete();
        }
      });

      // Angular descarta la validación anterior cuando el valor cambia (o se vuelve a validar):
      // en ese caso también se cancela la consulta al backend para no dejar pedidos de más.
      return () => consulta.unsubscribe();
    });
  };

  // ===== Helpers privados =====

  private crearFormularioHabitacion(
    piso: number | string, numero: number | string, tipo: number | string,
    precio: number | string, capacidad: number | string, estado: number | string
  ): FormGroup {
    return this.formBuilder.group({
      piso: [piso, [Validators.required, Validators.min(0)]],
      // [valor, validadores síncronos, validadores asíncronos]
      numero: [numero, [Validators.required, Validators.min(1)], [this.validarNumeroDisponible]],
      tipo: [tipo, [Validators.required]],
      precio: [precio, [Validators.required, Validators.min(1)]],
      capacidad: [capacidad, [Validators.required, Validators.min(1)]],
      estado: [estado, [Validators.required]]
    });
  }

  /** Nombre del estado que tiene guardado la habitación en la base de datos. */
  private obtenerNombreEstadoGuardado(habitacion: Habitacion): string {
    const estadoEncontrado = this.estadosHabitacion.find(estadoHabitacion => estadoHabitacion.id === habitacion.id_estado_habitacion);
    return estadoEncontrado ? estadoEncontrado.estado_habitacion : '';
  }

  /** Fecha de hoy como aaaa-mm-dd, el mismo formato en que el backend guarda las fechas. */
  private obtenerHoy(): string {
    return new Date().toLocaleDateString('en-CA');
  }

  /** De aaaa-mm-dd a dd/mm/aaaa. */
  private formatearFecha(fecha: string): string {
    return fecha.slice(0, 10).split('-').reverse().join('/');
  }

  /** Traduce el nombre del estado que se muestra al slug usado para las clases CSS. */
  private obtenerSlugEstado(habitacion: Habitacion): string {
    const nombre = this.obtenerNombreEstado(habitacion);
    if (nombre === 'Disponible') return 'disponible';
    if (nombre === 'Ocupada') return 'ocupado';
    if (nombre === 'Mantenimiento') return 'mantenimiento';
    if (nombre === 'Reservada') return 'reservada';
    return '';
  }
}