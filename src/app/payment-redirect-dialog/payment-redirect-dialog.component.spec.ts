import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRedirectDialogComponent } from './payment-redirect-dialog.component';

describe('PaymentRedirectDialogComponent', () => {
  let component: PaymentRedirectDialogComponent;
  let fixture: ComponentFixture<PaymentRedirectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentRedirectDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentRedirectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
