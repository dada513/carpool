import React from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {vw, vh} from '../utils/constants';
import LocationsListItem from './LocationsListItem';
import colors from '../styles/colors';
import sheet from '../styles/sheet';

const LocationsFlatList = ({data, loading, isEmpty}) => {
  return (
    <FlatList
      style={{
        width: '100%',
      }}
      contentContainerStyle={{
        paddingHorizontal: 8 * vw,
        paddingTop: 2 * vh,
      }}
      data={data}
      keyExtractor={item => item.id}
      renderItem={({item}) => <LocationsListItem item={item} />}
      refreshControl={
        <RefreshControl
          colors={colors.green}
          tintColor={colors.green}
          refreshing={loading}
        />
      }
      ListEmptyComponent={
        isEmpty ? (
          <View
            style={{
              width: '100%',
              height: 12 * vh,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...sheet.textSemiBold,
                fontSize: 5 * vw,
                color: colors.blue,
              }}>
              No places found
            </Text>
          </View>
        ) : null
      }
    />
  );
};

export default LocationsFlatList;
