import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaurdComponent } from './gaurd.component';

describe('GaurdComponent', () => {
  let component: GaurdComponent;
  let fixture: ComponentFixture<GaurdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GaurdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GaurdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
