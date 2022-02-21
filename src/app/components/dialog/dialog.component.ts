import { Component, OnInit , Input,EventEmitter,Output} from '@angular/core';

@Component({
  selector: 'dialog-component',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  @Input() title;
  @Input() alertMessage;
  @Output() closeEmit= new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closeModal(){
    this.closeEmit.emit();
  }
}
