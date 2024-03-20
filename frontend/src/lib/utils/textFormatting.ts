export const convertNewlinesToBreaks = (str: string) => {
  return str.replace(/\n/g, '<br>');
};
