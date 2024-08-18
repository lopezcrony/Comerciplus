import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Importar HttpClient
import { catchError, Observable } from 'rxjs';
import { Proveedor } from './providers.model';
import { environment } from '../../../environments/environment'; 

@Injectable({
  providedIn: 'root' 
})
export class ProvidersService {
  private apiUrl = `${environment.apiUrl}/proveedores`; // URL de la API

  constructor(private http: HttpClient) { } // Inyectar HttpClient

  getAllProviders(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl);
  }

  createProvider(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, proveedor);
  }

  updateProvider(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.apiUrl}/${proveedor.idProveedor}`, proveedor);
  }
  updateStatusProveedor(id:number, status: boolean):Observable<Proveedor> {
    const body = { estadoProveedor: status };

    return this.http.patch<Proveedor>(`${this.apiUrl}/${id}`, body);
  }

  deleteProvider(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteProviders(ids: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/delete-multiple`, { ids });
  }

 
}
