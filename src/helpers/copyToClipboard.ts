const copyToClipboard = (value: string) => {
  if ('clipboard' in navigator) {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        // console.log('copied to clipboard');
      })
      .catch((err) => console.error(err));
  } else {
    console.error('navigator.clipboard is not found');
    throw new Error('navigator.clipboard is not found');
  }
};

const handleCopy = (value: string) => {
  return () => {
    copyToClipboard(value);
  };
};

export { copyToClipboard, handleCopy };
