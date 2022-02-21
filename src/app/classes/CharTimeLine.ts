import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4plugins_timeline from "@amcharts/amcharts4/plugins/timeline";
import * as am4plugins_bullets from "@amcharts/amcharts4/plugins/bullets";


export class ChartTimeLine {

    generateChart(data, chartDiv: string) {
        let chart = am4core.create(chartDiv, am4plugins_timeline.CurveChart);
        chart.data = data;
        chart.dateFormatter.dateFormat = "yyyy-MM-dd hh:mm";
        chart.dateFormatter.inputDateFormat = "yyyy-MM-dd hh:mm";
        chart.responsive.enabled = true;
        chart.maskBullets = false;

        // chart.legend = new am4charts.Legend();
        // chart.legend.useDefaultMarker = true;
        //chart.legend.position = "right";
        //chart.legend.valign = "top";
        //chart.legend.labels.template.maxWidth = 120;
        //chart.legend.labels.template.truncate = false;
        //chart.legend.labels.template.wrap = true;
        //chart.legend.labels.template.text = "{task}";
        return chart;
    }

    generateSerie(chart) {
        let interfaceColors = new am4core.InterfaceColorSet();

        let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "task";
        categoryAxis.renderer.labels.template.paddingRight = 25;
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.innerRadius = 0;
        categoryAxis.renderer.radius = 100;
        categoryAxis.renderer.grid.template.location = 1;

        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 70;
        dateAxis.min = new Date("2019-11-10 05:00").getTime();
        dateAxis.max = new Date("2019-11-11 02:00").getTime();

        dateAxis.baseInterval = { count: 1, timeUnit: "minute" };
        dateAxis.startLocation = -0.5;

        //dateAxis.renderer.points = [{ x: -400, y: 0 }, { x: -250, y: 0 }, { x: 0, y: 60 }, { x: 250, y: 0 }, { x: 400, y: 0 }];
        // dateAxis.renderer.autoScale = false;
        dateAxis.renderer.polyspline.tensionX = 0.8;
        dateAxis.renderer.tooltipLocation = 0;
        dateAxis.renderer.grid.template.disabled = true;
        dateAxis.renderer.line.strokeDasharray = "1,4";
        dateAxis.renderer.line.strokeOpacity = 0.7;
        dateAxis.tooltip.background.fillOpacity = 0.2;
        dateAxis.tooltip.background.cornerRadius = 5;
        dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
        dateAxis.tooltip.label.paddingTop = 7;

        let labelTemplate = dateAxis.renderer.labels.template;
        labelTemplate.verticalCenter = "middle";
        labelTemplate.fillOpacity = 0.7;
        labelTemplate.background.fill = interfaceColors.getFor("background");
        labelTemplate.background.fillOpacity = 1;
        labelTemplate.padding(7, 7, 7, 7);

        let series = chart.series.push(new am4plugins_timeline.CurveColumnSeries());
        series.columns.template.height = am4core.percent(15);
        series.columns.template.tooltipText = "{categoryX}: [bold]{openDateX}[/] - [bold]{dateX}[/]";

        series.dataFields.openDateX = "start";
        series.dataFields.dateX = "end";
        series.dataFields.categoryY = "task";
        series.columns.template.propertyFields.fill = "color"; // get color from data
        series.columns.template.propertyFields.stroke = "color";
        series.columns.template.strokeOpacity = 0;

        series.columns.template.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index * 3);
        })

        let flagBullet1 = new am4plugins_bullets.FlagBullet();
        series.bullets.push(flagBullet1);
        flagBullet1.disabled = true;
        flagBullet1.propertyFields.disabled = "bulletf1";
        flagBullet1.locationX = 1;
        flagBullet1.label.text = "start";

        let flagBullet2 = new am4plugins_bullets.FlagBullet();
        series.bullets.push(flagBullet2);
        flagBullet2.disabled = true;
        flagBullet2.propertyFields.disabled = "bulletf2";
        flagBullet2.locationX = 0;
        flagBullet2.background.fill = interfaceColors.getFor("background");
        flagBullet2.label.text = "end";

        let bullet = new am4charts.CircleBullet();
        series.bullets.push(bullet);
        bullet.circle.radius = 3;
        bullet.circle.strokeOpacity = 0;
        bullet.locationX = 0;

        bullet.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index * 3);
        })

        let bullet2 = new am4charts.CircleBullet();
        series.bullets.push(bullet2);
        bullet2.circle.radius = 3;
        bullet2.circle.strokeOpacity = 0;
        bullet2.propertyFields.fill = "color";
        bullet2.locationX = 1;

        bullet2.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index * 3);
        })

        let cursor = new am4plugins_timeline.CurveCursor();
        chart.cursor = cursor;
        cursor.xAxis = dateAxis;
        cursor.yAxis = categoryAxis;
        cursor.lineY.disabled = true;
        cursor.lineX.strokeDasharray = "1,4";
        cursor.lineX.strokeOpacity = 1;

        dateAxis.renderer.tooltipLocation2 = 0;
        categoryAxis.cursorTooltipEnabled = false;
        chart.responsive.enabled = true;
        return series;
    }

}