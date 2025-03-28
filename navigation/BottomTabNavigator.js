import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import RadioScreen from '../screens/RadioScreen';
import ProgramsScreen from '../screens/ProgramsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <NavigationContainer>
<Tab.Navigator
  screenOptions={({ route }) => ({
    headerShown: false, // Hides the header completely
    tabBarIcon: ({ color, size }) => {
      let iconName;

      if (route.name === 'Radio') {
        iconName = 'radio';
      } else if (route.name === 'Programs') {
        iconName = 'list';
      } else if (route.name === 'Notifications') {
        iconName = 'notifications';
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
  })}
>

        <Tab.Screen name="Radio" component={RadioScreen} />
        <Tab.Screen name="Programs" component={ProgramsScreen} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
