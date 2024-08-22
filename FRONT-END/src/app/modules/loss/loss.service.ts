import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment'; 

import { Loss } from './loss.model';

@Injectable({
  providedIn: 'root'
})
export class LossService {
  private apiUrl= `${environment.apiUrl}/perdida`

  constructor(private http: HttpClient) {}


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
    console.error('Ocurrió un error:', error);
    return throwError('Algo salió mal; por favor, intente nuevamente más tarde.');
  }
}
