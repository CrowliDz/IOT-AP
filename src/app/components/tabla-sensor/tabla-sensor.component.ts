import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tabla-sensor',
  templateUrl: './tabla-sensor.component.html',
  styleUrls: ['./tabla-sensor.component.css']
})
export class TablaSensorComponent implements OnInit {

  @Input() public eventos;

  constructor() { }

  ngOnInit() {
  }

}
