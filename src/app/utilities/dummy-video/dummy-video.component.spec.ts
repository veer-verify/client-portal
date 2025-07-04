import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyVideoComponent } from './dummy-video.component';

describe('DummyVideoComponent', () => {
  let component: DummyVideoComponent;
  let fixture: ComponentFixture<DummyVideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DummyVideoComponent]
    });
    fixture = TestBed.createComponent(DummyVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
