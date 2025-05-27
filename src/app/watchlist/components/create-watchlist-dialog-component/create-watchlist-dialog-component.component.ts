// create-watchlist-dialog.component.ts

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-watchlist-dialog',
  templateUrl: './create-watchlist-dialog-component.component.html',
  styleUrls: ['./create-watchlist-dialog-component.component.scss']
})
export class CreateWatchlistDialogComponent {

  // Define the FormGroup for the dialog form
  createWatchlistForm: FormGroup;

  constructor(
    // Inject MatDialogRef to control the dialog instance
    public dialogRef: MatDialogRef<CreateWatchlistDialogComponent>,
    // Inject MAT_DIALOG_DATA if you need to pass data into the dialog
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialize the FormGroup with a FormControl for the watchlist name
    this.createWatchlistForm = new FormGroup({
      // 'name' is the form control name, initialized as empty string
      // Add Validators.required to make the input mandatory
      name: new FormControl('', Validators.required)
    });
  }

  // Helper getter to easily access the name form control
  get nameControl() {
    return this.createWatchlistForm.get('name') as FormControl;
  }

  // Method called when the "Create" button is clicked
  onCreateClick(): void {
    // Check if the form is valid
    if (this.createWatchlistForm.valid) {
      // Close the dialog and pass the value of the name control back
      this.dialogRef.close({ name: this.nameControl.value });
    } else {
      // Mark the form control as touched to display validation errors
      this.nameControl.markAsTouched();
    }
  }

  // Method called when the "Cancel" button is clicked
  onCancelClick(): void {
    // Close the dialog without passing any data back
    this.dialogRef.close();
  }
}
