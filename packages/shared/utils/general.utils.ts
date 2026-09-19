function hasKey<T extends object, K extends PropertyKey>(
  obj: T,
  key: K,
): key is K & keyof T {
  return Object.hasOwn(obj, key);
}

function assertAllowed<const A extends readonly unknown[]>(
  value: unknown,
  valueName: string,
  allowed: A,
): asserts value is A[number] {
  if (!allowed.includes(value))
    throw new Error(
      `${valueName} must be one of: "${allowed.join(", ")}", got: "${value}"`,
    );
}

export { hasKey, assertAllowed };
