const AVATAR_ILLUSTRATIONS = [
  'https://api.dicebear.com/7.x/avataaars/png?seed=1&backgroundColor=8A4DFF',
  'https://api.dicebear.com/7.x/avataaars/png?seed=2&backgroundColor=8A4DFF',
  'https://api.dicebear.com/7.x/avataaars/png?seed=3&backgroundColor=8A4DFF',
  'https://api.dicebear.com/7.x/avataaars/png?seed=4&backgroundColor=8A4DFF',
  'https://api.dicebear.com/7.x/avataaars/png?seed=5&backgroundColor=8A4DFF',
  'https://api.dicebear.com/7.x/avataaars/png?seed=6&backgroundColor=8A4DFF',
  'https://api.dicebear.com/7.x/avataaars/png?seed=7&backgroundColor=8A4DFF',
  'https://api.dicebear.com/7.x/avataaars/png?seed=8&backgroundColor=8A4DFF',
  'https://api.dicebear.com/7.x/avataaars/png?seed=9&backgroundColor=8A4DFF',
  'https://api.dicebear.com/7.x/avataaars/png?seed=10&backgroundColor=8A4DFF',
];

export const getRandomAvatar = (userId?: number | string): string => {
  const seed = userId ? String(userId) : Date.now().toString();
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % AVATAR_ILLUSTRATIONS.length;
  return AVATAR_ILLUSTRATIONS[index];
};

export const getAvatarForUser = (userId?: number | string): string => {
  if (!userId) {
    return getRandomAvatar();
  }
  return `https://api.dicebear.com/7.x/avataaars/png?seed=${userId}&backgroundColor=8A4DFF`;
};




