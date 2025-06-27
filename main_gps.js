
'use strict';

let roadLayers;
let roadfeatures;
let roadLayers_flag;
let roadcount = 0;

let arrowLayers;

//let markerLayers;

let markerPointLayers;
let markerPointFeatures;

let nameflag = true;

let center_lat = 0;
let center_lon = 0;


let hoveredFeature = null;
let hoveredFeaturekind = 0;
let hoverindex = -1;




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
    zoom:19
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
    //map.getView().setZoom(18); // 줌 레벨 설
}

export function Removeroad(index)
{
    map.removeLayer(roadLayers[index]);
    roadLayers[index] = null;
    roadfeatures[ind] = null;

    map.removeLayer(arrowLayers[index]);
    arrowLayers[index] = null;
}

function sendMessageToCSharp(value) {
    // C#으로 메시지 전송
    window.chrome.webview.postMessage(value);
}

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

export function setroadcount(count) {
    roadcount = count*1;
    roadLayers = new Array(roadcount);
    arrowLayers = new Array(roadcount);
    roadfeatures = new Array(roadcount);

    roadLayers_flag = new Array(roadcount);
    //markerLayers = new Array(roadcount);

    markerPointLayers = new Array(roadcount);
    markerPointFeatures = new Array(roadcount);


    for(let i = 0;i < roadcount;i++)
    {
        roadLayers_flag[i] = false;
        //markerLayers[i] = [];
        markerPointLayers[i] = [];
        markerPointFeatures[i] = [];
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
                hoveredFeature.setStyle(defaultStyle);
                map.removeLayer(arrowLayers[hoverindex]);
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
                    feature.setStyle(hoverStyle);
                    hoveredFeature = feature;
                    map.addLayer(arrowLayers[index]);
                    console.log(index);
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
                sendMessageToCSharp(feature.get('name'));
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

        /*
        const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);

        if (feature) {

            if(roadfeatures.includes(feature))
            {
                sendMessageToCSharp(feature.get('name'));
            }
        }*/
    }
});



export function setroads(index,lat,log,color,name) {

    const ind = index*1;


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

    polygonFeature.set('noMouse', false);
    polygonFeature.set('type', 1);

    const vectorSource = new ol.source.Vector({
        features: [polygonFeature]
    });

    const vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });

   
    roadfeatures[ind] = polygonFeature;
    roadLayers[ind] = vectorLayer;





    {
        //화살표 테스트
        // 화살표 길이 설정 (EPSG:3857 기준 약간 짧게)
        const arrowLength = 2; // 중심선 길이
        const sideLength = 1;   // 날개 길이
        const angleDeg = 30;       // 날개 벌어짐 각도

        const blackstyle = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'black',
                    width: 1.5
                })
                });

        const arrowFeatures = [];
        const clats = [];
        const clogs = [];

        for(let i = 0 ; i < lats.length/2;i++)
        {
            const clat = (lats[i] + lats[lats.length-1-i])*0.5;
            const clog = (logs[i] + logs[logs.length-1-i])*0.5;

            clats.push(clat);
            clogs.push(clog);
        }

        const arrow_coords = clats.map((lat3, i) => [clogs[i], lat3]);
        const arrow_transformedCoords = arrow_coords.map(arrow_coords => ol.proj.fromLonLat(arrow_coords));

        for (let i = 40; i < arrow_transformedCoords.length - 40; i+= 150) {
            const start = arrow_transformedCoords[i];
            const end = arrow_transformedCoords[i + 1];

            const dx = end[0] - start[0];
            const dy = end[1] - start[1];
            const len = Math.sqrt(dx * dx + dy * dy);
            const ux = dx / len;
            const uy = dy / len;

            // 중심선 중간 위치
            const mid = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];

            // 기준 방향선 (화살표 몸통)
            const tip = [mid[0] + ux * arrowLength / 2, mid[1] + uy * arrowLength / 2];
            const base = [mid[0] - ux * arrowLength / 2, mid[1] - uy * arrowLength / 2];
            const shaft = new ol.Feature({ geometry: new ol.geom.LineString([base, tip]) });

            // 날개 1 (왼쪽)
            const [lx, ly] = rotateVector(ux, uy, toRadians(150));
            const leftWing = new ol.Feature({
                geometry: new ol.geom.LineString([
                tip,
                [tip[0] + lx * sideLength, tip[1] + ly * sideLength]
                ])
            });

            // 날개 2 (오른쪽)
            const [rx, ry] = rotateVector(ux, uy, toRadians(-150));
            const rightWing = new ol.Feature({
                geometry: new ol.geom.LineString([
                tip,
                [tip[0] + rx * sideLength, tip[1] + ry * sideLength]
                ])
            });

            for (const f of [shaft, leftWing, rightWing]) {
                f.setStyle(blackstyle);
                arrowFeatures.push(f);
            }
        }

        for (let i = 0; i < arrowFeatures.length; i++)
        {
            arrowFeatures[i].set('noMouse', true);
        }

        const arrow_vectorSource = new ol.source.Vector({
        features: [...arrowFeatures]
        });

        arrowLayers[ind] = new ol.layer.Vector({
            source: arrow_vectorSource,
            interactive: false
        });

        console.log(arrowLayers[ind]);
    }
}



