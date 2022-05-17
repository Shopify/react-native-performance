import React, {useCallback, useState} from 'react';
import gql from 'graphql-tag';
import {ReactNavigationPerformanceView} from '@shopify/react-native-performance-navigation';
import {Text} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useApolloClient} from '@apollo/client';

import {NavigationKeys} from '../constants';

const AllRickAndMortyCharacters = gql`
  query AllRickAndMortyCharacters {
    characters {
      results {
        name
      }
    }
  }
`;

type QueryState = 'loading' | 'cache' | 'network';

function useRickAndMortyData() {
  const client = useApolloClient();

  const [{response, queryState}, setQueryState] = useState<{
    response?: {[key: string]: unknown};
    queryState: QueryState;
  }>({queryState: 'loading'});

  const doQuery = useCallback(async () => {
    try {
      const cacheResponse = await client.query({
        query: AllRickAndMortyCharacters,
        fetchPolicy: 'cache-only',
      });
      if (cacheResponse.data.characters !== undefined) {
        setQueryState({response: cacheResponse.data, queryState: 'cache'});
      }
    } catch (error) {
      // cache-miss. no-op
    }

    const networkResponse = await client.query({
      query: AllRickAndMortyCharacters,
      fetchPolicy: 'network-only',
    });
    setQueryState({response: networkResponse.data, queryState: 'network'});
  }, [client]);

  return {
    doQuery,
    response,
    queryState,
  };
}

const FastRenderPassesScreen = () => {
  const {queryState, doQuery} = useRickAndMortyData();

  const interactive = queryState !== 'loading';
  const renderPassName = queryState;

  useFocusEffect(
    useCallback(() => {
      doQuery();
    }, [doQuery]),
  );

  return (
    <ReactNavigationPerformanceView
      screenName={NavigationKeys.FAST_RENDER_PASSES_SCREEN}
      interactive={interactive}
      renderPassName={renderPassName}
    >
      <Text>{renderPassName}</Text>
    </ReactNavigationPerformanceView>
  );
};

export default FastRenderPassesScreen;
