import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Sale } from './sales.model';
import { DetailSale } from '../detailSale/detailSale.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private apiUrl = `${environment.apiUrl}/ventas`;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

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
