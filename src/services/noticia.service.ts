import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private apiUrl = `${environment.apiUrl}/noticias`; 

  constructor(private http: HttpClient) {}


  

  getNoticias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/obtenerNoticias`);
    
  }

  createNoticia(noticia: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, noticia);
  }

updateNoticia(id: number, noticia: any): Observable<any> {
  if (id === undefined || id === null) {
    throw new Error('El ID de la noticia es inválido');
  }
  return this.http.put(`${this.apiUrl}/update/${id}`, noticia);
}
  deleteNoticia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}