import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment'; 

import { Loss } from './loss.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class LossService {
  private apiUrl= `${environment.apiUrl}/perdida`

  constructor(private http: HttpClient, private toastr: ToastrService) {}


    getLoss(): Observable<Loss[]> {
      return this.http.get<Loss[]>(this.apiUrl).pipe(
        catchError(this.handleError)
      );
    }
  
  
    getLossId(id: number): Observable<Loss> {
      return this.http.get<Loss>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
      );
    }
  
    createLoss(loss: Loss): Observable<Loss> {
      return this.http.post<Loss>(this.apiUrl, loss).pipe(
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
