import { Component, OnInit , Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'filter-by',
  templateUrl: './filter-by.component.html',
  styleUrls: ['./filter-by.component.scss']
})
export class FilterByComponent implements OnInit {
  @Input() filterBy:number;
  @Output() selectionFilter = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  filterTypeselected(selected){
    this.selectionFilter.emit(selected);
  }

}
