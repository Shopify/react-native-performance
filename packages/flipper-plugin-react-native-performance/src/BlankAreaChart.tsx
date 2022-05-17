import React from 'react';
import {BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line} from 'recharts';

import Header from './Header';

export interface BlankData {
  listName: string;
  offset: number;
}

interface BlankAreaChartProps {
  colors: Map<string, string>;
  blankData: Map<string, BlankData[]>;
}

const BlankAreaChart = ({colors, blankData}: BlankAreaChartProps) => {
  const listNames = Array.from(blankData.keys());

  const averageData: any = Array.from(blankData.keys()).map(listName => {
    const listBlankData = blankData.get(listName) ?? [];
    const sum: number = listBlankData.reduce((sum, {offset}) => {
      return sum + offset;
    }, 0);
    const average: any = {listName};
    average[listName] = sum / listBlankData.length;
    return average;
  });

  return (
    <>
      <Header>Blank Spaces</Header>
      <LineChart width={730} height={250}>
        <XAxis dataKey="screenName" />
        <YAxis
          tickFormatter={millis => {
            return `${millis} px`;
          }}
        />
        <Tooltip />
        {listNames.map(listName => {
          return (
            <Line
              key={listName}
              name={listName}
              type="monotone"
              dataKey="offset"
              stroke={colors.get(listName)}
              data={blankData.get(listName)}
              // Removing dot
              dot={<></>}
            />
          );
        })}
      </LineChart>
      <Header>Blank Space Averages</Header>
      <BarChart width={400} height={400} data={averageData}>
        <XAxis dataKey="listName" />
        <YAxis
          tickFormatter={millis => {
            return `${millis} px`;
          }}
        />
        <Tooltip />
        {listNames.map(listName => {
          return <Bar dataKey={listName} key={listName} stackId="a" fill={colors.get(listName)} />;
        })}
      </BarChart>
    </>
  );
};

export default BlankAreaChart;
