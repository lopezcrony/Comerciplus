import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Barcode } from './barcode.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarcodesService {

  private apiUrl = `${environment.apiUrl}/codigo_barra`; 

  
  constructor(private http:HttpClient) { }


  getAllBarcodes(): Observable<Barcode[]> {
    return this.http.get<Barcode[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getOneBarcode(id: number): Observable<Barcode> {
    return this.http.get<Barcode>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error:', error);
    return throwError('Algo salió mal; por favor, intente nuevamente más tarde.');
  }
}
