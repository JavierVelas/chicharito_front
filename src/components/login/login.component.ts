import { Component, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  usuario = '';
  clave = '';
  mensaje = '';
  mostrarLogin = false;
  errorMessage: string = '';


    // Añade esta propiedad:
  mostrarClave: boolean = false;

  // Añade este método:
  toggleMostrarClave() {
    this.mostrarClave = !this.mostrarClave;
  }

  private ctx: CanvasRenderingContext2D | null = null;
  private circles: any[] = [];
  private animationFrameId: number | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  mostrarFormularioLogin() {
    this.mostrarLogin = true;
  }



login() {
  this.errorMessage = '';

  this.authService.login(this.usuario, this.clave).subscribe({
    next: (res) => {
      // Guardar el usuario completo (con rol, etc.) en localStorage
      console.log(res)
      localStorage.setItem('usuarios', JSON.stringify(res));

      // Redirigir al home o panel principal
      this.router.navigate(['/main']);
    },
    error: (err) => {
      this.errorMessage = "Credenciales incorrectas";
    }
  });
}


ingresarComoInvitado() {
  console.log('Intentando ingresar como invitado...');
  this.authService.ingresarComoInvitado();
  
  // Opcional: verificar estado después de 1 segundo
  setTimeout(() => {
    console.log('Estado después de ingresar:',
      'Autenticado:', this.authService.isAuthenticated(),
      'Invitado:', this.authService.isGuest(),
      'Puede editar:', this.authService.canEdit());
  }, 1000);
}

  // --- ANIMACIÓN DE CÍRCULOS ---
  ngAfterViewInit() {
    this.initBackgroundCircles();



    
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
  }

  private initBackgroundCircles() {
    const canvas = document.getElementById('background-circles') as HTMLCanvasElement;
    if (!canvas) return;
    this.ctx = canvas.getContext('2d');
    this.resizeCanvas();

    const width = canvas.width;
    const height = canvas.height;
    const numCircles = 20;

    // Genera círculos
    this.circles = [];
    for (let i = 0; i < numCircles; i++) {
      this.circles.push({
        x: this.random(40, width - 40),
        y: this.random(40, height - 40),
        r: this.random(20, 50),
        dx: this.random(-2, 2) || 1,
        
        color: `hsla(${this.random(0, 360)}, 60%, 70%, 0.4)`
      });
    }
    // Dentro de initBackgroundCircles()

const colors = [
  'rgba(76, 230, 100, 0.4)',  // verde
  'rgba(255, 241, 50, 0.4)'   // amarillo
];

for (let i = 0; i < numCircles; i++) {
  this.circles.push({
    x: this.random(40, width - 40),
    y: this.random(40, height - 40),
    r: this.random(20, 50),
    dx: this.random(-2, 2) || 1,
    dy: this.random(-2, 2) || 1,
    color: colors[Math.floor(Math.random() * colors.length)]
  });
}

    this.animateCircles();
  }

  private animateCircles = () => {
    const canvas = document.getElementById('background-circles') as HTMLCanvasElement;
    if (!canvas || !this.ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    this.ctx.clearRect(0, 0, width, height);

    for (let circle of this.circles) {
      circle.x += circle.dx;
      circle.y += circle.dy;

      // rebote en paredes
      if (circle.x - circle.r < 0 || circle.x + circle.r > width) circle.dx *= -1;
      if (circle.y - circle.r < 0 || circle.y + circle.r > height) circle.dy *= -1;

      this.ctx.beginPath();
      this.ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
      this.ctx.fillStyle = circle.color;
      this.ctx.fill();
      this.ctx.closePath();
    }
    this.animationFrameId = requestAnimationFrame(this.animateCircles);
  };

  private resizeCanvas() {
    const canvas = document.getElementById('background-circles') as HTMLCanvasElement;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  private random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}