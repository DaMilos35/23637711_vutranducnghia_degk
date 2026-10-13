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
      <TouchableOpacity style={styles.compactBox} onPress={() => onPress(tour)}>
        <View style={styles.imgWrap}>
          <Image source={{ uri: tour.image }} style={styles.compactImg} />
          <TouchableOpacity
            testID="fav-btn"
            style={styles.absFav}
            onPress={(e) => {
              e.stopPropagation?.();
              onToggleFavorite(tour.id, !tour.isFavorite);
            }}
          >
            <Text style={tour.isFavorite ? styles.redText : null}>
              {tour.isFavorite ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text numberOfLines={1}>{tour.name}</Text>
        <Text>{tour.price.toLocaleString('vi-VN')} ₫</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.rowBox} onPress={() => onPress(tour)}>
      <Image source={{ uri: tour.image }} style={styles.rowImg} />
      <View style={{ flex: 1, paddingHorizontal: 8 }}>
        <Text style={{ fontWeight: 'bold' }}>{tour.name}</Text>
        <Text>{tour.city}</Text>
        <Text>📅 {formatDate(tour.departure)} · {tour.days} ngày</Text>
        <Text>{tour.price.toLocaleString('vi-VN')} ₫</Text>
        <Text style={tour.seats <= 3 ? styles.redText : null}>
          {getSeatLabel(tour.seats)}
        </Text>
      </View>
      <TouchableOpacity
        testID="fav-btn"
        onPress={(e) => {
          e.stopPropagation?.();
          onToggleFavorite(tour.id, !tour.isFavorite);
        }}
      >
        <Text style={[styles.favIcon, tour.isFavorite && styles.redText]}>
          {tour.isFavorite ? '♥' : '♡'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default React.memo(TourItem);

const styles = StyleSheet.create({
  rowBox: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  rowImg: {
    width: 90,
    height: 90,
  },
  compactBox: {
    width: 160,
  },
  imgWrap: {
    width: '100%',
    aspectRatio: 4 / 3,
    position: 'relative',
  },
  compactImg: {
    width: '100%',
    height: '100%',
  },
  absFav: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#fff',
    padding: 2,
    borderRadius: 12,
  },
  favIcon: {
    fontSize: 20,
    padding: 8,
  },
  redText: {
    color: 'red',
  },
});