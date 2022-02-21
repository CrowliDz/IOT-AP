import { Component, OnInit, Input ,OnDestroy} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { ChartPie } from '@app/classes/ChartPie';
import * as ruta from '@app/classes/Ruta';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnInit,OnDestroy {

  private chartPie: ChartPie = new ChartPie();
  chart1;
  dataChart1;

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

  llenarGrafica(){
    this.dataChart1 = this.chartData;
    this.chart1 = am4core.create("chartdiv1", am4charts.PieChart);
    this.chart1.data = this.dataChart1;
    let pieSeries = this.chartPie.generateSeries(this.chart1)
    this.chart1.legend = new am4charts.Legend();
    this.chart1.legend.valign = "bottom";
    this.chart1.legend.labels.template.maxWidth = 120;
    this.chart1.legend.labels.template.truncate = false;
    this.chart1.legend.labels.template.wrap = true;
    this.chart1.legend.labels.template.text = "{name}";
    let markerTemplate = this.chart1.legend.markers.template;
    markerTemplate.width = 15;
    markerTemplate.height = 15;
    pieSeries.slices.template.events.on("hit", this.clickEventPie, this);
  }
  
  clickEventPie(ev) {
    let selected = ev.target.dataItem.dataContext.sensor;
    let fechaI: string = this.fechaInicio + ' ' + this.horaInicio;
    let fechaF: string = this.fechaFin + ' ' + this.horaFin;
    localStorage.setItem('maquina', this.maquina);
    localStorage.setItem('fechaInicio', fechaI);
    localStorage.setItem('fechaFin', fechaF);
    localStorage.setItem('sensor',selected);
    window.open("http://localhost:4200/evento", "_blank");
    
  }

  ngOnDestroy() {
    if (this.chart1) {
      this.chart1.dispose();
    }
  }

}
