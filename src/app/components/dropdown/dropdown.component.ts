import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

  @Input() optionList;
  @Input() isDropleft: boolean;
  @Output() selectOptionOut = new EventEmitter();

  optionSelected;

  constructor() { }

  ngOnInit() {
    this.optionSelected = this.optionList[0];
  }

  selectOption(option) {
    this.optionSelected = option;
    this.selectOptionOut.emit(option);
  }

}
