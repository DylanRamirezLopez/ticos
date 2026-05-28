// #6: Validación de datos rigurosa centralizada
const validate = {
  string: (field, value, { maxLen = 10000, minLen = 1, required = true } = {}) => {
    const errors = [];
    if (required && (!value || typeof value !== 'string' || !value.trim())) {
      errors.push(`${field} is required`);
    } else if (value && typeof value === 'string') {
      if (value.trim().length < minLen) errors.push(`${field} must be at least ${minLen} characters`);
      if (value.trim().length > maxLen) errors.push(`${field} must be at most ${maxLen} characters`);
    }
    return errors;
  },

  email: (value) => {
    const errors = [];
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.push('Valid email is required');
    }
    return errors;
  },

  username: (value) => {
    const errors = [];
    if (!value || !/^[a-zA-Z0-9_]{3,30}$/.test(value)) {
      errors.push('Username must be 3-30 characters, letters, numbers, underscores only');
    }
    return errors;
  },

  password: (value) => {
    const errors = [];
    if (!value || value.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    if (value && value.length > 128) {
      errors.push('Password must be at most 128 characters');
    }
    return errors;
  },

  objectId: (value, field = 'ID') => {
    const errors = [];
    if (!value || !/^[0-9a-fA-F]{24}$/.test(value)) {
      errors.push(`Invalid ${field}`);
    }
    return errors;
  },

  boolean: (value, field = 'Field') => {
    const errors = [];
    if (value !== undefined && value !== null && typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
      errors.push(`${field} must be a boolean`);
    }
    return errors;
  },

  reactions: ['❤️', '🫂', '💪', '😢', '😂', '🔥', '🕊️', '💡'],

  sanitize: (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>]/g, '').trim();
  },
};

module.exports = validate;
