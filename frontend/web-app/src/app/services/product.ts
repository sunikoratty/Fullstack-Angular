import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class Product {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5000/api/products';

  getProducts(page: number, limit: number) {
    return this.http.get<any>(`${this.baseUrl}?page=${page}&limit=${limit}`);
  }

  createProduct(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  updateProduct(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
