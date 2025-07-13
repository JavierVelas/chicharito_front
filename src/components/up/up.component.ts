import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-up',
  templateUrl: './up.component.html',
  styleUrls: ['./up.component.css']
})
export class UpComponent {
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  uploadedImages: string[] = [];
  isLoading: boolean = false;
  uploadProgress: number = 0;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    
    // Validar tipo de archivo
    if (!file?.type.match('image.*')) {
      alert('Solo se permiten archivos de imagen');
      return;
    }

    // Validar tamaño (ejemplo: máximo 5MB)
    if (file?.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 5MB');
      return;
    }

    this.selectedFile = file;
    
    // Mostrar vista previa
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) return;

    this.isLoading = true;
    this.uploadProgress = 0;

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    // Configuración para reportar progreso
    const config = {
      reportProgress: true,
      observe: 'events' as const
    };

    this.http.post('http://tu-backend.com/api/upload', formData, config)
      .subscribe({
        next: (event: any) => {
          if (event.type === 1 && event.loaded && event.total) { // UploadProgress
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          } else if (event.body) { // Response
            this.uploadedImages.push(event.body.imageUrl);
            this.resetUpload();
          }
        },
        error: (error) => {
          console.error('Error al subir imagen', error);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  public resetUpload(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.uploadProgress = 0;
  }

  removeImage(index: number): void {
    this.uploadedImages.splice(index, 1);
    // Opcional: llamar al backend para eliminar el archivo también
  }
}