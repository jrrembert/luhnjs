# luhnjs Specification

> Canonical specification for all language ports of the Luhn algorithm library.

## 1. High-Level Objective

Provide a minimal, dependency-free library that implements the [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm) (ISO/IEC 7812-1) for:

- **Generating** a check digit for a numeric string
- **Validating** whether a numeric string has a correct Luhn check digit
- **Generating random** numeric strings with valid Luhn checksums

The library is used primarily for credit card number validation, but the algorithm applies to any numeric identifier that uses Luhn checksums (IMEI numbers, National Provider Identifiers, etc.).

## 2. Public API

### `generate(value, options?) -> string`

Calculate and append a Luhn check digit to `value`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `value` | `string` | yes | Numeric string to compute a check digit for |
| `options.checkSumOnly` | `boolean` | no | Default `false`. When `true`, return only the check digit instead of `value + checkDigit` |

**Returns:**
- If `checkSumOnly` is `false` (default): the original `value` with the check digit appended (e.g. `"123"` -> `"1230"`)
- If `checkSumOnly` is `true`: the check digit alone as a single-character string (e.g. `"123"` -> `"0"`)

**Errors:** Applies [input validation](#4-input-validation) on `value`.

### `validate(value) -> boolean`

Determine whether `value` has a valid Luhn check digit as its last character.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `value` | `string` | yes | Numeric string where the last digit is the check digit |

**Returns:** `true` if the check digit is valid, `false` otherwise.

**Errors:** Applies [input validation](#4-input-validation) on `value`, plus:

| Condition | Error message |
|---|---|
| `value` has length 1 | `string must be longer than 1 character` |

**Behavior:** Strips the last character (the check digit), runs `generate` on the remainder, and compares the result to the original `value`.

### `random(length) -> string`

Generate a random numeric string of the specified length with a valid Luhn check digit as the last digit.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `length` | `string` | yes | Desired length of the output string (as a numeric string) |

**Returns:** A numeric string of exactly `length` characters with a valid Luhn checksum. The first digit is never zero.

**Errors:** Applies [input validation](#4-input-validation) on `length`, plus:

| Condition | Error message |
|---|---|
| Parsed integer > 100 | `string must be less than 100 characters` |
| Parsed integer < 2 | `string must be greater than 1` |

**Behavior:**
1. Generate `length - 1` random digits (first digit is 1-9, remaining digits are 0-9)
2. Pass the random digits to `generate` to append a valid check digit
3. Return the full string

### `generateModN(value, n, options?) -> string`

Luhn mod-N variant that computes a check character from an expanded alphabet.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `value` | `string` | yes | Alphanumeric string to compute a check character for |
| `n` | `number` | yes | Modulus (1 to 36 inclusive, matching the `CODE_POINTS` alphabet `0-9A-Z`) |
| `options.checkSumOnly` | `boolean` | no | Default `false`. When `true`, return only the check character |

**Errors:** Applies [mod-N input validation](#mod-n-input-validation) on `value`, plus:

| Condition | Error message |
|---|---|
| `n` <= 0 or `n` > 36 | `n must be between 1 and 36` |

### `validateModN(value, n) -> boolean`

Determine whether `value` has a valid Luhn mod-N check character as its last character.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `value` | `string` | yes | String where the last character is the check character |
| `n` | `number` | yes | Modulus (1 to 36 inclusive) |

**Returns:** `true` if the check character is valid, `false` otherwise.

**Errors:** Applies [mod-N input validation](#mod-n-input-validation) on `value` (including the check character), plus:

| Condition | Error message |
|---|---|
| Length is 1 | `string must be longer than 1 character` |
| `n` < 1 or `n` > 36 | `n must be between 1 and 36` |

**Behavior:** Strips the last character (the check character), runs `generateModN` on the remainder, and compares the result to the original `value`.

### `checksumModN(value, n) -> number`

Lower-level mod-N check digit calculation. Accepts alphanumeric input (`0-9`, `A-Z`, `a-z`), returns the check digit as an integer.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `value` | `string` | yes | Alphanumeric string |
| `n` | `number` | yes | Modulus (1 to 36 inclusive) |

**Errors:** Applies [mod-N input validation](#mod-n-input-validation) on `value`, plus:

| Condition | Error message |
|---|---|
| `n` < 1 or `n` > 36 | `n must be between 1 and 36` |

## 3. Algorithm

The Luhn algorithm computes a single check digit (0-9) for a given numeric string. All ports must implement this exact procedure.

### Checksum Calculation

Given an input string of digits (the "payload", **without** a check digit):

```
INPUT:  "7992739871"

1. Convert to array of digits:
   [7, 9, 9, 2, 7, 3, 9, 8, 7, 1]

2. Traverse from RIGHT to LEFT.
   Starting from the rightmost digit, DOUBLE every other digit
   (i.e. the 1st, 3rd, 5th, ... digits from the right):

   Position (from right):  1   2   3   4   5   6   7   8   9  10
   Original digit:         1   7   8   9   3   7   2   9   9   7
   Action:                 x2      x2      x2      x2      x2
   After doubling:         2   7  16   9   6   7   4   9  18   7

3. If a doubled value >= 10, sum its individual digits:
   16 -> 1 + 6 = 7
   18 -> 1 + 8 = 9

   Result:                 2   7   7   9   6   7   4   9   9   7

4. Sum all values:
   2 + 7 + 7 + 9 + 6 + 7 + 4 + 9 + 9 + 7 = 67

5. Check digit = (10 - (sum % 10)) % 10
                = (10 - (67 % 10)) % 10
                = (10 - 7) % 10
                = 3
```

### Pseudocode

```
function generateCheckSum(value):
    digits = toArrayOfCharacters(value)
    shouldDouble = true
    sum = 0

    for i from (length(digits) - 1) down to 0:
        digit = toInteger(digits[i])

        if shouldDouble:
            doubled = digit * 2
            if doubled >= 10:
                // Sum individual digits of the doubled value
                sum = sum + floor(doubled / 10) + (doubled % 10)
            else:
                sum = sum + doubled
            shouldDouble = false
        else:
            sum = sum + digit
            shouldDouble = true

    return (10 - (sum % 10)) % 10
```

### Validation via Generation

`validate(value)` does **not** re-implement the algorithm. It works by:

1. Stripping the last digit from `value` to get `payload`
2. Calling `generate(payload)` to get `payload + correctCheckDigit`
3. Returning `value == payload + correctCheckDigit`

## 4. Input Validation

All three public functions validate their input through a shared routine. Checks are applied **in order** — the first failing check throws and subsequent checks are skipped.

| Order | Condition | Error message |
|---|---|---|
| 1 | Value is not a string | `value must be a string - received <value>` |
| 2 | String is empty (length 0) | `string cannot be empty` |
| 3 | String contains spaces | `string cannot contain spaces` |
| 4 | String contains `-` | `negative numbers are not allowed` |
| 5 | String contains `.` | `floating point numbers are not allowed` |
| 6 | String cannot be converted to a number | `string must be convertible to a number` |

> **Note:** In check #1, `<value>` is the literal string representation of the received value (e.g. `null`, `undefined`, `42`).

**Function-specific validation** (applied *after* the shared checks):

| Function | Condition | Error message |
|---|---|---|
| `validate` | Length is 1 | `string must be longer than 1 character` |
| `random` | Parsed integer > 100 | `string must be less than 100 characters` |
| `random` | Parsed integer < 2 | `string must be greater than 1` |

### Mod-N Input Validation

The mod-N functions (`generateModN`, `validateModN`, `checksumModN`) use a separate validation routine tailored for alphanumeric input. Checks are applied **in order** — the first failing check returns an error and subsequent checks are skipped.

| Order | Condition | Error message |
|---|---|---|
| 1 | Value is not a string | `value must be a string - received <value>` |
| 2 | String is empty (length 0) | `string cannot be empty` |
| 3 | String contains spaces | `string cannot contain spaces` |
| 4 | Character not in valid `CODE_POINTS` for the given `n` | `invalid character: <char>` |

> **Note:** The empty and spaces checks are shared with the base validation. The numeric-specific checks (negative, float, non-numeric) are replaced by per-character validation against the `CODE_POINTS` alphabet, since mod-N accepts alphanumeric input. Characters like `-` and `.` that would trigger specific errors in the base functions will produce the generic `invalid character` error in mod-N functions.
>
> For `validateModN`, the entire input string is validated (including the check character position) before processing.

## 5. Test Vectors

Every port must pass all of the following test cases.

### `generate` — checksum only

| Input | Expected checksum |
|---|---|
| `"1"` | `"8"` |
| `"12"` | `"5"` |
| `"123"` | `"0"` |
| `"1234"` | `"4"` |
| `"12345"` | `"5"` |
| `"123456"` | `"6"` |
| `"1234567"` | `"4"` |
| `"12345678"` | `"2"` |
| `"123456789"` | `"7"` |
| `"7992739871"` | `"3"` |

### `generate` — full output (value + checksum)

| Input | Expected output |
|---|---|
| `"1"` | `"18"` |
| `"12"` | `"125"` |
| `"123"` | `"1230"` |
| `"1234"` | `"12344"` |
| `"12345"` | `"123455"` |
| `"123456"` | `"1234566"` |
| `"1234567"` | `"12345674"` |
| `"12345678"` | `"123456782"` |
| `"123456789"` | `"1234567897"` |
| `"7992739871"` | `"79927398713"` |

### `generate` — edge cases

| Input | Expected | Notes |
|---|---|---|
| `"0"` | `"00"` | Leading zero preserved |
| `"00123"` | `"001230"` | Multiple leading zeros preserved |

### `validate` — valid checksums

| Input | Expected |
|---|---|
| `"18"` | `true` |
| `"125"` | `true` |
| `"1230"` | `true` |
| `"001230"` | `true` (leading zeros) |

### `validate` — invalid checksums

| Input | Expected |
|---|---|
| `"10"` | `false` |
| `"120"` | `false` |
| `"1231"` | `false` |

### `random`

For `random`, the output is non-deterministic, so test the following properties:

- Output length equals the requested length
- Output passes `validate`
- Output contains only digit characters (`/^\d+$/`)
- The first digit is not zero
- 100 consecutive calls produce 100 unique values (length `"10"`)
- Distribution is roughly uniform (within 40% margin over 1000 iterations at length `"2"`)

### Error cases

| Function | Input | Expected error message |
|---|---|---|
| `generate` | `""` | `string cannot be empty` |
| `generate` | `"1a"` | `string must be convertible to a number` |
| `generate` | `" 123 "` | `string cannot contain spaces` |
| `generate` | `"-123"` | `negative numbers are not allowed` |
| `generate` | `"123.45"` | `floating point numbers are not allowed` |
| `validate` | `""` | `string cannot be empty` |
| `validate` | `"1"` | `string must be longer than 1 character` |
| `validate` | `"1a"` | `string must be convertible to a number` |
| `validate` | `" 1230 "` | `string cannot contain spaces` |
| `validate` | `"-1230"` | `negative numbers are not allowed` |
| `validate` | `"123.40"` | `floating point numbers are not allowed` |
| `random` | `null` | `value must be a string - received null` |
| `random` | `undefined` | `value must be a string - received undefined` |
| `random` | `""` | `string cannot be empty` |
| `random` | `"1a"` | `string must be convertible to a number` |
| `random` | `"1"` | `string must be greater than 1` |
| `random` | `"1"` repeated 99 times | `string must be less than 100 characters` |
| `generateModN` | `""`, n=10 | `string cannot be empty` |
| `generateModN` | `" A "`, n=36 | `string cannot contain spaces` |
| `generateModN` | `"A-B"`, n=36 | `invalid character: <->` |
| `generateModN` | `"A.B"`, n=36 | `invalid character: <.>` |
| `generateModN` | `"A!"`, n=36 | `invalid character: <!>` |
| `generateModN` | `"A"`, n=10 | `invalid character: <A>` |
| `validateModN` | `""`, n=10 | `string cannot be empty` |
| `validateModN` | `"A"`, n=36 | `string must be longer than 1 character` |
| `validateModN` | `" AB "`, n=36 | `string cannot contain spaces` |
| `validateModN` | `"1a"`, n=10 | `invalid character: <a>` |
| `checksumModN` | `""`, n=10 | `string cannot be empty` |
| `checksumModN` | `" A "`, n=36 | `string cannot contain spaces` |
| `checksumModN` | `"A!"`, n=36 | `invalid character: <!>` |

## 6. Constraints & Boundaries

| Constraint | Value | Notes |
|---|---|---|
| Minimum input length (`generate`) | 1 | Single digit is valid |
| Minimum input length (`validate`) | 2 | Must have at least payload + check digit |
| Minimum length (`random`) | 2 | Must have at least one random digit + check digit |
| Maximum length (`random`) | 100 | Parsed integer must be <= 100 |
| Valid input characters | `0-9` | Stable API accepts digits only |
| Check digit range | `0-9` | Single decimal digit |
| Leading zeros | Preserved | `"0"` -> `"00"`, `"00123"` -> `"001230"` |
| `random` first digit | `1-9` | Never zero |
| `CODE_POINTS` alphabet | `0-9A-Z` (36 chars) | Used by public mod-N functions |
