
import Highcharts from 'highcharts';

import { chartColors } from 'store/globalObject';

require ('highcharts/modules/exporting')(Highcharts);
require ('highcharts/modules/offline-exporting')(Highcharts);

Highcharts.setOptions({
  colors: chartColors
});


export function drawChart (divId, chart, data) {
  if (data === undefined || chart === undefined || divId === undefined)
    return;
  if (document.getElementById(divId) === undefined)
    return;

  let categories;
  const mapping = chart.options.mapping[0].reduce ((acc, cv) => Object.assign (acc, {[cv.value]: cv}), {});

  let chartData;
  if (chart.options.chartOptions.chart.type === 'pie') {
    const dataWithColor = data.chart_data.data.map ((data) => ({name: mapping[data[0]].label, y: data[1], color: mapping[data[0]].color}));
    categories = dataWithColor.map (d => d.name);
    chartData = {
      type: 'pie',
      name: 'Number of households',
      data: dataWithColor
    };
  } else if (data.chart_data.singleField) {
    const pointData = data.chart_data.data.map ((data) => ({name: mapping[data[0]].label, y: data[1]}));
    categories = pointData.map (d => d.name);
    chartData = {
      name: 'Number of households',
      data: pointData,
      color: chart.options.chartOptions.color
    };
  } else {
    // TODO - fix for multi-level charts
  }

  // Set chart options for Highcharts
  const chartType = chart.options.chartOptions.chart.type;
  const chartOptions = {
    ...chart.options.chartOptions,
    xAxis: {
      categories: categories,
      title: { text: null  }
    },
    yAxis: {
      title: { text: '' }
    },
    plotOptions: {
      [chartType]:  {
        size: (50 * chart.width >150 && divId !== 'pm-chart-preview') ? 50 * chart.width : 140,
        showInLegend: true,
        dataLabels:{
          enabled: false,
          format: chartType === 'pie' ? '{point.name}: {point.percentage:.1f} %' : '',
          style: {
            width: '100px'
          }
        }
      }
    },
    exporting: { enabled: false },
    series: [chartData]
  };

  divId = divId || `chart${chart.id}`;
  Highcharts.chart(divId, chartOptions);
  }


export default Highcharts;
