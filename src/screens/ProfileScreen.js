import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService, productService } from '../services/api';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [error, setError] = useState('');

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get current user from AsyncStorage
      const userJson = await AsyncStorage.getItem('user');
      if (!userJson) {
        // If no user is logged in, redirect to login
        navigation.navigate('Login');
        return;
      }
      
      const currentUser = JSON.parse(userJson);
      
      // Fetch user profile details
      const userProfile = await userService.getUserProfile(currentUser.id);
      setUser(userProfile);
      
      // Fetch user products based on active tab
      fetchUserProducts(currentUser.id, activeTab);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Profil bilgileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  const fetchUserProducts = async (userId, status) => {
    try {
      let products;
      
      if (status === 'favorites') {
        products = await productService.getFavoriteProducts();
      } else {
        products = await productService.getUserProducts(userId, status);
      }
      
      setProducts(products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user products:', error);
      setError('Ürünler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserProducts(user.id, activeTab);
    }
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
        style={styles.productImage} 
      />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.productPrice}>₺{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

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
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserProfile}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Kullanıcı bilgileri bulunamadı.</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.retryButtonText}>Giriş Yap</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profilim</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileContainer}>
        <Image 
          source={{ uri: user.profilePicture || 'https://via.placeholder.com/150' }} 
          style={styles.profilePicture} 
        />
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.userInfo}>★ {user.rating || '0.0'} · {user.location || 'Konum belirtilmemiş'}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.followers || 0}</Text>
            <Text style={styles.statLabel}>Takipçi</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.following || 0}</Text>
            <Text style={styles.statLabel}>Takip</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.editProfileButton} 
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editProfileButtonText}>Profili Düzenle</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'active' && styles.activeTabButton]} 
          onPress={() => handleTabChange('active')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'active' && styles.activeTabButtonText]}>Satışta</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'sold' && styles.activeTabButton]} 
          onPress={() => handleTabChange('sold')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'sold' && styles.activeTabButtonText]}>Satıldı</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'favorites' && styles.activeTabButton]} 
          onPress={() => handleTabChange('favorites')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'favorites' && styles.activeTabButtonText]}>Favoriler</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === 'active' 
                ? 'Henüz satışta ürününüz yok.' 
                : activeTab === 'sold' 
                  ? 'Henüz satılmış ürününüz yok.' 
                  : 'Henüz favorilere eklediğiniz ürün yok.'}
            </Text>
            {activeTab === 'active' && (
              <TouchableOpacity 
                style={styles.addProductButton}
                onPress={() => navigation.navigate('Sell')}
              >
                <Text style={styles.addProductButtonText}>Ürün Ekle</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsIcon: {
    fontSize: 20,
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userInfo: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
  },
  editProfileButton: {
    borderWidth: 1,
    borderColor: '#00C3A5',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  editProfileButtonText: {
    color: '#00C3A5',
    fontSize: 14,
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#00C3A5',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#757575',
  },
  activeTabButtonText: {
    color: '#00C3A5',
    fontWeight: '500',
  },
  productRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 15,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 10,
  },
  productTitle: {
    fontSize: 14,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
  },
  addProductButton: {
    backgroundColor: '#00C3A5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addProductButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
