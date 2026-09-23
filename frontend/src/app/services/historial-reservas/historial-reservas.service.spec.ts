import { TestBed } from '@angular/core/testing';

import { HistorialReservasService } from './historial-reservas.service';

describe('HistorialReservasService', () => {
  let service: HistorialReservasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialReservasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
