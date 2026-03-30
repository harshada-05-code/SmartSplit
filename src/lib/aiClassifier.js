const CATEGORY_MAP = {
  food: ['dinner', 'pizza', 'restaurant', 'burger', 'zomato', 'swiggy', 'cafe'],
  travel: ['fuel', 'petrol', 'uber', 'ola', 'bus', 'train', 'flight', 'cab'],
  entertainment: ['movie', 'netflix', 'game', 'bowling', 'party'],
  bills: ['rent', 'electricity', 'wifi', 'water', 'gas'],
};

const CATEGORY_ICONS = {
  food: '🍕',
  travel: '🚕',
  rent: '🏠',
  others: '📦'
}

export const suggestCategory = (text) => {
  const input = text.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some(keyword => input.includes(keyword))) {
      return category;
    }
  }
  return 'others';
};

export const getAIRecommendation = (desc) => {
  const text = desc.toLowerCase();
  if (text.includes('pizza') || text.includes('dinner')) return { cat: 'food', icon: '🍕' };
  if (text.includes('uber') || text.includes('ola')) return { cat: 'travel', icon: '🚕' };
  if (text.includes('rent') || text.includes('room')) return { cat: 'rent', icon: '🏠' };
  return { cat: 'others', icon: '📦' };
};
