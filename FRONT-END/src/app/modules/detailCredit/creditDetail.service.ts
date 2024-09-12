import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { CreditDetail } from './creditDetail.model';


@Injectable({
    providedIn: 'root'
})
export class CreditDetailService {

    private creditDetailUrl = `${environment.apiUrl}/detallecredito`;

    constructor(private http: HttpClient) { }

    addSaleToCredit(creditDetail: any): Observable<CreditDetail> {
        return this.http.post<CreditDetail>(this.creditDetailUrl, creditDetail).pipe(
        catchError(this.handleError))
    }

    private handleError(error: HttpErrorResponse) {
        console.error('Ocurrió un error:', error);
        return throwError(() => new Error('Algo salió mal; por favor, intente nuevamente más tarde.'));
    }


}
