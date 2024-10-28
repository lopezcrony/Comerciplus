import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DetailSale } from './detailSale.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class DetailSalesService {
  private apiUrl = `${environment.apiUrl}/detalleventa`;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

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

  getDetailSaleByidSale(idSale: number): Observable<DetailSale[]> {
    return this.http.get<DetailSale[]>(`${this.apiUrl}/venta/${idSale}`).pipe(
      catchError(this.handleError)
    );
  }

private handleError(error: HttpErrorResponse) {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de la red
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error: ${error.error.message}`;
    }
    return throwError(() => new Error('Algo salió mal; por favor, intente nuevamente más tarde.'));
  }
}