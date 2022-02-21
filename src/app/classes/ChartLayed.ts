import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from '@amcharts/amcharts4/core';

export class ChartLayed {

    generateChartData(data, chartDiv: string) {
        let chart = am4core.create(chartDiv, am4charts.XYChart);

        // Add percent sign to all numbers
        //chart.numberFormatter.numberFormat = "#.#'%'";

        chart.data = data;
        chart.responsive.enabled = true;

        // Create axes
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "sensor";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = "Tiempo";
        valueAxis.title.fontSize = 25;

        // Create series
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "standyBy";
        series.dataFields.categoryX = "sensor";
        series.clustered = false;
        series.tooltipText = "Stand by {categoryX}: [bold]{valueY}[/]";

        series.columns.template.adapter.add("fill", function (fill, target) {
            const item = target.dataItem.dataContext as any;
            return am4core.color(item.color2);
        });

        let series2 = chart.series.push(new am4charts.ColumnSeries());
        series2.dataFields.valueY = "evento";
        series2.dataFields.categoryX = "sensor";
        series2.clustered = false;
        series2.columns.template.width = am4core.percent(50);
        series2.tooltipText = " {categoryX}: [bold]{valueY}[/]";

        series2.columns.template.adapter.add("fill", function (fill, target) {
            const item = target.dataItem.dataContext as any;
            return am4core.color(item.color);
        });

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.lineX.disabled = true;
        chart.cursor.lineY.disabled = true;
        return chart;
    }
}