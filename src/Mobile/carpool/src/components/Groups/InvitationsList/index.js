import React from 'react';
import {FlatList, RefreshControl} from 'react-native';
import colors from '../../../styles/colors';
import {ListEmptyComponent} from '../../common/lists';
import {styles} from './index.styles';
import ListItem from './ListItem';

const InvitationsList = ({data, loading, onAccept, onDecline}) => (
  <FlatList
    data={data}
    style={styles.flatlist}
    contentContainerStyle={styles.contentContainer}
    keyExtractor={item => item.id}
    renderItem={({item}) => (
      <ListItem item={item} onAccept={onAccept} onDecline={onDecline} />
    )}
    refreshControl={
      <RefreshControl
        colors={[colors.green]}
        tintColor={colors.green}
        refreshing={loading}
      />
    }
    ListEmptyComponent={
      <ListEmptyComponent
        title="You don't have any invitations"
        onRefresh={() => null}
      />
    }
  />
);

export default InvitationsList;
