import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { RolesEnum } from '../../enums/roles.enum';

interface ILoginUser {
  id: number | null,
  rol: string
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private client: HttpClient, private router: Router) {
    this.isLoggedInSubject.next(this.hasToken());
  }

  login(email: string, password: string): Observable<{ token: string, idUsuario: number }> {
    const response = this.client.post<{ token: string, idUsuario: number }>('http://localhost:3000/api/auth/login', {
      email,
      password,
    }).pipe(
      tap(response => {
        this.setSession(response.token);
        localStorage.setItem('userId', String(response.idUsuario)); // Guarda el ID del usuario en el localStorage
        this.isLoggedInSubject.next(true);
      })
    )

    return response
  }

  getSessionToken(): string {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem('token') || "";
    }
    return ""
  }

  setSession(token: string) {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('token', token);
    }
  }

  register(username: string, email: string, password: string): Observable<{ token: string }> {
    return this.client.post<{ token: string }>('http://localhost:3000/api/usuarios', {
      username,
      email,
      password,
      rol: 'Usuario'
    })
  }

  updateProfile(profileData: { username?: string, password?: string, nombre?: string, email?: string, imagen?: string, bio?: string, rol?: string }): Observable<any> {
    return this.client.put('http://localhost:3000/api/usuarios', profileData);
  }

  logout() {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('token');
    }
    this.isLoggedInSubject.next(false);
    this.router.navigateByUrl('login');
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  private hasToken(): boolean {
    if (typeof sessionStorage === 'undefined') {
      return false;
    }
    const token = sessionStorage.getItem('token');
    if (!token) {
      return false;
    }
    return !new JwtHelperService().isTokenExpired(token);
  }

  hasRole(rol: RolesEnum): boolean {
    if (typeof sessionStorage === 'undefined') {
      return false;
    }
    const token = sessionStorage.getItem('token');
    if (!token) {
      return false;
    }
    const jwtHelper = new JwtHelperService();
    const decodedToken = jwtHelper.decodeToken(token);
    return decodedToken.rol === rol;
  }

  getUserRole(): RolesEnum {
    if (typeof sessionStorage === 'undefined') return RolesEnum.INVITADO;

    const token = sessionStorage.getItem('token');
    if (!token) return RolesEnum.INVITADO;

    const jwtHelper = new JwtHelperService();
    const decodedToken = jwtHelper.decodeToken(token);

    const rol = String(decodedToken.rol).toLocaleLowerCase();

    switch (rol) {
      case String(RolesEnum.ADMINISTRADOR).toLocaleLowerCase():
        return RolesEnum.ADMINISTRADOR

      case String(RolesEnum.USUARIO).toLocaleLowerCase():
        return RolesEnum.USUARIO

      default:
        break;
    }

    return decodedToken.rol;
  }

  getUser(): ILoginUser {
    if (typeof sessionStorage === 'undefined') return { id: null, rol: RolesEnum.INVITADO };

    const token = sessionStorage.getItem('token');
    if (!token) return { id: null, rol: RolesEnum.INVITADO };

    const jwtHelper = new JwtHelperService();
    const decodedToken = jwtHelper.decodeToken(token);

    return { id: parseInt(decodedToken.sub), rol: String(decodedToken.rol).toLocaleLowerCase() }
  }
}