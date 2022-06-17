import React, {useCallback, useEffect, useState, useMemo} from 'react';
import {
  StatusBar,
  SafeAreaView,
  StyleSheet,
  Text,
  ActivityIndicator,
  Button,
  NativeSyntheticEvent,
  NativeTouchEvent,
} from 'react-native';
import {RenderStateProps, useResetFlow, GestureResponderEvent} from '@shopify/react-native-performance';
import {ReactNavigationPerformanceView, useProfiledNavigation} from '@shopify/react-native-performance-navigation';
import gql from 'graphql-tag';
import {ScrollView} from 'react-native-gesture-handler';
import {useQuery} from '@apollo/client';

import {NavigationKeys} from '../constants';

import useSimulatedSlowOperation from './useSimulatedSlowOperation';
import useCountdownTimer from './useCountdownTimer';

const RENDER_DELAY_SECONDS = 5;

const AllRickAndMortyCharacters = gql`
  query AllRickAndMortyCharacters {
    characters {
      results {
        name
      }
    }
  }
`;

const PerformanceScreen = () => {
  const navigation = useProfiledNavigation();
  const [simulatedSlowData, setSimulatedSlowData] = useState<string>();
  const [secondsLeft, restartTimer] = useCountdownTimer({
    durationSeconds: RENDER_DELAY_SECONDS,
  });
  const simulatedSlowOperation = useSimulatedSlowOperation({
    delaySeconds: RENDER_DELAY_SECONDS,
    result: '<some simulated slow API result>',
  });
  const rickAndMortyQueryResult = useQuery(AllRickAndMortyCharacters);

  const {resetFlow, componentInstanceId} = useResetFlow();

  useEffect(() => {
    (async () => {
      const data = await simulatedSlowOperation();
      setSimulatedSlowData(data);
    })();
  }, [simulatedSlowOperation]);

  const rendered = rickAndMortyQueryResult.data !== undefined && simulatedSlowData !== undefined;

  const goHome = useCallback(
    (uiEvent: GestureResponderEvent) => {
      navigation.navigate({uiEvent}, {name: NavigationKeys.EXAMPLES, params: {}});
    },
    [navigation],
  );

  const RenderedBody = useMemo(() => {
    return (
      <ScrollView>
        <Text style={styles.helperText}>Rendered: {JSON.stringify({simulatedSlowData})}</Text>
        <Text style={styles.helperText}>
          All Rick and Morty characters: {JSON.stringify(rickAndMortyQueryResult.data)}
        </Text>
      </ScrollView>
    );
  }, [simulatedSlowData, rickAndMortyQueryResult]);

  const WaitingBody = useMemo(() => {
    return (
      <>
        <ActivityIndicator />
        <Text style={styles.helperText}>Rendering in: {secondsLeft} seconds.</Text>
      </>
    );
  }, [secondsLeft]);

  let renderStateProps: RenderStateProps;
  if (rendered) {
    renderStateProps = {
      interactive: true,
    };
  } else {
    renderStateProps = {
      interactive: false,
      renderPassName: `loading_${RENDER_DELAY_SECONDS - secondsLeft}`,
    };
  }

  const onFakePullToRefresh = useCallback(
    async (uiEvent: NativeSyntheticEvent<NativeTouchEvent>) => {
      resetFlow({uiEvent, destination: NavigationKeys.PERFORMANCE, renderTimeoutMillisOverride: 6 * 1000});
      restartTimer();
      setSimulatedSlowData(undefined);
      rickAndMortyQueryResult.refetch();
      const data = await simulatedSlowOperation();
      setSimulatedSlowData(data);
    },
    [resetFlow, restartTimer, rickAndMortyQueryResult, simulatedSlowOperation],
  );

  return (
    <ReactNavigationPerformanceView
      screenName={NavigationKeys.PERFORMANCE}
      {...renderStateProps}
      componentInstanceId={componentInstanceId}
    >
      <Button onPress={onFakePullToRefresh} title="Simulate Pull-to-refresh" />
      <Button title="Go to home" onPress={goHome} />
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>{rendered ? RenderedBody : WaitingBody}</SafeAreaView>
    </ReactNavigationPerformanceView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: 64,
  },
  helperText: {
    margin: 16,
    textAlign: 'center',
  },
});

export default PerformanceScreen;
