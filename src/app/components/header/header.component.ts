import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  urlImg:string;
  chartPage:number = 0;
  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.urlImg = "../../../favicon.png";
  }

  logout(): void {
    this.auth.logout();
    Swal.fire('Sesión cerrada!', '', 'success');
    this.router.navigate(['/login']);
  }

  config(){
    
  }
}
