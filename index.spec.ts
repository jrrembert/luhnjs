const luhn = require('./index').default;


test('should throw error is string is empty', () => {
    const actual = () => luhn.generate('')

    expect(actual).toThrow('string cannot be empty');
})

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
})
