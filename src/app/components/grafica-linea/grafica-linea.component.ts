import { Component, NgZone, OnInit, Input, Inject, OnDestroy } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { LuzService } from '@app/services/luz.service';
import { ConfigusService } from '@app/services/configus.service';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { CardTitleComponent } from '@app/components/card-title/card-title.component';

am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-grafica-linea',
  templateUrl: './grafica-linea.component.html',
  styleUrls: ['./grafica-linea.component.scss']
})
export class GraficaLineaComponent implements OnInit {

  lista: [];
  graph: [];
  config= [];
  submitted = false;
  graf : boolean;
  token;
  chart;
  datos;
  chartdiv = "chartdiv";

  constructor(
    private luzService: LuzService,
    private auth: AuthService,
    private configusService: ConfigusService,
  ) { }

  ngOnInit() {
    this.token = this.auth.token;

    this.P_EstadoYCodeX();
    this.grafica(this.graph);

    setInterval(() => {
      this.P_EstadoYCodeX2();
    }, 3000);
  }

  ngOnDestroy() {
   // this.unsubscribeInterval();
  }



  async P_EstadoYCodeX() {
    try {
      let resp = await this.luzService.P_EstadoYCodeX(this.token).toPromise();
      if (resp.code == 200) {
        this.graph = resp.response;

        console.log(this.graph)
        this.grafica(this.graph)
      }
    } catch (e) {
    }
  }

  async P_EstadoYCodeX2() {
    try {
      let resp = await this.luzService.P_EstadoYCodeX(this.token).toPromise();
      if (resp.code == 200) {
        this.graph = resp.response;
      }
    } catch (e) {
    }
  }

  grafica(datos) {
    // Themes end
    console.log(this.graph)
    // Create chart instance
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.data = datos;
    console.log(datos)
    console.log(chart.data)
    
    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "code_sensorluz";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 10;
    
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 1;
    
    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "estado_sensorluz";
    series.dataFields.categoryX = "code_sensorluz";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;
    
    series.tooltip.pointerOrientation = "vertical";
    
    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;
    
    // on hover, make corner radiuses bigger
    let hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;
    
    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });
    
    // Cursor
    chart.cursor = new am4charts.XYCursor();
    

  }
  

}