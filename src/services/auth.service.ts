import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

interface User {
  usuario: string;
  puede_editar: boolean; // 1 = true, 0 = false
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<User | null>(null);
  
  isAuthenticated$ = this.authSubject.asObservable();
  currentUser$ = this.userSubject.asObservable();
  
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token) {
      this.authSubject.next(true);
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          this.userSubject.next(user);
        } catch {
          this.clearAuthData();
        }
      } else {
        this.fetchCurrentUser().subscribe();
      }
    } else {
      this.clearAuthData();
    }
  }

  login(usuario: string, clave: string): Observable<boolean> {
    return this.http.post<{ 
      token: string; 
      user: {
        usuario: string;
        puede_editar: number; // 1 o 0 desde PostgreSQL
      } 
    }>(`${this.apiUrl}/login`, { usuario, clave })
      .pipe(
        tap(response => {
          const user: User = {
            usuario: response.user.usuario,
            puede_editar: response.user.puede_editar === 1
          };
          this.storeAuthData(response.token, user);
          this.authSubject.next(true);
          this.userSubject.next(user);
        }),
        map(() => true),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  ingresarComoInvitado(): void {
    const guestUser: User = {
      usuario: 'invitado',
      puede_editar: false
    };
    
    this.clearAuthData();

    this.userSubject.next(guestUser);
    localStorage.setItem('userData', JSON.stringify(guestUser));
    localStorage.setItem('isGuest', 'true');
    this.authSubject.next(false);
    
     this.router.navigate(['/main'])
    .then(success => {
      if (!success) {
        window.location.href = '/main'; // Fallback absoluto
      }
    })
     .catch(err => {
      console.error('Error de navegación:', err);
      window.location.href = '/main';
    });
  }

  logout(): void {
    this.clearAuthData();
    this.authSubject.next(false);
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.authSubject.value;
  }

// auth.service.ts
canEdit(): boolean {
  // Usuario autenticado (no invitado) con permiso explícito
  return this.isAuthenticated() && 
         !this.isGuest() && 
         this.userSubject.value?.puede_editar === true;
}

isRegularUser(): boolean {
  // Usuario normal (no invitado, autenticado)
  return this.isAuthenticated() && !this.isGuest();
}

  isGuest(): boolean {
    return localStorage.getItem('isGuest') === 'true';
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  getUsername(): string | null {
    return this.userSubject.value?.usuario || null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private fetchCurrentUser(): Observable<User> {
    return this.http.get<{
      usuario: string;
      puede_editar: number;
    }>(`${this.apiUrl}/me`).pipe(
      map(response => ({
        usuario: response.usuario,
        puede_editar: response.puede_editar === 1
      })),
      tap(user => {
        this.userSubject.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
      }),
      catchError(error => {
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  private storeAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.removeItem('isGuest');
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('isGuest');
  }

  authHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  }
}