const luhn = require('./index').default;


test('should throw error when string is empty', () => {
  const actual = () => luhn.generate('');

  expect(actual).toThrow(expect.objectContaining({ message: 'string cannot be empty' }));
});

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
])('should generate $expected', ({ value, expected }) => {
  const actual = luhn.generate(value);

  expect(actual).toBe(expected);
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
  ])('should return false if value contains an invalid check digit', ({ value, expected }) => {
    const actual = luhn.validate(value);

    expect(actual).toBe(expected);
  });


  test.each([
    { value: '18', expected: true },
    { value: '125', expected: true },
    { value: '1230', expected: true },
  ])('should return true if value contains a valid check digit', ({ value, expected}) => {
    const actual = luhn.validate(value);

    expect(actual).toBe(expected);
  });
});
