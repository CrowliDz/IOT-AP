import { Component, OnInit, EventEmitter,Output } from '@angular/core';

@Component({
  selector: 'app-file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.scss']
})
export class FilePickerComponent implements OnInit {

  fileToUpload: File = null;
  @Output() selectFileOut= new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.selectFileOut.emit(this.fileToUpload);
  }
}
