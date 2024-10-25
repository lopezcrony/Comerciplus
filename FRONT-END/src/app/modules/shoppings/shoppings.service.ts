import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


import { environment } from '../../../environments/environment'; 
import { Shopping } from "../shoppings/shopping.model";
import { Shoppingdetails } from '../shoppingdetails/model';


@Injectable({
  providedIn: 'root'
})
export class ShoppingsService {

  private apiUrl=`${environment.apiUrl}/compras`;


  constructor(private http:HttpClient) { }


  getAllShoppings(): Observable<Shopping[]> {
    return this.http.get<Shopping[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getShoppingdetailsByShopping(idCompra: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3006/detallecompras/${idCompra}`);
  }

  getOneShopping(id: number): Observable<Shopping> {
    return this.http.get<Shopping>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // createShopping(Shopping: Shopping): Observable<Shopping> {
  //   return this.http.post<Shopping>(this.apiUrl, Shopping).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  createShopping(shopping: Shopping, shoppingDetail: Shoppingdetails[]): Observable<any> {
    const payload = { shopping, shoppingDetail };
    console.log('Sending to backend:', payload);
    return this.http.post(this.apiUrl, payload).pipe(
      tap(response => console.log('Response from backend:', response)),
      catchError(this.handleError)
    );
  }

  updateStatusShopping(id: number, status: boolean): Observable<Shopping> {
    const body = { estadoCompra: status };
    
    return this.http.patch<Shopping>(`${this.apiUrl}/${id}`, body).pipe(
      catchError(this.handleError)
    );
  }

  getAllProviders(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/proveedores`).pipe(
      catchError(this.handleError)
    );
  }


  // Método para anular la compra y revertir las acciones
  anularCompra(idCompra: number): Observable<any> {
    return this.http.delete(`/api/shoppings/${idCompra}/anular`);
  }

  // cancelShopping(id: number): Observable<any> {
  //   return this.http.patch<any>(`${this.apiUrl}/${id}`).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  checkShoppingExists(numeroFactura: string): Observable<boolean> {
    return this.http.get<boolean>(`/api/shoppings/exists/${encodeURIComponent(numeroFactura)}`);
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
