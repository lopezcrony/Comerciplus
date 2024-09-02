import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment'; 
import { Credit } from './credit.model';


@Injectable({
  providedIn: 'root'
})
export class CreditsService {

  private apiUrl=`${environment.apiUrl}/creditos`;

  constructor( private http : HttpClient) { }

  getAllCredits(): Observable<Credit[]> {
    return this.http.get<Credit[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  };

  getOneCredit(): Observable<Credit> {
    return this.http.get<Credit>(this.apiUrl).pipe(
      catchError(this.handleError)
    )
  };

  // updateCreditTotal(id:number, ): Observable(Credit)

  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Algo salió mal; por favor, intente nuevamente más tarde.'));
}

  
}
