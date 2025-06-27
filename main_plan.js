
'use strict';

const planLayers = [];
const planviewCount = [];

let GPSFlag = false;

let markerPointLayers;
let markerPointFeatures;

let hoveredFeature = null;
let hoveredFeaturekind = 0;
let hoverindex = -1;

let roadcount = 0;


let nameflag = true;


const loadingModal = document.getElementById('loadingModal');
let center_lat = 0;
let center_lon = 0;
let opacity = 1.0;



const redCircleStyle = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 6, // 원 크기
    fill: new ol.style.Fill({ color: 'rgba(255, 0, 0, 1)' }),
    stroke: new ol.style.Stroke({ color: 'white', width: 1 }) // 테두리 흰색
  })
});

function createCircleStyle(feature) {
  return new ol.style.Style({
    image: new ol.style.Circle({
    radius: 6, // 원 크기
     fill: new ol.style.Fill({ color: 'rgba(255, 0, 0, 1)' }),
    stroke: new ol.style.Stroke({ color: 'white', width: 1 }) // 테두리 흰색
  }),
    text: new ol.style.Text({
      text: feature.get('name'),
      font: '14px Noto Sans, sans-serif',
      fill: new ol.style.Fill({ color: 'black' }),
      stroke: new ol.style.Stroke({ color: 'white', width: 2 }),
      backgroundFill: new ol.style.Fill({ color: 'rgba(255,255,255,0.7)' }), // 배경색
     padding: [2, 2, 2, 2],                      // 여백
      offsetY: -28,
      zIndex:11
    })
  });
}

function createHoverStyle(feature) {
  return new ol.style.Style({
    image: new ol.style.Circle({
    radius: 6, // 원 크기
    fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 1)' }),
    stroke: new ol.style.Stroke({ color: 'white', width: 1 }) // 테두리 흰색
  }),
    text: new ol.style.Text({
      text: feature.get('name'),
      font: '14px Noto Sans, sans-serif',
      fill: new ol.style.Fill({ color: 'black' }),
      stroke: new ol.style.Stroke({ color: 'white', width: 2 }),
      backgroundFill: new ol.style.Fill({ color: 'rgba(255,255,255,0.7)' }), // 배경색
    padding: [2, 2, 2, 2],                      // 여백
      offsetY: -28,
      zIndex:11
    })
  });
}



const normalLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        projection : 'EPSG:3857',
        //url : 'https://map.pstatic.net/nrb/styles/basic/1750413718/{z}/{x}/{y}.png?mt=bg.oh',
        url : 'http://xdworld.vworld.kr:8080/2d/Base/service/{z}/{x}/{y}.png',
        crossOrigin: 'anonymous'
    }),
    id: 'vworld_satellite',
    visible: true
})

const satelliteLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        projection : 'EPSG:3857',
        url : 'https://xdworld.vworld.kr/2d/Satellite/service/{z}/{x}/{y}.jpeg',
        crossOrigin: 'anonymous'
    }),
    id: 'vworld_satellite',
    visible: true
})




