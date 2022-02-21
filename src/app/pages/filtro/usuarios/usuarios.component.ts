import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '@app/services/usuario.service';
import { Usuario } from '@app/models/usuario';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from '@app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Departamento } from '@app/models/departamento';
import { DepartamentoService } from '@app/services/departamento.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})

export class UsuariosComponent implements OnInit {

  usuarios: Usuario[];
  usuario: Usuario;
  // listaEvento:EventoSensor[];
  listaEvento = [
   // { id: 1, nombre: "Operando" },
   // { id: 2, nombre: "En paro" },
   // { id: 3, nombre: "Stand by" },
    { id: 4, nombre: "Mantenimiento" },
    { id: 5, nombre: "Materiales" },
    { id: 6, nombre: "Ingenieria" },
    { id: 7, nombre: "Producción" },
    { id: 8, nombre: "Calidad" }
  ];
  listaDepart: Departamento[];
  formUser: FormGroup;
  total: number = 0;
  submitted = false;
  activoUsuario = '1';
  status: string;
  s: number;
  statusr: any[] = [
    { status: 0, statnom: 'Todos' },
    { status: 1, statnom: 'Activo' },
    { status: 2, statnom: 'Inactivo' },
  ];
  listNav = [
    { "name": "Usuarios del Sistema", "router": "/usuario" },
    { "name": "Personal Técnico", "router": "/personal-tecnico" },
    { "name": "Personal Operativo", "router": "/personal-operativo" },
    { "name": "Personal Ingeniería", "router": "/personal-ingenieria" },
    { "name": "Personal Calidad", "router": "/personal-calidad" },
    { "name": "Personal Materiales", "router": "/personal-materiales" },
  ]
  token: string;
  constructor(private usuarioService: UsuarioService,
    private departamentoService: DepartamentoService, private auth: AuthService,
    private dialog: MatDialog, private spinner: NgxSpinnerService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.s = 1;
    this.usuario = new Usuario();
    this.formUser = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      departamento: ['', Validators.required],
      evento: ['', Validators.required],
    });
    this.getUsuarios2('');
    this.getDepartamentos();

  }

  async getUsuarios2(searchValue: string) {
    try {
      let resp = await this.usuarioService.getUsuariosSistema(searchValue, '', this.activoUsuario, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.usuarios = resp.usuario;
      }
    } catch (e) {
    }
  }

  
  async getDepartamentos() {
    try {
      let resp = await this.departamentoService.getDepartamentos('', this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listaDepart = resp.depto;
      }
    } catch (e) {
    }
  }

  /*
  async addUsuario() {
    const dialogRef = this.dialog.open(IngresaNipComponent, {
      //width: '25rem',
      data: {
        title: 'Ingresa el NIP',
        btnText: 'Ingresar',
        alertSuccesText: 'Entraste!',
        alertErrorText: "El NIP no coincide",
        modalMode: 'create',
        username: this.usuario.username,
        Username_last: this.usuario.Username_last,
        iddep: this.usuario.iddep,
        idevento: this.usuario.idevento,
        tipousuario: 'sistema'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getUsuarios2('');
      this.formUser.reset({});
    });
  }

  updateUsuario(usuario) {
    const dialogRef = this.dialog.open(IngresaNipComponent, {
      //width: '25rem',
      data: {
        title: 'Ingresa el NIP',
        btnText: 'Ingresar',
        alertSuccesText: 'Entraste!',
        alertErrorText: "El NIP no coincide",
        modalMode: 'create',
        usuario,
        tipousuario: 'sistema'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getUsuarios2('');
      this.formUser.reset({});
    });
  }*/

  delete(id: number) {
    Swal.fire({
      title: '¿Estas seguro?', text: "Desea eliminar el usuario",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.usuarioService.delete(id, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            //Swal.fire('Eliminado', 'El usuario se ha sido eliminado correctamente', 'success');
            this.getUsuarios2('');
          } else {
            //Swal.fire('Error', 'No fue posible eliminar el usuario', 'error');
          }
        });
      }
    });
  }

  showSpinner() {
    const opt1: Spinner = {
      bdColor: "rgba(51,51,51,0.8)",
      size: "medium",
      color: "#fff",
      type: "square-jelly-box"
    };
    this.spinner.show("mySpinner", opt1);
  }

  async onSearchChange(searchValue: string) {
    this.getUsuarios2(searchValue);
  }

  get f() { return this.formUser.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.formUser.invalid) {
      return;
    } else {

      this.submitted = false;
    }
  }

  async save() {
    try {
      let response = await this.usuarioService.create(this.formUser.value, this.auth.token).toPromise();
      if (response.code == 200) {
        Swal.fire('Guardado', 'El registro ha sido guardado!', 'success');
        this.getUsuarios2('');
        this.submitted = false;
        this.formUser.reset({});
      }
    } catch (error) {
      Swal.fire('Error', 'No fue posible guardar el registro!', 'error');
    }
  }



}