function toRadians(deg) {
    return deg * Math.PI / 180;
}

// 회전 함수
function rotateVector(x, y, angleRad) {
    return [
    x * Math.cos(angleRad) - y * Math.sin(angleRad),
    x * Math.sin(angleRad) + y * Math.cos(angleRad)
    ];
}



export function checkroad(index,flag) {
    const ind = index*1;
    console.log('checkroad');


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

    // for(let i = 0 ; i < markerLayers[index].length;i++)
    // {
    //     map.removeLayer(markerLayers[index][i]);
    // }
    // markerLayers[index].length = 0;

    for(let i = 0 ; i < markerPointLayers[index].length;i++)
    {
        map.removeLayer(markerPointLayers[index][i]);
    }

    markerPointLayers[index].length = 0;
    markerPointFeatures[index].length = 0;

    index = index*1;
    let temp = names.split(",");
    for(let i = 0 ; i < lats.length;i++)
    {
        const lat = lats[i]*1.0;
        const log = logs[i]*1.0;

        
        const pointFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform([log,lat], 'EPSG:4326','EPSG:3857')),
        name: temp[i]
        });

        pointFeature.set('noMouse', false);
        pointFeature.set('type', 2);

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
        

        // const markerStyle = new ol.style.Style({
        //     image: markerimg,
        //     text: new ol.style.Text({
        //         text: temp[i], // 표시할 텍스트
        //         font: '14px Arial', // 글꼴과 크기
        //         fill: new ol.style.Fill({ color: '#000' }), // 텍스트 색상
        //         stroke: new ol.style.Stroke({ color: '#fff', width: 2 }), // 텍스트 외곽선
        //         offsetY: -40 // 텍스트 위치 조정 (마커 위로)
        //     })
        // });

        // const marker = new ol.Feature({
        //     geometry: new ol.geom.Point(ol.proj.transform([log,lat], 'EPSG:4326','EPSG:3857')) // 마커 위치
        // });
        // // 스타일 적용
        // marker.setStyle(markerStyle);
    

        // // 벡터 소스 및 레이어 생성
        // const vectorSource = new ol.source.Vector({
        //     features: [marker] // 마커 추가
        // });

        // const vectorLayer = new ol.layer.Vector({
        //     source: vectorSource,
        //     zIndex:10
        // });
        // markerLayers[index].push(vectorLayer);
    }
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



window.setroadcount = setroadcount;
window.setroads = setroads;
window.checkroad = checkroad;
window.checkmarker = checkmarker;

window.removemarker = removemarker;

window.moveview = moveview;
window.Removeroad = Removeroad;
window.setmarker = setmarker;



// GPS 클릭 기능들
let DrawGPS = null;
let GPSFlag = false;

export function StartGPSClickMode(index) {

    console.log('StartGPSClickMode');

    index = index*1;
    GPSFlag = true;
    modeText.style.display = 'block';


    DrawGPS = new ol.interaction.Draw({
        source: new ol.source.Vector({ wrapX:false}),
        type : "LineString"
    })

    map.addInteraction(DrawGPS);

    DrawGPS.on('drawstart',function(event){
        //mainState.currentFeature = event.feature;

    })

    DrawGPS.on('drawend',function(event){
        console.log('drawend')
            var polygon = event.feature.getGeometry();
            var center = polygon.getCoordinates();

            let str = "";
            for(let i = 0 ; i < center.length;i++)
            {
                const point = ol.proj.transform([center[i][0],center[i][1]], 'EPSG:3857','EPSG:4326');
                str += point[1] + "_"+point[0]+ "_";
            }
            map.removeInteraction(DrawGPS);
            DrawGPS = null;
            GPSFlag = false;

            sendMessageToCSharp(str);
    });
}

const mapElement = map.getTargetElement();

mapElement.addEventListener('contextmenu', function (event) {
   event.preventDefault(); // 기본 브라우저 우클릭 메뉴 막기
    DrawGPS.removeLastPoint(); // 마지막 점 제거
    DrawGPS.removeLastPoint(); // 마지막 점 제거
});

window.addEventListener('keydown', (event) => {

    var keycode = event.keyCode;

    // ENTER
    if (keycode == 13) {
        DrawGPS.finishDrawing();
    }

    // ESC
    if (keycode == 27) {
        modeText.style.display = 'none';
        GPSFlag = false;
        DrawGPS.abortDrawing();
        map.removeInteraction(DrawGPS);
    }
});



window.StartGPSClickMode = StartGPSClickMode;





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

