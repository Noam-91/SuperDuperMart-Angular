import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from "./services/cart.service";
import ICart from "../shared/models/ICart";
import {IProduct} from "../shared/models/IProduct";
import {
  PaymentRedirectDialogComponent,
  PaymentRedirectDialogData
} from "../payment-redirect-dialog/payment-redirect-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cart: ICart | null = null;
  selectedProductIds: Set<number> = new Set<number>();
  cartSubscription: Subscription | null = null;
  errorMessage: string = '';

  constructor(private dialog: MatDialog,
              public cs:CartService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.cs.getCart().subscribe();
    this.cartSubscription = this.cs.cart$.subscribe({
      next: value => {
        this.cart = value
      }
    })
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }

  /** Product selection */
  isSelected(productId: number): boolean {
    return this.selectedProductIds.has(productId);
  }

  toggleSelect(productId: number, event:Event): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectedProductIds.add(productId);
    } else {
      this.selectedProductIds.delete(productId);
    }
  }

  /** Modify Cart */
  updateQuantity(productId: number, operation:'+'|'-'): void {
    const product = this.cart?.products.find(p => p.productId === productId);
    if (operation === '+') {
      product!.quantity!++;
    } else if (operation === '-') {
      product!.quantity!--;
    }
    console.log(productId,product!.quantity);
    this.cs.updateProductQuantity(this.cart!).subscribe();
  }

  removeProduct(productId: number): void {
    this.cs.removeProductFromCart(productId).subscribe();
  }


  getTotalPrice(): number {
    let total = 0;
    this.getSelectedProducts().forEach(p => {
      total += p.priceRetail * p.quantity!;
    });
    return total;
  }

  getSelectedProducts(): IProduct[] {
    return this.cart?.products.filter(p => this.selectedProductIds.has(p.productId)) || [];
  }

  /** Checkout */
  checkout(): void {
      const purchasingCart = {
        userId: this.cart!.userId,
        products: this.getSelectedProducts()
      }
      this.cs.checkout(purchasingCart).subscribe({
        next: value => {
          this.openPaymentRedirectDialog(value['paymentUrl']);
          this.cs.getCart().subscribe();
        },
        error: err => {
          this.errorMessage = err.error.error;
          this.snackBar.open(this.errorMessage, 'Close',
            {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
        }
      });
  }

  openPaymentRedirectDialog(paymentUrl: string): void {
    const dialogData: PaymentRedirectDialogData = {
      paymentUrl: paymentUrl
    };

    const dialogRef = this.dialog.open(PaymentRedirectDialogComponent, {
      width: '400px', // Set the width of the dialog
      data: dialogData // Pass the payment URL data to the dialog
    });

    // Optional: Subscribe to the afterClosed() event to get a result when the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      // Handle the result (e.g., if the user clicked "Cancel", result might be false)
      if (result === true) {
        // User clicked "Go to Payment" (or it was successful)
        // You might want to do something here, but the redirection is handled by the <a> tag
      } else {
        // User clicked "Cancel" or closed the dialog
      }
    });
  }
}
