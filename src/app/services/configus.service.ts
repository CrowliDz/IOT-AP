import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigusService {

  private url: string = environment.environment.urlEndPoint + '/Configus';
  constructor(private http: HttpClient) { }

  get(name: string, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', name);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/get', { headers, params: params });
  }
  
  P_ObjetosEnFuncion( token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/P_ObjetosEnFuncion', { headers});
  }

  MQTTEncoder(MQTT): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders();
    const url = `http://52.14.16.49:3000`;
    return this.http.get(`${url + '/sendLight?'}topic=${MQTT.topic}&message=${MQTT.message}`, { headers });
  }

  create(Configus, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post<any>(this.url + '/get', Configus, { headers });
  }

  read(id, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(`${this.url + '/read'}/${id}`, { headers });
  }

  delete(id: number, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete<any>(`${this.url + '/read'}/${id}`, { headers });
  }

  update(configus, token) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/read'}/${configus.id_config}`, configus, { headers });
  }
}
