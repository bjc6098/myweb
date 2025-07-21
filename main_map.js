
'use strict';

let roadLayers;
let markerLayers = [];
let markerPointLayers = [];
let markerPointFeatures = [];
let markerLayers_name = [];

let roadfeatures;
let arrowLayers;

let center_lat = 0;
let center_lon = 0;


let PipeLayers = [];
let PipeFeatures = [];
let PipevectorSource = [];
let TextFeatures = [];


let arearoadfeatures = null;
let arearoadLayers = null;

const nameButtonimg = document.getElementById('nameButtonimg');

let hoveredFeature = null;
let hoveredFeaturekind = 0;


let nameflag = true;


function createPipetextStyle(feature) {
    return new ol.style.Style({
    text: new ol.style.Text({
        text: feature.get('name'),
        font: '14px Noto Sans, sans-serif',
        fill: new ol.style.Fill({ color: 'black' }),
        stroke: new ol.style.Stroke({ color: 'white', width: 2 }),
        backgroundFill: new ol.style.Fill({ color: 'rgba(255,255,255,0.7)' }), // 배경색
        offsetY: -20, // 위로 15px 띄움
        textAlign: 'center',
        zIndex:11,
        textBaseline: 'bottom' // 기준점을 아래쪽으로 해서 위로 띄움
    })
    });
}

const PipelineStyle = new ol.style.Style({
    // 외곽선 (하얀색, 두껍게)
    stroke: new ol.style.Stroke({
    color: 'white',
    width: 6,
    zIndex : 11
    })
});

const PiperedInnerLine = new ol.style.Style({
    stroke: new ol.style.Stroke({
    color: 'red',
    width: 4,
    zIndex:11
    })
});

const PipeblueInnerLine = new ol.style.Style({
    stroke: new ol.style.Stroke({
    color: 'blue',
    width: 4,
    zIndex:11
    })
});


const redCircleStyle = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 5, // 원 크기
    fill: new ol.style.Fill({ color: 'rgba(255, 0, 0, 1)' }),
    stroke: new ol.style.Stroke({ color: 'white', width: 1 }) // 테두리 흰색
  })
});


function createCircleStyle(feature) {
  return new ol.style.Style({
    image: new ol.style.Circle({
    radius: 5, // 원 크기
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
    radius: 5, // 원 크기
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

// const HoverCircleStyle = new ol.style.Style({
//   image: new ol.style.Circle({
//     radius: 7, // 원 크기
//     fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 1)' }),
//     stroke: new ol.style.Stroke({ color: 'white', width: 2 }) // 테두리 흰색
//   })
// });


const normalLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        projection : 'EPSG:3857',
        //url : 'https://map.pstatic.net/nrb/styles/basic/1750413718/{z}/{x}/{y}.png?mt=bg.oh',
        //url : 'http://xdworld.vworld.kr:8080/2d/Base/service/{z}/{x}/{y}.png',\
        url : 'https://cdn.vworld.kr/2d/vector/Base/service/{z}/{x}/{y}.png',
        crossOrigin: 'anonymous'
    }),
    id: 'vworld_Base',
    visible: true
})

const satelliteLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        projection : 'EPSG:3857',
        //url : 'https://xdworld.vworld.kr/2d/Satellite/service/{z}/{x}/{y}.jpeg',
        url : 'https://cdn.vworld.kr/2d/Satellite/service/{z}/{x}/{y}.jpeg',
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
            markerPointFeatures[i].setStyle(redCircleStyle);
        }

        for(let i = 0 ; i < PipeLayers.length;i++)
        {
            PipevectorSource[i].removeFeature(TextFeatures[i]);
        }

        nameButtonimg.src = './image/name2.png';
    }
    else
    {
        nameflag = true;

        for(let i = 0 ; i < markerPointFeatures.length;i++)
        {
            markerPointFeatures[i].setStyle(createCircleStyle(markerPointFeatures[i]));
        }

        for(let i = 0 ; i < PipeLayers.length;i++)
        {
            PipevectorSource[i].addFeature(TextFeatures[i]);
        }

        nameButtonimg.src = './image/name.png';
    }

});

