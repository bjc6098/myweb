
'use strict';


let lastMouse;
let planLayers;
let planRoadLayers;
let planviewCount;

let GPSFlag = false;

let markerPointLayers;
let markerPointFeatures;

let hoveredFeature = null;
let hoveredFeaturekind = 0;
let hoverindex = -1;

let roadcount = 0;
let roadLayers;
let roadfeatures;

let PipeLayers;
let PipeFeatures;
let PipevectorSource;
let TextFeatures;

let nameflag = true;

const loadingModal = document.getElementById('loadingModal');
let center_lat = 0;
let center_lon = 0;
let opacity = 1.0;


let center_lats;
let center_lons;

let color_marker = '#ff0000ff';
let color_marker_outline = '#ffffffff';

let markerkind = 0;

let mapkindflag = 1; // 1 == Vworld ,2  == OpenStreetMap
let mapkindflag2 = 2; // 1 == 일반지도 ,2  == 위성지도


let rightmouseFeature = null;
const menu = document.getElementById('context-menu');
const menu2 = document.getElementById('context-menu2');
const menu3 = document.getElementById('context-menu3');
const addressBox = document.getElementById('addressBox');
const addressBox_close = document.getElementById('addressBox_close');
const addressBoxText = document.getElementById('addressBoxText');

const DistanceBox = document.getElementById('DistanceBox');
const DistanceBox_close = document.getElementById('DistanceBox_close');
const DistanceBoxText = document.getElementById('DistanceBoxText');

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


    // Overlay 생성
const popupOverlay = new ol.Overlay({
    element: DistanceBox,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -10]
});

map.addOverlay(popupOverlay);

popupOverlay.setPosition(undefined);


const markerimg = new ol.style.Icon({
    anchor: [0.5, 1], // 이미지 앵커 위치
    src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // 마커 이미지 URL
    scale: 0.06 // 크기 조정
})

export function setroadcount(count) {

    roadcount = count*1;
    markerPointLayers = new Array(roadcount);
    markerPointFeatures = new Array(roadcount);

    roadLayers = new Array(roadcount);
    roadfeatures = new Array(roadcount);

    PipeLayers = new Array(roadcount);
    PipeFeatures = new Array(roadcount);
    PipevectorSource = new Array(roadcount);
    TextFeatures = new Array(roadcount);

    center_lats = new Array(roadcount);
    center_lons = new Array(roadcount);

    for(let i = 0;i < roadcount;i++)
    {
        markerPointLayers[i] = [];
        markerPointFeatures[i] = [];
        
        center_lats[i] = -1;
        center_lons[i] = -1;

        PipeLayers[i] = [];
        PipeFeatures[i] = [];
        PipevectorSource[i] = [];
        TextFeatures[i] = [];
    }
}

let selectpipeindex1 = -1;
let selectpipeindex2 = -1;

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
        else if (feature.get('type') == 10) // 측선
        {
            let tt = feature.get('line');
            sendMessageToCSharp('pipe_'+tt);
        }

        menu3.style.display = 'none';

        // 반환값 true는 반복 중단 (원하는 로직에 따라 조절)
        return true;
    });
});








export function moveview(lat,log) {

    center_lat = lat*1.0;
    center_lon = log*1.0;
    SetViewCenter();
}

// homeButton.addEventListener('click', function(e) {
//     SetViewCenter();
// });


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


export function Removeplanview(index)
{
    index = index*1;
    for(let i = 0 ; i < planLayers[index].length;i++)
    {
        map.removeLayer(planLayers[index][i]);
    }
    planLayers[index].length = 0;

    // for(let i = 0 ; i < planRoadLayers[index].length;i++)
    // {
    //     map.removeLayer(planRoadLayers[index][i]);
    // }
    // planRoadLayers[index].length = 0;

}


