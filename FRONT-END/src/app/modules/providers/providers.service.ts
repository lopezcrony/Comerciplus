import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Proveedor } from './providers.model';
import { environment } from '../../../environments/environment'; 
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Auth/auth.service';

@Injectable({
  providedIn: 'root' 
})
export class ProvidersService {
  private apiUrl = `${environment.apiUrl}/proveedores`;

  constructor(private http: HttpClient, private authService: AuthService, private toastr: ToastrService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken(); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  
  getAllProviders(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
    };

  createProvider(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, proveedor).pipe(
      catchError(this.handleError)
    );
    };

  updateProvider(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.apiUrl}/${proveedor.idProveedor}`, proveedor).pipe(
      catchError(this.handleError)
    );
    };

  updateStatusProvider(id:number, status: boolean):Observable<Proveedor> {
    return this.http.patch<Proveedor>(`${this.apiUrl}/${id}`, { estadoProveedor: status }).pipe(
      catchError(this.handleError)
    );
    };

  deleteProvider(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
    };

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
