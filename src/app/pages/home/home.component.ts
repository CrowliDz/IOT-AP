import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CiaService } from '@app/services/cia.service';
import { Cia } from '@app/models/cia';
import { AuthService } from '@app/services/auth.service';
import * as environment from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  homeCards: Array<object> = [];

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.homeCards = [
      {
        icon: 'wb_incandescent',
        text: 'Light',
        function: '/light-control',
        class: 'be-green',
      },
      {
        icon: 'settings_input_antenna',
        text: 'Temperature',
        function: '/temperature-control',
        class: 'be-green',
      },
    ];

  }

  navigateTo(url: String) {
    url = '/' + url;
    this.router.navigate([url]);
  }
}
