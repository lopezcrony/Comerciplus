import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { ReturnSaleModel } from './return-sale.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ReturnSaleService {
  private apiUrl = `${environment.apiUrl}/devolucionVentas`

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getReturnSale(): Observable<ReturnSaleModel[]> {
    return this.http.get<ReturnSaleModel[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getReturnSaleId(id: number): Observable<ReturnSaleModel> {
    return this.http.get<ReturnSaleModel>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createReturnSale(returSale: ReturnSaleModel): Observable<ReturnSaleModel> {
    return this.http.post<ReturnSaleModel>(this.apiUrl, returSale).pipe(
      catchError(this.handleError)
    );
  }

  updateStatusSale(id: number, status: boolean): Observable<ReturnSaleModel> {
    const body = { estado: status };

    return this.http.patch<ReturnSaleModel>(`${this.apiUrl}/${id}`, body).pipe(
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
