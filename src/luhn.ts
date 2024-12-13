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
    throw new Error(`value must be a string - received ${value}`)
  }

  if (!value.length) {
    throw new Error('string cannot be empty');
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
    console.log('test')
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
  }).join('')

  return generate(random);
}
