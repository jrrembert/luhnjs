function generate (value: string): string {
  if (!value.length) {
    throw new Error('string cannot be empty');
  }

  // convert to array
  const toArray = Array.from(value);

  // if double is true, multiply digit by 2
  let double = true;

  // iterate through value, multiplying value by 2 for every 2nd digit
  const sum = toArray.reduceRight((prev, current) => {
    if (double === true) {
      double = false;
      const temp = parseInt(current) * 2;

      // if value is greater than or equal to 10, sum each digit ie. if value is 15, use 1 + 5 to get value
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

  const checkDigit = (10 - (sum % 10)) % 10;

  return value.concat(checkDigit.toString());
}

/**
 * Determine if the Luhn checkdigit for a given number is correct
 * 
 * @param value number containing a Luhn checkdigit
 * @returns 
 */
function validate (value: string): boolean {
  if (!value.length) {
    throw new Error('string cannot be empty');
  }

  if (value.length === 1) {
    throw new Error('string must be longer than 1 character');
  }

  if (isNaN(+value)) {
    throw new Error('string must be convertible to a number');
  }

  const valueWithoutCheckDigit = value.substring(0, value.length - 1);

  return value === generate(valueWithoutCheckDigit);
}

export default {
  generate,
  validate,
};