
'use strict';

let roadLayers;
let roadfeatures;
let roadcount = 0;

let arrowLayers;

//let markerLayers;

let markerPointLayers;
let markerPointFeatures;

let PipeLayers;
let PipeFeatures;
let PipevectorSource;
let TextFeatures;

let arrowFeaturesList;


let nameflag = true;

let center_lat = 0;
let center_lon = 0;


let hoveredFeature = null;
let hoveredFeaturekind = 0;
let hoverindex = -1;

let center_lats;
let center_lons;

let color_marker = '#ff0000ff';
let color_marker_outline = '#ffffffff';

let markerkind = 0;

let mapkindflag = 1; // 1 == Vworld ,2  == OpenStreetMap
let mapkindflag2 = 2; // 1 == 일반지도 ,2  == 위성지도




function NoTextMarkerStyle1() {
    return new ol.style.Style({
    image: new ol.style.Circle({
    radius: 5, // 원 크기
        fill: new ol.style.Fill({ color: color_marker }),
    stroke: new ol.style.Stroke({ color: color_marker_outline, width: 1 }) // 테두리 흰색
    })
    });
}

function NoTextMarkerStyle2() {
    return new ol.style.Style({
    image: new ol.style.RegularShape({
    radius: 5, // 원 크기
        points: 4,             // 4개 → 사각형
        radius: 7,
        angle: Math.PI / 4,    // 회전 보정 (정사각형으로 보이게)
        fill: new ol.style.Fill({ color:color_marker}),
        stroke: new ol.style.Stroke({ color: color_marker_outline, width: 1 })
    })
    });
}

function NoTextMarkerStyle3() {
    return new ol.style.Style({
    image: new ol.style.RegularShape({
    radius: 5, // 원 크기
        points: 3,            
        radius: 7,
        fill: new ol.style.Fill({ color:color_marker}),
        stroke: new ol.style.Stroke({ color: color_marker_outline, width: 1 })
    })
    });
}

function NoTextMarkerStyle4() {
    return new ol.style.Style({
    image: new ol.style.RegularShape({
        points: 5,             // 별의 꼭짓점 수
        radius: 8,            // 바깥쪽 반지름
        radius2: 4,           // 안쪽 반지름
        angle: 0,
        fill: new ol.style.Fill({ color: color_marker }),
        stroke: new ol.style.Stroke({ color: color_marker_outline, width: 1 })
    })
    });
}

