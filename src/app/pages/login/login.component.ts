import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  alertRegister: String;
  urlImg:string;
  alertSuccess: Boolean;
  submitted = false;
  constructor(private auth: AuthService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
    });
    this.urlImg = "../../../favicon.png";
  }
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      this.login();
    }
  }

  async login() {
    try {
      this.alertRegister = null;
      let response = await this.auth.login(this.loginForm.value).toPromise();
      if (response.code == 200) {
        let usuario = response.dataUser;
        if (!usuario.token) {
          this.alertRegister = "Fallo al iniciar sesión.";
        } else {
          this.auth.guardarUsuarioToken(usuario.token, usuario.id, usuario.expires);
          this.router.navigate(['/home']);
        }
      }
    } catch (e) {
      this.alertRegister = e.error.message;
      this.alertSuccess = false;
    }
  }

  register(){}
}
