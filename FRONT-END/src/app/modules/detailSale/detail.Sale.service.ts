import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DetailSale } from './detailSale.model';

@Injectable({
  providedIn: 'root'
})
export class DetailSalesService {
  private apiUrl = `${environment.apiUrl}/detalleventa`;

  constructor(private http: HttpClient) {}

  createDetailSale(saleData: any): Observable<any> {
    return this.http.post<DetailSale>(this.apiUrl, saleData).pipe(
      catchError(this.handleError)
    );
  }

  getDetailSale(): Observable<DetailSale[]> {
    return this.http.get<DetailSale[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  

  private handleError(error: HttpErrorResponse) {
    console.error('Error completo:', error);
    let errorMessage = 'Algo salió mal; por favor, intente nuevamente más tarde.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      errorMessage = `Error del servidor: ${error.status}, mensaje: ${error.error?.message || error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}