import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabNavigator} from '../components';
import {
  History,
  Profile,
  Splash,
  Started,
  LoginCustomer,
  LoginDriver,
  HomeCustomer,
  HomeDriver,
  EditProfile,
  Help,
  Secure,
  MapCustomer,
  MapDriver,
} from '../pages';
import DetailHistory from '../pages/DetailHistory';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainAppCustomer = () => {
  return (
    <Tab.Navigator tabBar={props => <BottomTabNavigator {...props} />}>
      <Tab.Screen name="Home" component={HomeCustomer} />
      <Tab.Screen name="Riwayat" component={History} />
      <Tab.Screen name="Profil" component={Profile} />
    </Tab.Navigator>
  );
};

const MainAppDriver = () => {
  return (
    <Tab.Navigator tabBar={props => <BottomTabNavigator {...props} />}>
      <Tab.Screen name="Home" component={HomeDriver} />
      <Tab.Screen name="Riwayat" component={History} />
      <Tab.Screen name="Profil" component={Profile} />
    </Tab.Navigator>
  );
};

const Router = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Started"
        component={Started}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LoginDriver"
        component={LoginDriver}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LoginCustomer"
        component={LoginCustomer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MainAppCustomer"
        component={MainAppCustomer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MainAppDriver"
        component={MainAppDriver}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Help"
        component={Help}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Secure"
        component={Secure}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DetailHistory"
        component={DetailHistory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MapCustomer"
        component={MapCustomer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MapDriver"
        component={MapDriver}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default Router;