const map = new ol.Map({
target: 'map',
layers: [satelliteLayer],

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








export function setroadcount(count) {

    console.log('setroadcount');

    roadcount = count*1;
    markerPointLayers = new Array(roadcount);
    markerPointFeatures = new Array(roadcount);

    for(let i = 0;i < roadcount;i++)
    {
        markerPointLayers[i] = [];
        markerPointFeatures[i] = [];
    }
}





map.on('pointermove', function (evt) {

    if(!GPSFlag)
    {
        // 현재 픽셀에서 feature 찾기
        const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);

        // 커서 처리
        map.getTargetElement().style.cursor = feature ? 'pointer' : '';

        // ✅ 여기에 마우스 오버 처리
        if (feature !== hoveredFeature) {
            if(hoveredFeaturekind == 1){
                //hoveredFeature.setStyle(defaultStyle);
                //map.removeLayer(arrowLayers[hoverindex]);
            }
            else if(hoveredFeaturekind == 2)
            {
                if(nameflag)
                {
                    hoveredFeature.setStyle(createCircleStyle(hoveredFeature));
                }
                else
                {
                    hoveredFeature.setStyle(redCircleStyle);
                }
            }
            else if(hoveredFeaturekind == 3)
            {

            }

            hoveredFeaturekind = 0;
            hoveredFeature = null;
        }

        map.forEachFeatureAtPixel(evt.pixel, function (feature) {
            if (feature.get('noMouse')) {
            return false; // 👉 이 피처는 무시
            }

            if (feature.get('type') == 1) // 측선
            {
                if(hoveredFeaturekind != 1)
                {
                    const index = roadfeatures.indexOf(feature);
                    hoverindex = index;
                    // feature.setStyle(hoverStyle);
                    hoveredFeature = feature;
                    // map.addLayer(arrowLayers[index]);
                    // console.log(index);
                    hoveredFeaturekind = 1;
                }
            }
            else if (feature.get('type') == 2) // 마커
            {
                if(hoveredFeaturekind != 2)
                {
                    feature.setStyle(createHoverStyle(feature));
                    hoveredFeature = feature;
                    hoveredFeaturekind = 2;
                }
            }
            else if (feature.get('type') == 3) // 관로
            {
                
            }

            
            // 반환값 true는 반복 중단 (원하는 로직에 따라 조절)
            return true;
        });
    }

});

map.on('singleclick', function (evt) {

    if(!GPSFlag)
    {
        map.forEachFeatureAtPixel(evt.pixel, function (feature) {
            if (feature.get('noMouse')) {
            return false; // 👉 이 피처는 무시
            }

            if (feature.get('type') == 1) // 측선
            {
                //sendMessageToCSharp(feature.get('name'));
            }
            else if (feature.get('type') == 2) // 마커
            {

            }
            else if (feature.get('type') == 3) // 관로
            {
                
            }

            // 반환값 true는 반복 중단 (원하는 로직에 따라 조절)
            return true;
        });
    }
});








export function moveview(lat,log) {

    center_lat = lat*1.0;
    center_lon = log*1.0;
    SetViewCenter();
}

homeButton.addEventListener('click', function(e) {
    SetViewCenter();
});


nameButton.addEventListener('click', function(e) {

    if(nameflag)
    {
        nameflag = false;

        for(let i = 0 ; i < markerPointFeatures.length;i++)
        {
            for(let j = 0 ; j < markerPointFeatures.length;j++)
            {
                markerPointFeatures[i][j].setStyle(redCircleStyle);
            }
        }

        nameButtonimg.src = './image/name2.png';
    }
    else
    {
        nameflag = true;

        for(let i = 0 ; i < markerPointFeatures.length;i++)
        {
            for(let j = 0 ; j < markerPointFeatures.length;j++)
            {
                markerPointFeatures[i][j].setStyle(createCircleStyle( markerPointFeatures[i][j]));
            }
        }

        nameButtonimg.src = './image/name.png';
    }
});



function SetViewCenter()
{
    const center = ol.proj.transform([center_lon,center_lat], 'EPSG:4326','EPSG:3857');
    map.getView().setCenter(center); // 지도 시점 변경
    map.getView().setZoom(18); // 줌 레벨 설
}


export function Removeplanview(index)
{
    index = index*1;
    for(let i = 0 ; i < planLayers[index].length;i++)
    {
        map.removeLayer(planLayers[index][i]);
    }
    planLayers[index].length = 0;

}


export function addplanview(image,minLat,minLon,maxLat,maxLon,index) {

    const base64Image = image;
    minLat = minLat*1.0;
    minLon = minLon*1.0;
    maxLat = maxLat*1.0;
    maxLon = maxLon*1.0;

    index = index*1;

    const min = new ol.proj.transform([minLon,minLat], 'EPSG:4326','EPSG:3857');
    const max = new ol.proj.transform([maxLon,maxLat], 'EPSG:4326','EPSG:3857');
    const imageExtent2 = [min[0],min[1],max[0],max[1]];

    const imageLayer = new ol.layer.Image({ //png파일, jpeg파일 
        source : new ol.source.ImageStatic({
            url : `data:image/png;base64,${base64Image}`, 
            imageExtent: imageExtent2,
            projection : "EPSG:3857",
        }),
        opacity:opacity,
        zIndex:0
    });

    planLayers[index].push(imageLayer);

    if(planLayers[index].length == planviewCount[index])
    {
        for(let i = 0 ; i < planLayers[index].length;i++)
        {
            map.addLayer(planLayers[index][i]);
        }
    }
}


export function addplanview_ani(image,minLat,minLon,maxLat,maxLon,index) {

    const base64Image = image;
    const min = new ol.proj.transform([minLon,minLat], 'EPSG:4326','EPSG:3857');
    const max = new ol.proj.transform([maxLon,maxLat], 'EPSG:4326','EPSG:3857');
    const imageExtent2 = [min[0],min[1],max[0],max[1]];

    const imageLayer = new ol.layer.Image({ //png파일, jpeg파일 
        source : new ol.source.ImageStatic({
            url : `data:image/png;base64,${base64Image}`, 
            imageExtent: imageExtent2,
            projection : "EPSG:3857",
        }),
        opacity:opacity,
        zIndex:0
    });

    planLayers[index].push(imageLayer);

    if(planLayers[index].length == planviewCount[index])
    {
        aniCount++;
        for(let i = 0 ; i < planLayers[index].length;i++)
        {
            map.addLayer(planLayers[index][i]);
        }

        if(aniCount == aniMaxCount)
        {
            console.log('ani_end');
            window.chrome.webview.postMessage('d');
        }
    }
}



export function setplanviewCount(count, count2) {

    planLayers.length = 0;

    const vv = count*1;


    for(let i = 0 ; i < vv;i++)
    {
        const value = count2[i]*1;
        planviewCount.push(value);

        const imgs = [];
        planLayers.push(imgs);
    }
}



export function clearplanview() {
    for(let i = 0 ; i < planLayers.length;i++)
    {
        for(let j = 0 ; j < planLayers[i].length;j++)
        {
            map.removeLayer(planLayers[i][j]);
        }
        planLayers[i].length = 0;
    }
}

export function SetOpacity(value) {

    value *= 1.0;
    opacity = value;

    for(let i = 0 ; i < planLayers.length;i++)
    {
        for(let j = 0 ; j < planLayers[i].length;j++)
        {
            planLayers[i][j].setOpacity(opacity);
        }
    }
}




function sendMessageToCSharp() {
    // C#으로 메시지 전송
    window.chrome.webview.postMessage('Hello from JavaScript!');
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

export function setmarker(index,lats,logs,names) {

    // for(let i = 0 ; i < markerLayers[index].length;i++)
    // {
    //     map.removeLayer(markerLayers[index][i]);
    // }
    // markerLayers[index].length = 0;

    console.log('asd');
    console.log(index);
    console.log(lats);
    console.log(logs);
    console.log(names);


    for(let i = 0 ; i < markerPointLayers[index].length;i++)
    {
        map.removeLayer(markerPointLayers[index][i]);
    }

     console.log('asd055');

    markerPointLayers[index].length = 0;
    markerPointFeatures[index].length = 0;

    index = index*1;
    let temp = names.split(",");
    for(let i = 0 ; i < lats.length;i++)
    {
        const lat = lats[i]*1.0;
        const log = logs[i]*1.0;

        
         console.log('asd0');
        const pointFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform([log,lat], 'EPSG:4326','EPSG:3857')),
        name: temp[i]
        });

         console.log('asd1');
        pointFeature.set('noMouse', false);
        pointFeature.set('type', 2);
         console.log('asd2');

        if(nameflag)
        {
            pointFeature.setStyle(createCircleStyle(pointFeature));
        }
        else
        {
            pointFeature.setStyle(redCircleStyle);
        }


        markerPointFeatures[index].push(pointFeature);

        const PointvectorSource = new ol.source.Vector({
            features: [pointFeature]
        });
        const PointvectorLayer = new ol.layer.Vector({
            source: PointvectorSource,
            zIndex:10
        });
        markerPointLayers[index].push(PointvectorLayer);
    }

    console.log(markerPointLayers);
}



