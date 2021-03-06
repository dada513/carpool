import React, {useState} from 'react';
import {View, SafeAreaView} from 'react-native';
import {colors} from '../../../styles';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {useNavigation} from '@react-navigation/core';
import {LocationSheet} from '../../../components/Locations';
import Icon from 'react-native-vector-icons/FontAwesome';
import {MAP_LIGHT} from '@env';

const ShowSelected = props => {
  const navigation = useNavigation();

  const {selected} = props.route.params;

  const [coordinates, setCoordinates] = useState(selected.center);
  const [location, setLocation] = useState(selected);

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
        <View style={{flex: 1}}>
          <MapboxGL.MapView
            style={{flex: 1}}
            onPress={event => console.log(event)}
            styleURL={MAP_LIGHT}>
            <MapboxGL.Camera
              zoomLevel={16}
              animationMode="flyTo"
              animationDuration={2000}
              centerCoordinate={[coordinates[0], coordinates[1]]}
            />
            <MapboxGL.PointAnnotation
              key={coordinates.toString()}
              id="selected"
              coordinate={coordinates}>
              <Icon
                name="map-marker"
                color={colors.blue}
                size={35}
                style={{marginBottom: 35}}
              />
            </MapboxGL.PointAnnotation>
            <MapboxGL.UserLocation />
          </MapboxGL.MapView>
        </View>
      </SafeAreaView>
      <LocationSheet
        _onSelect={() => null}
        _onGoBack={() => navigation.goBack()}
        location={location}
      />
    </View>
  );
};

export default ShowSelected;
