import * as luhn from './luhn';
import { generateModN, luhnModN } from './luhn';

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
      { value: '1', expected: '18', options: undefined },
      { value: '7992739871', expected: '79927398713' },
    ])('should return value + checksum ($expected) for value = $value', ({ value, expected, options }) => {
      const actual = luhn.generate(value, options);

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
  ])('should return true if value ($value) contains a valid checksum', ({ value, expected}) => {
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
  describe('input validation', () => {
    test.each([
      { value: '', n: 10, message: 'string cannot be empty', spec: 'empty string' },
      { value: '1a', n: 10, message: 'string must be convertible to a number', spec: 'non-numeric string' },
      { value: ' 123 ', n: 10, message: 'string cannot contain spaces', spec: 'spaces' },
      { value: '-123', n: 10, message: 'negative numbers are not allowed', spec: 'negative' },
      { value: '123.45', n: 10, message: 'floating point numbers are not allowed', spec: 'floating point' },
      { value: '123', n: 0, message: 'n must be between 1 and 36', spec: 'n = 0' },
      { value: '123', n: 37, message: 'n must be between 1 and 36', spec: 'n = 37' },
    ])('should throw error for $spec', ({ value, n, message }) => {
      expect(() => generateModN(value, n)).toThrow(expect.objectContaining({ message }));
    });
  });

  describe('when options.checkSumOnly is undefined/false', () => {
    test.each([
      { value: '0', n: 16, expected: '00' },
      { value: '1', n: 10, expected: '18' },
      { value: '1', n: 16, expected: '1E' },
      { value: '16', n: 16, expected: '163' },
      { value: '32', n: 16, expected: '329' },
      { value: '123', n: 10, expected: '1230' },
      { value: '7992739871', n: 10, expected: '79927398713' },
    ])('should return $expected for ($value, $n)', ({ value, n, expected }) => {
      const actual = generateModN(value, n);

      expect(actual).toBe(expected);
    });
  });

  describe('when options.checkSumOnly is true', () => {
    const options = { checkSumOnly: true };

    test.each([
      { value: '0', n: 16, expected: '0' },
      { value: '1', n: 16, expected: 'E' },
      { value: '16', n: 16, expected: '3' },
      { value: '32', n: 16, expected: '9' },
      { value: '123', n: 10, expected: '0' },
    ])('should return $expected for ($value, $n)', ({ value, n, expected }) => {
      const actual = generateModN(value, n, options);

      expect(actual).toBe(expected);
    });
  });

  describe('edge cases', () => {
    test('leading zero', () => {
      expect(generateModN('0', 10)).toBe('00');
    });

    test('multiple leading zeros', () => {
      expect(generateModN('00123', 10)).toBe('001230');
    });

    test('n=10 matches generate for various values', () => {
      const values = ['1', '123', '7992739871'];

      values.forEach((value) => {
        expect(generateModN(value, 10)).toBe(luhn.generate(value));
      });
    });

    test('n=1 always produces check char 0', () => {
      expect(generateModN('1', 1)).toBe('10');
      expect(generateModN('123', 1)).toBe('1230');
    });

    test('n=36 boundary', () => {
      expect(generateModN('1', 36)).toBe('1Y');
    });
  });
});

describe('luhnModN', () => {
  describe('check digit calculation', () => {
    test.each([
      { value: '12345', n: 10, expected: 5, spec: 'numeric strings' },
      { value: 'A1B2C3', n: 10, expected: 2, spec: 'alphanumeric uppercase' },
      { value: 'a1b2c3', n: 10, expected: 2, spec: 'alphanumeric lowercase' },
      { value: '12345', n: 11, expected: 9, spec: 'different moduli' },
      { value: '5', n: 10, expected: 9, spec: 'single character' },
    ])('should return $expected for ($value, $n) - $spec', ({ value, n, expected }) => {
      const actual = luhnModN(value, n);

      expect(actual).toBe(expected);
    });
  });

  describe('error handling', () => {
    test.each([
      { value: '123@45', n: 10, char: '@', spec: 'invalid character' },
      { value: 'hello!', n: 10, char: '!', spec: 'special character' },
    ])('should throw error for $spec', ({ value, n, char }) => {
      expect(() => luhnModN(value, n)).toThrow(`Invalid character: ${char}`);
    });
  });
});
