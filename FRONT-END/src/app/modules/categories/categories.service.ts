import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment'; 
import { Categorie } from './categories.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})


export class CategoriesService {
//se define el api url
  private apiUrl = `${environment.apiUrl}/categorias`; 

  //el client de http es el estandar para conectar la base de datos, no es nada del modulo de clientes
  constructor(private http:HttpClient, private toastr: ToastrService) { }


  getAllCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getOneCategorie(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createCategorie(categorie: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(this.apiUrl, categorie).pipe(
      catchError(this.handleError)
    );
  }

  updateCategorie(categorie: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.apiUrl}/${categorie.idCategoria}`, categorie).pipe(
      catchError(this.handleError)
    );
  }

  updateStatusCategorie(id: number, status: boolean): Observable<Categorie> {
    return this.http.patch<Categorie>(`${this.apiUrl}/${id}`, { estadoCategoria: status }).pipe(
      catchError(this.handleError)
    );
  }
  
  deleteCategorie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
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
