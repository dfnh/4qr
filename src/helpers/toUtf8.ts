const toUtf8 = (text: string) => {
  return unescape(encodeURIComponent(text));
};

export { toUtf8 };
