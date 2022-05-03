import { useState } from "react";

import { State } from "../state-machine/states";

import useProfilerStateChangeListener from "./useProfilerStateChangeListener";

interface Props {
  destinationScreen?: RegExp | string;
}

export default function useProfilerState({ destinationScreen }: Props) {
  const [state, setState] = useState<State | undefined>(undefined);
  useProfilerStateChangeListener({
    destinationScreen,
    onStateChanged: setState,
  });
  return state;
}
