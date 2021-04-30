import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FxRequestsService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public getSymbols(): Observable<{[key: string]: string}> {
    return this.httpClient.get<{[key: string]: string}>(`${env.apiUrl}/symbols`)
  }

  public getExchange(from: string, to: string, amount: number): Observable<any> {
    let params = new HttpParams();
    params = params.set('from', from);
    params = params.set('to', to);
    params = params.set('amount', amount.toString());
    return this.httpClient.get<any>(`${env.apiUrl}/convert`, { params });
  }
}
