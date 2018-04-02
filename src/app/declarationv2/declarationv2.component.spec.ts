import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Declarationv2Component } from './declarationv2.component';

describe('Declarationv2Component', () => {
  let component: Declarationv2Component;
  let fixture: ComponentFixture<Declarationv2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Declarationv2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Declarationv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
