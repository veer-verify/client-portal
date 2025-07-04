import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskrequestComponent } from './helpdeskrequest.component';

describe('HelpdeskrequestComponent', () => {
  let component: HelpdeskrequestComponent;
  let fixture: ComponentFixture<HelpdeskrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpdeskrequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpdeskrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
