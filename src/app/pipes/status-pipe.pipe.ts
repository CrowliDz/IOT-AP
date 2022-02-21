import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (args != null) {
      switch (value) {
        case 0: return "En proceso";
        case 1: return "Pendiente";
        case 2: return "En suspensión";
        case 3: return "Terminado";
      }
    }
    return null;
  }

}
