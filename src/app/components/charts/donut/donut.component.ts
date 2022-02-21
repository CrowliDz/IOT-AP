import { Component, OnInit, Input,OnDestroy } from '@angular/core';
import { ChartDonut } from '@app/classes/ChartDonut';

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.css']
})
export class DonutComponent implements OnInit, OnDestroy {
  private charDonut: ChartDonut = new ChartDonut();
  chartD;
  dataChart;
  @Input() divInput: string;
  @Input() chartData;

  constructor() { }

  ngOnInit() {
    this.llenarGrafica();
  }

  llenarGrafica(){
    this.dataChart = this.chartData;
    this.chartD = this.charDonut.generateChartData(this.dataChart,this.divInput);
    this.charDonut.generateSerie(this.chartD);
  }

  ngOnDestroy() {
    if (this.chartD) {
      this.chartD.dispose();
    }
  }

}
