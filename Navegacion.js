import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';

import Settings from './Screens/Settings';
import Home from './Screens/Home';
import Users from './Screens/Users';
import DetailHome from './Screens/DetailHome';
import AnotherDetailHome from './Screens/AnotherDetailHome';
import Tareas from './Screens/Tareas';
import RegistrarVuelos from './Screens/RegistrarVuelos';
import EditarRegistros from './Screens/EditarRegistros';
import Estadisticas from './Screens/Estadisticas';

const Tab = createBottomTabNavigator();
const TareasStack = createStackNavigator();
const DetailHomeNavigator = createStackNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Areopuerto"
      screenOptions={{
        tabBarActiveTintColor: 'purple',
      }}
    >
      <Tab.Screen
        name="Areopuerto"
        component={StackDetailHome}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={30} color="black" />
          ),
        }}
      />

      <Tab.Screen
        name="Tareas"
        component={TareasStackNavigator}
        options={{
          tabBarLabel: 'Tareas',
          tabBarIcon: ({ color, size }) => (
            <Entypo name="clipboard" size={24} color="black" />
          ),
        }}
      />

      <Tab.Screen
        name="Setting"
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="player-settings" size={28} color="black" />
          ),
        }}
      />

      <Tab.Screen
        name="Users"
        component={Users}
        options={{
          tabBarLabel: 'Users',
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={30} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function TareasStackNavigator() {
  return (
    <TareasStack.Navigator initialRouteName="PantallaTareas">
      <TareasStack.Screen 
        name="PantallaTareas" 
        component={Tareas} 
        options={{ headerShown: false }} 
      />
      <TareasStack.Screen 
        name="RegistrarVuelos" 
        component={RegistrarVuelos} 
        options={{ title: 'Registrar Vuelos' }}
      />
      <TareasStack.Screen 
        name="EditarRegistros" 
        component={EditarRegistros} 
        options={{ title: 'Editar Registros' }}
      />
            <TareasStack.Screen 
        name="Estadisticas" 
        component={Estadisticas} 
        options={{ title: 'Estadisticas' }}
      />
    </TareasStack.Navigator>
    
  );
}


function StackDetailHome() {
  return (
    <DetailHomeNavigator.Navigator initialRouteName="Menú">
      <DetailHomeNavigator.Screen name="Menú" component={Home} />
      <DetailHomeNavigator.Screen name="DetailHome" component={DetailHome} />
      <DetailHomeNavigator.Screen name="AnotherDetailHome" component={AnotherDetailHome} />
    </DetailHomeNavigator.Navigator>
  );
}

export default function Navigacion() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
