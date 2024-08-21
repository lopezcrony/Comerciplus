import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Roles } from './roles.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<Roles[]> {
    return this.http.get<Roles[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getOneRoles(id: number): Observable<Roles> {
    return this.http.get<Roles>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createRoles(roles: Roles): Observable<Roles> {
    return this.http.post<Roles>(this.apiUrl, roles).pipe(
      catchError(this.handleError)
    );
  }

  updateRoles(roles: Roles): Observable<Roles> {
    return this.http.put<Roles>(`${this.apiUrl}/${roles.idRol}`, roles).pipe(
      catchError(this.handleError)
    );
  }

  deleteRoles(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error:', error);
    return throwError('Algo salió mal; por favor, intente nuevamente más tarde.');
  }
}
