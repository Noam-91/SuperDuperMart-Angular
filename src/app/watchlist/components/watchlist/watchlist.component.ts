import { Component, OnInit } from '@angular/core';
import IWatchlist from "../../../shared/models/IWatchlist";
import {of, Subscription, switchMap, tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {WatchlistService} from "../../services/watchlist.service";
import {CartService} from "../../../cart/services/cart.service";
import {FormControl, FormGroup} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {IProduct} from "../../../shared/models/IProduct";
import {
  CreateWatchlistDialogComponent
} from "../create-watchlist-dialog-component/create-watchlist-dialog-component.component";

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {
  watchlistCollection: IWatchlist[] = [];
  watchlist: IWatchlist | null = null;
  watchlistForm: FormGroup;
  onLoading: boolean = false;

  constructor(private ws: WatchlistService,
              private cs: CartService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private router: Router ) {
    this.watchlistForm = new FormGroup({
      selectedWatchlistId: new FormControl(null)
    })
  }

  ngOnInit(): void {


    this.ws.getAllWatchlists().pipe(
      tap(watchlists => {
        this.watchlistCollection = watchlists; // Update the collection
      }),
      switchMap(watchlists=>{
        // If watchlists exist, select the first one and load its details
        if (watchlists && watchlists.length > 0) {
          this.onLoading = true; // Start loading
          const firstWatchlistId = watchlists[0].watchlistId;
          this.selectedWatchlistIdControl.setValue(watchlists[0].watchlistId);
          return this.ws.getWatchlistById(firstWatchlistId); // Fetch details of the first watchlist
        }
        // If no watchlists, return an observable of null
        return of(null);
      })
    ).subscribe({
      next: watchlist => {
        this.onLoading = false;
        this.watchlist = watchlist; // Set the loaded watchlist
      },
      error: err => {
        this.onLoading = false;
        console.error("Error loading initial watchlist:", err);
        this.snackBar.open('Failed to load watchlists.', 'Close', { duration: 3000 });
        this.watchlist = null;
      }
    });

    // Subscribe to changes in the selected watchlist dropdown
    // This will trigger whenever the user selects a different watchlist
    this.selectedWatchlistIdControl.valueChanges.pipe(
      switchMap(watchlistId => {
        if (watchlistId !== null) {
          this.onLoading = true;
          return this.ws.getWatchlistById(watchlistId); // Fetch details of the selected watchlist
        }
        return of(null);
      })
    ).subscribe({
      next: watchlist => {
        this.onLoading = false;
        this.watchlist = watchlist;
      },
      error: err => {
        this.onLoading = false;
        console.error("Error loading selected watchlist:", err);
        this.snackBar.open('Failed to load selected watchlist products.', 'Close', { duration: 3000 });
        this.watchlist = null;
      }
    });

    this.ws.watchlistCollection$.subscribe(watchlists => {
      this.watchlistCollection = watchlists;
      // Optional: If the currently selected watchlist is deleted elsewhere, reset the form control
      if (this.watchlist && !watchlists.find(w => w.watchlistId === this.watchlist?.watchlistId)) {
        this.selectedWatchlistIdControl.setValue(null);
      }
    });
  }

  openCreateWatchlistDialog(): void {
    const dialogRef = this.dialog.open(CreateWatchlistDialogComponent, {
      width: '300px', // Adjust width as needed
      data: {} // You can pass data to the dialog if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.name) {
        // Assuming result.name contains the new watchlist name
        this.ws.createWatchlist(result.name).subscribe({
          next: _ => {
            this.snackBar.open(`Watchlist "${result.name}" created!`, 'Close', { duration: 3000 });
            this.ws.getAllWatchlists().subscribe(); // manually watchlistCollection state
          },
          error: err => {
            console.error('Error creating watchlist:', err);
            this.snackBar.open('Failed to create watchlist.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteSelectedWatchlist(): void {
    const watchlistId = this.selectedWatchlistIdControl.value;
    if (watchlistId !== null) {
      // Optional: Add a confirmation dialog before deleting
      const confirmDelete = confirm('Are you sure you want to delete this watchlist?');
      if (confirmDelete) {
        this.ws.deleteWatchlist(watchlistId).subscribe({
          next: () => {
            this.snackBar.open('Watchlist deleted successfully!', 'Close', { duration: 3000 });

            // Reset the selected watchlist
            this.selectedWatchlistIdControl.setValue(null);
            this.watchlist = null; // Clear displayed watchlist details
            this.ws.getAllWatchlists().subscribe(); // manually watchlistCollection state
          },
          error: (err: any) => {
            console.error(`Error deleting watchlist ${watchlistId}:`, err);
            this.snackBar.open('Failed to delete watchlist.', 'Close', { duration: 3000 });
          }
        });
      }
    }
    this.ws.getAllWatchlists().subscribe(
      watchlist=>this.watchlistCollection = watchlist
    );
    this.watchlist = null;
  }

  addToCart(product: IProduct): void {
    // Assuming your CartService has an addProductToCart method that takes product and quantity
    const quantity = 1; // Default quantity to add from watchlist

    this.cs.addProductToCart(product.productId, quantity).subscribe({
      next: () => {
        this.snackBar.open('Product added to cart!', 'Close', { duration: 3000 });
        // Optional: Provide visual feedback on the page if needed
      },
      error: err => {
        console.error('Error adding product to cart:', err);
        this.snackBar.open('Failed to add product to cart.', 'Close', { duration: 3000 });
      }
    });
  }

  removeFromWatchlist(product: IProduct): void {
    const watchlistId = this.selectedWatchlistIdControl.value;
    if (watchlistId !== null && this.watchlist) {
      // Assuming your WatchlistService has a method to remove a product from a watchlist
      this.ws.removeProductFromWatchlist(watchlistId, product.productId).subscribe({
        next: () => {
          this.snackBar.open('Product removed from watchlist.', 'Close', { duration: 3000 });
          // Remove the product from the local watchlist object to update the display
          if (this.watchlist && this.watchlist.products) {
            this.watchlist.products = this.watchlist.products.filter(p => p.productId !== product.productId);
          }
        },
        error: err => {
          console.error(`Error removing product ${product.productId} from watchlist ${watchlistId}:`, err);
          this.snackBar.open('Failed to remove product from watchlist.', 'Close', { duration: 3000 });
        }
      });
    }
  }


  // Helper getter for easier access to products in the template
  get selectedWatchlistIdControl() {
    return this.watchlistForm.get('selectedWatchlistId') as FormControl;
  }

  get productsInWatchlist(): IProduct[] {
    return this.watchlist?.products || [];
  }
}
