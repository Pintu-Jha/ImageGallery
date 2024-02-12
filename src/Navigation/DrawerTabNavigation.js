import React from 'react';
import Home from '../screens/Home';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Notification from '../screens/Notification';
import {NavigationContainer} from '@react-navigation/native';

const Drawer = createDrawerNavigator();

const DrawerTabNavigation = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Notification" component={Notification} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default DrawerTabNavigation;
