import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { productService } from '../services/api';

const SellScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Mock categories
  const categories = [
    'Kadın', 'Erkek', 'Çocuk', 'Ev', 'Elektronik', 'Spor'
  ];
  
  // Mock conditions
  const conditions = [
    'Yeni', 'Çok iyi', 'İyi', 'Orta'
  ];

  const handleAddPhotos = () => {
    // In a real app, this would open the camera or photo gallery
    Alert.alert('Bilgi', 'Bu özellik şu anda geliştirme aşamasındadır.');
  };

  const handlePublish = async () => {
    // Validate inputs
    if (!title || !price || !category || !description) {
      setError('Lütfen en azından başlık, fiyat, kategori ve açıklama alanlarını doldurun.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const productData = {
        title,
        description,
        price: parseFloat(price),
        category,
        brand: brand || undefined,
        size: size || undefined,
        condition: condition || undefined,
        // In a real app, we would upload images here
        images: []
      };
      
      const response = await productService.createProduct(productData);
      
      Alert.alert(
        'Başarılı',
        'Ürününüz başarıyla yayınlandı!',
        [
          { 
            text: 'Tamam', 
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    } catch (error) {
      console.error('Error publishing product:', error);
      setError(error.message || 'Ürün yayınlanırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni Ürün Ekle</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.formContainer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <TouchableOpacity style={styles.photoUploadContainer} onPress={handleAddPhotos}>
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderIcon}>+</Text>
            <Text style={styles.photoPlaceholderText}>Fotoğraf Ekle (1/20)</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Başlık</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Ürün başlığı"
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Kategori</Text>
          <TouchableOpacity 
            style={styles.selectInput}
            onPress={() => {
              // In a real app, this would open a category picker
              setCategory(categories[0]);
            }}
            disabled={loading}
          >
            <Text style={category ? styles.selectText : styles.selectPlaceholder}>
              {category || 'Kategori seçin'}
            </Text>
            <Text style={styles.selectIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Beden</Text>
          <TouchableOpacity 
            style={styles.selectInput}
            onPress={() => {
              // In a real app, this would open a size picker
              setSize('M');
            }}
            disabled={loading}
          >
            <Text style={size ? styles.selectText : styles.selectPlaceholder}>
              {size || 'Beden seçin'}
            </Text>
            <Text style={styles.selectIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Marka</Text>
          <TouchableOpacity 
            style={styles.selectInput}
            onPress={() => {
              // In a real app, this would open a brand picker
              setBrand('Zara');
            }}
            disabled={loading}
          >
            <Text style={brand ? styles.selectText : styles.selectPlaceholder}>
              {brand || 'Marka seçin'}
            </Text>
            <Text style={styles.selectIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Durum</Text>
          <TouchableOpacity 
            style={styles.selectInput}
            onPress={() => {
              // In a real app, this would open a condition picker
              setCondition(conditions[0]);
            }}
            disabled={loading}
          >
            <Text style={condition ? styles.selectText : styles.selectPlaceholder}>
              {condition || 'Durum seçin'}
            </Text>
            <Text style={styles.selectIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Fiyat (TL)</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="0.00"
            keyboardType="numeric"
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Açıklama</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Ürün açıklaması"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!loading}
          />
        </View>

        <TouchableOpacity 
          style={[
            styles.publishButton, 
            (loading || !title || !price || !category || !description) && styles.publishButtonDisabled
          ]} 
          onPress={handlePublish}
          disabled={loading || !title || !price || !category || !description}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.publishButtonText}>YAYINLA</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  formContainer: {
    padding: 15,
  },
  errorText: {
    color: '#FF5252',
    marginBottom: 15,
    textAlign: 'center',
  },
  photoUploadContainer: {
    marginBottom: 20,
  },
  photoPlaceholder: {
    height: 200,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  photoPlaceholderIcon: {
    fontSize: 40,
    color: '#757575',
    marginBottom: 10,
  },
  photoPlaceholderText: {
    fontSize: 16,
    color: '#757575',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  selectInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
  },
  selectPlaceholder: {
    fontSize: 16,
    color: '#9E9E9E',
  },
  selectIcon: {
    fontSize: 14,
    color: '#757575',
  },
  publishButton: {
    backgroundColor: '#00C3A5',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  publishButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SellScreen;
