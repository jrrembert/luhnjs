const CODE_POINTS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

interface GenerateOptions {
  checkSumOnly: boolean;
}

/**
   * Validates that input is a non-empty string that can be converted to a number
   *
   * @param value - String to validate
   * @throws {Error} If value is not a string, is empty, or cannot be converted to a number
   */
function handleErrors(value: string): void {
  if (typeof value !== 'string') {
    throw new Error(`value must be a string - received ${value}`);
  }

  if (!value.length) {
    throw new Error('string cannot be empty');
  }

  if (value.includes(' ')) {
    throw new Error('string cannot contain spaces');
  }

  if (value.includes('-')) {
    throw new Error('negative numbers are not allowed');
  }

  if (value.includes('.')) {
    throw new Error('floating point numbers are not allowed');
  }

  if (isNaN(+value)) {
    throw new Error('string must be convertible to a number');
  }
}

/**
 * Generates a Luhn algorithm checksum digit for a string of numbers
 *
 * @param value - String of digits to generate checksum for
 * @returns Single digit checksum value (0-9)
 */
function generateCheckSum(value: string): number {
  // convert to array
  const toArray = Array.from(value);

  // if double is `true`, multiply digit by 2
  let double = true;

  // starting from right, iterate through each value multiplying every 2nd digit by 2
  const sum = toArray.reduceRight((prev, current) => {
    if (double) {
      double = false;
      const temp: number = parseInt(current) * 2;

      // if value is greater than or equal to 10, sum each digit of value ie. if value is 15, use 1 + 5 to get value
      if (temp >= 10) {
        return prev + Array.from(temp.toString()).reduce((prev, current) => {
          return prev + parseInt(current);
        }, 0);
      }

      return prev + parseInt(current) * 2;
    }

    double = true;

    return prev + parseInt(current);
  }, 0);

  return (10 - (sum % 10)) % 10;
}

/**
   * Calculate and append Luhn algorithm checksum to a given value
   *
   * @param value string of digits to generate checksum for
   * @param options.checkSumOnly if true, returns only the checksum digit; if false, returns value with checksum appended
   * @returns string containing either the checksum digit alone or the input value with checksum appended
   */
export function generate(value: string, options?: GenerateOptions): string {
  handleErrors(value);

  const checkSum = generateCheckSum(value).toString();

  return options?.checkSumOnly ? checkSum : value.concat(checkSum);
}

/**
   * Determine if the Luhn checksum for a given number is correct
   *
   * @param value string containing digits with a Luhn checksum as the last digit
   * @returns boolean indicating whether the checksum is valid
   */
export function validate(value: string): boolean {
  handleErrors(value);

  if (value.length === 1) {
    throw new Error('string must be longer than 1 character');
  }

  const valueWithoutCheckSum = value.substring(0, value.length - 1);

  return value === generate(valueWithoutCheckSum);
}

/**
 * Generate a random number with valid Luhn checksum
 *
 * @param length string containing the desired length of the generated number
 * @returns string containing random digits with valid Luhn checksum
 */
export function random(length: string): string {
  handleErrors(length);

  const lengthAsInteger = parseInt(length);

  if (lengthAsInteger > 100) {
    throw new Error('length must be less than or equal to 100');
  }

  if (lengthAsInteger < 2) {
    throw new Error('length must be greater than or equal to 2');
  }

  const random = Array.from({ length: lengthAsInteger - 1 }, (_, index) => {
    // Ensure the first digit is not zero
    if (index === 0) {
      return Math.floor(Math.random() * 9) + 1; // 1 to 9
    }

    return Math.floor(Math.random() * 10);
  }).join('');

  return generate(random);
}

/**
 * Calculate and append a Luhn mod-N checksum to a numeric string
 *
 * @param value - Numeric string to generate checksum for
 * @param n - Modulus (base) between 1 and 36
 * @param options.checkSumOnly - If true, returns only the checksum character
 * @returns String containing either the checksum character alone or input with checksum appended
 */
export function generateModN(value: string, n: number, options?: GenerateOptions): string {
  handleErrors(value);

  if (n < 1 || n > 36) {
    throw new Error('n must be between 1 and 36');
  }

  const checkSum = checksumModN(value, n);
  const checkChar = CODE_POINTS[checkSum];

  return options?.checkSumOnly ? checkChar : value.concat(checkChar);
}

/**
 * Determine if the Luhn mod-N checksum for a given value is correct
 *
 * @param value - Numeric string where the last character is the check character
 * @param n - Modulus (base) between 1 and 36
 * @returns boolean indicating whether the checksum is valid
 */
export function validateModN(value: string, n: number): boolean {
  if (typeof value !== 'string') {
    throw new Error(`value must be a string - received ${value}`);
  }

  if (!value.length) {
    throw new Error('string cannot be empty');
  }

  if (value.length === 1) {
    throw new Error('string must be longer than 1 character');
  }

  if (n < 1 || n > 36) {
    throw new Error('n must be between 1 and 36');
  }

  const valueWithoutCheckSum = value.substring(0, value.length - 1);

  return value === generateModN(valueWithoutCheckSum, n);
}

/**
 * Convert a character to its code point index (0-9, A-Z, case-insensitive)
 */
function charToInt(char: string): number {
  const index = CODE_POINTS.indexOf(char.toUpperCase());

  if (index === -1) {
    throw new Error(`Invalid character: ${char}`);
  }

  return index;
}

/**
 * Calculate Luhn mod-N check digit for an alphanumeric string
 *
 * @param value - Alphanumeric string to calculate check digit for
 * @param n - Modulus (base) to use for the algorithm
 * @returns Check digit as a number
 */
export function checksumModN(value: string, n: number): number {
  if (typeof value !== 'string') {
    throw new Error(`value must be a string - received ${value}`);
  }

  if (!value.length) {
    throw new Error('string cannot be empty');
  }

  if (n < 1 || n > 36) {
    throw new Error('n must be between 1 and 36');
  }

  const chars = Array.from(value);
  let factor = 2;
  let sum = 0;

  for (let i = chars.length - 1; i >= 0; i--) {
    let addend = charToInt(chars[i]) * factor;
    addend = Math.floor(addend / n) + (addend % n);
    sum += addend;
    factor = factor === 2 ? 1 : 2;
  }

  return (n - (sum % n)) % n;
}
