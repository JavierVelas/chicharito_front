// data.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = '${environment.apiUrl}/noticias'; 

  constructor(private http: HttpClient) {}

  
 
}