import {Component, OnDestroy, OnInit} from '@angular/core';
import {IProduct, IProductInternal} from "../shared/models/IProduct";
import {ProductService} from "../product/services/product.service";
import {AuthService} from "../auth/services/auth.service";
import {UserRole} from "../shared/models/IUser";
import {Subscription, switchMap} from "rxjs";
import {Router} from "@angular/router";
import {CartService} from "../cart/services/cart.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ProductService]
})
export class HomeComponent implements OnInit, OnDestroy {
  userRole: UserRole = 'ANONYMOUS';
  userRoleSubscription: Subscription | null = null;
  productsByCategory: Map<string, IProductInternal[]> = new Map();

  // Helper getter to easily get sorted category names for iteration in template
  get categoryNames(): string[] {
    return Array.from(this.productsByCategory.keys()).sort(); // Sort categories alphabetically
  }

  constructor(private as: AuthService,
              private ps: ProductService,
              private cs: CartService,
              private snackBar: MatSnackBar,
              private router: Router) { }

  ngOnDestroy(): void {
    this.userRoleSubscription?.unsubscribe();
  }


  ngOnInit(): void {
    this.userRoleSubscription = this.as.userRole$.pipe(
      switchMap(
        userRole => {
          this.userRole = userRole;
          return userRole==='ADMIN'? this.ps.getAllProductsInternal() : this.ps.getAllInStock();
        }
      )
    ).subscribe(
      {
        next: products => {
          this.groupProductsByCategory(products as IProductInternal[]);
        },
        error: err => {
          console.error(err);
          this.productsByCategory.clear();
        }
      }
    )

  }

  private groupProductsByCategory(products: IProductInternal[]): void {
    this.productsByCategory.clear();      // Clear any previous grouping
    products.forEach(product => {
      // Use category name or a default 'Uncategorized' if not present
      const categoryName = product.category?.name || 'Uncategorized';
      if (!this.productsByCategory.has(categoryName)) {
        this.productsByCategory.set(categoryName, []);
      }
      this.productsByCategory.get(categoryName)?.push(product);
    });
  }

  /**
   * TrackBy function for product *ngFor loops to optimize performance.
   */
  trackByProductId(index: number, product: IProductInternal): number {
    return product.productId;
  }

  /**
   * TrackBy function for category *ngFor loops.
   */
  trackByCategoryName(index: number, categoryName: string): string {
    return categoryName;
  }

  addToCart(product: IProduct): void {
    console.log(`Added "${product.name}" to cart.`);
    this.cs.addProductToCart(product.productId, 1).subscribe(
      {
        next: () => {
          this.snackBar.open('Product added to cart!', 'Close',
            { duration: 3000,
             verticalPosition: 'top', horizontalPosition: 'center'});
        },
        error: err => {
          console.error('Failed to add product to cart:', err);
          this.snackBar.open('Failed to add product to cart.', 'Close',
            { duration: 3000,
            verticalPosition: 'top', horizontalPosition: 'center'
          });
        }
      }
    );
  }

  viewProductDetails(productId: number): void {
    console.log(`Navigating to details for product ID: ${productId}`);
    this.router.navigate(['/product', productId]); // Assumes you have a '/product/:productId' route
  }

}



