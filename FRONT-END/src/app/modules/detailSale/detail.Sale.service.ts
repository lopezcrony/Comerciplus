import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DetailSale } from './detailSale.model';

@Injectable({
  providedIn: 'root'
})
export class DetailSalesService {
  private apiUrl = `${environment.apiUrl}/detalleVenta`;


  constructor(private http: HttpClient) {}

  createDetailSale(saleData: DetailSale[]): Observable<DetailSale[]> {
    return this.http.post<DetailSale[]>(this.apiUrl, saleData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
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