import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomscreenComponent } from './roomscreen.component';

describe('RoomscreenComponent', () => {
  let component: RoomscreenComponent;
  let fixture: ComponentFixture<RoomscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomscreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
