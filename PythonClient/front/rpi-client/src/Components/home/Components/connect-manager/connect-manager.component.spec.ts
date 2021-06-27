import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectManagerComponent } from './connect-manager.component';

describe('ConnectManagerComponent', () => {
  let component: ConnectManagerComponent;
  let fixture: ComponentFixture<ConnectManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
