import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Credit } from './credit.model';
import { Installment } from '../installments/installment.model';


@Injectable({
  providedIn: 'root'
})
export class CreditsService {

  private creditsUrl = `${environment.apiUrl}/creditos`;
  private installmentUrl = `${environment.apiUrl}/abonos`;

  constructor(private http: HttpClient) { }

  getAllCredits(): Observable<Credit[]> {
    return this.http.get<Credit[]>(this.creditsUrl).pipe(
      catchError(this.handleError)
    );
  };

  getCreditHistory(creditId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.creditsUrl}/${creditId}/historial`);
  }

  getOneCredit(): Observable<Credit> {
    return this.http.get<Credit>(this.creditsUrl).pipe(
      catchError(this.handleError)
    )
  };

  createInstallment(installment: Installment): Observable<Installment> {
    return this.http.post<Installment>(this.installmentUrl, installment).pipe(
      catchError(this.handleError)
    );
  }

  createAbono(installment: { idCredito: number; montoAbonado: number }): Observable<any> {
    return this.http.post<Installment>(this.installmentUrl, installment).pipe(
      catchError(this.handleError)
    );
  };

  cancelInstallment(idAbono: number): Observable<Installment> {
    return this.http.put<Installment>(`${this.installmentUrl}/${idAbono}/cancel`, {});
  };

  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Algo salió mal; por favor, intente nuevamente más tarde.'));
  }


}
