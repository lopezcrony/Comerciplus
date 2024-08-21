import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from './users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getOneUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.idUsuario}`, user).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error:', error);
    return throwError('Algo salió mal; por favor, intente nuevamente más tarde.');
  }
}



// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// import { environment } from '../../../environments/environment'; 
// import { User } from './users.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   private apiUrl = `${environment.apiUrl}/usuarios`; // Cambia esta URL por la de tu API

//   constructor(private http: HttpClient) { }

//   getUsers(): Observable<User[]> {
//     return this.http.get<User[]>(this.apiUrl).pipe(
//       catchError(this.handleError)
//     );
//   }

//   getUser(id: number): Observable<User> {
//     return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
//       catchError(this.handleError)
//     );
//   }

//   createUser(user: User): Observable<User> {
//     return this.http.post<User>(this.apiUrl, user).pipe(
//       catchError(this.handleError)
//     );
//   }

//   updateUser(user: User): Observable<User> {
//     return this.http.put<User>(`${this.apiUrl}/${user.idUsuario}`, user).pipe(
//       catchError(this.handleError)
//     );
//   }

//   updateStatusUser(id: number, status: boolean): Observable<User> {
//     const body = { estadoUsuario: status };
//     return this.http.patch<User>(`${this.apiUrl}/${id}`, body).pipe(
//       catchError(this.handleError)
//     );
//   }
  
//   deleteUser(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
//       catchError(this.handleError)
//     );
//   }  

//   private handleError(error: HttpErrorResponse) {
//     console.error('Ocurrió un error:', error);
//     return throwError('Algo salió mal; por favor, intente nuevamente más tarde.');
//   }
// }
