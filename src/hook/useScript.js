import { useEffect, useState } from 'react';

const useScript = (url, callback) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = () => {
      setLoaded(true);
      if (callback) callback();
    };
    script.onerror = () => {
      console.error(`Script load error for ${url}`);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url, callback]);

  return loaded;
};

export default useScript;
