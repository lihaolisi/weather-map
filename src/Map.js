import React, { useEffect } from 'react';
import axios from 'axios';
import useAmap from './hook/useAmap';


const Map = () => {
  const HE_WEATHER_API_KEY = 'bafb0b3a0a98472a9cda6217abf81adc';
  const mapKey = 'e58946a8871db2a02accf4b18750446d';
  const securityJsCode = '63d4fa484ed7948e9dd9e296359670c1';
  const { mapRef, isMapLoaded } = useAmap(mapKey, securityJsCode);


  const cities = ["北京", "上海", "广州", "成都", "杭州", "武汉", "南京", "西安", "沈阳", "长春"];

  useEffect(() => {
    if (isMapLoaded && mapRef.current != null) {
      window.AMap.plugin('AMap.Geocoder', () => {
        const geocoder = new window.AMap.Geocoder();

        cities.forEach(city => {
          geocoder.getLocation(city, (status, result) => {
            if (status === 'complete' && result.geocodes.length > 0) {
              // console.log(`获取 ${city} 的位置成功`, result);

              var position = result.geocodes[0].location;
              const marker = new window.AMap.Marker({
                // icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
                isCustom: true,
                position,
                title: city,
              });

              mapRef.current.add(marker);

              marker.on('click', (e) => {

                axios.get(`https://devapi.qweather.com/v7/weather/7d?location=${e.lnglat.lng},${e.lnglat.lat}&key=${HE_WEATHER_API_KEY}`)
                  .then(response => {
                    const weatherContent = `
                      <div class="p-4 bg-white rounded-lg shadow-md min-w-xs">
                        <h3 class="text-lg font-bold mb-2 text-center">${city} 七天天气预报</h3>
                        <ul class="space-y-2 h-[30vh] overflow-y-auto">
                          ${response.data.daily.map(day => `
                            <li class="flex justify-between items-center space-x-[20px] md:flex-row flex-col p-2 border-b border-gray-200">
                              <div class="font-medium">${day.fxDate}</div>
                              <div class="text-gray-600">${day.textDay}</div>
                              <div class="text-blue-500">${day.tempMin}°C / ${day.tempMax}°C</div>
                            </li>
                          `).join('')}
                        </ul>
                      </div>
                    `;
                    const infoWindow = new window.AMap.InfoWindow({
                      offset: new window.AMap.Pixel(0, -30),
                      position: marker.getPosition(),
                      closeWhenClickMap: true,
                      isCustom: true,
                      autoMove: false,
                    });

                    infoWindow.setContent(weatherContent); // 设置信息窗体内容
                    infoWindow.open(mapRef.current, marker.getPosition()); // 打开信息窗体

                  })
                  .catch(error => {
                    console.error('Error fetching weather data:', error);
                  });

              });
            } else {
              console.error(`获取 ${city} 的位置失败`, result);
            }
          });
        });
      });

      const handleResize = () => {
        if (mapRef.current) {
          mapRef.current.setFitView();
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isMapLoaded]);

  return (
    <div className="flex flex-col items-center">
      <div id="container" style={{ width: '100%', height: '100vh' }}></div>
    </div>
  );
};

export default Map;
