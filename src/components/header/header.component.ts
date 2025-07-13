import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderService } from 'src/services/header.service';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  showHeader = true;
private subscription!: Subscription;


  constructor(
    public router: Router, 
    private headerService: HeaderService,
    public authService: AuthService,
  
  ) {}

  cerrarSesion(): void {
  this.authService.logout();
  this.router.navigate(['/login']); // Redirige al login o página principal
}

  ngOnInit(): void {
    this.subscription = this.headerService.showHeader$.subscribe(
      visible => this.showHeader = visible
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  navigateTo(route: string): void {
    console.log(`Intentando navegar a: ${route}`);
    this.router.navigate([route])
      .then(success => {
        if (success) {
          console.log(`Navegación a ${route} exitosa`);
        } else {
          console.error(`Fallo al navegar a ${route}`);
        }
      })
      .catch(err => {
        console.error(`Error al navegar: ${err}`);
      });
  }
  
}
