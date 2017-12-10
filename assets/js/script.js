var map;
var myLatlng = new google.maps.LatLng(35.655689, 139.544200);
var service = new google.maps.DistanceMatrixService();
var mapOptions = {
  zoom: 16,
  center: myLatlng,
  mapTypeId: 'terrain'
};
const testData = {
  1:[
    {name:"ひじき",cat_id:1},
    {x:35.656610, y:139.545311},
    {x:35.657147, y:139.546101}
  ],
  2:[
    {name:"よしひこ",cat_id:2},
    {x:35.657210, y:139.545606},
    {x:35.658297, y:139.544963}
  ],
  3:[
    {name:"みけ",cat_id:3},
    {x:35.653914, y:139.542106},
    {x:35.653971, y:139.538639}
  ],
  4:[
    {name:"たま",cat_id:4},
    {x:35.654891, y:139.546306}
  ],
  5:[
    {name:"ぶち",cat_id:5},
    {x:35.659230, y:139.541604}
  ],
}

/*function makeGeoJson(testData){
  function getFeature(name,x,y){
    return { 
      "type": "Feature",
      "properties": {"name": name},
      "geometry": {
        "type": "Point",
        "coordinates": [x, y]
      }
    }
  }

  var features = [];
  for(var i = 0;i<testData.length;i++){
    var catData = testData[i];
    var x = 0;
    var y = 0;
    for(var j = 1;j<catData.length;j++){
      //coordinate の 中点を計算
      x = x + catData[j].x;
      y = y + catData[j].y;
    }
    x = x/(catData.length-1);
    y = y/(catData.length-1);
    console.log(catData[0].name," : ",x,",",y);
    var feature = getFeature(catData[0].name,x,y);
    features.push(feature);
  }

  return { 
    "type": "FeatureCollection",
    "features": features
  }
}*/

function getDistance(lat1,lon1,lat2,lon2){
    var mode = false;
    var radlat1 = lat1 * Math.PI / 180.0; //経度1
    var radlon1 = lon1 * Math.PI / 180.0; //緯度1
    var radlat2 = lat2 * Math.PI / 180.0; //経度2
    var radlon2 = lon2 * Math.PI / 180.0; //緯度2
    //平均緯度
    var radLatAve = (radlat1 + radlat2) / 2;
    //緯度差
    var radLatDiff = radlat1 - radlat2;
    //経度差算
    var radLonDiff = radlon1 - radlon2;

    var sinLat = Math.sin(radLatAve);
    if(mode==true){
        //mode引数がtrueなら世界測地系で計算（デフォルト）
        var tmp =  1.0 - 0.00669438 * (sinLat*sinLat);
        var meridianRad = 6335439.0 / Math.sqrt(tmp*tmp*tmp); // 子午線曲率半径
        var dvrad = 6378137.0 / Math.sqrt(tmp); // 卯酉線曲率半径
    }else{
        //mode引数がfalseなら日本測地系で計算
        var tmp = 1.0 - 0.00667478 * (sinLat*sinLat);
        var meridianRad = 6334834.0 / Math.sqrt(tmp*tmp*tmp); // 子午線曲率半径
        var dvrad = 6377397.155 / Math.sqrt(tmp); // 卯酉線曲率半径
    }
    var t1 = meridianRad * radLatDiff;
    var t2 = dvrad * Math.cos(radLatAve) * radLonDiff;
    var dist = Math.sqrt((t1*t1) + (t2*t2));

    dist = Math.floor(dist); //小数点以下切り捨て
    return dist; //２点間の直線距離を返す (単位はm)
}

function getCenter(catData){
  console.log(catData);
  var x = 0;
  var y = 0;
  for(var j in catData){
    if(j!=0){
      //coordinate の 中点を計算
      x = x + (catData[j].x-0);
      y = y + (catData[j].y-0);
    }
  }
  x = x/(Object.keys(catData).length-1);
  y = y/(Object.keys(catData).length-1);
  console.log(x,":",y)

  return {lat:x,lng:y}
}

function getRadius(catData,center){
  if(Object.keys(catData).length<3){
    return 140;
  }else{
    return getDistance(center.lat,center.lng,(catData[1].x-0),(catData[1].y-0));
  }

}

function setCatList(dataList){
  var clickEvent = function(id,name){
    return function(evt){
      showMordal(id,name);
    }
  };
  var clickEvent2 = function(lat,lng){
    return function(evt){
      forcusMap(lat,lng);
    }
  };
  var catList = document.getElementById('catList');
  for (var i in dataList) {
    var catPoint = getCenter(dataList[i]);
    var li = document.createElement('p');
    li.classList.add('catList__item');

    var name = document.createElement('p');
    var addr = document.createElement('p');
    var detail = document.createElement('a');

    name.classList.add('catList__item__name');
    addr.classList.add('catList__item__address');
    detail.classList.add('catList__item__button');
    
    name.textContent = dataList[i][0]["name"];
    addr.textContent = "緯度:"+catPoint.lat.toFixed(4)+", 経度:"+catPoint.lng.toFixed(4);
    detail.textContent = "くわしく見る";

    li.addEventListener("click",clickEvent2(catPoint.lat, catPoint.lng));
    detail.addEventListener("click",clickEvent(dataList[i][0]["cat_id"],dataList[i][0]["name"]));

    li.appendChild(name);
    li.appendChild(addr);
    li.appendChild(detail);
    
    catList.appendChild(li);
  }
}

function forcusMap(lat,lng){
  map.panTo(new google.maps.LatLng(lat,lng));
  console.log(lat,lng)
}

function showMordal(cat_id,name){
  console.log(cat_id,name);
  $('#modal-title').text(name);


  fetch('http://13.115.239.18/info?cat_id='+cat_id, { mode: 'cors' })
  .then(function(response) {
    return response.json();
  }).then((json)=>{
    console.log(json);
    $('#modal-leftImg').attr("src","http://13.115.239.18/"+json.imagePath.file_path);
    $('#modal-item_latest').text(json.latestAppear.create_at);
    $('#modal-item_kyosei').text((json.kyosei.surgery_flag?"されてる":"されてない"));
    fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng='+json.latestAppear.location_x+','+json.latestAppear.location_y+'&key=AIzaSyDxKhQcrnMgAJotsIr4V1Lr_-j83FmTDCc&language=ja')
    .then(function(response) {
      return response.json();
    }).then((json)=>{
      $('#modal-item_address').text(json.results[0].formatted_address);
    });
  });

  $('#sampleModal').modal();
}

function initmap(){
  map = new google.maps.Map(document.getElementById('map'),mapOptions);
  
  fetch('http://13.115.239.18/geo', { mode: 'cors' })
  .then(function(response) {
    return response.json();
  }).then((json)=>{
    console.log(json);
    console.log(testData);
    for (i in json) {
      // Add the circle for this city to the map.
      var catAreaCenter = getCenter(json[i])
      var cityCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: catAreaCenter,
        radius: getRadius(json[i],catAreaCenter)
      });
      console.log(cityCircle.radius);
    }
    setCatList(json);

  });
}

initmap();

