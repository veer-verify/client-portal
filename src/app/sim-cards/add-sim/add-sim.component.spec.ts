import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSimComponent } from './add-sim.component';

describe('AddSimComponent', () => {
  let component: AddSimComponent;
  let fixture: ComponentFixture<AddSimComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSimComponent]
    });
    fixture = TestBed.createComponent(AddSimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
