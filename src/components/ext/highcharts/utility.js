
export function getChartOptions (chart, data, config={}) {
  if (data === undefined || chart === undefined)
    return;

  let chartData;
  let categories;

  if (chart.options.chartOptions.chart.type === 'pie') {
    const mapping = chart.options.mapping[0].reduce ((acc, cv) => Object.assign (acc, {[cv.value]: cv}), {});
    const dataWithColor = data.chart_data.data.map ((data) => ({
      name: mapping[data[0]] ? mapping[data[0]].label : '',
      y: data[1],
      color: mapping[data[0]] ? mapping[data[0]].color : 'black'
    }));
    categories = dataWithColor.map (d => d.name);
    chartData = [{
      type: 'pie',
      name: 'Number of households',
      data: dataWithColor
    }];
  } else if (data.chart_data.singleField) {
    const mapping = chart.options.mapping[0].reduce ((acc, cv) => Object.assign (acc, {[cv.value]: cv}), {});
    const pointData = data.chart_data.data.map ((data) => ({
      name: mapping[data[0]] ? mapping[data[0]].label : '',
      y: data[1]
    }));
    categories = pointData.map (d => d.name);
    chartData = [{
      name: 'Number of households',
      data: pointData,
      color: chart.options.chartOptions.color
    }];
  } else {
    categories = data.chart_data.categories;
    chartData = data.chart_data.data;
  }

  const exporting = !config.exporting ?
    { enabled: false } :
    {
      enabled: true,
      buttons: {
        contextButton: {
          symbol: 'menu',
          theme: { 'stroke-width': 0 },
          menuItems: [
            {
              text: '<i class="material-icons">file_download</i>Download',
              onclick: function () {
                 this.exportChart()
              }
            }, {
              text: '<i class="material-icons">mode_edit</i> Edit',
              onclick: () => config.edit(chart.id),
              separator: false
            }, {
              text: '<i class="material-icons">delete_forever</i> Remove',
              onclick: () => config.remove(chart.id, chart.title),
              separator: false
            }
          ]
        }
      }
    };

  const chartType = chart.options.chartOptions.chart.type;

  // Set width and height of chart
  const height = config.height || 300;
  const width = config.fullWidth ? (config.width * window.screen.width / 12 ) : 300;
  chart.options.chartOptions.chart.height = height;
  if (!config.fullWidth)
    chart.options.chartOptions.chart.width = 300;

  const xOffset = config.width * 10 + 70;
  const labelLength = config.width * 5;
  // Set chart options for Highcharts
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
        showInLegend: true,
        center: [width / 2 - xOffset, height / 2 - 50],
        size: Math.min(width, height) - 50,
        dataLabels:{
          enabled: false,
          format: chartType === 'pie' ? '{point.name}: {point.percentage:.1f} %' : '',
        }
      }
    },
    exporting,
    series: chartData
  };
  if (chartType === 'pie') {
    chartOptions.legend = {
        layout: 'vertical',
        align: 'right',
        useHtml: true,
        labelFormatter: function () {
          return `<div title=${this.name}>${this.name.slice(0, labelLength)}</div>`
        }
      };
  }

  return chartOptions;
}

export function getOptionFromState(chart, data, config={}) {
  if (data === undefined || chart === undefined)
    return;

  let chartData;
  let categories;

  if (chart.type === 'pie') {
    const mapping = chart.surveyFieldValues[0].reduce ((acc, cv) => Object.assign (acc, {[cv.value]: cv}), {});
    const dataWithColor = data.data.map ((data) => ({
      name: mapping[data[0]] ? mapping[data[0]].label : '',
      y: data[1],
      color: mapping[data[0]] ? mapping[data[0]].color : 'black'
    }));
    categories = dataWithColor.map (d => d.name);
    chartData = [{
      type: 'pie',
      name: 'Number of households',
      data: dataWithColor
    }];
  } else if (data.singleField) {
    const mapping = chart.surveyFieldValues[0].reduce ((acc, cv) => Object.assign (acc, {[cv.value]: cv}), {});
    const pointData = data.data.map ((data) => ({
      name: mapping[data[0]] ? mapping[data[0]].label : '',
      y: data[1]
    }));
    categories = pointData.map (d => d.name);
    chartData = [{
      name: 'Number of households',
      data: pointData,
      color: chart.color
    }];
  } else {
    categories = data.categories;
    chartData = data.data;
  }

  const exporting = !config.exporting ?
    { enabled: false } :
    {
      enabled: true,
      buttons: {
        contextButton: {
          symbol: 'menu',
          theme: { 'stroke-width': 0 },
          menuItems: [
            {
              text: '<i class="material-icons">file_download</i>Download',
              onclick: function () {
                 this.exportChart()
              }
            }, {
              text: '<i class="material-icons">mode_edit</i> Edit',
              onclick: () => config.edit(chart.id),
              separator: false
            }, {
              text: '<i class="material-icons">delete_forever</i> Remove',
              onclick: () => config.remove(chart.id, chart.title),
              separator: false
            }
          ]
        }
      }
    };

  // Set chart options for Highcharts
  const chartOptions = {
    chart: { type: chart.type },
    legend: { enable: false },
    color: chart.color,
    subtitle: { text: chart.subtitle },
    title: { text: chart.title },
    xAxis: { categories: categories, title: { text: null  } },
    yAxis: { title: { text: '' } },
    plotOptions: {
      [chart.type]:  {
        showInLegend: true,
        dataLabels:{
          enabled: false,
          format: chart.type === 'pie' ? '{point.name}: {point.percentage:.1f} %' : '',
        }
      }
    },
    exporting,
    series: chartData
  };

  return chartOptions;
}
