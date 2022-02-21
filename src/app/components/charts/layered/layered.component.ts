import { Component, OnInit, Input } from '@angular/core';
import { ChartLayed } from '@app/classes/ChartLayed';

@Component({
  selector: 'app-layered',
  templateUrl: './layered.component.html',
  styleUrls: ['./layered.component.css']
})
export class LayeredComponent implements OnInit {

  chart;
  chartLayer: ChartLayed = new ChartLayed();
  dataChart;
  @Input() divInput: string;
  @Input() chartData;

  constructor() { }

  ngOnInit() {

    this.dataChart = this.chartData;
    this.chart = this.chartLayer.generateChartData(this.dataChart, this.divInput);
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

}
