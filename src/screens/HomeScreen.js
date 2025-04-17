import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { productService } from '../services/api';

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Mock data for categories
  const categories = [
    { id: '1', name: 'Kadın' },
    { id: '2', name: 'Erkek' },
    { id: '3', name: 'Çocuk' },
    { id: '4', name: 'Ev' },
    { id: '5', name: 'Elektronik' },
    { id: '6', name: 'Spor' },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Ürünler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleFavorite = async (productId) => {
    try {
      // Find the product in the state
      const productIndex = products.findIndex(p => p.id === productId);
      if (productIndex === -1) return;
      
      const product = products[productIndex];
      const isFavorite = product.isFavorite;
      
      // Optimistically update the UI
      const updatedProducts = [...products];
      updatedProducts[productIndex] = {
        ...product,
        isFavorite: !isFavorite
      };
      setProducts(updatedProducts);
      
      // Call the API
      if (isFavorite) {
        await productService.removeFromFavorites(productId);
      } else {
        await productService.addToFavorites(productId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert the optimistic update on error
      fetchProducts();
    }
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
        <Text style={styles.productSize}>Beden: {item.size}</Text>
      </View>
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item.id)}
      >
        <Text style={styles.favoriteIcon}>{item.isFavorite ? '♥' : '♡'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryButton}
      onPress={() => navigation.navigate('Search', { categoryId: item.id })}
    >
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>VINTED</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Text style={styles.headerIcon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Text style={styles.headerIcon}>🔔</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00C3A5" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
          numColumns={2}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#00C3A5']}
            />
          }
          ListHeaderComponent={
            <View>
              <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesList}
              />
              <Text style={styles.sectionTitle}>Öne Çıkanlar</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Henüz ürün bulunmuyor.</Text>
            </View>
          }
          columnWrapperStyle={styles.productRow}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00C3A5',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIcon: {
    fontSize: 20,
    marginLeft: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  categoriesList: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    marginBottom: 10,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: 15,
  },
  productRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    position: 'relative',
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
    fontWeight: '500',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 3,
  },
  productSize: {
    fontSize: 12,
    color: '#757575',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 20,
    color: '#FF5252',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
});

export default HomeScreen;
