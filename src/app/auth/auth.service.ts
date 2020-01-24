import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { DataStorageService } from '../shared/data-storage.service';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  userDetails: User;
  private autoLogoutTimer: any;

  // private WEB_API_KEY = 'firebase-api-key';
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    this.userDetails = null;
    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
    }
    this.autoLogoutTimer = null;
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      this.userDetails = loadedUser;
      const tokenExpirationTime =
        new Date(userData._tokenExpDate).getTime() - new Date().getTime();
      this.autoLogout(tokenExpirationTime);
    }
  }

  autoLogout(time: number) {
    this.autoLogoutTimer = setTimeout(_ => this.logout(), time);
  }

  signup(email, password) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          environment.WEB_API_KEY,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        tap(res => {
          const user = new User(
            res.email,
            res.localId,
            res.idToken,
            new Date(new Date().getTime() + +res.expiresIn * 1000)
          );
          this.user.next(user);
          this.userDetails = user;
          this.autoLogout(+res.expiresIn * 1000);
          localStorage.setItem('userData', JSON.stringify(user));
        })
      );
  }

  login(email, password) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          environment.WEB_API_KEY,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        tap(res => {
          const user = new User(
            res.email,
            res.localId,
            res.idToken,
            new Date(new Date().getTime() + +res.expiresIn * 1000)
          );
          this.user.next(user);
          this.userDetails = user;
          this.autoLogout(+res.expiresIn * 1000);
          localStorage.setItem('userData', JSON.stringify(user));
        })
      );
  }
}
