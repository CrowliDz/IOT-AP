import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  urlImg:string;
  chartPage:number = 0;
  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.urlImg = "../../../favicon.png";
  }

 
}
