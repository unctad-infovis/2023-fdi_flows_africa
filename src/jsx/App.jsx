import React, { useState, useEffect } from 'react';

// Load helpers.
import { transpose } from 'csv-transpose';
import CSVtoJSON from './helpers/CSVtoJSON.js';
import ChartLine from './components/ChartTileMap.jsx';

import '../styles/styles.less';

function Figure1() {
  // Data states.
  const [dataFigure, setDataFigure] = useState(false);

  const cleanData = (data) => data.map((el, i) => {
    const labels = Object.keys(el).filter(val => val !== 'Name').map(val => val);
    const values = Object.values(el).map(val => parseFloat(val) * 100).filter(val => !Number.isNaN(val));
    return ({
      data: values.map((val, j) => ({
        dataLabels: {
          y: (i === 0) ? -10 : 30
        },
        name: labels[j],
        y: val
      })),
      labels,
      name: el.Name
    });
  });

  useEffect(() => {
    const data_file = `${(window.location.href.includes('unctad.org')) ? 'https://storage.unctad.org/2023-fdi_flows_africa/' : './'}assets/data/2023-fdi_flows_africa_data.csv`;
    try {
      fetch(data_file)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.text();
        })
        .then(body => setDataFigure(cleanData(CSVtoJSON(transpose(body)))));
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div className="app">
      {dataFigure && (
      <ChartLine
        idx="1"
        data={dataFigure}
        note=""
        show_first_label
        source=""
        subtitle=""
        suffix=""
        title=""
        ylabel=""
      />
      )}
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default Figure1;
