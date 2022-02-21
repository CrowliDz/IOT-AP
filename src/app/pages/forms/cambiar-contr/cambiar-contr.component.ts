import { string } from '@amcharts/amcharts4/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dialog } from '@app/classes/Dialog';
import { Usuario } from '@app/models/usuario';
import { AuthService } from '@app/services/auth.service';
import { UsuarioService } from '@app/services/usuario.service';
import Swal from 'sweetalert2';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-cambiar-contr',
  templateUrl: './cambiar-contr.component.html',
  styleUrls: ['./cambiar-contr.component.scss']
})
export class CambiarContrComponent extends Dialog implements OnInit {

  usuario: Usuario;
  password: string;
  token;
  CambiaContrForm: FormGroup;
  submitted = false;
  id;
  c = [];

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private usuarioService: UsuarioService,
    public dialogRef: MatDialogRef<CambiarContrComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data) {
    super();
  }
  ngOnInit() {
    this.usuario = new Usuario();
    this.loadModalTexts();
    this.CambiaContrForm = this.formBuilder.group({
      id: [''],
      password: ['', [Validators.required, Validators.min(6)]],
      password2: ['', [Validators.required]]
    },
      { validator: [this.MustMatch('password', 'password2')] });//, { validator: this.MustMatch('nip', this.usuario.nip.toString()) }    { validator: this.MustMatch('nip')}

    this.token = this.auth.token;
  }

  get f() { return this.CambiaContrForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.CambiaContrForm.invalid) {
      return;
    } else {
      this.guardar();
    }
  }


  async guardar() {
    this.CambiaContrForm.value.password = await bcrypt.hash(this.CambiaContrForm.value.password, 5);
    this.CambiaContrForm.value.id = this.id;
    try {
      let resp = await this.usuarioService.update(this.CambiaContrForm.value, this.token).toPromise();
      if (resp.code == 200) {
        this.c = resp;
        this.showAlert(this.alertSuccesText, true);
        this.submitted = false;
        this.closeModal();
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar el registro', error.error);
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  loadModalTexts(): void {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, usuario } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;
    this.usuario = usuario;
    this.id = usuario.id;
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

}
