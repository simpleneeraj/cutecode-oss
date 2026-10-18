const download = (source: Blob | string, filename: string) => {
  const link = document.createElement("a");
  link.download = filename;

  if (typeof source === "string") {
    link.href = source;
    link.click();
    return;
  }

  const url = URL.createObjectURL(source);
  link.href = url;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export default download;
