/**
 * Tests unitaires pour les validateurs frontend
 */

import {
  validateFullName,
  validatePhone,
  validateEmail,
  validateDateOfBirth,
  validatePassword,
  validateLoginData,
  validateSignupStep1Data,
  validateSignupStep2Data,
  validateSignupData
} from '../validation';

describe('validateFullName', () => {
  it('should accept valid full names with 2 words', () => {
    expect(validateFullName('John Doe')).toBe(true);
    expect(validateFullName('Marie Claire')).toBe(true);
    expect(validateFullName('Jean-Pierre Dupont')).toBe(true);
  });

  it('should accept full names with more than 2 words', () => {
    expect(validateFullName('John Paul Jones')).toBe(true);
    expect(validateFullName('Marie Claire De La Fontaine')).toBe(true);
  });

  it('should reject single word names', () => {
    expect(validateFullName('John')).toBe(false);
    expect(validateFullName('Marie')).toBe(false);
  });

  it('should reject names with numbers', () => {
    expect(validateFullName('John 123')).toBe(false);
    expect(validateFullName('Marie 2024')).toBe(false);
  });

  it('should reject names with special characters', () => {
    expect(validateFullName('John@Doe')).toBe(false);
    expect(validateFullName('Marie#Claire')).toBe(false);
    expect(validateFullName('John$Doe')).toBe(false);
  });

  it('should reject empty names', () => {
    expect(validateFullName('')).toBe(false);
    expect(validateFullName('   ')).toBe(false);
  });

  it('should accept names with hyphens', () => {
    expect(validateFullName('Jean-Pierre Dupont')).toBe(true);
  });
});

describe('validatePhone', () => {
  it('should accept valid RDC phone numbers starting with +2438', () => {
    expect(validatePhone('+2438123456789')).toBe(true);
    expect(validatePhone('+2438000000000')).toBe(true);
  });

  it('should accept valid RDC phone numbers starting with +2439', () => {
    expect(validatePhone('+2439123456789')).toBe(true);
    expect(validatePhone('+2439000000000')).toBe(true);
  });

  it('should reject phone numbers with wrong country code', () => {
    expect(validatePhone('+1234567890')).toBe(false);
    expect(validatePhone('+33123456789')).toBe(false);
  });

  it('should reject phone numbers starting with +2437', () => {
    expect(validatePhone('+2437123456789')).toBe(false);
  });

  it('should reject phone numbers with wrong length', () => {
    expect(validatePhone('+243812345678')).toBe(false); // Too short
    expect(validatePhone('+24381234567890')).toBe(false); // Too long
  });

  it('should reject phone numbers without +243 prefix', () => {
    expect(validatePhone('0812345678')).toBe(false);
    expect(validatePhone('812345678')).toBe(false);
  });

  it('should reject empty phone numbers', () => {
    expect(validatePhone('')).toBe(false);
    expect(validatePhone('   ')).toBe(false);
  });

  it('should handle phone numbers with spaces', () => {
    expect(validatePhone('+243 812 345 678 9')).toBe(true);
  });
});

describe('validateEmail', () => {
  it('should accept valid email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('user+tag@example.com')).toBe(true);
  });

  it('should reject invalid email formats', () => {
    expect(validateEmail('notanemail')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('user@.com')).toBe(false);
  });

  it('should reject empty emails', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('   ')).toBe(false);
  });

  it('should trim whitespace', () => {
    expect(validateEmail('  test@example.com  ')).toBe(true);
  });
});

