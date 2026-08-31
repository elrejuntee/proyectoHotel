import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasVaciasComponent } from './listas-vacias.component';

describe('ListasVaciasComponent', () => {
  let component: ListasVaciasComponent;
  let fixture: ComponentFixture<ListasVaciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListasVaciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListasVaciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