function SetViewCenter()
{
    console.log(center_lon);
    console.log(center_lat);
    const center = ol.proj.transform([center_lon,center_lat], 'EPSG:4326','EPSG:3857');
    map.getView().setCenter(center); // 지도 시점 변경
    //map.getView().setZoom(18); // 줌 레벨 설
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


// 측선영역
const defaultStyle = new ol.style.Style({
    fill: new ol.style.Fill({ color: 'rgba(179, 249, 179, 0.53)' }),
    stroke: new ol.style.Stroke({ color: 'green', width: 1 }),
});

const hoverStyle = new ol.style.Style({
    fill: new ol.style.Fill({ color: 'rgba(160, 244, 209, 0.46)' }),
  stroke: new ol.style.Stroke({ color: 'red', width: 2 }), // 두껍고 빨간 외곽선
});


map.on('pointermove', function (evt) {
  // 현재 픽셀에서 feature 찾기
  const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);

  // 커서 처리
    map.getTargetElement().style.cursor = feature ? 'pointer' : '';

    // ✅ 여기에 마우스 오버 처리
    if (feature !== hoveredFeature) {
        if(hoveredFeaturekind == 1){
            hoveredFeature.setStyle(defaultStyle);
            map.removeLayer(arrowLayers);
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
            hoveredFeature.setStyle(function () { return [PipelineStyle, PiperedInnerLine]; });

            const index = PipeFeatures.indexOf(hoveredFeature);

            if(!nameflag)
            {
                PipevectorSource[index].removeFeature(TextFeatures[index]);
            }

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
            feature.setStyle(hoverStyle);
            hoveredFeature = feature;
            hoveredFeaturekind = 1;
            map.addLayer(arrowLayers);
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
        if(hoveredFeaturekind != 3)
        {
            feature.setStyle(function () { return [PipelineStyle, PipeblueInnerLine]; });

            const index = PipeFeatures.indexOf(feature);

            if(!nameflag)
            {
                PipevectorSource[index].addFeature(TextFeatures[index]);
            }
            
            hoveredFeature = feature;
            hoveredFeaturekind = 3;
        }
    }
    
    // 반환값 true는 반복 중단 (원하는 로직에 따라 조절)
    return true;
  });

  
});

map.on('singleclick', function (evt) {
  // 클릭한 위치에 있는 feature 탐색
  const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);

  if (feature) {
    if(roadfeatures == feature)
    {
        //console.log('road');
        //sendMessageToCSharp(feature.get('name'));
    }
    else if(markerPointFeatures.includes(feature))
    {
        let index = markerPointFeatures.indexOf(feature);
        sendMessageToCSharp("poi_"+index);
    }
    else if(PipeFeatures.includes(feature))
    {
        let index = PipeFeatures.indexOf(feature);
        sendMessageToCSharp("pipe_"+index);
    }

  }
});

map.on('dblclick', function (event) {
  const coordinate = event.coordinate;
  console.log('더블클릭한 좌표:', coordinate);
});


let transformedCoords_list;
let arrowCoords_list;


export function setroads(lat,log,color) {

    if(roadLayers != null)
    {
        map.removeLayer(roadLayers);
        map.removeLayer(arrowLayers);
    }

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
    transformedCoords_list = coords.map(coord => ol.proj.fromLonLat(coord));
    const polygonGeometry = new ol.geom.Polygon([transformedCoords_list]);

    const polygonFeature = new ol.Feature({
        geometry: polygonGeometry
    });

    polygonFeature.set('noMouse', false);
    polygonFeature.set('type', 1);

    polygonFeature.setStyle(
        new ol.style.Style({
            //fill: new ol.style.Fill({ color: color }),
            //stroke: new ol.style.Stroke({ color: '#0088ff', width: 2 }),
            fill: new ol.style.Fill({ color: 'rgba(179, 249, 179, 0.53)' }),
            stroke: new ol.style.Stroke({ color: 'green', width: 1 }),
        })
    );

    roadfeatures = polygonFeature;

    const vectorSource = new ol.source.Vector({
        features: [polygonFeature]
    });

    const vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });

    roadLayers = vectorLayer;

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

        center_lat = clats[ Math.floor(clats.length/2)]*1.0;
        center_lon = clogs[ Math.floor(clogs.length/2)]*1.0;

        const arrow_coords = clats.map((lat3, i) => [clogs[i], lat3]);
        arrowCoords_list = clats.map((lat3, i) => [clogs[i], lat3]);

        const line = new ol.geom.LineString(arrow_coords);
        const linelength = ol.sphere.getLength(line, {projection: 'EPSG:4326'});
        const arrow_transformedCoords = arrow_coords.map(arrow_coords => ol.proj.fromLonLat(arrow_coords));
        const unit = Math.floor(5/ (linelength / arrow_transformedCoords.length));
        const start = Math.floor(2/ (linelength / arrow_transformedCoords.length));

        for (let i = start; i < arrow_transformedCoords.length - 20; i+= unit) {
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

        arrowLayers = new ol.layer.Vector({
            source: arrow_vectorSource,
            interactive: false
        });
    }

}


