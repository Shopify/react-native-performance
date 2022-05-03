export default function matchesPattern(
  input: string,
  pattern: string | RegExp
): boolean {
  return (
    (pattern instanceof RegExp && pattern.test(input)) || pattern === input
  );
}
