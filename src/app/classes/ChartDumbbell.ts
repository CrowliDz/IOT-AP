import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';


export class ChartDumbbell {

    generateChart(data, chartDiv: string) {
        let chart = am4core.create(chartDiv, am4charts.XYChart);
        chart.data = data;
        return chart;
    }

    generateSerie(chart: am4charts.XYChart) {
        let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.ticks.template.disabled = true;
        categoryAxis.renderer.axisFills.template.disabled = true;
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.minGridDistance = 15;
        categoryAxis.renderer.inversed = true;
        categoryAxis.renderer.inside = true;
        categoryAxis.renderer.grid.template.location = 0.5;
        categoryAxis.renderer.grid.template.strokeDasharray = "1,3";

        let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.ticks.template.disabled = true;
        valueAxis.renderer.axisFills.template.disabled = true;

        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryY = "category";
        series.dataFields.openValueX = "open";
        series.dataFields.valueX = "close";
        series.tooltipText = "open: {openValueX.value} close: {valueX.value}";
        series.sequencedInterpolation = true;
        series.fillOpacity = 0;
        series.strokeOpacity = 1;
        series.columns.template.height = 0.01;
        series.tooltip.pointerOrientation = "vertical";

        let openBullet = series.bullets.create(am4charts.CircleBullet);
        //openBullet.locationX = 1;

        let closeBullet = series.bullets.create(am4charts.CircleBullet);

        closeBullet.fill = chart.colors.getIndex(4);
        closeBullet.stroke = closeBullet.fill;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.behavior = "zoomY";

        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarY = new am4core.Scrollbar();

        return series;
    }

}