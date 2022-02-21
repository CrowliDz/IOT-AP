import { Component, OnInit, Input,OnDestroy } from '@angular/core';
import { ChartGauge } from '@app/classes/ChartGauge';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css']
})
export class GaugeComponent implements OnInit, OnDestroy {
  private chartGauge: ChartGauge = new ChartGauge();
  
  @Input() chartdiv: string;
  @Input() chartData;
  CG;
  Input: string;
  dataGauge = [];
  token;
  data;
  score;
  title: string;
  chartD;

  constructor() { }

  ngOnInit() {
    this.Gauge();
  }

  Gauge(){
    console.log(this.chartData)
    console.log(this.chartdiv)
    if(this.chartdiv == 'chartdiv'){
      this.title = 'CALIDAD'
    } else { this. title = 'OEE'}
    this.CG = this.chartData;
    this.Input = this.chartdiv;
    this.chartD = this.chartGauge.Gauge(this.CG,this.Input, this.title)
  }

  ngOnDestroy() {
    if (this.chartD) {
      this.chartD.dispose();
    }
  }


}