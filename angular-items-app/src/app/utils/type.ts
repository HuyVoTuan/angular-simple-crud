import {
  HttpHeaders,
  HttpContext,
  HttpParams,
  HttpStatusCode,
} from '@angular/common/http';

export interface Options {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body';
  context?: HttpContext;
  params?:
    | HttpParams
    | {
        [param: string]:
          | string
          | number
          | boolean
          | ReadonlyArray<string | number | boolean>;
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  transferCache?:
    | {
        includeHeaders?: string[];
      }
    | boolean;
}

export interface Item {
  _id: number;
  name: string;
  type: string;
  category: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Items {
  isSuccess: boolean;
  statusCode: HttpStatusCode;
  message: string;
  pageIndex: number;
  pageSize: number;
  dataLength: number;
  totalPages: number;
  data: Item[];
}

export interface PaginationParams {
  filter: string;
  pageIndex: number;
  pageSize: number;
  sortField: string;
  sortOrder: string;
}
