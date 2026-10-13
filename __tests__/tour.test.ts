import { groupByCity, formatDate, getSeatLabel, Tour } from '../utils/tour';

const mockTours: Tour[] = [
  { id: '1', name: 'T1', city: 'B', days: 1, price: 100, seats: 5, departure: '2026-11-20', image: '', isFavorite: false },
  { id: '2', name: 'T2', city: 'A', days: 1, price: 100, seats: 2, departure: '2026-11-15', image: '', isFavorite: true },
  { id: '3', name: 'T3', city: 'A', days: 1, price: 100, seats: 0, departure: '2026-11-05', image: '', isFavorite: false },
];

test('groupByCity', () => {
  const g = groupByCity(mockTours);
  expect(g.length).toBe(2);
  expect(g[0].title).toBe('A');
  expect(g[1].title).toBe('B');
  expect(g[0].data[0].departure).toBe('2026-11-05');
  expect(g[0].data[1].departure).toBe('2026-11-15');
});

test('formatDate', () => {
  expect(formatDate('2026-11-05')).toBe('05/11/2026');
});

test('getSeatLabel', () => {
  expect(getSeatLabel(0)).toBe('Hết chỗ');
  expect(getSeatLabel(3)).toBe('Chỉ còn 3 chỗ');
  expect(getSeatLabel(4)).toBe('Còn 4 chỗ');
});