describe('validateDateOfBirth', () => {
  it('should accept valid dates in DD/MM/YYYY format', () => {
    expect(validateDateOfBirth('01/01/1990')).toBe(true);
    expect(validateDateOfBirth('15/06/1985')).toBe(true);
    expect(validateDateOfBirth('31/12/2000')).toBe(true);
  });

  it('should reject invalid date formats', () => {
    expect(validateDateOfBirth('1990-01-01')).toBe(false);
    expect(validateDateOfBirth('01-01-1990')).toBe(false);
    expect(validateDateOfBirth('1/1/90')).toBe(false);
  });

  it('should reject invalid dates', () => {
    expect(validateDateOfBirth('32/01/1990')).toBe(false); // Invalid day
    expect(validateDateOfBirth('01/13/1990')).toBe(false); // Invalid month
    expect(validateDateOfBirth('31/02/1990')).toBe(false); // Invalid February date
  });

  it('should reject empty dates', () => {
    expect(validateDateOfBirth('')).toBe(false);
    expect(validateDateOfBirth('   ')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('should accept passwords with 6 or more characters', () => {
    expect(validatePassword('123456')).toBe(true);
    expect(validatePassword('password')).toBe(true);
    expect(validatePassword('verylongpassword123')).toBe(true);
  });

  it('should reject passwords shorter than 6 characters', () => {
    expect(validatePassword('12345')).toBe(false);
    expect(validatePassword('pass')).toBe(false);
  });

  it('should reject empty passwords', () => {
    expect(validatePassword('')).toBe(false);
  });

  it('should accept passwords with special characters', () => {
    expect(validatePassword('P@ssw0rd!')).toBe(true);
  });
});

describe('validateLoginData', () => {
  it('should validate correct login data with email', () => {
    const errors = validateLoginData({
      identifier: 'test@example.com',
      password: 'password123'
    });
    expect(errors).toHaveLength(0);
  });

  it('should validate correct login data with phone', () => {
    const errors = validateLoginData({
      identifier: '+2438123456789',
      password: 'password123'
    });
    expect(errors).toHaveLength(0);
  });

  it('should return error for empty identifier', () => {
    const errors = validateLoginData({
      identifier: '',
      password: 'password123'
    });
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe('identifier');
  });

  it('should return error for invalid email', () => {
    const errors = validateLoginData({
      identifier: 'invalidemail',
      password: 'password123'
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should return error for invalid phone', () => {
    const errors = validateLoginData({
      identifier: '+1234567890',
      password: 'password123'
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should return error for short password', () => {
    const errors = validateLoginData({
      identifier: 'test@example.com',
      password: '12345'
    });
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe('password');
  });

  it('should return multiple errors for multiple invalid fields', () => {
    const errors = validateLoginData({
      identifier: '',
      password: '123'
    });
    expect(errors.length).toBeGreaterThanOrEqual(2);
  });
});

describe('validateSignupStep1Data', () => {
  it('should validate correct step 1 data', () => {
    const errors = validateSignupStep1Data({
      fullName: 'John Doe',
      phone: '+2438123456789'
    });
    expect(errors).toHaveLength(0);
  });

  it('should return error for invalid full name', () => {
    const errors = validateSignupStep1Data({
      fullName: 'John',
      phone: '+2438123456789'
    });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].field).toBe('fullName');
  });

  it('should return error for invalid phone', () => {
    const errors = validateSignupStep1Data({
      fullName: 'John Doe',
      phone: '+1234567890'
    });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].field).toBe('phone');
  });
});

describe('validateSignupStep2Data', () => {
  it('should validate correct step 2 data', () => {
    const errors = validateSignupStep2Data({
      email: 'test@example.com',
      dateOfBirth: '01/01/1990'
    });
    expect(errors).toHaveLength(0);
  });

  it('should return error for invalid email', () => {
    const errors = validateSignupStep2Data({
      email: 'invalidemail',
      dateOfBirth: '01/01/1990'
    });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].field).toBe('email');
  });

  it('should return error for invalid date', () => {
    const errors = validateSignupStep2Data({
      email: 'test@example.com',
      dateOfBirth: 'invalid-date'
    });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].field).toBe('dateOfBirth');
  });
});

describe('validateSignupData', () => {
  it('should validate complete signup data', () => {
    const errors = validateSignupData({
      fullName: 'John Doe',
      phone: '+2438123456789',
      email: 'test@example.com',
      dateOfBirth: '01/01/1990'
    });
    expect(errors).toHaveLength(0);
  });

  it('should return all errors for completely invalid data', () => {
    const errors = validateSignupData({
      fullName: 'John',
      phone: 'invalid',
      email: 'invalid',
      dateOfBirth: 'invalid'
    });
    expect(errors.length).toBeGreaterThanOrEqual(4);
  });
});



