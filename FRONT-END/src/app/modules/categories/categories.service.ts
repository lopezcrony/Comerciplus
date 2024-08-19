import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment'; 
import { Categorie } from './categories.model';

@Injectable({
  providedIn: 'root'
})


export class CategoriesService {
//se define el api url
  private apiUrl = `${environment.apiUrl}/categorias`; // Cambia esta URL por la de tu API

  //el client de http es el estandar para conectar la base de datos, no es nada del modulo de clientes
  constructor(private http:HttpClient) { }


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
    const body = { estadoCategoria: status };
    
    return this.http.patch<Categorie>(`${this.apiUrl}/${id}`, body).pipe(
      catchError(this.handleError)
    );
  }
  
  // Método para eliminar un cliente
  deleteCategorie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error:', error);
    return throwError('Algo salió mal; por favor, intente nuevamente más tarde.');
  }
}
