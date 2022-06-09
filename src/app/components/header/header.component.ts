import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { ConfigusService } from '@app/services/configus.service';
import { Router } from '@angular/router';
import { ConfigUsComponent } from '@app/pages/forms/config-us/config-us.component';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  urlImg:string;
  chartPage:number = 0;
  token;
  lista:[];

  constructor(
    public auth: AuthService,
    public dialog: MatDialog,  
    public configusService: ConfigusService, 
    private router: Router) { }

  ngOnInit() {
    this.token = this.auth.token;
    this.urlImg = "../../../favicon.png";
    this.get('');
  }

  logout(): void {
    
    this.auth.logout();
    Swal.fire('Sesión cerrada!', '', 'success');
    this.router.navigate(['/login']);
  }

  async get(searchValue: string) {
    try {
      let resp = await this.configusService.read(1, this.token).toPromise();
      if (resp.code == 200) {
        this.lista = resp.response;
      console.log(this.lista)
      }
    } catch (e) {
    }
  }

  async configus(pbj) {
    const dialogRef = this.dialog.open(ConfigUsComponent, {
      width: '20rem',
      data: {
        title: 'Configuración',
        btnText: 'Ingresar',
        alertSuccesText: 'Actualizado!',
        alertErrorText: "Fallo de actualización",
        obj: this.lista,
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.get('');
    });
  }

}