function TextMarkerStyle1(feature) {
    return new ol.style.Style({
    image: new ol.style.Circle({
    radius: 5, // 원 크기
        fill: new ol.style.Fill({ color: color_marker }),
    stroke: new ol.style.Stroke({ color: color_marker_outline, width: 1 }) // 테두리 흰색
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

function TextMarkerStyle2(feature) {
    return new ol.style.Style({
    image: new ol.style.RegularShape({
    radius: 5, // 원 크기
        points: 4,             // 4개 → 사각형
        radius: 7,
        angle: Math.PI / 4,    // 회전 보정 (정사각형으로 보이게)
        fill: new ol.style.Fill({ color:color_marker}),
        stroke: new ol.style.Stroke({ color: color_marker_outline, width: 1 })
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

function TextMarkerStyle3(feature) {
    return new ol.style.Style({
    image: new ol.style.RegularShape({
    radius: 5, // 원 크기
        points: 3,             // 4개 → 사각형
        radius: 7,
        fill: new ol.style.Fill({ color:color_marker}),
        stroke: new ol.style.Stroke({ color: color_marker_outline, width: 1 })
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

function TextMarkerStyle4(feature) {
    return new ol.style.Style({
    image: new ol.style.RegularShape({
        points: 5,             // 별의 꼭짓점 수
        radius: 8,            // 바깥쪽 반지름
        radius2: 4,           // 안쪽 반지름
        angle: 0,
        fill: new ol.style.Fill({ color: color_marker }),
        stroke: new ol.style.Stroke({ color: color_marker_outline, width: 1 })
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

function TextMarkerHoverStyle1(feature) {
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

function TextMarkerHoverStyle2(feature) {
    return new ol.style.Style({
        image: new ol.style.RegularShape({
        radius: 5, // 원 크기
            points: 4,             // 4개 → 사각형
            radius: 7,
            angle: Math.PI / 4,    // 회전 보정 (정사각형으로 보이게)
            fill: new ol.style.Fill({ color:'rgba(0, 0, 255, 1)'}),
            stroke: new ol.style.Stroke({ color: 'white', width: 1 })
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

function TextMarkerHoverStyle3(feature) {
    return new ol.style.Style({
        image: new ol.style.RegularShape({
        radius: 5, // 원 크기
            points: 3,             // 4개 → 사각형
            radius: 7,
            fill: new ol.style.Fill({ color:'rgba(0, 0, 255, 1)'}),
            stroke: new ol.style.Stroke({ color: 'white', width: 1 })
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

function TextMarkerHoverStyle4(feature) {
    return new ol.style.Style({
        image: new ol.style.RegularShape({
            points: 5,             // 별의 꼭짓점 수
            radius: 8,            // 바깥쪽 반지름
            radius2: 4,           // 안쪽 반지름
            angle: 0,
            fill: new ol.style.Fill({ color:'rgba(0, 0, 255, 1)'}),
            stroke: new ol.style.Stroke({ color: 'white', width: 1 })
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

function NoTextMarkerHoverStyle1() {
    return new ol.style.Style({
        image: new ol.style.Circle({
        radius: 5, // 원 크기
        fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 1)' }),
        stroke: new ol.style.Stroke({ color: 'white', width: 1 }) // 테두리 흰색
    })
    });
}

function NoTextMarkerHoverStyle2() {
    return new ol.style.Style({
        image: new ol.style.RegularShape({
        radius: 5, // 원 크기
            points: 4,             // 4개 → 사각형
            radius: 7,
            angle: Math.PI / 4,    // 회전 보정 (정사각형으로 보이게)
            fill: new ol.style.Fill({ color:'rgba(0, 0, 255, 1)'}),
            stroke: new ol.style.Stroke({ color: 'white', width: 1 })
        })
    });
}

function NoTextMarkerHoverStyle3() {
    return new ol.style.Style({
        image: new ol.style.RegularShape({
        radius: 5, // 원 크기
            points: 3,             // 4개 → 사각형
            radius: 7,
            fill: new ol.style.Fill({ color:'rgba(0, 0, 255, 1)'}),
            stroke: new ol.style.Stroke({ color: 'white', width: 1 })
        })
    });
}

function NoTextMarkerHoverStyle4() {
    return new ol.style.Style({
        image: new ol.style.RegularShape({
            points: 5,             // 별의 꼭짓점 수
            radius: 8,            // 바깥쪽 반지름
            radius2: 4,           // 안쪽 반지름
            angle: 0,
            fill: new ol.style.Fill({ color:'rgba(0, 0, 255, 1)'}),
            stroke: new ol.style.Stroke({ color: 'white', width: 1 })
        })
    });
}






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




const normalLayer_VWorld = new ol.layer.Tile({
    source: new ol.source.XYZ({
        projection : 'EPSG:3857',
        //url : 'https://map.pstatic.net/nrb/styles/basic/1750413718/{z}/{x}/{y}.png?mt=bg.oh',
        //url : 'http://xdworld.vworld.kr:8080/2d/Base/service/{z}/{x}/{y}.png',\
        url : 'https://cdn.vworld.kr/2d/vector/Base/service/{z}/{x}/{y}.png',
        crossOrigin: 'anonymous'
    }),
    id: 'vworld_Base',
    visible: false
})

const satelliteLayer_Vworld = new ol.layer.Tile({
    source: new ol.source.XYZ({
        projection : 'EPSG:3857',
        //url : 'https://xdworld.vworld.kr/2d/Satellite/service/{z}/{x}/{y}.jpeg',
        url : 'https://cdn.vworld.kr/2d/Satellite/service/{z}/{x}/{y}.jpeg',
        crossOrigin: 'anonymous'
    }),
    id: 'vworld_satellite',
    visible: true
})

const normalLayer_OSM = new ol.layer.Tile({
    title: 'OSM',
    visible: false,
    source: new ol.source.OSM(),   // 기본 OSM 타일
});





const map = new ol.Map({
target: 'map',
layers: [satelliteLayer_Vworld,normalLayer_VWorld,normalLayer_OSM],

view: new ol.View({
    center: ol.proj.transform([126.660509954,37.540375191], 'EPSG:4326','EPSG:3857'),
    zoom:19
}),
controls: [
    new ol.control.Zoom(),
    new ol.control.Attribution(),
    new ol.control.Rotate(),
    new ol.control.ScaleLine({
      units: 'metric',
      bar: true,
      text: true
    })
  ]
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

    center_lat = 0;
    center_lon = 0;
    let count = 0;

    for(let i = 0 ; i < center_lats.length;i++)
    {
        if(center_lats[i] != -1)
        {
            center_lat += center_lats[i];
            center_lon += center_lons[i];
            count += 1.0;

            console.log(center_lats[i] + " / " + center_lons[i])
        }
    }

    if(count == 0)
    {
        return;
    }

    center_lat /= count;
    center_lon /= count;

    console.log(center_lat + " / " + center_lon)

    SetViewCenter();
});


nameButton.addEventListener('click', function(e) {

    if(nameflag)
    {
        nameflag = false;

        if(markerkind == 0)
        {
            for(let i = 0 ; i < markerPointFeatures.length;i++)
            {
                for(let j = 0 ; j < markerPointFeatures[i].length;j++)
                {
                    markerPointFeatures[i][j].setStyle(NoTextMarkerStyle1());
                }
            }
        }
        else if(markerkind == 1)
        {
            for(let i = 0 ; i < markerPointFeatures.length;i++)
            {
                for(let j = 0 ; j < markerPointFeatures[i].length;j++)
                {
                    markerPointFeatures[i][j].setStyle(NoTextMarkerStyle2());
                }
            }
        }
        else if(markerkind == 2)
        {
            for(let i = 0 ; i < markerPointFeatures.length;i++)
            {
                for(let j = 0 ; j < markerPointFeatures[i].length;j++)
                {
                    markerPointFeatures[i][j].setStyle(NoTextMarkerStyle3());
                }
            }
        }
        else if(markerkind == 3)
        {
            for(let i = 0 ; i < markerPointFeatures.length;i++)
            {
                for(let j = 0 ; j < markerPointFeatures[i].length;j++)
                {
                    markerPointFeatures[i][j].setStyle(NoTextMarkerStyle4());
                }
            }
        }

        for(let i = 0 ; i < PipeLayers.length;i++)
        {
            for(let j = 0 ; j < PipeLayers[i].length;j++)
            {
                PipevectorSource[i][j].removeFeature(TextFeatures[i][j]);
            }
        }

        nameButtonimg.src = './image/name2.png';
    }
    else
    {
        nameflag = true;

        if(markerkind == 0)
        {
            for(let i = 0 ; i < markerPointFeatures.length;i++)
            {
                for(let j = 0 ; j < markerPointFeatures[i].length;j++)
                {
                    markerPointFeatures[i][j].setStyle(TextMarkerStyle1(markerPointFeatures[i][j]));
                }
            }
        }
        else if(markerkind == 1)
        {
            for(let i = 0 ; i < markerPointFeatures.length;i++)
            {
                for(let j = 0 ; j < markerPointFeatures[i].length;j++)
                {
                    markerPointFeatures[i][j].setStyle(TextMarkerStyle2(markerPointFeatures[i][j]));
                }
            }
        }
        else if(markerkind == 2)
        {
            for(let i = 0 ; i < markerPointFeatures.length;i++)
            {
                for(let j = 0 ; j < markerPointFeatures[i].length;j++)
                {
                    markerPointFeatures[i][j].setStyle(TextMarkerStyle3(markerPointFeatures[i][j]));
                }
            }
        }
        else if(markerkind == 3)
        {
            for(let i = 0 ; i < markerPointFeatures.length;i++)
            {
                for(let j = 0 ; j < markerPointFeatures[i].length;j++)
                {
                    markerPointFeatures[i][j].setStyle(TextMarkerStyle4(markerPointFeatures[i][j]));
                }
            }
        }


        for(let i = 0 ; i < PipeLayers.length;i++)
        {
            for(let j = 0 ; j < PipeLayers[i].length;j++)
            {
                PipevectorSource[i][j].addFeature(TextFeatures[i][j]);
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
    index = index*1;

    map.removeLayer(roadLayers[index]);
    roadLayers[index] = null;
    roadfeatures[index] = null;

    map.removeLayer(arrowLayers[index]);
    arrowLayers[index] = null;

    center_lats[index] = -1;
    center_lons[index] = -1;
}

function sendMessageToCSharp(value) {
    // C#으로 메시지 전송
    window.chrome.webview.postMessage(value);
}


export function setroadcount(count) {
    roadcount = count*1;
    roadLayers = new Array(roadcount);
    arrowLayers = new Array(roadcount);
    roadfeatures = new Array(roadcount);

    markerPointLayers = new Array(roadcount);
    markerPointFeatures = new Array(roadcount);


    PipeLayers = new Array(roadcount);
    PipeFeatures = new Array(roadcount);
    PipevectorSource = new Array(roadcount);
    TextFeatures = new Array(roadcount);

    center_lats = new Array(roadcount);
    center_lons = new Array(roadcount);

    arrowFeaturesList = new Array(roadcount);

    for(let i = 0;i < roadcount;i++)
    {
        center_lats[i] = -1;
        center_lons[i] = -1;
        markerPointLayers[i] = [];
        markerPointFeatures[i] = [];

        PipeLayers[i] = [];
        PipeFeatures[i] = [];
        PipevectorSource[i] = [];
        TextFeatures[i] = [];
        arrowFeaturesList[i] = [];
    }
}

let defaultStyle = new ol.style.Style({
    fill: new ol.style.Fill({ color: 'rgba(179, 249, 179, 0.53)' }),
    stroke: new ol.style.Stroke({ color: 'green', width: 1 }),
});

let hoverStyle = new ol.style.Style({
    fill: new ol.style.Fill({ color: 'rgba(160, 244, 209, 0.46)' }),
  stroke: new ol.style.Stroke({ color: 'red', width: 2 }), // 두껍고 빨간 외곽선
});

let selectpipeindex1 = -1;
let selectpipeindex2 = -1;

map.on('pointermove', function (evt) {

    if(GPSFlag == 0)
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
                    if(markerkind == 0)
                    {
                        hoveredFeature.setStyle(TextMarkerStyle1(hoveredFeature));
                    }
                    else if(markerkind == 1)
                    {
                        hoveredFeature.setStyle(TextMarkerStyle2(hoveredFeature));
                    }
                    else if(markerkind == 2)
                    {
                        hoveredFeature.setStyle(TextMarkerStyle3(hoveredFeature));
                    }
                    else if(markerkind == 3)
                    {
                        hoveredFeature.setStyle(TextMarkerStyle4(hoveredFeature));
                    }
                }
                else
                {
                    if(markerkind == 0)
                    {
                        hoveredFeature.setStyle(NoTextMarkerStyle1());
                    }
                    else if(markerkind == 1)
                    {
                        hoveredFeature.setStyle(NoTextMarkerStyle2());
                    }
                    else if(markerkind == 2)
                    {
                        hoveredFeature.setStyle(NoTextMarkerStyle3());
                    }
                    else if(markerkind == 3)
                    {
                        hoveredFeature.setStyle(NoTextMarkerStyle4());
                    }
                }


            }
            else if(hoveredFeaturekind == 3)
            {
                hoveredFeature.setStyle(function () { return [PipelineStyle, PiperedInnerLine]; });
                if(!nameflag)
                {
                PipevectorSource[selectpipeindex1][selectpipeindex2].removeFeature(TextFeatures[selectpipeindex1][selectpipeindex2]);
                selectpipeindex1 = -1;
                selectpipeindex2 = -1;
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
                    if(nameflag)
                    {
                        if(markerkind == 0)
                        {
                            feature.setStyle(TextMarkerHoverStyle1(feature));
                        }
                        else if(markerkind == 1)
                        {
                            feature.setStyle(TextMarkerHoverStyle2(feature));
                        }
                        else if(markerkind == 2)
                        {
                            feature.setStyle(TextMarkerHoverStyle3(feature));
                        }
                        else if(markerkind == 3)
                        {
                            feature.setStyle(TextMarkerHoverStyle4(feature));
                        }
                    }
                    else
                    {
                        if(markerkind == 0)
                        {
                            feature.setStyle(NoTextMarkerHoverStyle1());
                        }
                        else if(markerkind == 1)
                        {
                            feature.setStyle(NoTextMarkerHoverStyle2());
                        }
                        else if(markerkind == 2)
                        {
                            feature.setStyle(NoTextMarkerHoverStyle3());
                        }
                        else if(markerkind == 3)
                        {
                            feature.setStyle(NoTextMarkerHoverStyle4());
                        }
                    }

                    hoveredFeature = feature;
                    hoveredFeaturekind = 2;
                }
            }
            else if (feature.get('type') == 3) // 관로
            {
                if(hoveredFeaturekind != 3)
                {
                    if(!nameflag)
                    {
                        for(let i = 0 ; i < PipeFeatures.length;i++)
                        {
                            const index = PipeFeatures[i].indexOf(feature);
                            if(index != -1)
                            {
                                selectpipeindex1 = i;
                                selectpipeindex2 = index;
                                break;
                            }
                        }

                        PipevectorSource[selectpipeindex1][selectpipeindex2].addFeature(TextFeatures[selectpipeindex1][selectpipeindex2]);
                    }

                    feature.setStyle(function () { return [PipelineStyle, PipeblueInnerLine]; });
                    hoveredFeature = feature;
                    hoveredFeaturekind = 3;
                }
            }

            
            // 반환값 true는 반복 중단 (원하는 로직에 따라 조절)
            return true;
        });
    }

});

map.on('singleclick', function (evt) {

    if(GPSFlag == 0)
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
                let tt = feature.get('line');
                sendMessageToCSharp( 'marker_'+tt);
            }
            else if (feature.get('type') == 3) // 관로
            {
                let tt = feature.get('line');
                sendMessageToCSharp('pipe_'+tt);
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



let color_road;
let color_outline;
let color_arrow;

export function setroads(index,lat,log,color,color2,color3,name) {

    color_road = color;
    color_outline = color2;
    color_arrow = color3;

    defaultStyle = new ol.style.Style({
        fill: new ol.style.Fill({ color: color_road }),
        stroke: new ol.style.Stroke({ color: color_outline, width: 1 }),
    });

    const ind = index*1;

    
    if(roadLayers[ind] != null)
    {
        map.removeLayer(roadLayers[ind]);
        map.removeLayer(arrowLayers[ind]);
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
    const transformedCoords = coords.map(coord => ol.proj.fromLonLat(coord));
    const polygonGeometry = new ol.geom.Polygon([transformedCoords]);

    const polygonFeature = new ol.Feature({
        geometry: polygonGeometry,
        name: name,
    });

    polygonFeature.setStyle(defaultStyle);
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
                    color: color_arrow,
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

        center_lats[ind] = clats[Math.floor(clats.length/2)]*1.0;
        center_lons[ind] = clogs[Math.floor(clogs.length/2)]*1.0;

        const arrow_coords = clats.map((lat3, i) => [clogs[i], lat3]);
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

        arrowFeaturesList[ind] = arrowFeatures;

        const arrow_vectorSource = new ol.source.Vector({
        features: [...arrowFeatures]
        });

        arrowLayers[ind] = new ol.layer.Vector({
            source: arrow_vectorSource,
            interactive: false
        });

        //console.log(arrowLayers[ind]);
    }
}



export function selectroad(index) {

    index = index*1;

    if(center_lats[index] != -1)
    {
        const center = ol.proj.transform([center_lons[index],center_lats[index]], 'EPSG:4326','EPSG:3857');
        map.getView().setCenter(center); // 지도 시점 변경
    }
}



export function SetColor(color1,color2,color3) {

    color_road = color1;
    color_outline = color2;
    color_arrow = color3;

    defaultStyle = new ol.style.Style({
        fill: new ol.style.Fill({ color: color_road }),
        stroke: new ol.style.Stroke({ color: color_outline, width: 1 }),
    });

    for(let i = 0; i < roadfeatures.length;i++)
    {
        if(roadfeatures[i] != null)
        {
            roadfeatures[i].setStyle(defaultStyle);
        }
    }

    const blackstyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: color_arrow,
            width: 1.5
        })
    });

    for(let i = 0; i < arrowFeaturesList.length;i++)
    {
        if(arrowFeaturesList[i].length != 0)
        {
            for(let j = 0; j < arrowFeaturesList[i].length;j++)
            {
                arrowFeaturesList[i][j].setStyle(blackstyle);
            }
        }
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
        map.removeLayer(roadLayers[ind]);
        console.log(roadLayers)
        console.log(flag)
    }
    else
    {
        map.addLayer(roadLayers[ind]);
        console.log(roadLayers)
        console.log(flag)
    }
}


export function checkpipe(index,flag) {
    if(flag == 0)
    {
        index = index*1;
        for(let i = 0 ; i < PipeLayers[index].length;i++)
        {
            map.removeLayer(PipeLayers[index][i]);
        }
    }
    else
    {
        index = index*1;
        for(let i = 0 ; i < PipeLayers[index].length;i++)
        {
            map.addLayer(PipeLayers[index][i]);
        }
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
            pointFeature.setStyle(TextMarkerStyle1(pointFeature));
        }
        else
        {
            pointFeature.setStyle(NoTextMarkerStyle1());
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




export function setmarker2(index,lats,logs,names,kind,color,color2) {

    markerkind = kind*1;
    color_marker = color;
    color_marker_outline = color2;

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
        pointFeature.set('line', index);
        pointFeature.set('name', temp[i]);

        if(nameflag)
        {
            if(markerkind == 0)
            {
                pointFeature.setStyle(TextMarkerStyle1(pointFeature));
            }
            else if(markerkind == 1)
            {
                pointFeature.setStyle(TextMarkerStyle2(pointFeature));
            }
            else if(markerkind == 2)
            {
                pointFeature.setStyle(TextMarkerStyle3(pointFeature));
            }
            else if(markerkind == 3)
            {
                pointFeature.setStyle(TextMarkerStyle4(pointFeature));
            }
        }
        else
        {
            if(markerkind == 0)
            {
                pointFeature.setStyle(NoTextMarkerStyle1());
            }
            else if(markerkind == 1)
            {
                pointFeature.setStyle(NoTextMarkerStyle2());
            }
            else if(markerkind == 2)
            {
                pointFeature.setStyle(NoTextMarkerStyle3());
            }
            else if(markerkind == 3)
            {
                pointFeature.setStyle(NoTextMarkerStyle4());
            }
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
}




export function Removepipe(index) {

    index = index*1;

    for(let i = 0 ; i < PipeLayers[index].length;i++)
    {
        map.removeLayer(PipeLayers[index][i]);
    }

    PipeLayers[index].length = 0;
    PipeFeatures[index].length = 0;
    PipevectorSource[index].length = 0;
    TextFeatures[index].length = 0;
}


export function addpipe(index,lats,logs,name) {

    index = index*1;
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
    lineFeature.set('line', index);

    PipeFeatures[index].push(lineFeature);


     // 텍스트
    const lineCenter = line.getCoordinateAt(0.5);

    const textFeature = new ol.Feature({
    geometry: new ol.geom.Point(lineCenter),
    name:name
    });

    textFeature.setStyle(createPipetextStyle(textFeature));
    TextFeatures[index].push(textFeature);

    // 벡터 소스 및 레이어
    const vectorSource = new ol.source.Vector({
    features: [lineFeature]
    });

    PipevectorSource[index].push(vectorSource);

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

    PipeLayers[index].push(vectorLayer);


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





// GPS 클릭 기능들
let DrawGPS = null;
let EditGPS = null;
let GPSFlag = 0;

export function StartGPSClickMode(index) {

    console.log('StartGPSClickMode');

    index = index*1;
    GPSFlag = 1;
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
            GPSFlag = 0;

            sendMessageToCSharp(str);
    });
}



let EditGPSCircleFeatures = [];
let EditGPSCircleLayer;
let EditGPSModify;
let EditGPSModifyIndex = 0;
let EditGPSModifyCoord;

export function StartGPSEditMode(index,lats,logs) {

    console.log('StartGPSEditMode');

    EditGPSCircleFeatures.length = 0;

    index = index*1;
    GPSFlag = 2;
    modeText2.style.display = 'block';

    const coordinates = [];

    for(let i = 0 ; i < lats.length;i++)
    {
        const lat = lats[i]*1.0;
        const log = logs[i]*1.0;
        coordinates.push(ol.proj.transform([log,lat], 'EPSG:4326','EPSG:3857'));
    }

    const pointSource = new ol.source.Vector();
    const pointFeatures = coordinates.map(c => new ol.Feature({ geometry: new ol.geom.Point(c) }));

    for(let i = 0 ; i < pointFeatures.length;i++)
    {
        pointFeatures[i].set('type', 4);
        EditGPSCircleFeatures.push(pointFeatures[i]);
    }

    pointSource.addFeatures(pointFeatures);

    EditGPSCircleLayer = new ol.layer.Vector({
        source: pointSource,
        style: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({ color: '#00ffff' }),
                stroke: new ol.style.Stroke({ color: '#000', width: 2 }),
            }),
        }),
    });

    const line = new ol.geom.LineString(coordinates);
    const lineFeature = new ol.Feature({
    geometry: line
    });

    const vectorSource = new ol.source.Vector({
    features: [lineFeature]
    });

    EditGPS = new ol.layer.Vector({
    source: vectorSource,
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#e85555ff', width: 5 })})
    });

    map.addLayer(EditGPS);
    map.addLayer(EditGPSCircleLayer);

    EditGPSModify = new ol.interaction.Modify({
    source: vectorSource,
    insertVertexCondition: ol.events.condition.never,

    style: function (feature) {
    const geom = feature.getGeometry();
    if (geom.getType() === 'Point') {
        return new ol.style.Style({
            image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({ color: '#00ffff' }),
            stroke: new ol.style.Stroke({ color: '#000', width: 2 }),
            }),
        });
        }
        return null;
    },
    });

    map.addInteraction(EditGPSModify);

    EditGPSModify.on('modifystart', function (evt) {
        console.log('수정 시작!');

        const feature = evt.features.item(0);
        const geom = feature.getGeometry();
        const coords = geom.getCoordinates();
        const clickCoord = evt.mapBrowserEvent.coordinate;

        EditGPSModifyIndex = -1;
        let minDist = Infinity;

        coords.forEach((c, i) => {
            const dx = c[0] - clickCoord[0];
            const dy = c[1] - clickCoord[1];
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
            minDist = dist;
            EditGPSModifyIndex = i;
            }
        });

        evt.features.forEach((feature) => {
            const geom = feature.getGeometry();
            geom.on('change', function (e) {
            const coords = e.target.getCoordinates();
            EditGPSCircleFeatures[EditGPSModifyIndex].getGeometry().setCoordinates(coords[EditGPSModifyIndex]);
            });
        });
    });

    // 6️⃣ 점 이동 후 좌표 확인
    EditGPSModify.on('modifyend', (event) => {

        const feature = event.features.item(0);

        const newCoords = feature.getGeometry().getCoordinates();
        EditGPSModifyCoord = feature.getGeometry().getCoordinates().map(c => ol.proj.toLonLat(c));
        console.log('수정된 좌표:', newCoords);

        EditGPSCircleFeatures[EditGPSModifyIndex].getGeometry().setCoordinates(newCoords[EditGPSModifyIndex]);
    });
}





const mapElement = map.getTargetElement();

mapElement.addEventListener('contextmenu', function (event) {
   event.preventDefault(); // 기본 브라우저 우클릭 메뉴 막기

    if(GPSFlag != 0)
    {
        DrawGPS.removeLastPoint(); // 마지막 점 제거
        DrawGPS.removeLastPoint(); // 마지막 점 제거
    }

});

window.addEventListener('keydown', (event) => {

    var keycode = event.keyCode;

    // ENTER
    if (keycode == 13) {
        if(GPSFlag == 1)
        {
            DrawGPS.finishDrawing();
            modeText.style.display = 'none';
        }
        else if(GPSFlag == 2)
        {
            map.removeLayer(EditGPS);
            map.removeLayer(EditGPSCircleLayer);
            EditGPS = null;
            EditGPSCircleLayer = null;
            modeText2.style.display = 'none';
            map.removeInteraction(EditGPSModify);
            GPSFlag = 0;

            // let str = "";
            // for(let i = 0 ; i < EditGPSModifyCoord.length;i++)
            // {
            //     str += EditGPSModifyCoord[i][1] + "_"+EditGPSModifyCoord[i][0]+ "_";
            // }
            // sendMessageToCSharp(str);
        }

    }

    // ESC
    if (keycode == 27) {
        if(GPSFlag == 1)
        {
            modeText.style.display = 'none';
            GPSFlag = 0;
            DrawGPS.abortDrawing();
            map.removeInteraction(DrawGPS);
        }
        else if(GPSFlag == 2)
        {
            map.removeLayer(EditGPS);
            map.removeLayer(EditGPSCircleLayer);
            EditGPS = null;
            EditGPSCircleLayer = null;
            modeText2.style.display = 'none';
            map.removeInteraction(EditGPSModify);
            GPSFlag = 0;
        }
    }
});

function setMapView(type) {

    if(mapkindflag == 1)
    {
        if(type == 'satellite')
        {
            satelliteLayer_Vworld.setVisible(true);
            normalLayer_VWorld.setVisible(false);
        }
        else
        {
            satelliteLayer_Vworld.setVisible(false);
            normalLayer_VWorld.setVisible(true);
        }
    }
    else if(mapkindflag == 2)
    {
        if(type == 'satellite')
        {
            satelliteLayer_Vworld.setVisible(true);
            normalLayer_OSM.setVisible(false);
        }
        else
        {
            satelliteLayer_Vworld.setVisible(false);
            normalLayer_OSM.setVisible(true);
        }
    }
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
            mapkindflag2 = 2;
        }
        else
        {
            setMapView('normal');
            mapkindflag2 = 1;
        }

      });
    });











let rightmouseFeature = null;
const menu = document.getElementById('context-menu');
const menu2 = document.getElementById('context-menu2');

    // 1) 우클릭 이벤트
map.getViewport().addEventListener('contextmenu', function(e) {
  e.preventDefault(); // 브라우저 기본 메뉴 막기

  // 지도 좌표
  const pixel = map.getEventPixel(e);
  const feature = map.forEachFeatureAtPixel(pixel, f => f);

    map.getTargetElement().style.cursor = feature ? 'pointer' : '';

  if (feature) {
    if (feature.get('noMouse')) {
      return false; // 👉 이 피처는 무시
    }

    if (feature.get('type') == 1) // 측선
    {
        // menu.style.left = e.pageX + 'px';
        // menu.style.top = e.pageY + 'px';
        // menu.style.display = 'block';
    }
    else if (feature.get('type') == 2) // 마커
    {
        rightmouseFeature = feature;
        menu.style.left = e.pageX + 'px';
        menu.style.top = e.pageY + 'px';
        menu.style.display = 'block';
    }
    if (feature.get('type') == 3) // 관로
    {
        rightmouseFeature = feature;
        menu2.style.left = e.pageX + 'px';
        menu2.style.top = e.pageY + 'px';
        menu2.style.display = 'block';
    }
  } else {
    menu.style.display = 'none';
    menu2.style.display = 'none';
  }
});

// 이름 변경
document.getElementById('rename').addEventListener('click', () => {
    if (rightmouseFeature) {
    let index = rightmouseFeature.get('line');
    let name = rightmouseFeature.get('name');
    sendMessageToCSharp('mrename_' + index + "_" + name);
    }
    menu.style.display = 'none';
});

// 삭제
document.getElementById('delete').addEventListener('click', () => {
    if (rightmouseFeature) {
    let index = rightmouseFeature.get('line');
    let name = rightmouseFeature.get('name');
    sendMessageToCSharp('mdelete_' + index + "_" + name);
    }
    menu.style.display = 'none';
});


// 관로이름 변경
document.getElementById('rename2').addEventListener('click', () => {
    if (rightmouseFeature) {
    let index = rightmouseFeature.get('line');
    let name = rightmouseFeature.get('name');
    sendMessageToCSharp('prename_' + index + "_" + name);
    }
    menu2.style.display = 'none';
});

// 관로삭제
document.getElementById('delete2').addEventListener('click', () => {
    if (rightmouseFeature) {
    let index = rightmouseFeature.get('line');
    let name = rightmouseFeature.get('name');
    sendMessageToCSharp('pdelete_' + index + "_" + name);
    }
    menu2.style.display = 'none';
});

// 지도 클릭 시 메뉴 숨기기
map.on('click', () => {
    menu.style.display = 'none';
    menu2.style.display = 'none';
});






export function setmapkind(flag) {

    flag = flag*1;

    if(mapkindflag == 1)
    {
        if(mapkindflag2 == 1)
        {
            normalLayer_VWorld.setVisible(false);
        }
        else
        {
            satelliteLayer_Vworld.setVisible(false);
        }
    }
    else if(mapkindflag == 2)
    {
        if(mapkindflag2 == 1)
        {
            normalLayer_OSM.setVisible(false);
        }
        else
        {
            satelliteLayer_Vworld.setVisible(false);
        }
    }

    mapkindflag = flag;

    if(mapkindflag == 1)
    {
        if(mapkindflag2 == 1)
        {
            normalLayer_VWorld.setVisible(true);
        }
        else
        {
            satelliteLayer_Vworld.setVisible(true);
        }
    }
    else if(mapkindflag == 2)
    {
        if(mapkindflag2 == 1)
        {
            normalLayer_OSM.setVisible(true);
        }
        else
        {
            satelliteLayer_Vworld.setVisible(true);
        }
    }

}

export function setmapkind2(flag) {
    mapkindflag = flag;
}




window.setroadcount = setroadcount;
window.setroads = setroads;
window.checkroad = checkroad;
window.selectroad = selectroad;

window.checkmarker = checkmarker;

window.removemarker = removemarker;

window.moveview = moveview;
window.Removeroad = Removeroad;
window.setmarker = setmarker;
window.setmarker2 = setmarker2;


window.Removepipe = Removepipe;
window.addpipe = addpipe;
window.checkpipe = checkpipe;
window.SetColor = SetColor;


window.StartGPSClickMode = StartGPSClickMode;
window.StartGPSEditMode = StartGPSEditMode;
window.setmapkind = setmapkind;
window.setmapkind2 = setmapkind2;