import * as luhn from './luhn';

describe('generate', () => {
  describe('when `options.checkSumOnly` is undefined/null', () => {
    test.each([
      { value: '', message: 'string cannot be empty', spec: 'string is empty' },
      { value: '1a', message: 'string must be convertible to a number', spec: 'string cannot be converted to a number' },
    ])('should throw error when $spec', ({ value, message }) => {
      const actual = () => luhn.generate(value);

      expect(actual).toThrow(expect.objectContaining({ message }));
    });
    test.each([
      { value: '1', expected: '18' },
      { value: '7992739871', expected: '79927398713' },
    ])('should return value + checksum ($expected) for value = $value', ({ value, expected }) => {
      const actual = luhn.generate(value);

      expect(actual).toBe(expected);
      expect(actual.length).toBeGreaterThan(1);
    });
  });

  describe('when `options.checkSumOnly` is set to false', () => {
    const options = { checkSumOnly: false };

    test.each([
      { value: '1', expected: '18' },
      { value: '12', expected: '125' },
      { value: '123', expected: '1230' },
      { value: '1234', expected: '12344' },
      { value: '12345', expected: '123455' },
      { value: '123456', expected: '1234566' },
      { value: '1234567', expected: '12345674' },
      { value: '12345678', expected: '123456782' },
      { value: '123456789', expected: '1234567897' },
      { value: '7992739871', expected: '79927398713' },
    ])('should return value + checksum ($expected) for value = $value', ({ value, expected }) => {
      const actual = luhn.generate(value, options);

      expect(actual).toBe(expected);
    });
  });

  describe('when `options.checkSumOnly` is set to true', () => {
    const options = { checkSumOnly: true };

    test.each([
      { value: '1', expected: '8' },
      { value: '12', expected: '5' },
      { value: '123', expected: '0' },
      { value: '1234', expected: '4' },
      { value: '12345', expected: '5' },
      { value: '123456', expected: '6' },
      { value: '1234567', expected: '4' },
      { value: '12345678', expected: '2' },
      { value: '123456789', expected: '7' },
      { value: '7992739871', expected: '3' },
    ])('should return checksum only ($expected) for value = $value', ({ value, expected }) => {
      const actual = luhn.generate(value, options);

      expect(actual).toBe(expected);
    });
  });

  describe('edge cases', () => {
    test.each([
      { value: '0', expected: '00', spec: 'leading zero' },
      { value: '00123', expected: '001230', spec: 'multiple leading zeros' },
      { value: ' 123 ', message: 'string cannot contain spaces', spec: 'string with spaces' },
      { value: '-123', message: 'negative numbers are not allowed', spec: 'negative number' },
      { value: '123.45', message: 'floating point numbers are not allowed', spec: 'floating point' },
    ])('should handle $spec correctly', ({ value, expected, message }) => {
      if (message) {
        expect(() => luhn.generate(value)).toThrow(expect.objectContaining({ message }));
      } else {
        const actual = luhn.generate(value);
        expect(actual).toBe(expected);
      }
    });
  });
});

describe('validate', () => {
  test.each([
    { value: '', message: 'string cannot be empty', spec: 'string is empty' },
    { value: '1', message: 'string must be longer than 1 character', spec: 'string has a length of 1' },
    { value: '1a', message: 'string must be convertible to a number', spec: 'string cannot be converted to a number' },
  ])('should throw error when $spec', ({ value, message }) => {
    const actual = () => luhn.validate(value);

    expect(actual).toThrow(expect.objectContaining({ message }));
  });

  test.each([
    { value: '10', expected: false },
    { value: '120', expected: false },
    { value: '1231', expected: false },
  ])('should return false if value ($value) contains an invalid checksum', ({ value, expected }) => {
    const actual = luhn.validate(value);

    expect(actual).toBe(expected);
  });

  test.each([
    { value: '18', expected: true },
    { value: '125', expected: true },
    { value: '1230', expected: true },
  ])('should return true if value ($value) contains a valid checksum', ({ value, expected }) => {
    const actual = luhn.validate(value);

    expect(actual).toBe(expected);
  });

  describe('edge cases', () => {
    test.each([
      { value: '001230', expected: true, spec: 'leading zeros' },
      { value: ' 1230 ', message: 'string cannot contain spaces', spec: 'string with spaces' },
      { value: '-1230', message: 'negative numbers are not allowed', spec: 'negative number' },
      { value: '123.40', message: 'floating point numbers are not allowed', spec: 'floating point' },
    ])('should handle $spec correctly', ({ value, expected, message }) => {
      if (message) {
        expect(() => luhn.validate(value)).toThrow(expect.objectContaining({ message }));
      } else {
        const actual = luhn.validate(value);
        expect(actual).toBe(expected);
      }
    });
  });
});

