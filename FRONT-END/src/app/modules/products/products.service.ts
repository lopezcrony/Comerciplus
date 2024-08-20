import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment'; 
import { Product } from '../products/products.model';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {


  private apiUrl=`${environment.apiUrl}/productos`;


  constructor(private http:HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getOneProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createProduct(Product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, Product).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(Product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${Product.idProducto}`, Product).pipe(
      catchError(this.handleError)
    );
  }

  updateStatusProduct(id: number, status: boolean): Observable<Product> {
    const body = { estadoProducto: status };
    
    return this.http.patch<Product>(`${this.apiUrl}/${id}`, body).pipe(
      catchError(this.handleError)
    );
  }
  
  // Método para eliminar un cliente
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/categorias`).pipe(
      catchError(this.handleError)
    );
  }

  checkProductExists(nombreProducto: string): Observable<boolean> {
    return this.http.get<boolean>(`/api/products/exists/${encodeURIComponent(nombreProducto)}`);
  }

  private handleError(error: HttpErrorResponse) {
    // Puedes ajustar la lógica para diferentes tipos de errores aquí
    let errorMessage = 'Algo salió mal; por favor, intente nuevamente más tarde.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = error.error?.message || errorMessage;
    }
    return throwError(() => new Error(errorMessage));
  }
}
