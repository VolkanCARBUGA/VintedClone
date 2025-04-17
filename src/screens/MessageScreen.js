import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { messageService } from '../services/api';

const MessagesScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await messageService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Mesajlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    
    // Set up a refresh interval to check for new messages
    const refreshInterval = setInterval(fetchConversations, 30000); // every 30 seconds
    
    return () => clearInterval(refreshInterval);
  }, []);

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => navigation.navigate('ConversationDetail', { conversationId: item.id })}
    >
      <Image 
        source={{ uri: item.user.profilePicture || 'https://via.placeholder.com/50' }} 
        style={styles.userAvatar} 
      />
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.username}>{item.user.username}</Text>
          <Text style={styles.timestamp}>{item.lastMessage.timestamp}</Text>
        </View>
        
        <Text 
          style={[styles.messagePreview, !item.lastMessage.isRead && styles.unreadMessage]} 
          numberOfLines={1}
        >
          {item.lastMessage.content}
        </Text>
        
        <View style={styles.productPreview}>
          <Image 
            source={{ uri: item.product.image || 'https://via.placeholder.com/50' }} 
            style={styles.productImage} 
          />
          <Text style={styles.productTitle} numberOfLines={1}>{item.product.title}</Text>
          <Text style={styles.productPrice}>₺{item.product.price}</Text>
        </View>
      </View>
      
      {!item.lastMessage.isRead && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C3A5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mesajlar</Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchConversations}>
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      ) : conversations.length > 0 ? (
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.conversationsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Henüz mesajınız yok</Text>
          <Text style={styles.emptyText}>
            Satıcılarla iletişime geçtiğinizde veya ürünlerinizle ilgilenen alıcılar olduğunda mesajlarınız burada görünecek.
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseButtonText}>Ürünlere Göz At</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF5252',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#00C3A5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  conversationsList: {
    paddingVertical: 10,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    position: 'relative',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: '#757575',
  },
  messagePreview: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 10,
  },
  unreadMessage: {
    fontWeight: '500',
    color: '#212121',
  },
  productPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 5,
  },
  productImage: {
    width: 30,
    height: 30,
    borderRadius: 3,
    marginRight: 8,
  },
  productTitle: {
    flex: 1,
    fontSize: 12,
    marginRight: 8,
  },
  productPrice: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  unreadIndicator: {
    position: 'absolute',
    right: 15,
    top: 20,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00C3A5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#00C3A5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MessagesScreen;
