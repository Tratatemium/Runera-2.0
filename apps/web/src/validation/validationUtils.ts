function checkEmpty(value: string, name: string) {
  if (value.trim() === "") {
    return `${name} can not be empty.`;
  }
}

function checkLength(
  value: string,
  name: string,
  min: number | null,
  max: number | null,
) {
  const length = value.length;
  if (min !== null && length < min) {
    return `${name} must be at least ${min} characters.`;
  }
  if (max !== null && length > max) {
    return `${name} cannot exceed ${max} characters.`;
  }
}

function checkWhitespace(value: string, name: string) {
  if (/\s/.test(value)) {
    return `${name} cannot contain spaces.`;
  }
}

function checkNumberGreaterThanZero(value: string, name: string) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return `${name} must be a number.`;
  }

  if (numberValue <= 0) {
    return `${name} must be greater than 0.`;
  }
}

export { checkEmpty, checkLength, checkWhitespace, checkNumberGreaterThanZero };
