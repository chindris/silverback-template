export const truncateString = ({ value, maxChar }: { value: string; maxChar: number }): string => {
  if (value.length <= maxChar) {
    return value;
  }

  // Split the string into words
  const words = value.split(' ');

  let result = '';
  for (const word of words) {
    if (result.length + word.length + 1 > maxChar) {
      break;
    }
    result += (result ? ' ' : '') + word;
  }

  return result + '...';
};
