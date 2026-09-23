import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoConfirmadoComponent } from './pago-confirmado.component';

describe('PagoConfirmadoComponent', () => {
  let component: PagoConfirmadoComponent;
  let fixture: ComponentFixture<PagoConfirmadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoConfirmadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoConfirmadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
