import React from 'react';
import {RefreshControl, FlatList} from 'react-native';
import {colors} from '../../styles';
import {ListEmptyComponent} from '../common/lists';
import {CurrentLocationListItem, LocationsListItem} from '../Locations';

const StartLocationsFlatList = ({
  data,
  loading,
  onItemPress,
  onCurrentClick,
}) => {
  return (
    <FlatList
      keyboardShouldPersistTaps="always"
      style={{
        width: '100%',
      }}
      contentContainerStyle={{
        paddingHorizontal: 32,
        paddingTop: 18,
      }}
      data={data}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <LocationsListItem item={item} onPress={() => onItemPress(item)} />
      )}
      refreshControl={
        <RefreshControl
          colors={[colors.green]}
          tintColor={colors.green}
          refreshing={loading}
        />
      }
      ListHeaderComponent={
        !data.length &&
        !loading && <CurrentLocationListItem onPress={onCurrentClick} />
      }
      ListEmptyComponent={
        <ListEmptyComponent title="No locations found" onRefresh={() => null} />
      }
    />
  );
};

export default StartLocationsFlatList;