export function setarearoads(starttrace,endtrace) {

    if(arearoadLayers != null)
    {
        map.removeLayer(arearoadLayers);
        arearoadfeatures = null;
        arearoadLayers = null;
    }

    starttrace = starttrace*1;
    endtrace = endtrace*1;

    const transformedCoords = [];

    const num = transformedCoords_list.length/2;

    for(let i = starttrace ; i < endtrace;i++)
    {
        transformedCoords.push(transformedCoords_list[i]);
    }

    for(let i =  num + num - endtrace; i < num + num - starttrace;i++)
    {
        transformedCoords.push(transformedCoords_list[i]);
    }

    //console.log(transformedCoords);

    const polygonGeometry = new ol.geom.Polygon([transformedCoords]);

    const polygonFeature = new ol.Feature({
        geometry: polygonGeometry
    });

    polygonFeature.set('noMouse', true);

    polygonFeature.setStyle(
        new ol.style.Style({
            fill: new ol.style.Fill({ color: 'rgba(163, 244, 255, 0.53)' }),
            stroke: new ol.style.Stroke({ color: 'white', width: 1 }),
        })
    );

    arearoadfeatures = polygonFeature;

    const vectorSource = new ol.source.Vector({
        features: [polygonFeature]
    });

    const vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });

    arearoadLayers = vectorLayer;

    map.addLayer(arearoadLayers);
    const center = ol.proj.transform(arrowCoords_list[Math.floor(starttrace+(endtrace-starttrace)/2)], 'EPSG:4326','EPSG:3857');
    map.getView().setCenter(center); // 지도 시점 변경
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

export function checkroad(flag) {

    if(flag == 0)
    {
        map.removeLayer(roadLayers);
        //map.removeLayer(arrowLayers);
    }
    else
    {
        map.addLayer(roadLayers);
        //map.addLayer(arrowLayers);

    }
}


export function setmarker(lats,logs,names) {

    for(let i = 0 ; i < markerPointLayers.length;i++)
    {
        map.removeLayer(markerPointLayers[i]);
    }

    markerPointLayers.length = 0;
    markerPointFeatures.length = 0;
    markerLayers_name.length = 0;

    let temp = names.split(",");
    for(let i = 0 ; i < lats.length;i++)
    {
        const lat = lats[i]*1.0;
        const log = logs[i]*1.0;

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
        // markerLayers.push(vectorLayer);
        markerLayers_name.push(temp[i]);

        // 2. Feature 생성

        {
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


            markerPointFeatures.push(pointFeature);

            const PointvectorSource = new ol.source.Vector({
                features: [pointFeature]
            });
            const PointvectorLayer = new ol.layer.Vector({
                source: PointvectorSource,
                zIndex:10
            });

            markerPointLayers.push(PointvectorLayer);
        }
    }
}


export function Removepipe(index) {
    index = index*1;
    map.removeLayer(PipeLayers[index]);
    PipeLayers.splice(index,1);
    PipeFeatures.splice(index,1);
    PipevectorSource.splice(index,1);
    TextFeatures.splice(index,1);
}


export function Editpipe(index,name) {
    index = index*1;

    TextFeatures[index].set('name', name);
    PipeFeatures[index].set('name', name);

    TextFeatures[index].setStyle(createPipetextStyle(TextFeatures[index]));

    // console.log(TextFeatures[index]);

    // PipevectorSource[index].removeFeature(TextFeatures[index]);
    // PipevectorSource[index].addFeature(TextFeatures[index]);
}

export function clearpipe() {

    for(let i = 0 ; i < PipeLayers.length;i++)
    {
        map.removeLayer(PipeLayers[i]);
    }

    PipeLayers.length = 0;
    PipeFeatures.length = 0;
    PipevectorSource.length = 0;
    TextFeatures.length = 0;
}



