import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { NoticiasComponent } from 'src/components/noticias/noticias.component';
import { MainComponent } from 'src/components/main/main.component';
import { LoginComponent } from 'src/components/login/login.component';

import { HeaderComponent } from 'src/components/header/header.component';
import { MapComponent } from 'src/components/map/map.component';

import { RouterModule } from '@angular/router';



// Pipe
import { SafeUrlPipe } from 'src/components/safe-url.pipe';

// Servicio
import { DataService } from 'src/services/data.service';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    NoticiasComponent,
    HeaderComponent,
    MapComponent,
    SafeUrlPipe, 
  
  
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([]),

  ],
  
  providers: [
    DataService  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }