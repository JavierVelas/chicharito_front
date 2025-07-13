import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  // Declara las propiedades primero
  slides: string[] = [
    'assets/img/logo_info.jpg',
    'assets/img/entrada.jpg',
    'assets/img/salon.jpg',
    'assets/img/patio_juegos.jpg'
  ];
  currentSlide: number = 0; // ¡Asegúrate de declarar esta propiedad!
  interval: any;

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  startAutoPlay(): void {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }
}