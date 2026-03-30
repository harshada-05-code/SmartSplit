const CATEGORY_CONFIG = {
  food: { icon: '🍕', keywords: ['pizza', 'zomato', 'swiggy', 'dinner', 'cake'] },
  travel: { icon: '🚕', keywords: ['uber', 'ola', 'auto', 'fuel', 'petrol'] },
  rent: { icon: '🏠', keywords: ['rent', 'maintenance', 'deposit'] }
};

export const suggestCategory = (desc) => {
  const text = desc.toLowerCase();
  for (const [name, config] of Object.entries(CATEGORY_CONFIG)) {
    if (config.keywords.some(kw => text.includes(kw))) {
      return { name, icon: config.icon };
    }
  }
  return { name: 'others', icon: '📦' };
};

export const getAIRecommendation = (desc) => {
  const text = desc.toLowerCase();
  if (text.includes('pizza') || text.includes('dinner')) return { cat: 'food', icon: '🍕' };
  if (text.includes('uber') || text.includes('ola')) return { cat: 'travel', icon: '🚕' };
  if (text.includes('rent') || text.includes('room')) return { cat: 'rent', icon: '🏠' };
  return { cat: 'others', icon: '📦' };
};
