var myLatlng = new google.maps.LatLng(35.655689, 139.544200);
var mapOptions = {
  zoom: 16,
  center: myLatlng,
  mapTypeId: 'terrain'
};
const testData = [
  [
    {name:"ひじき"},
    {x:35.656610, y:139.545311},
    {x:35.657147, y:139.546101}
  ],
  [
    {name:"よしひこ"},
    {x:35.657210, y:139.545606},
    {x:35.658297, y:139.544963}
  ],
  [
    {name:"みけ"},
    {x:35.653914, y:139.542106},
    {x:35.653971, y:139.538639}
  ],
  [
    {name:"たま"},
    {x:35.654891, y:139.546306}
  ],
  [
    {name:"ぶち"},
    {x:35.659230, y:139.541604}
  ]
]

function getCircle(color,size,) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: 'red',
    fillOpacity: .2,
    scale: Math.pow(2, magnitude) / 2,
    strokeColor: 'white',
    strokeWeight: .5
  };
}

function initmap(){  
  var map = new google.maps.Map(document.getElementById('map'),mapOptions);

  map.data.setStyle(function(feature) {
    var magnitude = 4;
    return {
      icon: getCircle(magnitude)
    };
  });
}



