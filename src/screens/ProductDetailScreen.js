import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { productService } from '../services/api';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await productService.getProductById(productId);
      setProduct(data);
      setIsFavorite(data.isFavorite || false);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setError('Ürün detayları yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const handleNextImage = () => {
    if (product && currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const toggleFavorite = async () => {
    try {
      // Optimistically update UI
      setIsFavorite(!isFavorite);
      
      // Call API
      if (isFavorite) {
        await productService.removeFromFavorites(productId);
      } else {
        await productService.addToFavorites(productId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert on error
      setIsFavorite(isFavorite);
      Alert.alert('Hata', 'Favori durumu güncellenirken bir hata oluştu.');
    }
  };

  const handleMessage = () => {
    if (product) {
      navigation.navigate('ConversationDetail', { 
        sellerId: product.seller.id, 
        productId: product.id 
      });
    }
  };

  const handleBuy = () => {
    if (product) {
      navigation.navigate('Checkout', { productId: product.id });
    }
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchProductDetails}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Ürün bulunamadı.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Geri Dön</Text>
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
        <TouchableOpacity>
          <Text style={styles.shareButton}>⋮</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: product.images && product.images.length > 0 
              ? product.images[currentImageIndex] 
              : 'https://via.placeholder.com/400' 
            }} 
            style={styles.productImage} 
          />
          
          <View style={styles.imageNavigation}>
            {currentImageIndex > 0 && (
              <TouchableOpacity style={styles.navButton} onPress={handlePrevImage}>
                <Text style={styles.navButtonText}>←</Text>
              </TouchableOpacity>
            )}
            {product.images && currentImageIndex < product.images.length - 1 && (
              <TouchableOpacity style={styles.navButton} onPress={handleNextImage}>
                <Text style={styles.navButtonText}>→</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {product.images && product.images.length > 1 && (
            <View style={styles.imageDots}>
              {product.images.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.dot, 
                    index === currentImageIndex ? styles.activeDot : {}
                  ]} 
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{product.title}</Text>
            <TouchableOpacity onPress={toggleFavorite}>
              <Text style={[styles.favoriteIcon, isFavorite ? styles.favoriteFilled : {}]}>
                {isFavorite ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>₺{product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>₺{product.originalPrice}</Text>
            )}
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Beden:</Text>
              <Text style={styles.detailValue}>{product.size}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Marka:</Text>
              <Text style={styles.detailValue}>{product.brand}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Durum:</Text>
              <Text style={styles.detailValue}>{product.condition}</Text>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Açıklama</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <View style={styles.sellerContainer}>
            <Text style={styles.sectionTitle}>Satıcı</Text>
            <TouchableOpacity 
              style={styles.sellerInfo}
              onPress={() => navigation.navigate('SellerProfile', { sellerId: product.seller.id })}
            >
              <Image 
                source={{ uri: product.seller.profilePicture || 'https://via.placeholder.com/50' }} 
                style={styles.sellerImage} 
              />
              <View style={styles.sellerDetails}>
                <Text style={styles.sellerName}>{product.seller.username}</Text>
                <Text style={styles.sellerRating}>★ {product.seller.rating} · {product.seller.reviewCount} değerlendirme</Text>
                <Text style={styles.sellerLocation}>{product.seller.location}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
          <Text style={styles.messageButtonText}>MESAJ GÖNDER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
          <Text style={styles.buyButtonText}>SATIN AL</Text>
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    zIndex: 10,
  },
  backButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  shareButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    height: 400,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageNavigation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageDots: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
  },
  infoContainer: {
    padding: 15,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  favoriteIcon: {
    fontSize: 28,
    color: '#FF5252',
    marginLeft: 10,
  },
  favoriteFilled: {
    color: '#FF5252',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
  },
  originalPrice: {
    fontSize: 16,
    color: '#757575',
    textDecorationLine: 'line-through',
    marginLeft: 10,
  },
  detailsContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#757575',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#212121',
  },
  sellerContainer: {
    marginBottom: 20,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  sellerDetails: {
    marginLeft: 15,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  sellerRating: {
    fontSize: 14,
    color: '#757575',
    marginVertical: 3,
  },
  sellerLocation: {
    fontSize: 14,
    color: '#757575',
  },
  actionContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    padding: 15,
  },
  messageButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#00C3A5',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  messageButtonText: {
    color: '#00C3A5',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buyButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#00C3A5',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;
