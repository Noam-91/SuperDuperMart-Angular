# SuperDuperMart - Angular 🛒

This repository hosts the **Angular client application** for SuperDuperMart, a simple yet functional e-commerce website. Built with **Angular Material**, it provides a responsive and intuitive user interface for Browse products, managing orders, and interacting with watchlists. It supports a robust **JWT-based authentication** system, with tokens securely stored in **HttpOnly cookies**, catering to anonymous, client, and admin user roles.

---

## ✨ Features

Our Angular client offers a comprehensive set of features for both users and administrators:

* **Product Catalog:**
  * **Product List:** Browse all available products with essential information.
  * **Product Detail:** View detailed information for individual products, including descriptions, images, and pricing.
* **Order Management:**
  * **Order List:** Clients can view their past orders.
  * **Order Management (Admin):** Admins have full control over viewing and managing all orders.
* **Watchlist Functionality:**
  * **Watchlists:** Users can create and manage lists of products they are interested in.
  * **Watchlist Management:** Easily add, remove, and organize items within watchlists.
* **Role-Based Access Control:**
  * **Anonymous:** Users can browse products and view product details without logging in.
  * **Client:** Authenticated users can manage their profiles, place orders, view order history, and manage watchlists.
  * **Admin:** Administrators have elevated privileges, including full order management and potentially other administrative tasks.
* **Secure Authentication:**
  * Utilizes **JSON Web Tokens (JWT)** for authentication.
  * JWTs are securely stored in **HttpOnly cookies** to mitigate XSS attacks.
* **Modern UI with Angular Material:**
  * A clean, consistent, and responsive user interface thanks to Angular Material components.

---

## 🛠️ Tech Stack

* **Frontend Framework:** Angular
* **UI Components:** Angular Material
* **State Management:** Built-in Angular services
* **HTTP Client:** Angular's `HttpClient` for API communication
* **Authentication:** JWT (handled by a backend API)
* **Package Manager:** npm / Yarn

---

## 🚀 Getting Started

To get this project up and running on your local machine, follow these steps:

### Prerequisites

Make sure you have the following installed:

* **Node.js** (LTS version recommended)
* **npm** (comes with Node.js) or **Yarn**
* **Angular CLI**: Install it globally if you haven't already:
    ```bash
    npm install -g @angular/cli
    ```

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Noam-91/SuperDuperMart-Angular.git](https://github.com/Noam-91/SuperDuperMart-Angular.git)
    cd SuperDuperMart-Angular
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure API Endpoints (if necessary):**
    Ensure your `environment.ts` and `environment.prod.ts` files point to the correct backend API endpoints.

    ```typescript
    // src/environments/environment.ts
    export const environment = {
      production: false,
      apiUrl: 'http://localhost:8080/api' // Adjust to your backend API URL
    };
    ```

### Running the Application

To start the development server:

```bash
ng serve
