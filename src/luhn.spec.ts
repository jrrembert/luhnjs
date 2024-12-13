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
})
