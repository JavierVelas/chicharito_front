import { Component } from '@angular/core';

@Component({
  selector: 'app-,map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  // URL del mapa
  locationUrl = "https://www.google.com/maps?q=Chicharitos+sur&output=embed";

  // Configuración de imágenes
  images: string[] = [
    'assets/img/horario1.jpg',
    'assets/img/horario2.jpg',
    'assets/img/horario3.jpg',
    'assets/img/horario4.jpg'
  ];
  currentIndex: number = 0;
  currentImage: string = this.images[0];

  // Navegación de imágenes
  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateImage();
  }

  prevImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateImage();
  }

  private updateImage(): void {
    this.currentImage = this.images[this.currentIndex];
  }
}