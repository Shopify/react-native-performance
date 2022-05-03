import React, { useState, useEffect } from "react";
import {
  PluginClient,
  usePlugin,
  createState,
  useValue,
  Layout,
  styled,
} from "flipper-plugin";
import { Button } from "antd";

import ListTTIChart, { ListTTIData } from "./ListTTIChart";
import BlankAreaChart, { BlankData } from "./BlankAreaChart";

interface Events {
  newBlankData: BlankData;
  newListTTIData: ListTTIData;
}

// Read more: https://fbflipper.com/docs/tutorial/js-custom#creating-a-first-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
export const plugin = (client: PluginClient<Events>) => {
  const blankData = createState<Map<string, BlankData[]>>(new Map(), {
    persist: "newBlankData",
  });
  const listTTIData = createState<Map<string, ListTTIData[]>>(new Map(), {
    persist: "newListTTIData",
  });

  client.onMessage("newBlankData", (newData) => {
    blankData.update((currentData) => {
      const currentListData = currentData.get(newData.listName) ?? [];
      currentData.set(newData.listName, [...currentListData, newData]);
    });
  });

  client.onMessage("newListTTIData", (newListTTIData) => {
    listTTIData.update((currentData) => {
      const currentListData = currentData.get(newListTTIData.listName) ?? [];
      currentData.set(newListTTIData.listName, [
        ...currentListData,
        newListTTIData,
      ]);
    });
  });

  return { blankData, listTTIData };
};

const randomColor = () => {
  let color = "#";
  for (let i = 0; i < 6; i++) {
    const random = Math.random();
    const bit = (random * 16) | 0;
    color += bit.toString(16);
  }
  return color;
};

// Read more: https://fbflipper.com/docs/tutorial/js-custom#building-a-user-interface-for-the-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
export const Component = () => {
  const instance = usePlugin(plugin);
  const [colors, setColors] = useState<Map<string, string>>(new Map());
  const listTTIData = useValue(instance.listTTIData);
  const listNames = Array.from(listTTIData.keys());
  listNames.forEach((listNames) => {
    if (colors.has(listNames)) {
      return;
    }
    setColors(colors.set(listNames, randomColor()));
  });
  const blankData = useValue(instance.blankData);
  return (
    <>
      <Layout.ScrollContainer>
        <BlankAreaChart colors={colors} blankData={blankData} />
        <ListTTIChart listColors={colors} listTTIData={listTTIData} />
      </Layout.ScrollContainer>
      <div style={{ display: "inline-block", margin: "auto" }}>
        <Button
          style={{ marginBottom: "10px" }}
          onClick={() => {
            instance.blankData.set(new Map());
            instance.listTTIData.set(new Map());
          }}
        >
          Reset data
        </Button>
      </div>
    </>
  );
};
