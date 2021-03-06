import React from 'react';
import {View, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {colors} from '../../styles';

const UpView = ({
  style,
  children,
  borderRadius,
  contentContainerStyle,
  onPress,
}) => {
  const WrappingComponent = onPress ? TouchableOpacity : View;

  const styles = Platform.OS === 'ios' ? iosStyles : androidStyles;

  const wrapperStyles = {...styles.wrapper, borderRadius, ...style};
  const containerStyles = {
    ...styles.container,
    borderRadius,
    ...contentContainerStyle,
  };

  return (
    <WrappingComponent
      style={wrapperStyles}
      onPress={onPress ? onPress : undefined}>
      <View style={containerStyles}>{children}</View>
    </WrappingComponent>
  );
};

const iosStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  container: {
    flex: 1,
    shadowColor: '#fff',
    shadowOffset: {
      width: -8,
      height: -8,
    },
    shadowOpacity: 1,
    shadowRadius: 6,
    backgroundColor: colors.background,
    elevation: 5,
  },
});

const androidStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flex: 1,
  },
});

export default UpView;
