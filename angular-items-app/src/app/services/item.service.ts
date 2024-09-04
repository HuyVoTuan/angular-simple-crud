// src/app/services/item.service.ts
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpParams } from '@angular/common/http';
import { Item, Items, PaginationParams } from '../utils/type';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private baseService: BaseService) {}

  getItems = (url: string, params: PaginationParams): Observable<Items> => {
    const queryParams = new HttpParams()
      .set('pageIndex', params.pageIndex.toString())
      .set('pageSize', params.pageSize.toString())
      .set('filter', params.filter.toString())
      .set('sortField', params.sortField.toString())
      .set('sortOrder', params.sortOrder.toString());

    return this.baseService.get(url, {
      params: queryParams,
      responseType: 'json',
    });
  };

  createItem = (url: string, body: any): Observable<Item> => {
    return this.baseService.post(url, body, {
      responseType: 'json',
    });
  };

  updateItem = (url: string, id: number, body: any): Observable<Item> => {
    return this.baseService.put(`${url}/${id}`, body, {
      responseType: 'json',
    });
  };

  deleteItem = (url: string, id: number): Observable<Item> => {
    return this.baseService.delete(`${url}/${id}`, {
      responseType: 'json',
    });
  };
}
