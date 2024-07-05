export const truncateString = ({
  value,
  maxChar,
}: {
  value: string;
  maxChar: number;
}): string => {
  if (value.length <= maxChar) {
    return value;
  }

  // Split the string into words
  const words = value.split(' ');

  let result = '';
  words.forEach((word, index) => {
    if (index === 0) {
      // Skip the first word
      result = word;
      return;
    }
    if (result.length + word.length + 1 > maxChar) {
      return;
    }
    result += ' ' + word;
  });

  return result + '...';
};
