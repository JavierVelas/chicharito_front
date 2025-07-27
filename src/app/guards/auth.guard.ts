// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Permitir acceso si está autenticado O es invitado
    if (this.authService.isAuthenticated() || this.authService.isGuest()) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}