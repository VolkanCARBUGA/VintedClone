import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import SellScreen from '../screens/SellScreen';
import MessagesScreen from '../screens/MessageScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ConversationDetailScreen from '../screens/ConversationDetailScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab icon component
const TabIcon = ({ name, focused }) => {
  // In a real app, these would be proper icons
  const icons = {
    Home: '🏠',
    Search: '🔍',
    Sell: '📸',
    Messages: '💬',
    Profile: '👤'
  };

  return (
    <Text style={{ 
      fontSize: 20, 
      color: focused ? '#00C3A5' : '#757575' 
    }}>
      {icons[name]}
    </Text>
  );
};

// Main tab navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00C3A5',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} />
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{
          tabBarLabel: 'Arama',
          tabBarIcon: ({ focused }) => <TabIcon name="Search" focused={focused} />
        }}
      />
      <Tab.Screen 
        name="Sell" 
        component={SellScreen} 
        options={{
          tabBarLabel: 'Sat',
          tabBarIcon: ({ focused }) => <TabIcon name="Sell" focused={focused} />
        }}
      />
      
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen} 
        options={{
          tabBarLabel: 'Mesajlar',
          tabBarIcon: ({ focused }) => <TabIcon name="Messages" focused={focused} />
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} />
        }}
      />
    </Tab.Navigator>
  );
};

// Main navigation container
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Auth screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        
        {/* Main app */}
        <Stack.Screen name="Main" component={MainTabNavigator} />
        
        {/* Detail screens */}
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="ConversationDetail" component={ConversationDetailScreen} />
        {/* Notifications screen */}
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        
        {/* Search screen */}
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
