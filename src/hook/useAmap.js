import { useRef, useState } from 'react';
import useScript from './useScript';

const useAmap = (mapKey, securityJsCode) => {
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapURL = `https://webapi.amap.com/maps?v=2.0&key=${mapKey}`;

  window._AMapSecurityConfig = {
    securityJsCode: securityJsCode,
  };

  // 加载高德地图脚本
  useScript(mapURL, () => {
    if (!mapRef.current && window.AMap) {
      mapRef.current = new window.AMap.Map('container', {
        zoom: 5,
        center: [104.114129, 37.550339],
        zooms: [5, 5]
      });

      mapRef.current.on('complete', () => {
        setIsMapLoaded(true);
        console.log('地图加载完成');
      });
    }
  });

  return { mapRef, isMapLoaded };
};

export default useAmap;
