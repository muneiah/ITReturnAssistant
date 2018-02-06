import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HraComponent } from './hra.component';

describe('HraComponent', () => {
  let component: HraComponent;
  let fixture: ComponentFixture<HraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
