import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'card-title',
  templateUrl: './card-title.component.html',
  styleUrls: ['./card-title.component.scss']
})
export class CardTitleComponent implements OnInit {

  @Input() title:string;
  @Input() styleClass:boolean;

  constructor() { }

  ngOnInit() {
  }

}
