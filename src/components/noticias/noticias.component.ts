import { Component, OnInit } from '@angular/core';
import { NoticiasService } from '../../services/noticia.service';
import { AuthService } from 'src/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})
export class NoticiasComponent implements OnInit {
  noticias: any[] = [];
  mostrarFormulario = false;
  noticiaEditando = false;
  nuevaNoticia: any = {
    titulo: '',
    info: '',
    url_imagen: '',
    fecha: null,
    id_user: null
  };
  
  archivoParaSubir: File | null = null;
  subiendoImagen = false;
  
  fechaNoticia = {
    dia: null as number | null,
    mes: null as number | null,
    anio: null as number | null
  };
  currentYear: number;

  constructor(
    private noticiasService: NoticiasService,
    public authService: AuthService,
    private http: HttpClient
  ) {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.cargarNoticias();
  }

  cargarNoticias() {
    this.noticiasService.getNoticias().subscribe({
      next: (data) => {
        this.noticias = data.map((noticia: any) => ({
          ...noticia,
          imagenes: noticia.url_imagen ? [{ url_fuente: noticia.url_imagen }] : []
        }));
      },
      error: (err) => {
        console.error('Error al cargar noticias:', err);
      }
    });
  }

  abrirFormularioNuevaNoticia() {
    this.nuevaNoticia = {
      titulo: '',
      info: '',
      url_imagen: '',
      fecha: null,
      id_user: null
    };
    this.archivoParaSubir = null;
    this.fechaNoticia = { dia: null, mes: null, anio: null };
    this.noticiaEditando = false;
    this.mostrarFormulario = true;
  }

  editarNoticia(noticia: any) {
    this.nuevaNoticia = { 
      ...noticia, 
      id: noticia.id
    };
    this.archivoParaSubir = null;
    
    if (noticia.fecha) {
      const fecha = new Date(noticia.fecha);
      this.fechaNoticia = {
        dia: fecha.getDate(),
        mes: fecha.getMonth() + 1,
        anio: fecha.getFullYear()
      };
    } else {
      this.fechaNoticia = { dia: null, mes: null, anio: null };
    }
    
    this.noticiaEditando = true;
    this.mostrarFormulario = true;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!tiposPermitidos.includes(file.type)) {
        alert('Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)');
        return;
      }
      
      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no puede superar los 5MB');
        return;
      }
      
      this.archivoParaSubir = file;
    }
  }

  obtenerVistaPrevia(): string {
  if (!this.archivoParaSubir) return '';
  
  // Crear una URL de objeto para la vista previa
  return URL.createObjectURL(this.archivoParaSubir);
}

  async subirImagen(): Promise<string> {
    if (!this.archivoParaSubir) return '';
    
    this.subiendoImagen = true;
    const formData = new FormData();
    formData.append('imagen', this.archivoParaSubir);
    
    try {
      // Cambia esta URL por tu endpoint de subida de imágenes
      const response: any = await this.http.post('https://tu-api.com/upload', formData).toPromise();
      return response.url; // Asume que la API devuelve la URL de la imagen subida
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    } finally {
      this.subiendoImagen = false;
    }
  }

 async guardarNoticia() {
  if (!this.nuevaNoticia.titulo || !this.nuevaNoticia.info) {
    alert('Título e información son campos obligatorios');
    return;
  }

  try {
    // Subir imagen si hay archivo
    if (this.archivoParaSubir) {
      const resp = await this.noticiasService.subirImagenImgBB(this.archivoParaSubir).toPromise();
      this.nuevaNoticia.url_imagen = resp.data.url; // ImgBB devuelve la URL en resp.data.url
    }

      // Formatear fecha
      if (this.fechaNoticia.dia && this.fechaNoticia.mes && this.fechaNoticia.anio) {
        this.nuevaNoticia.fecha = new Date(
          this.fechaNoticia.anio,
          this.fechaNoticia.mes - 1,
          this.fechaNoticia.dia
        ).toISOString().slice(0, 19).replace('T', ' ');
      } else {
        this.nuevaNoticia.fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');
      }

       // Guarda la noticia (create o update)
    if (this.noticiaEditando) {
      await this.noticiasService.updateNoticia(this.nuevaNoticia.id, this.nuevaNoticia).toPromise();
    } else {
      await this.noticiasService.createNoticia(this.nuevaNoticia).toPromise();
    }

      // Obtener ID de usuario
      const usuario = JSON.parse(localStorage.getItem('usuarios') || 'null');
      this.nuevaNoticia.id_user = usuario?.id_usuario || null;

      if (this.noticiaEditando) {
        await this.noticiasService.updateNoticia(this.nuevaNoticia.id, this.nuevaNoticia).toPromise();
      } else {
        await this.noticiasService.createNoticia(this.nuevaNoticia).toPromise();
      }

      this.cargarNoticias();
      this.cerrarFormulario();
    } catch (error) {
      console.error('Error al guardar noticia:', error);
      alert('Ocurrió un error al guardar la noticia');
    }
  }

  borrarNoticia(id: number) {
    if (confirm('¿Seguro que deseas borrar esta noticia?')) {
      this.noticiasService.deleteNoticia(id).subscribe({
        next: () => this.cargarNoticias(),
        error: (err) => console.error('Error al borrar noticia:', err)
      });
    }
  }

cerrarFormulario() {
  // Revocar URLs de objeto si existen
  if (this.archivoParaSubir && this.nuevaNoticia.url_imagen.startsWith('blob:')) {
    URL.revokeObjectURL(this.nuevaNoticia.url_imagen);
  }
  
  
  this.mostrarFormulario = false;
  this.nuevaNoticia = {
    titulo: '',
    info: '',
    url_imagen: '',
    fecha: null,
    id_user: null
  };
  this.archivoParaSubir = null;
  this.fechaNoticia = { dia: null, mes: null, anio: null };
  this.noticiaEditando = false;
}
}