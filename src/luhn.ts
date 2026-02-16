const CODE_POINTS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

class GenerateOptions {
  public checkSumOnly: boolean;

  constructor() {
    this.checkSumOnly = false;
  }
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
 * Generate a Luhn checksum for a given value mod n
 *
 * @param value - The value to generate a checksum for
 * @param n - The modulus to use
 * @returns The checksum for the value mod n
 */
function generateModNChecksum(value: string, n: number): number {
  let factor = 2;
  let sum = 0;

  // Work from right to left
  for (let i = value.length - 1; i >= 0; i--) {
    // Convert character to code point (e.g., '3' -> 3, '2' -> 2)
    const codePoint = parseInt(value[i], n);
    let addend = factor * codePoint;

    // Alternate factor between 2 and 1
    factor = factor === 2 ? 1 : 2;

    // Sum digits in base n
    addend = Math.floor(addend / n) + (addend % n);
    sum += addend;
  }

  // Calculate check digit
  const remainder = sum % n;
  return (n - remainder) % n;
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

export function generateModN(value: string, n: number, options?: GenerateOptions): string {
  handleErrors(value);

  if (n <= 0 || n > CODE_POINTS.length) {
    throw new Error(`n must be between 1 and ${CODE_POINTS.length}`);
  }

  const checkSum = generateModNChecksum(value, n);
  // Convert checksum to character using CODE_POINTS
  const checkChar = CODE_POINTS[checkSum].toUpperCase();
  
  return options?.checkSumOnly ? checkChar : value + checkChar;
}

export function luhnModN(number: string, n: number) {
  // Helper function to convert characters to their numeric values
  function charToInt(char: string) {
    if (char >= '0' && char <= '9') {
      return parseInt(char);
    } else if (char >= 'A' && char <= 'Z') {
      return char.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
    } else if (char >= 'a' && char <= 'z') {
      return char.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
    } else {
      throw new Error("Invalid character: " + char);
    }
  }

  // Convert the input string to an array of integers
  const digits = number.split('').map(charToInt);

  for (let i = digits.length - 1; i >= 0; i -= 2) {
    digits[i] *= 2; 
    if (digits[i] > 9) { 
      digits[i] -= 9; // Subtract 9 only after doubling
    }
  }

 

  // Calculate the sum of all digits
  const digitSum = digits.reduce((sum: number, digit: number) => sum + digit, 0);

  // Calculate the check digit
  const checkDigit = (n - (digitSum % n)) % n;

  return checkDigit;
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
    throw new Error('string must be less than 100 characters');
  }

  if (lengthAsInteger < 2) {
    throw new Error('string must be greater than 1');
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
