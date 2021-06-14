import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from 'app/app.config';
import { catchError, tap } from 'rxjs/operators';
import { throwError as observableThrowError, Observable, of, BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private bufferedApi: any;

  constructor(private http: HttpClient) { }

  getData(buffered = true): Observable<any> {
    if (this.bufferedApi && buffered) {
      return of(this.bufferedApi);
    } else {
      return this.http.post<any>(AppConfig.settings.apiServer.dataServer + '/customers/list', {}).pipe(
        tap(data => {
          this.bufferedApi = data;
        }), catchError((error: any) => observableThrowError(error.json().error))
      );
    }
  }

  getAllCustomers(start: number, limit: number, filter: any): Observable<any> {
    // , { start: start, limit: limit, filter: filter.searchValue }   ===> optional pagination
    return this.http.get<any>(AppConfig.settings.apiServer.dataServer + '/customers/list');
  }

  saveCustomer(customerForm: any): Observable<any> {
    return this.http.post<any>(AppConfig.settings.apiServer.dataServer + '/customers/save', customerForm).pipe(
      tap(customer => {
        if (this.bufferedApi) {
          const index = this.bufferedApi.fabrics.findIndex(x => x.fabric_id == customer.fabric_id);
          if (index > -1) {
            this.bufferedApi.fabrics.splice(index, 1, customer);
          } else {
            this.getData(false);
          }
        }
      })
    )
  }

  delete(id: number = 0): Observable<any> {
    return this.http.post<any>(AppConfig.settings.apiServer.dataServer + '/customer/delete', { 'id': id });
  }

  getCustomerDetails(customer_id): Observable<any> {
    return this.http.post<any>(AppConfig.settings.apiServer.dataServer + '/customers/' + customer_id, {});
  }

  customerStatus(status, customerId) {
    return this.http.post<any>(AppConfig.settings.apiServer.dataServer + '/customer/customerStatus', { 'customer_id': customerId, 'customer_status': status });
  }

  uploadImage(id, name, image, type = 'customer') {
    return this.http.post<any>(AppConfig.settings.apiServer.dataServer + '/customer/upload', { id: id, image: image, name: name, type: type });
  }
}
