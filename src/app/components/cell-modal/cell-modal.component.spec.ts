import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellModalComponent } from './cell-modal.component';

describe('CellModalComponent', () => {
  let component: CellModalComponent;
  let fixture: ComponentFixture<CellModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CellModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CellModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
