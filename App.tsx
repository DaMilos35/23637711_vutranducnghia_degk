import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Text,
  View,
  TextInput,
  SectionList,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform, 
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Tour, groupByCity, formatDate } from './utils/tour';
import TourItem from './components/TourItem';

const API_URL = 'https://6976c5a9c0c36a2a9951c9d8.mockapi.io/tours';

export default function App() {
  return (
    <SafeAreaProvider>
      <MainScreen />
    </SafeAreaProvider>
  );
}

function MainScreen() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [keyword, setKeyword] = useState('');

  const fetchTours = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error();
      setTours(await res.json());
    } catch {
      const errMsg = 'Không thể tải dữ liệu';
      Platform.OS === 'web' ? window.alert(errMsg) : Alert.alert('Lỗi', errMsg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const handlePress = useCallback((t: Tour) => {
    const info = `Tên: ${t.name}\nKhởi hành: ${formatDate(t.departure)}\nSố ngày: ${t.days} ngày\nGiá: ${t.price.toLocaleString('vi-VN')} ₫`;
    if (Platform.OS === 'web') {
      window.alert(`[Chi tiết tour]\n${info}`);
    } else {
      Alert.alert('Chi tiết tour', info);
    }
  }, []);

  const handleToggleFav = useCallback(
    async (id: string, next: boolean) => {
      const prev = [...tours];
      setTours((list) =>
        list.map((item) => (item.id === id ? { ...item, isFavorite: next } : item))
      );
      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isFavorite: next }),
        });
        if (!res.ok) throw new Error();
      } catch {
        setTours(prev);
        const errMsg = 'Cập nhật thất bại';
        Platform.OS === 'web' ? window.alert(errMsg) : Alert.alert('Lỗi', errMsg);
      }
    },
    [tours]
  );

  const favoriteTours = useMemo(() => tours.filter((t) => t.isFavorite), [tours]);

  const sections = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    const filtered = k ? tours.filter((t) => t.name.toLowerCase().includes(k)) : tours;
    return groupByCity(filtered);
  }, [tours, keyword]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tour Việt</Text>
        <Text>23637711 – Vũ Trần Đức Nghĩa</Text>
        <TextInput
          style={styles.input}
          placeholder="Tìm tour theo tên..."
          value={keyword}
          onChangeText={setKeyword}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchTours(true); }} />
          }
          ListHeaderComponent={
            <View style={{ padding: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Tour yêu thích ({favoriteTours.length})</Text>
              {favoriteTours.length === 0 ? (
                <Text style={{ fontStyle: 'italic', color: '#888' }}>Chưa có tour yêu thích</Text>
              ) : (
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={favoriteTours}
                  keyExtractor={(item) => item.id}
                  ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                  renderItem={({ item }) => (
                    <TourItem
                      tour={item}
                      compact={true}
                      onPress={handlePress}
                      onToggleFavorite={handleToggleFav}
                    />
                  )}
                />
              )}
            </View>
          }
          renderSectionHeader={({ section }) => (
            <View style={styles.secHeader}>
              <Text style={{ fontWeight: 'bold' }}>{section.title} · {section.data.length} tour</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TourItem
              tour={item}
              compact={false}
              onPress={handlePress}
              onToggleFavorite={handleToggleFav}
            />
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
              Không tìm thấy tour phù hợp
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 6,
    borderRadius: 6,
  },
  secHeader: {
    backgroundColor: '#eee',
    padding: 8,
  },
});