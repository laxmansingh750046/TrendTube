export const validators = {
  username: (value) => {
    const errors = [];
    if (!value) {
      errors.push('Username is required');
    } else if (value.length < 3) {
      errors.push('Username must be at least 3 characters');
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }
    return errors;
  },

  email: (value) => {
    const errors = [];
    if (!value) {
      errors.push('Email is required');
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
      errors.push('Please enter a valid email address');
    }
    return errors;
  },

  fullName: (value) => {
    const errors = [];
    if (!value) {
      errors.push('Full name is required');
    } else if (value.length < 2) {
      errors.push('Full name must be at least 2 characters');
    }
    return errors;
  },

  password: (value) => {
    const errors = [];
    if (!value) {
      errors.push('Password is required');
    } else if (value.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    return errors;
  },

  avatar: (file) => {
    const errors = [];
    if (!file) {
      errors.push('Profile picture is required');
      return errors;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      errors.push('Maximum file size is 10MB');
    }
    
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!acceptedTypes.includes(file.type)) {
      errors.push('Only JPEG, PNG, and GIF are allowed');
    }
    
    return errors;
  }
};

export const successChecks = {
  username: (value) => value && value.length >= 3,
  email: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value),
  fullName: (value) => value && value.length >= 2,
  password: (value) => value && value.length >= 6,
  avatar: (file) => {
    if (!file) return false;
    const validSize = file.size <= 10 * 1024 * 1024;
    const validType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
    return validSize && validType;
  }
};