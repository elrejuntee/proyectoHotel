import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { EstadoHabitacion, Habitacion, TipoHabitacion } from '../../models';
import { HabitacionesService } from '../../services/habitaciones/habitaciones.service';

@Component({
  selector: 'app-habitaciones',
  imports: [NgClass, FormsModule, ReactiveFormsModule],
  templateUrl: './habitaciones-admin.component.html',
  styleUrl: './habitaciones-admin.component.css'
})
export class HabitacionesAdminComponent {

  // ===== Datos: vienen del backend a través de HabitacionesService =====
  habitaciones: Habitacion[] = [];
  tiposHabitacion: TipoHabitacion[] = [];
  estadosHabitacion: EstadoHabitacion[] = [];
  errorHabitaciones: string | null = null;

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
  guardandoHabitacion: boolean = false;

  // Se inyectan el FormBuilder y el servicio en el constructor
  constructor(private formBuilder: FormBuilder, private habitacionesService: HabitacionesService) {
    this.formHabitacion = this.crearFormularioHabitacion('', '', '', '', '', '');
    this.cargarTiposHabitacion();
    this.cargarEstadosHabitacion();
    this.cargarHabitaciones();
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

  get totalMantenimiento(): number {
    return this.habitaciones.filter(habitacion => this.obtenerSlugEstado(habitacion) === 'mantenimiento').length;
  }

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

  // ===== Datos derivados de cada habitación (se consultan desde la vista) =====
  obtenerNombreTipo(habitacion: Habitacion): string {
    const tipoEncontrado = this.tiposHabitacion.find(tipoHabitacion => tipoHabitacion.id_tipo_habitacion_id === habitacion.id_tipo_habitacion_id);
    return tipoEncontrado ? tipoEncontrado.nombre : '';
  }

  obtenerNombreEstado(habitacion: Habitacion): string {
    const estadoEncontrado = this.estadosHabitacion.find(estadoHabitacion => estadoHabitacion.id_estado_habitacion_id === habitacion.id_estado_habitacion_id);
    return estadoEncontrado ? estadoEncontrado.estado_habitacion : '';
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
    return this.habitacionesService.obtenerImagenPrincipal(habitacion.id_tipo_habitacion_id);
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
    this.idNuevoEstado = String(habitacion.id_estado_habitacion_id);
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
      id_estado_habitacion_id: Number(this.idNuevoEstado)
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
    this.formHabitacion = this.crearFormularioHabitacion('', '', '', '', '', estadoDisponible ? estadoDisponible.id_estado_habitacion_id : '');
    this.errorFormularioHabitacion = null;
    this.modalActivo = 'formulario';
  }

  editarHabitacion(habitacion: Habitacion): void {
    this.cerrarDropdown();
    // Se guarda primero la habitación: el validador asíncrono la necesita para ignorarse a sí misma
    this.habitacionSeleccionada = habitacion;
    this.formHabitacion = this.crearFormularioHabitacion(
      habitacion.piso, habitacion.numero, habitacion.id_tipo_habitacion_id,
      habitacion.precio, habitacion.capacidad, habitacion.id_estado_habitacion_id
    );
    this.errorFormularioHabitacion = null;
    this.modalActivo = 'formulario';
  }

  guardarHabitacion(): void {
    if (this.guardandoHabitacion) {
      return;
    }

    if (!this.habitacionSeleccionada) {
      throw new Error('No hay una habitación seleccionada para actualizar');
    }

    // Mientras el validador asíncrono está consultando, el formulario no es válido todavía
    if (this.formHabitacion.valid) {
      const datosHabitacion = {
        id_tipo_habitacion_id: this.formHabitacion.value.tipo,
        id_estado_habitacion_id: Number(this.formHabitacion.value.estado),
        numero: Number(this.formHabitacion.value.numero),
        piso: Number(this.formHabitacion.value.piso),
        precio: Number(this.formHabitacion.value.precio),
        capacidad: Number(this.formHabitacion.value.capacidad)
      };

      const peticion = this.habitacionesService.actualizarHabitacion(
        this.habitacionSeleccionada.id, 
        { ...datosHabitacion, id: this.habitacionSeleccionada.id }
      );

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
    const numero = Number(control.value);

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

  /** Traduce el nombre de estado_habitacion al slug usado para las clases CSS. */
  private obtenerSlugEstado(habitacion: Habitacion): string {
    const nombre = this.obtenerNombreEstado(habitacion);
    if (nombre === 'Disponible') return 'disponible';
    if (nombre === 'Ocupada') return 'ocupado';
    if (nombre === 'Mantenimiento') return 'mantenimiento';
    if (nombre === 'Reservada') return 'reservada';
    return '';
  }
}