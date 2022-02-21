import { Component, OnInit, Inject } from '@angular/core';
import { DepartamentoService } from '@app/services/departamento.service';
import { UsuarioService } from '@app/services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Departamento } from '@app/models/departamento';
import { Usuario } from '@app/models/usuario';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoUsuarioComponent extends Dialog implements OnInit {

  usuario: Usuario = new Usuario();
  usuarioForm: FormGroup;
  MQTT: FormGroup;
  submitted = false;
  departamentos: Departamento[];
  enabledDepartamento: boolean = false;
  token;
  tipousuario: string;
  sistema: boolean = false;
  auxnip2: string = '';
  auxpassword2: string = '';
  statusUsu: string;
  
  usr = [];
  usrSend: string;

  constructor(private deptoService: DepartamentoService, private formBuilder: FormBuilder,
    private usuarioService: UsuarioService, private auth: AuthService,
    public dialogRef: MatDialogRef<NuevoUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
    super();
  }

  ngOnInit() {
    const disabled = this.data.idDepto ? true : false;
    this.loadModalTexts();
    this.MQTT = this.formBuilder.group({
      topic: [''],
      message: [],
    });

    if (this.sistema) {
      this.usuarioForm = this.formBuilder.group({
        nip: ['', Validators.required,],
        nip2: ['', Validators.required,],
        password: ['', [Validators.required, Validators.min(6)]],
        password2: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        celular: ['',],
        activousr: ['', Validators.required],
      },
        { validator: [this.MustMatch('password', 'password2'), this.MustMatch('nip', 'nip2')] });
    } else {
      this.usuarioForm = this.formBuilder.group({
        nip: ['', Validators.required,],
        nip2: ['', Validators.required],
        email: ['', Validators.email],
        celular: [''],
        activousr: ['', Validators.required],
      },
        { validator: [this.MustMatch('nip', 'nip2')] });
    }
    this.token = this.auth.token;
    this.getDeptos();
    
  }

  async getDeptos() {
    try {
      let resp = await this.deptoService.getDepartamentos("", this.token).toPromise();
      if (resp.code == 200) {
        this.departamentos = resp.depto;
      }
    } catch (e) {
    }
  }

  async getUsrAct() {
    try {
      let resp = await this.usuarioService.getUsuariosAct(this.auth.token).toPromise();
      if (resp.code == 200) {
        this.usr = resp.response;
        this.usrSend = JSON.stringify(this.usr);
        this.usrSend = this.usrSend.split(/]|{|}|"|id|evento|nip|:|/g).join('');
        this.usrSend = this.usrSend.split("[").join('');
        this.usrSend = this.usrSend.split(",").join('?');
        this.SendUsuariosMQTT(this.usrSend)
        console.log(this.usrSend)
      }
    } catch (e) {
    }
  }

  async SendUsuariosMQTT(info) {
    this.MQTT.value.message =  'Ids:'+ info +'/Fin';
    console.log(this.MQTT.value)
    try {
      let resp = await this.usuarioService.MQTTEncoder(this.MQTT.value).toPromise();
      
    } catch (e) {
    }
  }

  get f() { return this.usuarioForm.controls; }

  onSubmit() {

    this.submitted = true;
    if (this.usuarioForm.invalid) {
      return;
    } else {
      this.guardar();
    }
  }

  async guardar() {
    if (this.sistema) {
      try {
        let response = await this.usuarioService.create(this.usuario, this.token).toPromise();
        if (response.code = 200) {
          this.showAlert(this.alertSuccesText, true);
          this.closeModal();
          this.getUsrAct();
        }
        else {
          this.showAlert(this.alertErrorText, false);
        }
      } catch (e) {
        this.showAlert(e.error.message, false);
      }
    } else {
      try {
        let response = await this.usuarioService.createInf(this.usuario, this.token).toPromise();
        if (response.code = 200) {
          this.showAlert(this.alertSuccesText, true);
          this.closeModal();
          this.getUsrAct();
        }
        else {
          this.showAlert(this.alertErrorText, false);
        }
      } catch (e) {
        this.showAlert(e.error.message, false);
      }
    }
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

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, username, Username_last, iddep, idevento, tipousuario, usuario, idDepto, } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;
    this.usuario.username = username;
    this.usuario.Username_last = Username_last;
    this.usuario.iddep = parseInt(iddep);
    this.usuario.idevento = parseInt(idevento);
    this.tipousuario = tipousuario;

    if (usuario) {
      const { username, id, email, password, celular, iddep, nip, activousr } = usuario;
      this.usuario.iddep = iddep;
      this.usuario.username = username;
      this.usuario.celular = celular;
      this.usuario.email = email;
      this.usuario.id = id;
      this.usuario.nip = nip;
      this.auxnip2 = nip;
      this.usuario.activousr = parseInt(activousr);
    }
    if (tipousuario) {
      this.sistema = true;
    }
    if (idDepto) {
      this.enabledDepartamento = true;
      this.usuario.iddep = idDepto;
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  ToggleStatusUsu() {
    if (this.usuarioForm.value.activousr == 1) {
      this.statusUsu = 'Activo';
    } else {
      this.statusUsu = 'Inactivo';
      this.usuarioForm.value.activousr = 0;
    }
  }

}
