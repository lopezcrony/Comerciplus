import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Sale } from './sales.model';
import { DetailSale } from '../detailSale/detailSale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = `${environment.apiUrl}/ventas`;


  constructor(private http: HttpClient) {}

  createSale(sale: any, saleDetail: DetailSale[]): Observable<any> {
    const payload = { sale, saleDetail}
    return this.http.post<Sale>(this.apiUrl, payload).pipe(
      tap(response => console.log('Response from backend:', response)),
      catchError(this.handleError)
    );
  }
  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  updateStatusSale(id: number, status: boolean): Observable<Sale> {
    const body = { estadoVenta: status };
    
    return this.http.patch<Sale>(`${this.apiUrl}/${id}`, body).pipe(
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
