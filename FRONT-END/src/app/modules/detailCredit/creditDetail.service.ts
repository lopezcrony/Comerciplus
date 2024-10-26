import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { CreditDetail } from './creditDetail.model';
import { ToastrService } from 'ngx-toastr';


@Injectable({
    providedIn: 'root'
})
export class CreditDetailService {

    private creditDetailUrl = `${environment.apiUrl}/detallecredito`;

    constructor(private http: HttpClient, private toastr: ToastrService) { }

    addSaleToCredit(creditDetail: any): Observable<CreditDetail> {
        return this.http.post<CreditDetail>(this.creditDetailUrl, creditDetail).pipe(
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
