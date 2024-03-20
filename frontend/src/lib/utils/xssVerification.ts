export const containsHtmlTags = (str: string) => {
  // Regular expression to match a string that contains something that looks like an HTML tag
  const regex = /<[^>]+>/;
  return regex.test(str);
};

export const removesHtmlTags = (str: string) => {
  const regex = /<[^>]*>.*?<\/[^>]*>/g;
  return str.replace(regex, '');
};
