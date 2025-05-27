import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog'; // Import MatDialog components

// Define the data structure that will be passed to the dialog
export interface PaymentRedirectDialogData {
  paymentUrl: string;
}

@Component({
  selector: 'app-payment-redirect-dialog',
  templateUrl: `payment-redirect-dialog.component.html`,
  styleUrls: ['./payment-redirect-dialog.component.scss'],
})
export class PaymentRedirectDialogComponent {

  // Inject MAT_DIALOG_DATA to access data passed to the dialog
  // Inject MatDialogRef to control the dialog instance (close it)
  constructor(
    public dialogRef: MatDialogRef<PaymentRedirectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentRedirectDialogData
  ) {}

  // Method to close the dialog when the cancel button is clicked
  onCancelClick(): void {
    this.dialogRef.close(false); // Optionally pass a result back (e.g., false for cancellation)
  }

  // Optional: Method to close the dialog when the redirect button is clicked
  // The redirection happens via the <a> tag's href, but you might want to close the dialog
  onRedirectClick(): void {
    // Give the browser a moment to open the new tab/window before closing the dialog
    setTimeout(() => {
      this.dialogRef.close(true); // Optionally pass a result back (e.g., true for success/redirect initiated)
    }, 100); // Adjust delay if needed
  }
}
