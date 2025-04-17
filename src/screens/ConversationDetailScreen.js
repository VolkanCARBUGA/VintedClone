import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { messageService, productService } from '../services/api';

const ConversationDetailScreen = ({ route, navigation }) => {
  const { conversationId, sellerId, productId } = route.params;
  const [conversation, setConversation] = useState(null);
  const [product, setProduct] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const fetchConversation = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (conversationId) {
        // Fetch existing conversation
        const conversationData = await messageService.getConversationById(conversationId);
        setConversation(conversationData);
        
        // Fetch messages for this conversation
        const messagesData = await messageService.getConversationMessages(conversationId);
        setMessages(messagesData);
        
        // Fetch product details
        if (conversationData.product && conversationData.product.id) {
          const productData = await productService.getProductById(conversationData.product.id);
          setProduct(productData);
        }
      } else if (sellerId && productId) {
        // This is a new conversation
        // Fetch product details first
        const productData = await productService.getProductById(productId);
        setProduct(productData);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
      setError('Mesajlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversation();
    
    // Set up a refresh interval to check for new messages
    const refreshInterval = setInterval(() => {
      if (conversationId) {
        messageService.getConversationMessages(conversationId)
          .then(messagesData => setMessages(messagesData))
          .catch(error => console.error('Error refreshing messages:', error));
      }
    }, 10000); // every 10 seconds
    
    return () => clearInterval(refreshInterval);
  }, [conversationId, sellerId, productId]);

  const handleSendMessage = async () => {
    if (messageText.trim() === '') return;
    
    try {
      setSending(true);
      
      if (conversationId) {
        // Send message to existing conversation
        await messageService.sendMessage(conversationId, messageText);
        
        // Refresh messages
        const messagesData = await messageService.getConversationMessages(conversationId);
        setMessages(messagesData);
      } else if (sellerId && productId) {
        // Create a new conversation
        const newConversation = await messageService.createConversation(
          sellerId,
          productId,
          messageText
        );
        
        // Update state with new conversation
        setConversation(newConversation);
        
        // Update route params to include the new conversation ID
        navigation.setParams({ conversationId: newConversation.id });
        
        // Fetch messages for the new conversation
        const messagesData = await messageService.getConversationMessages(newConversation.id);
        setMessages(messagesData);
      }
      
      // Clear the input field
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Hata', 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSending(false);
    }
  };

  const renderMessage = (message) => {
    const isOwnMessage = message.senderId === 'me';
    
    return (
      <View 
        key={message.id} 
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer
        ]}
      >
        <View 
          style={[
            styles.messageBubble,
            isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble
          ]}
        >
          <Text style={styles.messageText}>{message.content}</Text>
          <Text style={styles.messageTimestamp}>{message.timestamp}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C3A5" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchConversation}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {conversation ? conversation.user.username : 'Yeni Mesaj'}
        </Text>
        <TouchableOpacity>
          <Text style={styles.moreButton}>⋮</Text>
        </TouchableOpacity>
      </View>

      {product && (
        <View style={styles.productBar}>
          <Image 
            source={{ uri: product.image || 'https://via.placeholder.com/50' }} 
            style={styles.productImage} 
          />
          <View style={styles.productInfo}>
            <Text style={styles.productTitle} numberOfLines={1}>{product.title}</Text>
            <Text style={styles.productPrice}>₺{product.price}</Text>
          </View>
          <TouchableOpacity 
            style={styles.buyButton}
            onPress={() => navigation.navigate('Checkout', { productId: product.id })}
          >
            <Text style={styles.buyButtonText}>Satın Al</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.messagesContainer}>
        {messages.map(renderMessage)}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Text style={styles.attachButtonText}>+</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.messageInput}
          placeholder="Mesajınızı yazın..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
          editable={!sending}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            (!messageText.trim() || sending) && styles.sendButtonDisabled
          ]}
          onPress={handleSendMessage}
          disabled={!messageText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.sendButtonText}>Gönder</Text>
          )}
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#FFFFFF',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  moreButton: {
    fontSize: 20,
  },
  productBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  buyButton: {
    backgroundColor: '#00C3A5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
  },
  ownMessageBubble: {
    backgroundColor: '#00C3A5',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#F5F5F5',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    marginBottom: 5,
  },
  messageTimestamp: {
    fontSize: 10,
    color: '#757575',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  attachButtonText: {
    fontSize: 20,
    color: '#757575',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#00C3A5',
    borderRadius: 18,
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ConversationDetailScreen;
