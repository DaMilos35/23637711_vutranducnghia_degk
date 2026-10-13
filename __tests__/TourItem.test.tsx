import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TourItem from '../components/TourItem';
import { Tour } from '../utils/tour';

const tour: Tour = {
  id: '1',
  name: 'Đà Lạt Trip',
  city: 'Đà Lạt',
  days: 3,
  price: 200,
  seats: 2,
  departure: '2026-11-05',
  image: 'img.jpg',
  isFavorite: false,
};

test('compact = true an city, compact = false hien city', () => {
  const { queryByText: q1 } = render(
    <TourItem tour={tour} compact={true} onPress={jest.fn()} onToggleFavorite={jest.fn()} />
  );
  expect(q1('Đà Lạt')).toBeNull();

  const { queryByText: q2 } = render(
    <TourItem tour={tour} compact={false} onPress={jest.fn()} onToggleFavorite={jest.fn()} />
  );
  expect(q2('Đà Lạt')).not.toBeNull();
});

test('press fav-btn va press the', () => {
  const onFav = jest.fn();
  const onPress = jest.fn();
  const { getByTestId, getByText } = render(
    <TourItem tour={tour} compact={false} onPress={onPress} onToggleFavorite={onFav} />
  );

  fireEvent.press(getByTestId('fav-btn'));
  expect(onFav).toHaveBeenCalledWith('1', true);
  expect(onPress).not.toHaveBeenCalled();

  fireEvent.press(getByText('Đà Lạt Trip'));
  expect(onPress).toHaveBeenCalledWith(tour);
});