import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

export class ChartDonut {


    generateChartData(data, chartDiv: string) {
        let chart = am4core.create(chartDiv, am4charts.PieChart);
        chart.data = data;
        chart.responsive.enabled = true;

        chart.legend = new am4charts.Legend();
        chart.legend.valign = "bottom";
        chart.legend.labels.template.maxWidth = 120;
        chart.legend.labels.template.wrap = true;
        chart.legend.labels.template.text = "{name}";
        chart.legend.labels.template.wrap = true;
        let markerTemplate = chart.legend.markers.template;
        markerTemplate.width = 15;
        markerTemplate.height = 15;

        return chart;
    }

    generateSerie(chart: am4charts.PieChart){
        
        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "numEventos";
        pieSeries.dataFields.category = "sensor";
        pieSeries.innerRadius = am4core.percent(50);
        pieSeries.ticks.template.disabled = true;
        pieSeries.labels.template.disabled = true;

        pieSeries.slices.template.adapter.add("fill", function (fill, target) {
            if(!target.dataItem){
                return am4core.color("FFFFFF");
            }
            const item = target.dataItem.dataContext as any;
            return am4core.color(item.color);
        });

        let rgm = new am4core.RadialGradientModifier();
        rgm.brightnesses.push(-0.8, -0.8, -0.5, 0, - 0.5);
        pieSeries.slices.template.fillModifier = rgm;
        pieSeries.slices.template.strokeModifier = rgm;
        pieSeries.slices.template.strokeOpacity = 0.4;
        pieSeries.slices.template.strokeWidth = 0;
        pieSeries.legendSettings.valueText = "{numEventos}";
    }
}