import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Proveedor } from './providers.model';
import { environment } from '../../../environments/environment'; 

@Injectable({
  providedIn: 'root' 
})
export class ProvidersService {
  private apiUrl = `${environment.apiUrl}/proveedores`;

  constructor(private http: HttpClient) { }

  getAllProviders(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl);
  }

  createProvider(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, proveedor);
  }

  updateProvider(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.apiUrl}/${proveedor.idProveedor}`, proveedor);
  }
  updateStatusProvider(id:number, status: boolean):Observable<Proveedor> {
    return this.http.patch<Proveedor>(`${this.apiUrl}/${id}`, { estadoProveedor: status });
  }

  deleteProvider(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
