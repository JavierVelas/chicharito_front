import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.authSubject.asObservable();
  private apiUrl = 'http://localhost:3000/api/auth';

  // Almacena los datos del usuario autenticado (opcional)
  private userData: any = null;

  constructor(private http: HttpClient) {
    this.authSubject.next(this.hasToken());
    // Si el usuario ya está autenticado, intenta cargar los datos de usuario
    if (this.hasToken()) {
      this.getCurrentUser().subscribe();
    }
  }

  login(usuario: string, clave: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { usuario, clave })
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('invitado', 'false');
            this.authSubject.next(true);
            // Opcional: carga los datos del usuario tras iniciar sesión
            this.getCurrentUser().subscribe();
          }
        })
      );
  }

  ingresarComoInvitado() {
    localStorage.removeItem('token');
    localStorage.setItem('invitado', 'true');
    this.authSubject.next(false);
    this.userData = null;
  }

  logout() {
    localStorage.removeItem('usuarios'); 
  }

isAuthenticated(): boolean {
  const usuario = JSON.parse(localStorage.getItem('usuarios') || 'null');
  return !!usuario;
}

isInvitado(): boolean {
  const usuario = JSON.parse(localStorage.getItem('usuarios') || 'null');
  return usuario?.rol === 'invitado'; // Ajusta según tu base de datos
}


  getToken(): string | null {
    return localStorage.getItem('token');
  }

  postProtected<T>(url: string, body: any): Observable<T> {
    const token = this.getToken();
    const headers = token
      ? new HttpHeaders({ 'Authorization': `Bearer ${token}` })
      : undefined;
    return this.http.post<T>(url, body, { headers });
  }

  /** Nuevo: Obtiene los datos del usuario autenticado usando el endpoint /me */
  getCurrentUser(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      this.userData = null;
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<any>(`${this.apiUrl}/me`, { headers }).pipe(
      tap(user => {
        this.userData = user;
      })
    );
  }

  /** Devuelve los datos cacheados del usuario autenticado (o null) */
  getUserData(): any {
    return this.userData;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}