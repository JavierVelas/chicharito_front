import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/components/login/login.component';
import { MainComponent } from 'src/components/main/main.component';
import { NoticiasComponent } from 'src/components/noticias/noticias.component';
import { MapComponent } from 'src/components/map/map.component';
import { NosotrosComponent } from 'src/components/nosotros/nosotros.component';
import { UpComponent } from 'src/components/up/up.component';
import { ErrorComponent } from 'src/components/error/error.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'main', component: MainComponent },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'login', component: LoginComponent },
  { path: 'map', component: MapComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'up', component: UpComponent },
  { path: '**', component: ErrorComponent },
  { path: '**', redirectTo: 'main' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
