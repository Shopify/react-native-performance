import {useRef} from 'react';

import {inMemoryCounter} from '../utils';

export default function useComponentInstanceId() {
  const componentInstanceId = useRef(inMemoryCounter()).current;
  return componentInstanceId;
}
