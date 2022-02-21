import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Cia } from '../models/cia';
import * as environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CiaService {

  private url: string = environment.environment.urlEndPoint + '/cia';
  private url2: string = environment.environment.urlEndPoint;

  private httpHeaderFormData = new HttpHeaders({ 'Content-Type': 'multipart/form-data' })
  //'Content-Type': 'application/x-www-form-urlencoded'
  // headers: { 'Content-Type': 'multipart/form-data'
  //'Content-type': 'application/json
  constructor(private http: HttpClient) { }

  /*getCias(token): Observable<any> {
    this.httpHeaders.set("Authorization", token);
    return this.http.get(this.url + '/cias');
  }*/

  /*create(cia: Cia): Observable<any> {
    return this.http.post<any>(this.url + '/cias', cia, { headers: this.httpHeaders });
  }*/

  createImage(img): Observable<any> {
    // const formData = new FormData();
    // formData.append('image', image);
    return this.http.post<any>(this.url2 + '/update', img.idcia, { headers: this.httpHeaderFormData });
  }

  readCia(id: string, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(`${this.url + '/read'}/${id}`, { headers });
  }

  update(cia, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/read'}/${cia.idcia}`, cia, { headers });
  }

  uploadImage(id: any, file: File, token) {
    const url = this.url2 + '/cia/upload-image/' + id;
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();
      formData.append('image', file, file.name);
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            return resolve(JSON.parse(xhr.response));
          } else {
            return reject(JSON.parse(xhr.response));
          }
        }
      };
    });
  }

}
