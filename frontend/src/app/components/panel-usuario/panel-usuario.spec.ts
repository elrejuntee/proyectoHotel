import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelUsuario } from './panel-usuario';

describe('PanelUsuario', () => {
  let component: PanelUsuario;
  let fixture: ComponentFixture<PanelUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
