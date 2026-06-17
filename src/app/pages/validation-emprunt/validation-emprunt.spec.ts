import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationEmprunt } from './validation-emprunt';

describe('ValidationEmprunt', () => {
  let component: ValidationEmprunt;
  let fixture: ComponentFixture<ValidationEmprunt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationEmprunt],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationEmprunt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
