export const getCurrentUser = () => {
  const savedUser = localStorage.getItem('currentUser');

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem('currentUser');
    return null;
  }
};

export const signOutCurrentUser = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('currentUser');
};
