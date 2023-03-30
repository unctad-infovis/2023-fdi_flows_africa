import React, { useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

// https://www.highcharts.com/
import Highcharts from 'highcharts/highmaps';
import highchartsAccessibility from 'highcharts/modules/accessibility';
import highchartsExporting from 'highcharts/modules/exporting';
import highchartsExportData from 'highcharts/modules/export-data';
import highchartsTileMap from 'highcharts/modules/tilemap';

// https://www.npmjs.com/package/react-is-visible
import 'intersection-observer';
import { useIsVisible } from 'react-is-visible';

import roundNr from '../helpers/RoundNr.js';

highchartsAccessibility(Highcharts);
highchartsExporting(Highcharts);
highchartsExportData(Highcharts);
highchartsTileMap(Highcharts);

Highcharts.setOptions({
  lang: {
    decimalPoint: '.',
    downloadCSV: 'Download CSV data',
    thousandsSep: ','
  }
});
Highcharts.SVGRenderer.prototype.symbols.download = (x, y, w, h) => {
  const path = [
    // Arrow stem
    'M', x + w * 0.5, y,
    'L', x + w * 0.5, y + h * 0.7,
    // Arrow head
    'M', x + w * 0.3, y + h * 0.5,
    'L', x + w * 0.5, y + h * 0.7,
    'L', x + w * 0.7, y + h * 0.5,
    // Box
    'M', x, y + h * 0.9,
    'L', x, y + h,
    'L', x + w, y + h,
    'L', x + w, y + h * 0.9
  ];
  return path;
};

function LineChart({
  data, idx, note, source, subtitle, title
}) {
  const chartRef = useRef();
  const isVisible = useIsVisible(chartRef, { once: true });

  const createChart = useCallback(() => {
    Highcharts.chart(`chartIdx${idx}`, {
      caption: {
        align: 'left',
        margin: 15,
        style: {
          color: 'rgba(0, 0, 0, 0.8)',
          fontFamily: 'Roboto',
          fontSize: '14px'
        },
        text: `<em>Source:</em> ${source} <br /><em>Note:</em> <span>${note}</span>`,
        verticalAlign: 'bottom',
        useHTML: true,
        x: 0
      },
      chart: {
        events: {
          load() {
            // eslint-disable-next-line react/no-this-in-sfc
            this.renderer.image('https://unctad.org/sites/default/files/2022-11/unctad_logo.svg', 20, 15, 80, 100).add();
          }
        },
        height: '125%',
        resetZoomButton: {
          theme: {
            fill: '#fff',
            r: 0,
            states: {
              hover: {
                fill: '#0077b8',
                stroke: 'transparent',
                style: {
                  color: '#fff',
                  fontFamily: 'Roboto',
                }
              }
            },
            stroke: '#7c7067',
            style: {
              fontFamily: 'Roboto',
              fontSize: '13px',
              fontWeight: 400
            }
          }
        },
        style: {
          color: 'rgba(0, 0, 0, 0.8)',
          fontFamily: 'Roboto',
          fontWeight: 400
        },
        type: 'tilemap'
      },
      colorAxis: {
        dataClasses: [{
          to: -900,
          color: '#fff',
          name: 'Unknown'
        }, {
          from: -900,
          to: 0.5,
          color: '#9c9e9f',
          name: 'Below $0.5 bn'
        }, {
          from: 0.5,
          to: 1,
          color: '#fabc72',
          name: '$0.5 to 1.0 bn'
        }, {
          from: 1,
          to: 2,
          color: '#f18e00',
          name: '$1.0 to $1.9 bn'
        }, {
          from: 2,
          to: 3,
          color: '#6dbfa9',
          name: '$2.0 to $2.9 bn'
        }, {
          from: 3,
          color: '#009473',
          name: 'Above $3.0 bn'
        }]
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: ['viewFullscreen', 'separator', 'downloadPNG', 'downloadPDF', 'separator', 'downloadCSV'],
            symbol: 'download',
            symbolFill: '#000'
          }
        }
      },
      legend: {
        align: 'left',
        enabled: true,
        floating: true,
        itemStyle: {
          color: '#000',
          cursor: 'default',
          fontFamily: 'Roboto',
          fontSize: '14px',
          fontWeight: 400
        },
        layout: 'vertical',
        reversed: true,
        title: {
          style: {
            color: '#000',
            cursor: 'default',
            fontFamily: 'Roboto',
            fontSize: '14px',
            fontWeight: 600
          },
          text: 'Foreign direct investment<br />in Africa, million USD'
        },
        y: -90
      },
      plotOptions: {
        series: {
          animation: {
            duration: 3000
          },
          cursor: 'pointer',

          dataLabels: {
            allowOverlap: true,
            enabled: true,
            format: '{point.iso-a3}',
            style: {
              color: 'rgba(0, 0, 0, 0.8)',
              fontFamily: 'Roboto',
              fontSize: '16px',
              fontWeight: 400,
              textOutline: 'none'
            }
          },
          events: {
            legendItemClick() {
              return false;
            },
            mouseOver() {
              return false;
            }
          },
          states: {
            hover: {
              halo: {
                size: 1
              }
            }
          },
          // Possible values are hexagon, circle, diamond, and square.
          tileShape: 'circle'
        }
      },
      responsive: {
        rules: [{
          chartOptions: {
            chart: {
              height: '150%'
            },
            plotOptions: {
              series: {
                dataLabels: {
                  style: {
                    fontSize: '14px'
                  }
                }
              }
            }
          },
          condition: {
            maxWidth: 600
          }
        }, {
          chartOptions: {
            chart: {
              height: '175%'
            },
            legend: {
              layout: 'horizontal'
            },
            plotOptions: {
              series: {
                dataLabels: {
                  style: {
                    fontSize: '12px'
                  }
                }
              }
            },
            title: {
              margin: 0,
              style: {
                fontSize: '26px',
                lineHeight: '30px'
              }
            }
          },
          condition: {
            maxWidth: 500
          }
        }, {
          chartOptions: {
            chart: {
              height: 700
            },
            plotOptions: {
              series: {
                dataLabels: {
                  style: {
                    fontSize: '10px'
                  }
                }
              }
            },
            title: {
              margin: 0
            },
          },
          condition: {
            maxWidth: 400
          }
        }]
      },
      series: [{
        data
      }],
      subtitle: {
        align: 'left',
        enabled: true,
        style: {
          color: 'rgba(0, 0, 0, 0.8)',
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '18px'
        },
        text: subtitle,
        widthAdjust: -100,
        x: 100
      },
      xAxis: {
        visible: false
      },
      yAxis: {
        visible: false
      },
      title: {
        align: 'left',
        margin: 0,
        style: {
          color: '#000',
          fontSize: '30px',
          fontWeight: 700,
          lineHeight: '34px'
        },
        text: title,
        widthAdjust: -160,
        x: 100
      },
      tooltip: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderRadius: 0,
        borderWidth: 1,
        pointFormat: '{point.name}: <strong>{point.value}</strong>',
        formatter() {
          // eslint-disable-next-line react/no-this-in-sfc
          return `<div class="tooltip_container"><h3 class="tooltip_header">${this.key}</h3><div><span class="tooltip_label"></span><span class="tooltip_value">${(this.point.value !== -999) ? `${roundNr(this.point.value, 1).toFixed(1).toLocaleString('en-US')} billion USD` : 'Unknown'}</span></div></div>`;
        },
        shadow: false,
        shared: true,
        useHTML: true
      }
    });
    chartRef.current.querySelector(`#chartIdx${idx}`).style.opacity = 1;
  }, [data, idx, note, source, subtitle, title]);

  useEffect(() => {
    if (isVisible === true) {
      setTimeout(() => {
        createChart();
      }, 300);
    }
  }, [createChart, isVisible]);

  return (
    <div className="chart_container">
      <div ref={chartRef}>
        {(isVisible) && (<div className="chart" id={`chartIdx${idx}`} />)}
      </div>
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

LineChart.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  idx: PropTypes.string.isRequired,
  note: PropTypes.string,
  source: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
};

LineChart.defaultProps = {
  note: '',
  subtitle: false,
};

export default LineChart;
