import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from '@amcharts/amcharts4/core';

export class ChartPie {

    generateSeries(chart: am4charts.PieChart) {
        // Add and configure Series
        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "numEventos";
        pieSeries.dataFields.category = "sensor";

        pieSeries.slices.template.adapter.add("fill", function (fill, target) {
            const item = target.dataItem.dataContext as any;
            return am4core.color(item.color);
        });

        // Let's cut a hole in our Pie chart the size of 30% the radius
        chart.innerRadius = am4core.percent(30);
        chart.responsive.enabled = true;
        // Put a thick white border around each Slice
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;
        pieSeries.slices.template
            // change the cursor on hover to make it apparent the object can be interacted with
            .cursorOverStyle = [
                {
                    "property": "cursor",
                    "value": "pointer"
                }
            ];

        pieSeries.legendSettings.valueText = "{numEventos}";
        /*pieSeries.alignLabels = false;
        pieSeries.labels.template.bent = false;
        pieSeries.labels.template.radius = 1;
        pieSeries.labels.template.padding(0, 0, 0, 1);*/
        pieSeries.ticks.template.disabled = true;
        pieSeries.labels.template.disabled = true;
        pieSeries.ticks.template.disabled = true;

        // Create a base filter effect (as if it's not there) for the hover to return to
        let shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
        shadow.opacity = 0;

        // Create hover state
        let hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists

        // Slightly shift the shadow and make it more prominent on hover
        let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
        hoverShadow.opacity = 0.7;
        hoverShadow.blur = 5;

        return pieSeries;
    }
}