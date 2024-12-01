import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { handleError } from '../../helpers';
import { UserDto } from '../../dtos/usuario.dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = "http://localhost:3000/api/usuarios";

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getSessionToken()}`,
    });
  }

  getUsers(): Observable<UserDto[]> {
    return this.http
      .get<UserDto[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(catchError(handleError));
  }

  getUser(id: number): Observable<UserDto> {
    return this.http
      .get<UserDto>(`${this.apiUrl}/buscarPorId?id=${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(handleError));
  }

  getCurrentUserId(): any {
    return localStorage.getItem("userId");
  }

  // Revisa si existe un email al registrarse o editar el perfil
  checkExistingEmail(email: string): Observable<UserDto> {
    const encodedEmail = encodeURIComponent(email);

    return this.http
      .get<UserDto>(`${this.apiUrl}/buscarPorEmail?email=${encodedEmail}`)
      .pipe(catchError(handleError));
  }

  addUser(user: UserDto): Observable<UserDto> {
    return this.http
      .post<UserDto>(this.apiUrl, user, { headers: this.getAuthHeaders() })
      .pipe(catchError(handleError));
  }

  updateUser(id: number, user: UserDto): Observable<UserDto> {
    return this.http
      .put<UserDto>(`${this.apiUrl}/modificarUsuario/${id}`, user, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(handleError));
  }

  deleteUser(id: number): Observable<UserDto> {
    return this.http
      .put<UserDto>(`${this.apiUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(handleError));
  }
}