describe('random', () => {
  test.each([
    { length: null as any, message: 'value must be a string - received null', spec: 'string cannot be null/undefined' },
    { length: undefined as any, message: 'value must be a string - received undefined', spec: 'string cannot be null/undefined' },
    { length: '', message: 'string cannot be empty', spec: 'string is empty' },
    { length: '1a', message: 'string must be convertible to a number', spec: 'string cannot be converted to a number' },
    { length: '1', message: 'string must be greater than 1', spec: 'string has a length of 1' },
    { length: '1'.repeat(99), message: 'string must be less than 100 characters', spec: 'string is longer than 100 characters' },
  ])('should throw error when $spec', ({ length, message }) => {
    const actual = () => luhn.random(length);

    expect(actual).toThrow(expect.objectContaining({ message }));
  });

  test.each([
    { length: '2' },
    { length: '25' },
    { length: '50' },
    { length: '100' },
  ])('should return string of specified length ($length) with valid Luhn checksum appended to end', ({ length }) => {
    const value = luhn.random(length);

    const actual = luhn.validate(value);

    expect(actual).toBe(true);
    expect(value.length).toBe(parseInt(length));
  });

  describe('randomness and formatting', () => {
    test('should generate different numbers on subsequent calls', () => {
      const length = '10';
      const results = new Set();

      // Generate 100 numbers and check for duplicates
      for (let i = 0; i < 100; i++) {
        results.add(luhn.random(length));
      }

      expect(results.size).toBe(100); // All numbers should be unique
    });

    test('should only contain numeric characters', () => {
      const length = '10';
      const value = luhn.random(length);

      expect(value).toMatch(/^\d+$/);
    });

    test('generated number should pass Luhn validation', () => {
      const length = '10';
      const value = luhn.random(length);

      expect(luhn.validate(value)).toBe(true);
    });

    test('distribution should be roughly uniform', () => {
      const length = '2'; // Test single digit distribution
      const counts: Record<string, number> = {};
      const iterations = 1000;

      // Generate many numbers and count digit frequencies
      for (let i = 0; i < iterations; i++) {
        const digit = luhn.random(length);
        counts[digit] = counts[digit] ? counts[digit] + 1 : 1;
      }

      // Check if each digit appears roughly the expected number of times (within 30% margin)
      const expected = iterations / 10;

      Object.keys(counts).forEach((key: string) => {
        expect(counts[key]).toBeGreaterThan(expected * 0.6);
        expect(counts[key]).toBeLessThan(expected * 1.4);
      });
    });
  });
});

describe('generateModN', () => {
  xdescribe('input validation', () => {
    test.each([
      { value: '', n: 16, message: 'string cannot be empty', spec: 'empty string' },
      { value: '1a', n: 16, message: 'string must be convertible to a number', spec: 'non-numeric string' },
      { value: '123', n: 0, message: 'n must be between 1 and 17', spec: 'n = 0' },
      { value: '123', n: 18, message: 'n must be between 1 and 17', spec: 'n > CODE_POINTS.length' },
      { value: ' 123', n: 16, message: 'string cannot contain spaces', spec: 'string with spaces' },
      { value: '-123', n: 16, message: 'negative numbers are not allowed', spec: 'negative number' },
      { value: '123.45', n: 16, message: 'floating point numbers are not allowed', spec: 'decimal number' },
    ])('should throw error when $spec', ({ value, n, message }) => {
      const actual = () => luhn.generateModN(value, n);
      expect(actual).toThrow(expect.objectContaining({ message }));
    });
  });

  xdescribe('when options.checkSumOnly is undefined/false', () => {
    test.each([
      { value: '0', n: 16, expected: '00' },
      { value: '16', n: 16, expected: '16f' },
      { value: '32', n: 16, expected: '32e' },
    ])('should return value + checksum ($expected) for value = $value, n = $n', ({ value, n, expected }) => {
      const actual = luhn.generateModN(value, n);
      expect(actual).toBe(expected);
    });
  });

  xdescribe('when options.checkSumOnly is true', () => {
    const options = { checkSumOnly: true };

    test.each([
      { value: '0', n: 16, expected: '0' },
      { value: '16', n: 16, expected: 'f' },
      { value: '32', n: 16, expected: 'e' },
    ])('should return checksum only ($expected) for value = $value, n = $n', ({ value, n, expected }) => {
      const actual = luhn.generateModN(value, n, options);
      expect(actual).toBe(expected);
    });
  });

  describe('Luhn Mod N Check Digit Calculation', () => {
    it('should calculate the correct check digit for numeric strings', () => {
      expect(luhn.luhnModN('12345', 10)).toBe(5);
    });

    it('should calculate the correct check digit for alphanumeric strings', () => {
      expect(luhn.luhnModN('A1B2C3', 10)).toBe(7);
    });

    it('should handle uppercase and lowercase letters', () => {
      expect(luhn.luhnModN('a1b2c3', 10)).toBe(7);
    });

    it('should handle different moduli', () => {
      expect(luhn.luhnModN('12345', 11)).toBe(1);
    });

    it('should throw an error for invalid characters', () => {
      expect(() => luhn.luhnModN('123@45', 10)).toThrow('Invalid character: @');
    });
  });
});
