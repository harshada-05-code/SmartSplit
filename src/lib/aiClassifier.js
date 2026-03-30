const CATEGORY_MAP = {
  food: ['dinner', 'pizza', 'restaurant', 'burger', 'zomato', 'swiggy', 'cafe'],
  travel: ['fuel', 'petrol', 'uber', 'ola', 'bus', 'train', 'flight', 'cab'],
  entertainment: ['movie', 'netflix', 'game', 'bowling', 'party'],
  bills: ['rent', 'electricity', 'wifi', 'water', 'gas'],
};

export const suggestCategory = (text) => {
  const input = text.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some(keyword => input.includes(keyword))) {
      return category;
    }
  }
  return 'others';
};
