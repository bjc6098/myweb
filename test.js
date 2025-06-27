
'use strict';

let roadLayers;
let roadLayers_flag;
let roadLayers_gps_flag;
let markerLayers;
let roadcount = 0;

const loadingModal = document.getElementById('loadingModal');
let center_lat = 0;
let center_lon = 0;

const map = new ol.Map({
target: 'map',
layers: [
new ol.layer.Tile({
    source: new ol.source.XYZ({
        projection : 'EPSG:3857',
        url : 'https://xdworld.vworld.kr/2d/Satellite/service/{z}/{x}/{y}.jpeg',
        crossOrigin: 'anonymous'
    }),
    id: 'vworld_satellite',
    visible: true
})
],

view: new ol.View({
    center: ol.proj.transform([126.660509954,37.540375191], 'EPSG:4326','EPSG:3857'),
    zoom:17
}),
});

const markerimg = new ol.style.Icon({
    anchor: [0.5, 1], // 이미지 앵커 위치
    src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // 마커 이미지 URL
    scale: 0.06 // 크기 조정
})



export function moveview(lat,log) {

    center_lat = lat*1.0;
    center_lon = log*1.0;
    SetViewCenter();
}

homeButton.addEventListener('click', function(e) {
    SetViewCenter();
});

function SetViewCenter()
{
    const center = ol.proj.transform([center_lon,center_lat], 'EPSG:4326','EPSG:3857');
    map.getView().setCenter(center); // 지도 시점 변경
    map.getView().setZoom(18); // 줌 레벨 설
}


export function Removeroad(index)
{
    for(let i = 0 ; i < roadLayers[index].length;i++)
    {
        map.removeLayer(roadLayers[index][i]);
    }
    roadLayers[index].length = 0;
}


function sendMessageToCSharp(value) {
    // C#으로 메시지 전송
    window.chrome.webview.postMessage(value);
}


// const markerStyle = new ol.style.Style({
//     image: new ol.style.Icon({
//         anchor: [0.5, 1],
//         src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // 마커 이미지 URL
//         scale: 0.06 // 크기 조정
//     }),
//     text: new ol.style.Text({
//         text: 'asd', // 표시할 텍스트
//         font: '14px Arial', // 글꼴과 크기
//         fill: new ol.style.Fill({ color: '#000' }), // 텍스트 색상
//         stroke: new ol.style.Stroke({ color: '#fff', width: 2 }), // 텍스트 외곽선
//         offsetY: -40 // 텍스트 위치 조정 (마커 위로)
//     })
// });


export function setroadcount(count,flag) {
    roadcount = count*1;
    roadLayers = new Array(roadcount);
    roadLayers_flag = new Array(roadcount);
    roadLayers_gps_flag = new Array(roadcount);
    markerLayers = new Array(roadcount);

    for(let i = 0;i < roadcount;i++)
    {
        roadLayers_flag[i] = false;
        markerLayers[i] = [];
    }

    for(let i = 0;i < flag.length;i++)
    {
        roadLayers_gps_flag[i] = flag[i]*1;
    }
}


const defaultStyle = new ol.style.Style({
    fill: new ol.style.Fill({ color: 'rgba(179, 249, 179, 0.53)' }),
    stroke: new ol.style.Stroke({ color: 'green', width: 1 }),
});

const hoverStyle = new ol.style.Style({
    fill: new ol.style.Fill({ color: 'rgba(160, 244, 209, 0.46)' }),
  stroke: new ol.style.Stroke({ color: 'red', width: 2 }), // 두껍고 빨간 외곽선
});

let hoveredFeature = null;

map.on('pointermove', function (evt) {
  // 현재 픽셀에서 feature 찾기
  const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);

  // 커서 처리
  map.getTargetElement().style.cursor = feature ? 'pointer' : '';

  if (feature !== hoveredFeature) {
    // 이전에 호버된 feature가 있으면 원래 스타일로 되돌림
    if (hoveredFeature) {
      hoveredFeature.setStyle(defaultStyle);
      hoveredFeature = null;
    }

    // 새로운 feature가 있으면 호버 스타일 적용
    if (feature) {
        if(roadfeatures.includes(feature))
        {
            feature.setStyle(hoverStyle);
            hoveredFeature = feature;
        }
    }
  }
});

