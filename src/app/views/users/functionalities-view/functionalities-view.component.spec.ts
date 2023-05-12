import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionalitiesViewComponent } from './functionalities-view.component';

describe('FunctionalitiesViewComponent', () => {
  let component: FunctionalitiesViewComponent;
  let fixture: ComponentFixture<FunctionalitiesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FunctionalitiesViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionalitiesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
