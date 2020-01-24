import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  signUpMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onSwitchSignUpMode() {
    this.signUpMode = !this.signUpMode;
  }

  onSubmit(f: NgForm) {
    if (!f.valid) {
      return;
    }
    const email = f.value.email;
    const password = f.value.password;
    this.isLoading = true;
    if (this.signUpMode) {
      this.authService.signup(email, password).subscribe(
        res => {
          // console.log(res);
          this.isLoading = false;
          f.reset();
          this.router.navigate(['/recipes']);
        },
        err => {
          // console.log(err);
          this.error = 'An Error Occured :' + err.error.error.message;
          this.isLoading = false;
        }
      );
    } else {
      this.authService.login(email, password).subscribe(
        res => {
          // console.log(res);
          this.isLoading = false;
          f.reset();
          this.router.navigate(['/recipes']);
        },
        err => {
          // console.log(err);
          if (err.error.error) {
            this.error =
              'An Error Occured at login :' + err.error.error.message;
          } else {
            this.error = 'an unknown error occured';
          }
          this.isLoading = false;
        }
      );
    }
  }
}
