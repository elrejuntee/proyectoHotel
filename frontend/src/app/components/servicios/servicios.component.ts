import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../auth/servicios/login/login.service';
import { Servicio, TipoServicio } from '../../models';
import { ServiciosService } from '../../services/servicios/servicios.service';
import { ModalReservaComponent } from '../modal-reserva/modal-reserva.component';

// Texto, imagen e ícono de cada tipo de servicio: no vienen de la base de datos (el diagrama no los modela),
// así que quedan en el código, indexados por el nombre del tipo.
interface DetalleServicio {
  icono: string;
  imagen: string;
  descripcion: string;
  beneficios: string[];
}

const DETALLE_POR_TIPO: Record<string, DetalleServicio> = {
  'Sala Conferencia': {
    icono: '🏢',
    imagen: 'imagenes/sala-conferencia.webp',
    descripcion: 'Espacios modernos y equipados para reuniones de negocios, eventos corporativos y presentaciones.',
    beneficios: [
      'Proyector y pantalla incluidos',
      'Conexión wifi de alta velocidad',
      'Servicio de catering disponible'
    ]
  },
  'Comedor': {
    icono: '🍽️',
    imagen: 'imagenes/comedor.webp',
    descripcion: 'Disfrutá de un desayuno completo y cenas gourmet elaboradas por nuestros chefs. Opciones para todos los gustos, con ingredientes frescos y de temporada.',
    beneficios: [
      'Desayuno continental incluido',
      'Menú variado para almuerzo y cena',
      'Opciones vegetarianas y veganas',
      'Servicio a la habitación disponible'
    ]
  },
  'Sala Privada': {
    icono: '🚪',
    imagen: 'imagenes/sala-privada.webp',
    descripcion: 'Un espacio exclusivo para reuniones íntimas, celebraciones especiales o cenas privadas. Ideal para grupos pequeños que buscan privacidad y confort.',
    beneficios: [
      'Menú personalizado a pedido',
      'Decoración incluida para eventos',
      'Acceso exclusivo durante la reserva'
    ]
  },
  'Co-working': {
    icono: '💻',
    imagen: 'imagenes/co-working.webp',
    descripcion: 'Trabajá cómodamente desde el hotel en nuestro espacio de co-working equipado. Perfecto para viajeros de negocios que necesitan un ambiente productivo.',
    beneficios: [
      'Wifi de alta velocidad dedicado',
      'Escritorios individuales y compartidos',
      'Sala de reuniones reservable',
      'Impresora y escáner disponibles'
    ]
  }
};

// Se usa si en la base hay un tipo de servicio que todavía no tiene texto ni imagen acá
const DETALLE_POR_DEFECTO: DetalleServicio = {
  icono: '🛎️',
  imagen: 'imagenes/sala-privada.webp',
  descripcion: 'Consultá la disponibilidad y reservá este servicio.',
  beneficios: []
};

@Component({
  selector: 'app-servicios',
  imports: [ModalReservaComponent],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {
  private loginService = inject(LoginService);
  private router = inject(Router);
  private serviciosService = inject(ServiciosService);

  // ===== Datos: vienen de Django a través de ServiciosService =====
  servicios: Servicio[] = [];
  tiposServicio: TipoServicio[] = [];
  mensajeError: string = '';

  // ===== Modal de inicio de sesión =====
  mostrarModal = false;
  idServicioSeleccionado?: number;

  constructor() {
    this.cargarServicios();
    this.cargarTiposServicio();
  }

  // ===== Carga de datos =====
  cargarServicios(): void {
    this.serviciosService.obtenerServicios().subscribe({
      next: (servicios) => {
        this.servicios = servicios;
      },
      error: (error) => {
        this.mensajeError = error.message;
      }
    });
  }

  cargarTiposServicio(): void {
    this.serviciosService.obtenerTiposServicio().subscribe({
      next: (tiposServicio) => {
        this.tiposServicio = tiposServicio;
      },
      error: (error) => {
        this.mensajeError = error.message;
      }
    });
  }

  // ===== Datos derivados de cada servicio (se consultan desde la vista) =====
  obtenerNombreTipo(servicio: Servicio): string {
    const tipoEncontrado = this.tiposServicio.find(tipoServicio => tipoServicio.id === servicio.id_tipo_servicio);
    return tipoEncontrado ? tipoEncontrado.nombre_servicio : '';
  }

  obtenerDetalle(servicio: Servicio): DetalleServicio {
    return DETALLE_POR_TIPO[this.obtenerNombreTipo(servicio)] ?? DETALLE_POR_DEFECTO;
  }

  obtenerIcono(tipoServicio: TipoServicio): string {
    return (DETALLE_POR_TIPO[tipoServicio.nombre_servicio] ?? DETALLE_POR_DEFECTO).icono;
  }

  // ===== Reservar =====
  intentarReservar(idServicio: number): void {
    if (this.loginService.usuarioLogueado) {
      this.router.navigate(['/formulario-servicio', idServicio]);
    } else {
      this.idServicioSeleccionado = idServicio;
      this.mostrarModal = true;
    }
  }
}