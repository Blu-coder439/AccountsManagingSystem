import { getCurrentUser } from './auth-session';

const settingsStorageKey = (userId) =>
  userId ? `finflow-user-settings-${userId}` : 'finflow-user-settings-guest';

export const getUserSettings = (userId) => {
  const savedSettings = localStorage.getItem(settingsStorageKey(userId));

  if (!savedSettings) {
    return {};
  }

  try {
    const parsed = JSON.parse(savedSettings);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    localStorage.removeItem(settingsStorageKey(userId));
    return {};
  }
};

export const saveUserSettings = (userId, settings) => {
  localStorage.setItem(settingsStorageKey(userId), JSON.stringify(settings));
};

export { getCurrentUser };
