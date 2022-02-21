import { Component, AfterViewInit, ElementRef } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'EXC';
  currentComponent: string;
  constructor(private elementRef: ElementRef) {

  }
  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#dee2e661';
  }

  onActivate(event: any) {
    //console.log(event.constructor.name)
    if (event.constructor.name) {
      this.currentComponent = event.constructor.name;
      //console.log(typeof(this.currentComponent))
    } else {
      this.currentComponent = null;
    }
    
  }
}  