map.on('singleclick', function (evt) {
  // 클릭한 위치에 있는 feature 탐색
  const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);

  if (feature) {

    if(roadfeatures.includes(feature))
    {
        sendMessageToCSharp(feature.get('name'));
    }

    // 예시: 클릭 시 스타일을 변경하고 싶을 때
    // feature.setStyle(
    //   new Style({
    //     fill: new Fill({ color: 'rgba(255, 255, 0, 0.4)' }), // 노란색 채움
    //     stroke: new Stroke({ color: 'orange', width: 3 }),
    //   })
    // );

    // 필요한 경우 다른 feature들의 스타일 초기화도 가능
    // vectorSource.getFeatures().forEach(f => {
    //   if (f !== feature) f.setStyle(defaultStyle);
    // });
  }
});


const roadfeatures = [];

export function setroads(index,lat,log,color,name) {

    const lats = [];
    const logs = [];

    for(let i = 0 ; i < lat.length;i++)
    {
        const lat2 = lat[i]*1.0;
        const log2 = log[i]*1.0;
        lats.push(lat2);
        logs.push(log2);
    }

    const coords = lats.map((lat, i) => [logs[i], lat]);
    const transformedCoords = coords.map(coord => ol.proj.fromLonLat(coord));
    const polygonGeometry = new ol.geom.Polygon([transformedCoords]);

    const polygonFeature = new ol.Feature({
        geometry: polygonGeometry,
        name: name,
    });

    polygonFeature.setStyle(
        new ol.style.Style({
            //fill: new ol.style.Fill({ color: color }),
            //stroke: new ol.style.Stroke({ color: '#0088ff', width: 2 }),
            fill: new ol.style.Fill({ color: 'rgba(179, 249, 179, 0.53)' }),
            stroke: new ol.style.Stroke({ color: 'green', width: 1 }),
        })
    );

    roadfeatures.push(polygonFeature);

    const vectorSource = new ol.source.Vector({
        features: [polygonFeature]
    });

    const vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });

    const ind = index*1;
    roadLayers[ind] = vectorLayer;
}

export function checkroad(index,flag) {
    const ind = index*1;


    if(flag == 0)
    {
        roadLayers_flag[index] = false;
        map.removeLayer(roadLayers[ind]);
        console.log(roadLayers)
        console.log(flag)
    }
    else
    {
        roadLayers_flag[index] = true;
        map.addLayer(roadLayers[ind]);
        console.log(roadLayers)
        console.log(flag)
    }
}


export function setmarker(index,lats,logs,names) {

    index = index*1;
    let temp = names.split(",");
    for(let i = 0 ; i < lats.length;i++)
    {
        const lat = lats[i]*1.0;
        const log = logs[i]*1.0;

        const markerStyle = new ol.style.Style({
            image: markerimg,
            text: new ol.style.Text({
                text: temp[i], // 표시할 텍스트
                font: '14px Arial', // 글꼴과 크기
                fill: new ol.style.Fill({ color: '#000' }), // 텍스트 색상
                stroke: new ol.style.Stroke({ color: '#fff', width: 2 }), // 텍스트 외곽선
                offsetY: -40 // 텍스트 위치 조정 (마커 위로)
            })
        });

        const marker = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([log,lat], 'EPSG:4326','EPSG:3857')) // 마커 위치
        });
        // 스타일 적용
        marker.setStyle(markerStyle);
    

        // 벡터 소스 및 레이어 생성
        const vectorSource = new ol.source.Vector({
            features: [marker] // 마커 추가
        });

        const vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            zIndex:10
        });
        markerLayers[index].push(vectorLayer);
    }
}

export function onmarker(index) {
    console.log(index);
    index = index*1;
    for(let i = 0 ; i < markerLayers[index].length;i++)
    {
        map.addLayer(markerLayers[index][i]);
    }
}

export function hiddenmarker(index) {
    console.log(index);
    index = index*1;
    for(let i = 0 ; i < markerLayers[index].length;i++)
    {
        map.removeLayer(markerLayers[index][i]);
        
    }
}

export function checkmarker(index,flag) {

    console.log("checkmarker");
    if(flag == 0)
    {
        index = index*1;
        for(let i = 0 ; i < markerLayers[index].length;i++)
        {
            map.removeLayer(markerLayers[index][i]);
        }
    }
    else
    {
        index = index*1;
        for(let i = 0 ; i < markerLayers[index].length;i++)
        {
            map.addLayer(markerLayers[index][i]);
        }
    }
}

window.setroadcount = setroadcount;
window.setroads = setroads;
window.checkroad = checkroad;
window.checkmarker = checkmarker;
window.moveview = moveview;
window.Removeroad = Removeroad;
window.setmarker = setmarker;
window.onmarker = onmarker;
window.hiddenmarker = hiddenmarker;