export function Removeplanview_road(index)
{
    index = index*1;
    for(let i = 0 ; i < planRoadLayers[index].length;i++)
    {
        map.removeLayer(planRoadLayers[index][i]);
    }
    planRoadLayers[index].length = 0;

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
        zIndex:9
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


export function addplanview_road(image,minLat,minLon,maxLat,maxLon,index) {

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

    planRoadLayers[index].push(imageLayer);




    /*
    if(planRoadLayers[index].length == planviewCount[index])
    {
        for(let i = 0 ; i < planRoadLayers[index].length;i++)
        {
            map.addLayer(planRoadLayers[index][i]);
        }
    }*/
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

    //planLayers.length = 0;
    const vv = count*1;

    planviewCount = new Array(vv);
    planLayers = new Array(vv);
    planRoadLayers = new Array(vv);

    for(let i = 0 ; i < vv;i++)
    {
        planviewCount[i] = count2[i]*1;
        planLayers[i] = [];
        planRoadLayers[i] = [];
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

export function clearplanview_road() {

    for(let i = 0 ; i < planRoadLayers.length;i++)
    {
        for(let j = 0 ; j < planRoadLayers[i].length;j++)
        {
            map.removeLayer(planRoadLayers[i][j]);
        }
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

export function setmarker(index,lats,logs,names) {

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
            pointFeature.setStyle(NoTextMarkerStyle1);
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



export function roadviewon(index) {

    index = index*1;

    for(let i = 0 ; i < planRoadLayers[index].length;i++)
    {
        map.addLayer(planRoadLayers[index][i]);
    }
    
}


export function roadviewoff(index) {

    index = index*1;

    for(let i = 0 ; i < planRoadLayers[index].length;i++)
    {
        map.removeLayer(planRoadLayers[index][i]);
    }
    
}


window.moveview = moveview;
window.addplanview = addplanview;
window.addplanview_road = addplanview_road;
window.clearplanview = clearplanview;
window.clearplanview_road = clearplanview_road;
window.setplanviewCount = setplanviewCount;
window.SetOpacity = SetOpacity;
window.Removeplanview = Removeplanview;
window.anistart = anistart;

window.setmarker = setmarker;
window.setmarker2 = setmarker2;
window.checkmarker = checkmarker;
window.removemarker = removemarker;
window.setroadcount = setroadcount;

window.roadviewon = roadviewon;
window.roadviewoff = roadviewoff;













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


    console.log('addpipe');
    console.log(PipeLayers[index]);

}


export function checkpipe(index,flag) {
    console.log(index)
    console.log(flag)
    console.log(PipeLayers[index])
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

const depthtext = document.getElementById('depthtext');

export function SetDepth(depth) {

    depth = depth*1.0;
    depthtext.innerText = depth.toFixed(2) + 'm';

}


window.Removepipe = Removepipe;
window.addpipe = addpipe;
window.checkpipe = checkpipe;
window.SetDepth = SetDepth;




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

window.setmapkind = setmapkind;
window.setmapkind2 = setmapkind2;







let last_lat = 0;
let last_log = 0;


// 1) 우클릭 이벤트
map.getViewport().addEventListener('contextmenu', function(e) {
  e.preventDefault(); // 브라우저 기본 메뉴 막기
    lastMouse = e;
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
        else if (feature.get('type') == 3) // 관로
        {
            rightmouseFeature = feature;
            menu2.style.left = e.pageX + 'px';
            menu2.style.top = e.pageY + 'px';
            menu2.style.display = 'block';
        }
        else if (feature.get('type') == 10) // 측선
        {
            rightmouseFeature = feature;
            menu3.style.left = e.pageX + 'px';
            menu3.style.top = e.pageY + 'px';
            menu3.style.display = 'block';
            console.log("asd");

            const coord = map.getCoordinateFromPixel(pixel);
            const point = ol.proj.transform([coord[0],coord[1]], 'EPSG:3857','EPSG:4326');
            last_lat = point[1];
            last_log = point[0];

        }
    } else {
        menu.style.display = 'none';
        menu2.style.display = 'none';
        menu3.style.display = 'none';

        const coord = map.getCoordinateFromPixel(pixel);
        const point = ol.proj.transform([coord[0],coord[1]], 'EPSG:3857','EPSG:4326');

        console.log(point)

        // 위도, 경도
        var lat = point[1];
        var lng = point[0];

        sendMessageToCSharp('address_' + lat + "_" + lng);
    }
});


export function SetAddress(address) {
    console.log('SetAddress');
    addressBoxText.innerText = address;
    // menu3.innerText = address;
    addressBox.style.left = (lastMouse.pageX - 80) + 'px';
    addressBox.style.top = (lastMouse.pageY - 40) + 'px';
    addressBox.style.display = 'block';
}

export function SetDistance(address,lat,log) {

    const lat1 = lat*1.0;
    const log1 = log*1.0;
    DistanceBox.style.display = 'block';
    const position = ol.proj.fromLonLat([lat1,log1]);
    popupOverlay.setPosition(position);
    DistanceBoxText.innerText = address+"m";
}



window.SetAddress = SetAddress;
window.SetDistance = SetDistance;


addressBox_close.addEventListener('click', () => {
    addressBox.style.display = 'none';
});


DistanceBox_close.addEventListener('click', () => {
    popupOverlay.setPosition(undefined);
    //DistanceBox.style.display = 'none';
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
























export function setroads(index,lat,log,name) {

    const defaultStyle2 = new ol.style.Style({
        fill: new ol.style.Fill({ color: '#00000000' }),
        zIndex : 10
    });

    const ind = index*1;

    if(roadLayers[ind] != null)
    {
        map.removeLayer(roadLayers[ind]);
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

    polygonFeature.setStyle(defaultStyle2);
    polygonFeature.set('noMouse', false);
    polygonFeature.set('line', index);
    polygonFeature.set('type', 10);

    const vectorSource = new ol.source.Vector({
        features: [polygonFeature]
    });

    const vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });

    let ii = Math.round(coords.length/4);

    // console.log(coords[ii][0]);
    
    center_lats[ind] = coords[ii][1];
    center_lons[ind] = coords[ii][0];

    roadfeatures[ind] = polygonFeature;
    roadLayers[ind] = vectorLayer;
    console.log("setroads2 : " + index);
}



export function checkroad(index,flag) {
    const ind = index*1;

    if(flag == 0)
    {
        map.removeLayer(roadLayers[ind]);
    }
    else
    {
        map.addLayer(roadLayers[ind]);
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




window.checkroad = checkroad;
window.setroads = setroads;
window.selectroad = selectroad;


document.getElementById('create_marker').addEventListener('click', () => {

    if (rightmouseFeature) {
        let index = rightmouseFeature.get('line');
        //let name = rightmouseFeature.get('name');
        sendMessageToCSharp('createmarker_' + index + "_" + last_lat + "_" + last_log);
    }

    menu3.style.display = 'none';
});

document.getElementById('check_dist').addEventListener('click', () => {

    if (rightmouseFeature) {
        let index = rightmouseFeature.get('line');
        sendMessageToCSharp('checkdist_' + index + "_" + last_lat + "_" + last_log);
    }

    menu3.style.display = 'none';
});