export function addpipe(lats,logs,name) {

    const coordinates = [];

    for(let i = 0 ; i < lats.length;i++)
    {
        const lat = lats[i]*1.0;
        const log = logs[i]*1.0;
        coordinates.push(ol.proj.transform([log,lat], 'EPSG:4326','EPSG:3857'));
    }

    const line = new ol.geom.LineString(coordinates);

    const lineFeature = new ol.Feature({
    geometry: line
    });

    lineFeature.set('noMouse', false);
    lineFeature.set('type', 3);
    lineFeature.set('name', name);

    PipeFeatures.push(lineFeature);

    const lineCenter = line.getCoordinateAt(0.5);

    const textFeature = new ol.Feature({
    geometry: new ol.geom.Point(lineCenter),
    name : name
    });

    textFeature.setStyle(createPipetextStyle(textFeature));
    TextFeatures.push(textFeature);

    // 벡터 소스 및 레이어
    const vectorSource = new ol.source.Vector({
    features: [lineFeature]
    });

    PipevectorSource.push(vectorSource);

    if(nameflag)
    {
        vectorSource.addFeature(textFeature);
    }

    const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    zIndex:10,
    style: function () {
    // 외곽선 → 안쪽 순서로 그리기
    return [PipelineStyle, PiperedInnerLine];
    }
    });

    PipeLayers.push(vectorLayer);
}

export function checkpipe(index,flag) {
    console.log('checkpipe');
    if(flag == 0)
    {
        index = index*1;
        map.removeLayer(PipeLayers[index]);
    }
    else
    {
        index = index*1;
        map.addLayer(PipeLayers[index]);
    }
}



export function offarearoads() {

    if(arearoadLayers != null)
    {
        map.removeLayer(arearoadLayers);
        arearoadfeatures = null;
        arearoadLayers = null;
    }
}



export function checkmarker(index,flag) {

    index = index*1;

    if(flag == 0)
    {
        //map.removeLayer(markerLayers[index]);
        map.removeLayer(markerPointLayers[index]);
    }
    else
    {
        //map.addLayer(markerLayers[index]);
        map.addLayer(markerPointLayers[index]);
    }
}

export function editmarker(index,name) {

    index = index*1;
    markerLayers_name[index] = name;
    markerPointFeatures[index].set('name', name);

    if(nameflag)
    {
        markerPointFeatures[index].setStyle(createCircleStyle(markerPointFeatures[index]));
    }
}

export function removemarker(index) {

    map.removeLayer(markerPointLayers[index]);

    index = index*1;
    markerLayers_name.splice(index,1);
    markerPointFeatures.splice(index,1);
    markerPointLayers.splice(index,1);
}

export function removemarkerall() {

    for(let i = 0 ; i < markerPointLayers.length;i++)
    {
        map.removeLayer(markerPointLayers[i]);
    }

    markerLayers_name.length = 0;
    markerPointFeatures.length = 0;
    markerPointLayers.length = 0;
}


export function createmarker(lat,log,name) {

    lat = lat*1.0;
    log = log*1.0;

    console.log(lat);
    console.log(log);

    markerLayers_name.push(name);

    const pointFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.transform([log,lat], 'EPSG:4326','EPSG:3857')),
    name: name
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

    markerPointFeatures.push(pointFeature);

    const PointvectorSource = new ol.source.Vector({
        features: [pointFeature]
    });
    const PointvectorLayer = new ol.layer.Vector({
        source: PointvectorSource,
        zIndex:10
    });

    markerPointLayers.push(PointvectorLayer);

    map.addLayer(PointvectorLayer);
}


export function removeroad() {
    map.removeLayer(roadLayers);
    map.removeLayer(arrowLayers);

    roadLayers = null;
    roadfeatures = null;
    arrowLayers = null;

    if(arearoadLayers != null)
    {
        map.removeLayer(arearoadLayers);
        arearoadfeatures = null;
        arearoadLayers = null;
    }

}



window.setroads = setroads;
window.removeroad = removeroad;


window.setarearoads = setarearoads;
window.offarearoads = offarearoads;
window.setmarker = setmarker;
window.editmarker = editmarker;
window.checkroad = checkroad;
window.checkmarker = checkmarker;
window.moveview = moveview;
window.removemarker = removemarker;
window.removemarkerall = removemarkerall;
window.createmarker = createmarker;

window.Removepipe = Removepipe;
window.addpipe = addpipe;
window.checkpipe = checkpipe;
window.clearpipe = clearpipe;
window.Editpipe = Editpipe;


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