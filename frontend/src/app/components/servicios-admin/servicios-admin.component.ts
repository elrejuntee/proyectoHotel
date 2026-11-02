import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Servicio, TipoServicio } from '../../models';
import { ServiciosService } from '../../services/servicios/servicios.service';

@Component({
  selector: 'app-servicios-admin',
  imports: [FormsModule],
  templateUrl: './servicios-admin.component.html',
  styleUrl: './servicios-admin.component.css'
})
export class ServiciosAdminComponent {

  // ===== Datos: vienen de json-server a través de ServiciosService =====
  servicios: Servicio[] = [];
  tiposServicio: TipoServicio[] = [];
  errorServicios: string | null = null;

  // ===== Menú de acciones abierto (número de fila de la tabla) =====
  dropdownAbiertoIndice: number | null = null;

  // ===== Modal abierto + servicio sobre el que se está trabajando =====
  modalActivo: 'ver' | 'agregar' | null = null;
  servicioSeleccionado: Servicio | null = null;

  // ===== Modal "Agregar servicio" (formulario con ngModel) =====
  idTipoNuevoServicio: string = '';
  precioNuevoServicio: number | null = null;
  capacidadNuevoServicio: number | null = null;

  // Se inyecta el servicio en el constructor
  constructor(private serviciosService: ServiciosService) {
    this.cargarServicios();
    this.cargarTiposServicio();
  }

  // ===== Getters de las tarjetas de estadísticas =====
  get totalServicios(): number {
    return this.servicios.length;
  }

  get capacidadTotal(): number {
    return this.servicios.reduce((total, servicio) => total + servicio.capacidad_maxima, 0);
  }

  // ===== Carga de datos: el componente se suscribe al observable del servicio =====
  cargarServicios(): void {
    this.serviciosService.obtenerServicios().subscribe({
      next: (servicios) => {
        this.servicios = servicios;
      },
      error: (error) => {
        this.errorServicios = error.message;
      }
    });
  }

  cargarTiposServicio(): void {
    this.serviciosService.obtenerTiposServicio().subscribe({
      next: (tiposServicio) => {
        this.tiposServicio = tiposServicio;
      },
      error: (error) => {
        this.errorServicios = error.message;
      }
    });
  }

  // ===== Datos derivados de cada servicio (se consultan desde la vista) =====
  obtenerNombreServicio(servicio: Servicio): string {
    const tipoEncontrado = this.tiposServicio.find(tipoServicio => tipoServicio.id_tipo_servicio === servicio.id_tipo_servicio);
    return tipoEncontrado ? tipoEncontrado.nombre_servicio : '';
  }

  // ===== Menú de acciones por fila =====
  toggleDropdown(indice: number): void {
    this.dropdownAbiertoIndice = this.dropdownAbiertoIndice === indice ? null : indice;
  }

  cerrarDropdown(): void {
    this.dropdownAbiertoIndice = null;
  }

  // ===== Modal: Ver =====
  verServicio(servicio: Servicio): void {
    this.cerrarDropdown();
    this.servicioSeleccionado = servicio;
    this.modalActivo = 'ver';
  }

  // ===== Modal: Agregar servicio =====
  abrirModalAgregar(): void {
    this.idTipoNuevoServicio = '';
    this.precioNuevoServicio = null;
    this.capacidadNuevoServicio = null;
    this.modalActivo = 'agregar';
  }

  guardarServicio(): void {
    // TODO: falta un método crearServicio (POST /servicios) en ServiciosService
    this.cerrarModal();
  }

  cerrarModal(): void {
    this.modalActivo = null;
    this.servicioSeleccionado = null;
  }
}
