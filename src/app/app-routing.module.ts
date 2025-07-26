import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/components/login/login.component';
import { MainComponent } from 'src/components/main/main.component';
import { NoticiasComponent } from 'src/components/noticias/noticias.component';
import { MapComponent } from 'src/components/map/map.component';
import { NosotrosComponent } from 'src/components/nosotros/nosotros.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // Rutas protegidas (ejemplo con AuthGuard)
  { 
    path: 'main', 
    component: MainComponent,
    canActivate: [AuthGuard] // Opcional: protege la ruta
  },
  { 
    path: 'noticias', 
    component: NoticiasComponent,
    canActivate: [AuthGuard] // Opcional: protege la ruta
  },
  { 
    path: 'map', 
    component: MapComponent,
    canActivate: [AuthGuard] // Opcional: protege la ruta
  },
  { 
    path: 'nosotros', 
    component: NosotrosComponent 
    // Esta ruta puede ser pública
  },

  // Manejo de rutas no encontradas
  { 
    path: '404', 
    component: LoginComponent // Puedes crear un componente NotFoundComponent
  },
  { 
    path: '**', 
    redirectTo: '404' 
    // Alternativa: redirectTo: 'main' para redirigir a ruta principal
  }
];

@NgModule({
  // Usa useHash para evitar problemas de recarga en producción
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }