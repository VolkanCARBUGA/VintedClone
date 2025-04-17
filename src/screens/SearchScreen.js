import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [isSearching, setIsSearching] = React.useState(false);

  // Mock categories for filter
  const categories = [
    { id: '1', name: 'Kadın' },
    { id: '2', name: 'Erkek' },
    { id: '3', name: 'Çocuk' },
    { id: '4', name: 'Ev' },
    { id: '5', name: 'Elektronik' },
    { id: '6', name: 'Spor' },
  ];

  // Mock sizes for filter
  const sizes = [
    { id: '1', name: 'XS' },
    { id: '2', name: 'S' },
    { id: '3', name: 'M' },
    { id: '4', name: 'L' },
    { id: '5', name: 'XL' },
    { id: '6', name: 'XXL' },
  ];

  // Mock conditions for filter
  const conditions = [
    { id: '1', name: 'Yeni' },
    { id: '2', name: 'Çok iyi' },
    { id: '3', name: 'İyi' },
    { id: '4', name: 'Orta' },
  ];

  // Mock search results
  const mockSearchResults = [
    {
      id: '1',
      title: 'Siyah Deri Ceket',
      price: 350,
      size: 'M',
      brand: 'Zara',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      title: 'Mavi Kot Pantolon',
      price: 150,
      size: 'L',
      brand: 'Mavi',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '3',
      title: 'Beyaz Tişört',
      price: 80,
      size: 'S',
      brand: 'H&M',
      image: 'https://via.placeholder.com/150',
    },
  ];

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate API call delay
    setTimeout(() => {
      setSearchResults(mockSearchResults);
      setIsSearching(false);
    }, 500);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.filterChip}>
      <Text style={styles.filterChipText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderSizeItem = ({ item }) => (
    <TouchableOpacity style={styles.filterChip}>
      <Text style={styles.filterChipText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderConditionItem = ({ item }) => (
    <TouchableOpacity style={styles.filterChip}>
      <Text style={styles.filterChipText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderSearchResultItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.resultImage} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.resultPrice}>₺{item.price}</Text>
        <Text style={styles.resultDetails}>Beden: {item.size} · Marka: {item.brand}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Ürün, marka ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={searchResults}
        renderItem={renderSearchResultItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={styles.filtersContainer}>
            <Text style={styles.filtersTitle}>Filtreler:</Text>
            
            <Text style={styles.filterSectionTitle}>Kategori:</Text>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filtersList}
            />
            
            <View style={styles.priceRangeContainer}>
              <Text style={styles.filterSectionTitle}>Fiyat Aralığı:</Text>
              <View style={styles.priceInputsContainer}>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Min: ₺"
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.priceInput}
                  placeholder="Max: ₺"
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <Text style={styles.filterSectionTitle}>Beden:</Text>
            <FlatList
              data={sizes}
              renderItem={renderSizeItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filtersList}
            />
            
            <Text style={styles.filterSectionTitle}>Durum:</Text>
            <FlatList
              data={conditions}
              renderItem={renderConditionItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filtersList}
            />
            
            <View style={styles.sortContainer}>
              <Text style={styles.filterSectionTitle}>Sıralama:</Text>
              <View style={styles.sortSelectContainer}>
                <Text style={styles.sortSelectText}>Önerilen</Text>
                <Text style={styles.sortSelectIcon}>▼</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.applyFiltersButton} onPress={handleSearch}>
              <Text style={styles.applyFiltersButtonText}>FİLTRELERİ UYGULA</Text>
            </TouchableOpacity>
            
            {searchResults.length > 0 && (
              <Text style={styles.resultsCount}>{searchResults.length} sonuç bulundu</Text>
            )}
          </View>
        }
        ListEmptyComponent={
          !isSearching && (
            <View style={styles.emptyResultsContainer}>
              <Text style={styles.emptyResultsText}>
                {searchQuery.length > 0 
                  ? 'Aramanızla eşleşen ürün bulunamadı.' 
                  : 'Ürün aramak için yukarıdaki arama çubuğunu kullanın.'}
              </Text>
            </View>
          )
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    fontSize: 24,
    marginRight: 10,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#757575',
  },
  filtersContainer: {
    padding: 15,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  filtersList: {
    marginBottom: 15,
  },
  filterChip: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  filterChipText: {
    fontSize: 14,
  },
  priceRangeContainer: {
    marginBottom: 15,
  },
  priceInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceInput: {
    width: '48%',
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  sortContainer: {
    marginBottom: 15,
  },
  sortSelectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  sortSelectText: {
    fontSize: 16,
  },
  sortSelectIcon: {
    fontSize: 14,
  },
  applyFiltersButton: {
    backgroundColor: '#00C3A5',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  applyFiltersButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  resultItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  resultInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  resultPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultDetails: {
    fontSize: 14,
    color: '#757575',
  },
  emptyResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyResultsText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
});

export default SearchScreen;
