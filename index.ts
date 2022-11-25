class GenerateOptions {
  public checkSumOnly: boolean;

  constructor() {
    this.checkSumOnly = false;
  }
}

/**
 * Verify string is correct length and can be converted to a number
 *
 * @param value potential value
 */
function handleErrors(value: string): void {
  if (!value.length) {
    throw new Error('string cannot be empty');
  }

  if (isNaN(+value)) {
    throw new Error('string must be convertible to a number');
  }
}

/**
 * Generate a checksum using Luhn algorithm
 *
 * @param value value to check
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
      const temp = parseInt(current) * 2;

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
 * Return value with checksum calculated using Luhn algorithm
 *
 * @param value value to check
 * @param options.checkSumOnly determine if value + checksum, or only checksum should be returned
 * @returns
 */
function generate(value: string, options?: GenerateOptions): string {
  handleErrors(value);

  const checkSum = generateCheckSum(value).toString();

  return options?.checkSumOnly ? checkSum : value.concat(checkSum);
}

/**
 * Determine if the Luhn checksum for a given number is correct
 *
 * @param value number containing a Luhn checksum
 * @returns
 */
function validate(value: string): boolean {
  handleErrors(value);

  if (value.length === 1) {
    throw new Error('string must be longer than 1 character');
  }

  const valueWithoutCheckSum = value.substring(0, value.length - 1);

  return value === generate(valueWithoutCheckSum);
}

export default {
  generate,
  validate,
};