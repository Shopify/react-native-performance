let counter = 0;
export default function inMemoryCounter(): string {
  const current = counter;
  counter += 1;
  return `${current}`;
}
