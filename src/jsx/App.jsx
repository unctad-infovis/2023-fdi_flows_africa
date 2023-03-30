import React, { useState, useEffect } from 'react';

// Load helpers.
import CSVtoJSON from './helpers/CSVtoJSON.js';
import ChartLine from './components/ChartTileMap.jsx';

import '../styles/styles.less';

function Figure1() {
  // Data states.
  const [dataFigure, setDataFigure] = useState(false);

  const cleanData = (data) => data.map((el) => {
    el.value = (el.value === 'null') ? -999 : parseFloat(el.value);
    el.x = parseInt(el.x, 10);
    el.y = parseInt(el.y, 10);
    return el;
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
        .then(body => setDataFigure(cleanData(CSVtoJSON(body))));
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
        note="Data for Libya and Ivory Coast is missing"
        source="UNCTAD"
        subtitle="Foreign direct investments in Africa, billion USD, 2021"
        title="Investments in Africa remain low in most countries"
      />
      )}
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default Figure1;
