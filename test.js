
'use strict';

const planLayers = [];
const planviewCount = [];

const loadingModal = document.getElementById('loadingModal');
let center_lat = 0;
let center_lon = 0;
let opacity = 1.0;

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
    console.log(center);
    map.getView().setCenter(center); // 지도 시점 변경
    map.getView().setZoom(18); // 줌 레벨 설
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

    // console.log(imageExtent2)

    const imageLayer = new ol.layer.Image({ //png파일, jpeg파일 
        source : new ol.source.ImageStatic({
            url : `data:image/png;base64,${base64Image}`, 
            imageExtent: imageExtent2,
            projection : "EPSG:3857",
        }),
        opacity:opacity,
    });

    // imageLayer.onload = () => {
    //     console.log('Image loaded');
    // };

    planLayers[index].push(imageLayer);

    if(planLayers[index].length == planviewCount[index])
    {
        for(let i = 0 ; i < planLayers[index].length;i++)
        {
            map.addLayer(planLayers[index][i]);
        }
    }
}


export function setplanviewCount(count, count2) {

    planLayers.length = 0;

    const vv = count*1;

    for(let i = 0 ; i < count;i++)
    {
        const value = count2[i]*1;
        planviewCount.push(value);

        const imgs = [];

        planLayers.push(imgs);
    }
    console.log(planviewCount);
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


window.moveview = moveview;
window.addplanview = addplanview;
window.clearplanview = clearplanview;
window.setplanviewCount = setplanviewCount;
window.SetOpacity = SetOpacity;


















// const heatmaps = [];

// export function heatmapCreate(Lats,Logs,values) {

//     const datas = new ol.source.Vector();
//     console.log(values);

//     for(let i = 0 ; i < Lats.length;i++)
//     {
//         const point = ol.proj.transform([Logs[i],Lats[i]], 'EPSG:4326','EPSG:3857');
//         // console.log(point);
//         const feature = new ol.Feature({
//             geometry: new ol.geom.Point([point[0],point[1]]),
//             weight: values[i], // 가중치 설정
//         });
//         datas.addFeature(feature);
//     }


//     const heatmapLayer = new ol.layer.Heatmap({
//         source: datas,
//         blur:4, // 블러 크기
//         radius: 4.5, // 각 포인트의 반경
//         // weight: (feature) => feature.get('weight'), // 피처의 가중치 값 사용
//         weight: function (feature) {
//             // 각 데이터 포인트에 고정된 weight 값을 반환
//             const magnitude = feature.get('weight'); // 예: GeoJSON의 magnitude 필드
//             return magnitude; // 고정된 정규화 값 (0~1 범위)
//         },
//         gradient: ['#ffffff', '#dddddd', '#bbbbbb', '#888888', '#555555', '#000000'],
//     });

//     heatmaps.push(heatmapLayer);
//     map.addLayer(heatmapLayer);

// }

// map.getView().on('change:resolution', () => {
//     const zoom = map.getView().getZoom();

//     // const value = 0.2909*Math.pow(zoom,2) - 11.551*zoom + 115.35;
//     // for(let i = 0 ; i < heatmaps.length;i++)
//     // {
//     //     heatmaps[i].setRadius(value); // 줌 레벨에 따라 고정된 반경 설정
//     // }
//     console.log(zoom);
//     // console.log(value);
// });

// window.heatmapCreate = heatmapCreate;
















