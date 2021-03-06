import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaView, View, PermissionsAndroid, Platform} from 'react-native';
import {colors} from '../../styles';
import {AccountSwitch, HamburgerMenu} from '../../components/navigation';
import {useRoute, useNavigation} from '@react-navigation/core';
import PassengerMap from './PassengerMap';
import DriverMap from './DriverMap';
import {useDispatch} from 'react-redux';
import * as actions from '../../store/actions';
import {useActiveAccount} from '../../hooks';

const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Carpool',
        message:
          'Carpool needs access to your location ' +
          'so you can use the app properly.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the location');
    } else {
      console.log('Location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

const Home = () => {
  const dispatch = useDispatch();

  const {activeAccount} = useActiveAccount();

  const [coordinates, setCoordinates] = useState([]);

  const _driverMap = useRef(null);
  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(actions.getGroups());

    if (Platform.OS === 'android') {
      requestLocationPermission();
    }
  }, []);

  useEffect(() => {
    // Delete ride from params
    if (activeAccount === 'driver') {
      dispatch(actions.getDriversRides());
      dispatch(actions.getDriversPastRides());

      if (route.params) {
        let params = route.params;
        delete params.ride;
        navigation.setParams({...params});
      }
    }
    if (activeAccount === 'passenger') {
      dispatch(actions.getUsersRides());
      dispatch(actions.getUsersPastRides());
    }
  }, [activeAccount]);

  const _onLocateUser = e => {
    if (e) {
      const {
        coords: {latitude, longitude},
      } = e;
      setCoordinates([longitude, latitude]);
    }
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
        <View style={{flex: 1}}>
          <HamburgerMenu />
          <AccountSwitch />
          {activeAccount === 'passenger' ? (
            <PassengerMap
              coordinates={coordinates}
              _onLocateUser={_onLocateUser}
            />
          ) : (
            <DriverMap
              coordinates={coordinates}
              _onLocateUser={_onLocateUser}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Home;
