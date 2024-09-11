import { Injectable } from '@angular/core';

import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment'; 
import { Shoppingdetails } from "../shoppingdetails/model";
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ShoppingdetailsService {


  private apiUrl=`${environment.apiUrl}/detallecompras`;

  constructor(private http:HttpClient) { }

  getAllShoppingDetails(): Observable<Shoppingdetails[]> {
    return this.http.get<Shoppingdetails[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getOneShoppingDetail(id: number): Observable<Shoppingdetails> {
    return this.http.get<Shoppingdetails>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createShoppingDetail(Shoppingdetails: Shoppingdetails): Observable<Shoppingdetails> {
    return this.http.post<Shoppingdetails>(this.apiUrl, Shoppingdetails).pipe(
      catchError(this.handleError)
    );
  }


  getDetailByShopping(idCompra: number) {
    return this.http.get<Shoppingdetails[]>(`${this.apiUrl}/detalleCompra/${idCompra}`);
  }
  



  getAllProviders(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/proveedores`).pipe(
      catchError(this.handleError)
    );
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
