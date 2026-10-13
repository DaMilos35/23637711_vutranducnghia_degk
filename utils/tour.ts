export interface Tour {
  id: string;
  name: string;
  city: string;
  days: number;
  price: number;
  seats: number;
  departure: string;
  image: string;
  isFavorite: boolean;
}

export interface CityGroup {
  title: string;
  data: Tour[];
}

export const groupByCity = (tours: Tour[]): CityGroup[] => {
  const map: Record<string, Tour[]> = {};
  tours.forEach((t) => {
    map[t.city] = map[t.city] || [];
    map[t.city].push(t);
  });

  return Object.keys(map)
    .sort((a, b) => a.localeCompare(b, 'vi'))
    .map((city) => ({
      title: city,
      data: map[city].sort((a, b) => a.departure.localeCompare(b.departure)),
    }));
};

export const formatDate = (d: string): string => {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
};

export const getSeatLabel = (s: number): string => {
  if (s === 0) return 'Hết chỗ';
  if (s <= 3) return `Chỉ còn ${s} chỗ`;
  return `Còn ${s} chỗ`;
};