export function checkmarker(index,flag) {
    if(flag == 0)
    {
        index = index*1;
        for(let i = 0 ; i < markerPointLayers[index].length;i++)
        {
            map.removeLayer(markerPointLayers[index][i]);
        }
    }
    else
    {
        index = index*1;
        for(let i = 0 ; i < markerPointLayers[index].length;i++)
        {
            map.addLayer(markerPointLayers[index][i]);
        }
        console.log(markerPointLayers);
    }
}


export function removemarker(index) {

    index = index*1;

    for(let i = 0 ; i < markerPointLayers[index].length;i++)
    {
        map.removeLayer(markerPointLayers[index][i]);
    }

    markerPointLayers[index].length = 0;
    markerPointFeatures[index].length = 0;
}































let aniMaxCount = 0;
let aniCount = 0;
export function anistart(value) {
    aniCount = 0;
    aniMaxCount = value;
    console.log('anistart');
}







function setMapView(type) {
  // 기존 base layer 제거
  map.getLayers().setAt(0,
    type === 'satellite' ? satelliteLayer : normalLayer
  );
}


const toggle = document.getElementById('viewToggle');
    const buttons = toggle.querySelectorAll('.toggle-button');
    const indicator = document.getElementById('indicator');

    buttons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        // 이미 선택된 버튼이면 무시
        if (btn.classList.contains('active')) return;

        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // indicator 위치 계산 (전체의 50%)
        const halfWidth = toggle.offsetWidth / 2;
        indicator.style.left = `${index * halfWidth + 3}px`;

        if(btn.dataset.view == "sky")
        {
            setMapView('satellite');
        }
        else
        {
            setMapView('normal');
        }

    });
    });






    
window.moveview = moveview;
window.addplanview = addplanview;
window.clearplanview = clearplanview;
window.setplanviewCount = setplanviewCount;
window.SetOpacity = SetOpacity;
window.Removeplanview = Removeplanview;
window.anistart = anistart;


window.setmarker = setmarker;
window.checkmarker = checkmarker;
window.removemarker = removemarker;
window.setroadcount = setroadcount;