const exportJson = (value: object) => {
  return `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(value))}`;
};

export { exportJson };
