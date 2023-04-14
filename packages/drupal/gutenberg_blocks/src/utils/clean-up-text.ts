export const trim = (text: string, delimiter: string) => {
  let result = text;
  while (result.startsWith(delimiter)) {
    result = result.substring(delimiter.length);
  }
  while (result.endsWith(delimiter)) {
    result = result.substring(0, result.length - delimiter.length);
  }
  return result;
};

export const cleanUpText = (
  text: string,
  allowedTags?: Array<string> | 'all',
) => {
  const cleanedText = text
    // When copying text from Word, HsTML comments are escaped. So we get this:
    // ...<br>&lt;!-- /* Font Definitions */ @font-face {...} --&gt;<br>...
    // Unescape them back. This should be enough for the editor to remove then
    // the comments.
    .replace('&lt;!--', '<!--')
    .replace('--&gt;', '-->')
    // Now clean all comment tags.
    .replace(/(<!--(.*?)-->)/gi, '');
  // If we allow all tags, we still want to trim the br tags from the text.
  if (allowedTags === 'all') {
    return trim(cleanedText, '<br>');
  }
  const regexTags: Array<string> = [];
  if (allowedTags) {
    allowedTags.map((allowedTag) => {
      regexTags.push(`(${allowedTag})`);
    });
  }
  const allowedTagsRegex = regexTags.length ? `(${regexTags.join('|')})` : '';
  const regexp = new RegExp('<(?!/?' + allowedTagsRegex + '>)[^>]*>', 'gi');
  return cleanedText.replace(regexp, '');
};
