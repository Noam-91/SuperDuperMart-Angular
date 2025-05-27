import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {IProduct, IProductInternal} from "../../../shared/models/IProduct";
import {CartService} from "../../../cart/services/cart.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {WatchlistService} from "../../../watchlist/services/watchlist.service";
import IWatchlist from "../../../shared/models/IWatchlist";
import {ActivatedRoute, Router} from "@angular/router";
import {of, Subscription, switchMap, tap} from "rxjs";
import {AuthService} from "../../../auth/services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserRole} from "../../../shared/models/IUser";

@Component({
  selector: 'app-product',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  providers: [ProductService]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: IProductInternal | null = null;
  undoFlag: boolean = true;
  watchlistCollection: IWatchlist[] = [];
  watchlistCollectionSubscription: Subscription | null = null;
  userRole: UserRole = "ANONYMOUS";
  userRoleSubscription: Subscription | null = null;
  productForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private as: AuthService,
              private ps: ProductService,
              private cs: CartService,
              private ws: WatchlistService,
              public snackBar: MatSnackBar) {
    this.productForm = new FormGroup({
      quantity: new FormControl(1, [Validators.required, Validators.min(1)]), // Default value and validation
      selectedWatchlist: new FormControl(null) // Default null for watchlist
    });
  }

  ngOnDestroy(): void {
        this.userRoleSubscription?.unsubscribe();
        this.watchlistCollectionSubscription?.unsubscribe();
    }

  ngOnInit(): void {
    this.userRoleSubscription = this.as.userRole$.subscribe(
      userRole => {
        this.userRole = userRole;
      }
    );
    this.watchlistCollectionSubscription = this.ws.watchlistCollection$.subscribe(
      watchlists=>this.watchlistCollection = watchlists
    )

    this.route.paramMap.pipe(
      switchMap(params => {
        const productId = Number(params.get('productId'));
        if(this.userRole === "ADMIN"){
          return this.ps.getProductByIdInternal(productId);
        }
        return this.ps.getProductById(productId);
      })
    ).subscribe({
      next:product=>{
        this.product=product as IProductInternal;
        // Set maximum quantity validator dynamically after product is loaded
        if (this.product && this.product.inventory) {
          this.productForm.get('quantity')?.setValidators([
            Validators.required,
            Validators.min(1),
          ]);
          this.productForm.get('quantity')?.updateValueAndValidity(); // Recalculate validity
        }
      },
      error: err=> {
        console.error(err);
        this.product = null;
        this.snackBar.open('Failed to load product details.', 'Close', {
          duration: 3000,
        });
      }
    });

    this.ws.getAllWatchlists().subscribe();
    this.ws.watchlistCollection$.subscribe({
      next: watchlists=>{
        this.watchlistCollection = watchlists;
      }
    });
  }

  /** Helper getters for easier access in the template */
  get quantityControl() {
    return this.productForm.get('quantity') as FormControl;
  }

  get selectedWatchlistControl() {
    return this.productForm.get('selectedWatchlist') as FormControl;
  }

  addToCart():void{
    const quantity = this.productForm.get('quantity')?.value;

    if(this.product){
      console.log('adding to cart');
      this.cs.addProductToCart(this.product.productId, quantity).subscribe();
      this.openSnackBar("Product added to cart", ()=>this.removeFromCart);
    }
  }

  removeFromCart():void{
    if(this.product){
      this.cs.removeProductFromCart(this.product.productId).subscribe();
      this.openSnackBar("Product removed from cart", ()=>this.addToCart());
    }
  }

  addToWatchlist(watchlistId:number):void{
    if(this.watchlistCollection.length===0){
      alert("Please create a watchlist first");
    }
    if(this.product){
      this.ws.addProductToWatchlist(watchlistId, this.product.productId).subscribe();
      this.openSnackBar("Product added to watchlist", ()=>this.removeFromWatchlist(watchlistId));
    }
  }

  removeFromWatchlist(watchlistId:number):void{
    if(this.product){
      this.ws.removeProductFromWatchlist(watchlistId, this.product.productId).subscribe();
      this.openSnackBar("Product removed from watchlist", ()=>this.addToWatchlist(watchlistId));
    }
  }

  /** Stock control */
  getInventoryStatusText(): string {
    if (!this.product || !this.product.inventory) {
      return 'Status unknown'; // Or handle as appropriate
    }

    const quantity = this.product.inventory.quantity;

    if (quantity === 0) {
      return 'Out of Stock';
    } else if (quantity < 10) {
      return 'Almost Sold Out!';
    } else if (quantity >= 10 && quantity <= 50) {
      return 'Less than 50 in stock';
    } else {
      return 'Sufficient Stock';
    }
  }

  getInventoryStatusClass(): { [key: string]: boolean } {
    const classes: { [key: string]: boolean } = {
      'out-of-stock': false,
      'almost-sold-out': false,
      'less-than-50': false,
      'sufficient-stock': false // You might not need a specific class for sufficient, but it's good to have it as an option
    };

    if (!this.product || !this.product.inventory) {
      return classes;
    }

    const quantity = this.product.inventory.quantity;

    if (quantity === 0) {
      classes['out-of-stock'] = true;
    } else if (quantity < 10) {
      classes['almost-sold-out'] = true;
    } else if (quantity >= 10 && quantity <= 50) {
      classes['less-than-50'] = true;
    } else {
      classes['sufficient-stock'] = true;
    }

    return classes;
  }

  /** redirect to edit */
  handleEdit(): void {
    if(this.product){
      this.router.navigate([`/product-edit`, {productId: this.product.productId}]);
    }
  }

  /** Snack bar*/
  openSnackBar(message: string, action:()=> void) {
    if(this.undoFlag){
      const snackBarRef = this.snackBar.open(message, "Undo", {duration:2000});

      snackBarRef.onAction().subscribe(()=>{
        action();
      })

      // to prevent undo loop
      this.undoFlag = false;
      setTimeout(() => {
        this.undoFlag = true;
      }, 2500);
    }
  }
}
