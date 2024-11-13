export function maxLengthMessageFactory(context: {
  requiredLength: string;
}): string {
  return `Максимальная длинна — ${context.requiredLength}`;
}
