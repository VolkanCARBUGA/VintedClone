import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CheckoutScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  
  // Mock product data
  const product = {
    id: productId,
    title: 'Siyah Deri Ceket',
    price: 350,
    image: 'https://via.placeholder.com/150',
    seller: {
      username: 'ayse_style',
    },
    size: 'M',
  };

  // Mock shipping options
  const shippingOptions = [
    { id: '1', name: 'Standart Kargo', price: 20, days: '2-4' },
    { id: '2', name: 'Hızlı Kargo', price: 35, days: '1-2' },
  ];

  const [selectedShipping, setSelectedShipping] = React.useState(shippingOptions[0].id);
  
  // Calculate totals
  const shippingCost = shippingOptions.find(option => option.id === selectedShipping).price;
  const protectionFee = Math.round(product.price * 0.05);
  const totalPrice = product.price + shippingCost + protectionFee;

  const handlePlaceOrder = () => {
    // In a real app, this would submit the order to the backend
    console.log('Placing order for product:', productId);
    
    // Show success message and navigate to home
    alert('Siparişiniz başarıyla oluşturuldu!');
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ödeme</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ürün Özeti</Text>
          <View style={styles.productSummary}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>{product.title}</Text>
              <Text style={styles.productDetail}>Beden: {product.size}</Text>
              <Text style={styles.productDetail}>Satıcı: {product.seller.username}</Text>
              <Text style={styles.productPrice}>₺{product.price.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Teslimat Adresi</Text>
          <TouchableOpacity style={styles.addressSelector}>
            <Text style={styles.addressSelectorText}>Adres seçin</Text>
            <Text style={styles.addressSelectorIcon}>▼</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addAddressButton}>
            <Text style={styles.addAddressButtonText}>+ Yeni adres ekle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kargo Seçenekleri</Text>
          {shippingOptions.map(option => (
            <TouchableOpacity 
              key={option.id}
              style={[
                styles.shippingOption,
                selectedShipping === option.id && styles.selectedShippingOption
              ]}
              onPress={() => setSelectedShipping(option.id)}
            >
              <View style={styles.shippingOptionInfo}>
                <Text style={styles.shippingOptionName}>{option.name}</Text>
                <Text style={styles.shippingOptionDetail}>{option.days} gün içinde teslimat</Text>
              </View>
              <Text style={styles.shippingOptionPrice}>₺{option.price.toFixed(2)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ödeme Yöntemi</Text>
          <TouchableOpacity style={styles.paymentSelector}>
            <Text style={styles.paymentSelectorText}>Ödeme yöntemi seçin</Text>
            <Text style={styles.paymentSelectorIcon}>▼</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addPaymentButton}>
            <Text style={styles.addPaymentButtonText}>+ Yeni kart ekle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sipariş Özeti</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ürün Fiyatı:</Text>
            <Text style={styles.summaryValue}>₺{product.price.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Kargo Ücreti:</Text>
            <Text style={styles.summaryValue}>₺{shippingCost.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Alıcı Koruma Ücreti:</Text>
            <Text style={styles.summaryValue}>₺{protectionFee.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Toplam:</Text>
            <Text style={styles.totalValue}>₺{totalPrice.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderButtonText}>SİPARİŞİ ONAYLA</Text>
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  productSummary: {
    flexDirection: 'row',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  productDetail: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 3,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  addressSelector: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressSelectorText: {
    fontSize: 16,
    color: '#9E9E9E',
  },
  addressSelectorIcon: {
    fontSize: 14,
    color: '#757575',
  },
  addAddressButton: {
    paddingVertical: 10,
  },
  addAddressButtonText: {
    fontSize: 14,
    color: '#00C3A5',
    fontWeight: '500',
  },
  shippingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedShippingOption: {
    borderColor: '#00C3A5',
    backgroundColor: 'rgba(0, 195, 165, 0.05)',
  },
  shippingOptionInfo: {
    flex: 1,
  },
  shippingOptionName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  shippingOptionDetail: {
    fontSize: 14,
    color: '#757575',
  },
  shippingOptionPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentSelector: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  paymentSelectorText: {
    fontSize: 16,
    color: '#9E9E9E',
  },
  paymentSelectorIcon: {
    fontSize: 14,
    color: '#757575',
  },
  addPaymentButton: {
    paddingVertical: 10,
  },
  addPaymentButtonText: {
    fontSize: 14,
    color: '#00C3A5',
    fontWeight: '500',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#757575',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00C3A5',
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  placeOrderButton: {
    backgroundColor: '#00C3A5',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
