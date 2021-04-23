export default (id, url, callback) => {
  const scriptId = `script-${id}`;
  const existingScript = document.getElementById(scriptId);

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = url;
    script.id = scriptId;
    document.body.appendChild(script);

    script.onload = () => {
      if (callback) callback();
    };
  }

  if (existingScript && callback) callback();
};
