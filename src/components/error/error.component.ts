// src/components/error/error.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderService } from 'src/services/header.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit, OnDestroy {
  constructor(private headerService: HeaderService) {}

  ngOnInit(): void {
    this.headerService.setVisibility(false); // Oculta el header al entrar
  }

  ngOnDestroy(): void {
    this.headerService.setVisibility(true); // Muestra el header al salir
  }
}