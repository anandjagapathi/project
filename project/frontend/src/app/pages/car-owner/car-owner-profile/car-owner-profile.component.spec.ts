import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarOwnerProfileComponent } from './car-owner-profile.component';

describe('CarOwnerProfileComponent', () => {
  let component: CarOwnerProfileComponent;
  let fixture: ComponentFixture<CarOwnerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarOwnerProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarOwnerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
