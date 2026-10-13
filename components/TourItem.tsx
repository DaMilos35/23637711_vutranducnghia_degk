import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Tour, formatDate, getSeatLabel } from '../utils/tour';

export interface TourItemProps {
  tour: Tour;
  compact?: boolean;
  onPress: (tour: Tour) => void;
  onToggleFavorite: (id: string, next: boolean) => void;
}

const TourItem: React.FC<TourItemProps> = ({
  tour,
  compact = false,
  onPress,
  onToggleFavorite,
}) => {
  if (compact) {
    return (
      <View style={styles.compactBox}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(tour)}>
          <View style={styles.imgWrap}>
            <Image source={{ uri: tour.image }} style={styles.compactImg} />
          </View>
          <Text numberOfLines={1} style={{ fontWeight: '600' }}>{tour.name}</Text>
          <Text style={{ color: 'red', fontWeight: 'bold' }}>
            {tour.price.toLocaleString('vi-VN')} ₫
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="fav-btn"
          style={styles.absFav}
          onPress={() => onToggleFavorite(tour.id, !tour.isFavorite)}
        >
          <Text style={tour.isFavorite ? styles.redText : null}>
            {tour.isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.rowBox}>
      <TouchableOpacity
        style={styles.contentRow}
        activeOpacity={0.8}
        onPress={() => onPress(tour)}
      >
        <Image source={{ uri: tour.image }} style={styles.rowImg} />
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>{tour.name}</Text>
          <Text style={{ color: '#666' }}>{tour.city}</Text>
          <Text>📅 {formatDate(tour.departure)} · {tour.days} ngày</Text>
          <Text style={{ color: 'red', fontWeight: 'bold' }}>
            {tour.price.toLocaleString('vi-VN')} ₫
          </Text>
          <Text style={tour.seats <= 3 ? styles.redText : null}>
            {getSeatLabel(tour.seats)}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        testID="fav-btn"
        style={styles.favBtn}
        onPress={() => onToggleFavorite(tour.id, !tour.isFavorite)}
      >
        <Text style={[styles.favIcon, tour.isFavorite && styles.redText]}>
          {tour.isFavorite ? '♥' : '♡'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(TourItem);

const styles = StyleSheet.create({
  rowBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowImg: {
    width: 90,
    height: 90,
    borderRadius: 6,
  },
  compactBox: {
    width: 160,
    position: 'relative',
    backgroundColor: '#fff',
  },
  imgWrap: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  compactImg: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  absFav: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favBtn: {
    padding: 10,
  },
  favIcon: {
    fontSize: 22,
    color: '#999',
  },
  redText: {
    color: 'red',
  },
});