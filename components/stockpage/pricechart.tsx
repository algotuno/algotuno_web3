import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import Layout from "../layout";
//import styles from '../styles/Home.module.css';
import styles from "../styles/stockpage.module.css";
import React, { Component, useState } from "react";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

function MyChart(props) {
  let statusA: boolean = false;
  let pDataA, dateList2, closePrice2;
  let pDataB, dateList3, closePrice3;

  const stockList = props.xyDataList.results;
  const dateList = stockList.map((e) => e.Date);
  const closePrice = stockList.map((e) =>
    parseFloat(parseFloat(e.Close).toFixed(2))
  );

  const resA = props.pDataListA;
  const resB = props.pDataListB;
  if ("results" in resA) {
    if ("results" in resB) {
      statusA = true;

      pDataA = props.pDataListA.results;
      dateList2 = pDataA.map((e) => e.Date);
      closePrice2 = pDataA.map((e) =>
        parseFloat(parseFloat(e.Price).toFixed(2))
      );

      pDataB = props.pDataListB.results;
      dateList3 = pDataB.map((e) => e.Date);
      closePrice3 = pDataB.map((e) =>
        parseFloat(parseFloat(e.Price).toFixed(2))
      );
    }
  } else {
    console.log("[ERROR] fetching ML prediction data");
    statusA = false;
  }
  const ticker = props.tickerName;

  //trace 1 is the stock data
  const trace1 = {
    x: dateList,
    y: closePrice,
    type: "scatter",
    mode: "lines+markers",
    marker: { color: "blue" },
    name: "Actual",
  };

  //trace 2 will be prediction data
  const trace2 = {
    x: dateList2,
    y: closePrice2,
    type: "scatter",
    mode: "lines+markers",
    marker: { color: "orange" },
    name: "Model A",
  };

  const trace3 = {
    x: dateList3,
    y: closePrice3,
    type: "scatter",
    mode: "lines+markers",
    marker: { color: "green" },
    name: "Model B",
  };

  var selectorOptions = {
    buttons: [
      {
        step: "day",
        stepmode: "backward",
        count: 7,
        label: "7d",
      },
      {
        step: "month",
        stepmode: "backward",
        count: 1,
        label: "1m",
      },
      {
        step: "month",
        stepmode: "backward",
        count: 6,
        label: "6m",
      },
      {
        step: "year",
        stepmode: "todate",
        count: 1,
        label: "YTD",
      },
      {
        step: "year",
        stepmode: "backward",
        count: 1,
        label: "1y",
      },
      {
        step: "all",
      },
    ],
  };

  //properties of the chart component
  const layouts = {
    autosize: true,
    width: 800,
    height: 600,
    yaxis: { title: "Price", fixedrange: true },
    xaxis: {
      title: "Date",
      range: ["2022-02-01", "2022-10-01"],
      rangeselector: selectorOptions,
    },
    //dragmode:"pan"
  };
  return (
    <div>
      {/*// @ts-ignore*/}
      {statusA ? (
        <div>
          <Plot
            // @ts-ignore
            data={[trace1, trace2, trace3]}
            // @ts-ignore
            layout={layouts}
            // @ts-ignore
            //frames={this.state.frames}
          />
        </div>
      ) : (
        <div>
          <Plot
            // @ts-ignore
            data={[trace1]}
            // @ts-ignore
            layout={layouts}
            // @ts-ignore
            //frames={this.state.frames}
          />
        </div>
      )}
    </div>
  );
}

export default MyChart;
