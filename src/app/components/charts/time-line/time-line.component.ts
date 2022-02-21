import { Component, OnInit , Input} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { ChartTimeLine } from '@app/classes/CharTimeLine';
import * as ruta from '@app/classes/Ruta';

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.css']
})
export class TimeLineComponent implements OnInit {

  private charTimeLine: ChartTimeLine = new ChartTimeLine();
  chart;
  dataChart;

  @Input() chartData;
  @Input() fechaInicio;
  @Input() horaInicio;
  @Input() horaFin;
  @Input() fechaFin;
  @Input() maquina;

  constructor() { }

  ngOnInit() {
    this.llenarGrafica();
  }

  llenarGrafica() {
    this.dataChart = this.chartData;
    this.chart = this.charTimeLine.generateChart(this.dataChart, "chartTimeLine");
    let serie = null;
    serie = this.charTimeLine.generateSerie(this.chart);
    //serie.columns.template.events.on("hit", this.clickEvent, this);
  }

  clickEvent(ev) {
    let selected = ev.target.dataItem.dataContext.sensor;
    let fechaI: string = this.fechaInicio + ' ' + this.horaInicio;
    let fechaF: string = this.fechaFin + ' ' + this.horaFin;
    localStorage.setItem('maquina', this.maquina);
    localStorage.setItem('fechaInicio', fechaI);
    localStorage.setItem('fechaFin', fechaF);
    localStorage.setItem('sensor',selected.substring(2, 3));
   // window.open(ruta.ruta+"/evento", "_blank");
    
  }

}
