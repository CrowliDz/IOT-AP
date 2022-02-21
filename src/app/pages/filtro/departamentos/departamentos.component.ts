import { Component, OnInit } from '@angular/core';
import { DepartamentoService } from '@app/services/departamento.service';
import { Departamento } from '@app/models/departamento';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { NuevoDepartamentoComponent } from '@app/pages/forms/nuevo-departamento/nuevo-departamento.component';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from "ngx-spinner";
import { NuevoUsuarioComponent } from '@app/pages/forms/nuevo-usuario/nuevo-usuario.component';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.scss']
})
export class DepartamentosComponent implements OnInit {

  departamentos: Departamento[];
  total: number;
  listNav = [
    { "name": "Departamento", "router": "/departamento" },
  ]
  constructor(private deptoService: DepartamentoService,
    private dialog: MatDialog, private spinner: NgxSpinnerService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.getDeptos("");
  }

  async getDeptos(searchValue) {
    try {
      let resp = await this.deptoService.getDepartamentos(searchValue, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.departamentos = resp.depto;
        this.total = this.departamentos.length;
      }
    } catch (e) {
    }
  }

  addDepto() {
    const dialogRef = this.dialog.open(NuevoDepartamentoComponent, {
      width: '30rem',
      data: {
        title: 'Agregar departamento',
        btnText: 'Guardar',
        alertSuccesText: 'Departamento creado!',
        alertErrorText: "No se puedo crear el departamento",
        modalMode: 'create'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getDeptos("");
    });
  }

  updateDepto(depto) {
    const dialogRef = this.dialog.open(NuevoDepartamentoComponent, {
      width: '30rem',
      data: {
        title: 'Editar departamento',
        btnText: 'Guardar',
        alertSuccesText: 'Departamento modificado correctamente',
        alertErrorText: "No se puedo modificar el departamento",
        modalMode: 'edit',
        depto
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getDeptos("");
    });
  }

  delete(id: number) {
    Swal.fire({
      title: '¿Estas seguro?', text: "Desea eliminar el departamento",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.deptoService.delete(id, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El departamento ha sido eliminado correctamente', 'success');
            this.getDeptos("");
          } else {
            Swal.fire('Error', 'No fue posible eliminar el departamento', 'error');
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
    this.getDeptos(searchValue);
  }

  addUsuario(idDepto) {
    const dialogRef = this.dialog.open(NuevoUsuarioComponent, {
      width: '40rem',
      data: {
        title: 'Agregar usuario',
        btnText: 'Agregar',
        alertSuccesText: 'Usuario creado!',
        alertErrorText: "No se puedo crear el usuario",
        modalMode: 'create',
        idDepto
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getDeptos("");
    });
  }
}
