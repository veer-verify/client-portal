import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimCardsComponent } from './sim-cards.component';

describe('SimCardsComponent', () => {
  let component: SimCardsComponent;
  let fixture: ComponentFixture<SimCardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimCardsComponent]
    });
    fixture = TestBed.createComponent(SimCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
