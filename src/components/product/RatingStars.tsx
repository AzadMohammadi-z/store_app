import React from 'react';
import { View } from 'react-native';
import { Star } from 'lucide-react-native';

const GOLD = '#FBBF24';

/** پنج ستاره؛ از راست پر می‌شوند */
export default function RatingStars({
  rating,
  size = 12,
}: {
  rating: number;
  size?: number;
}) {
  const filled = Math.round(rating);

  return (
    <View style={{ flexDirection: 'row-reverse', gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={1.5}
          color={i < filled ? GOLD : 'rgba(150,160,185,0.5)'}
          fill={i < filled ? GOLD : 'transparent'}
        />
      ))}
    </View>
  );
}
