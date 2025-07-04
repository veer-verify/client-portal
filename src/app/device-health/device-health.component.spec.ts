import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceHealthComponent } from './device-health.component';

describe('DeviceHealthComponent', () => {
  let component: DeviceHealthComponent;
  let fixture: ComponentFixture<DeviceHealthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceHealthComponent]
    });
    fixture = TestBed.createComponent(DeviceHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
