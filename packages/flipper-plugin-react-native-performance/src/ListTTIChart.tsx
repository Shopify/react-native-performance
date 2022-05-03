import React, { useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

import Header from "./Header";

interface ListTTIChartProps {
  listColors: Map<string, string>;
  listTTIData: Map<string, ListTTIData[]>;
}

export interface ListTTIData {
  listName: string;
  TTI: number;
}

const ListTTIChart = ({ listColors, listTTIData }: ListTTIChartProps) => {
  const listNames = Array.from(listTTIData.keys());

  const averageData: any = listNames.map((listName) => {
    const ttiData = listTTIData.get(listName) ?? [];
    const sum: number = ttiData.reduce((sum, { TTI }) => {
      return sum + TTI;
    }, 0);
    const average: any = { listName };
    average[listName] = sum / ttiData.length;
    return average;
  });

  const ttiMetricData = Array.from(listTTIData.values()).flat();
  return (
    <>
      <Header>TTI Metric Averages</Header>
      <BarChart width={400} height={400} data={averageData}>
        <XAxis dataKey="listName" />
        <YAxis
          tickFormatter={(millis) => {
            return `${millis} ms`;
          }}
        />
        <Tooltip />
        {listNames.map((listName) => {
          return (
            <Bar
              dataKey={listName}
              key={listName}
              stackId="a"
              fill={listColors.get(listName)}
            />
          );
        })}
      </BarChart>
      <Header>TTI Metric</Header>
      <BarChart width={400} height={400} data={ttiMetricData}>
        <XAxis dataKey="listName" />
        <YAxis
          tickFormatter={(millis) => {
            return `${millis} ms`;
          }}
        />
        <Tooltip />
        <Bar dataKey="TTI">
          {ttiMetricData.map((data) => {
            return (
              <Cell key={data.listName} fill={listColors.get(data.listName)} />
            );
          })}
        </Bar>
      </BarChart>
    </>
  );
};

export default ListTTIChart;
