import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment'; 

import { ReturnSaleModel } from './return-sale.model';

@Injectable({
  providedIn: 'root'
})
export class ReturnSaleService {
  private apiUrl= `${environment.apiUrl}/devolucionVentas`
  constructor(private http: HttpClient) { }

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
 
 private handleError(error: HttpErrorResponse) {
  console.error('Ocurrió un error:', error);
  return throwError('Algo salió mal; por favor, intente nuevamente más tarde.');
}



}
