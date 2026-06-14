export function useFormatters() {
  const formatViewers = (count: number): string => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  const formatDuration = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}min`;
    return `${h}h${m > 0 ? ` ${m}min` : ''}`;
  };

  const formatRating = (rating: number): string => rating.toFixed(1);

  const ageRatingColor = (rating: string) => {
    const map: Record<string, string> = {
      L: '#22C55E',
      '10': '#84CC16',
      '12': '#EAB308',
      '14': '#F97316',
      '16': '#EF4444',
      '18': '#7C3AED',
    };
    return map[rating] ?? '#6B7280';
  };

  return { formatViewers, formatDuration, formatRating, ageRatingColor };
}
