import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import HomeScreen from './src/screens/HomeScreen';
import MessagesScreen from './src/screens/MessageScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import ConversationDetailScreen from './src/screens/ConversationDetailScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const App = () => {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
};

export default App;
