import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  sendEmail(user: User, message: string, url: string) {
    const { name, lastName, email, password, role } = user;
    const data = { name, lastName, email, password, role, message, url };

    console.log(data);
    return this.http.post<any>(`${environment.apiUrl}/sendEmail`, data, { headers: this.headers });
  }
}
