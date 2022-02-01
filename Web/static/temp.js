let map, infoWindow
let flags = 0
let markers = []
let markerarr = []
var coordinates;

function initMap() {
  var location = httpGet("/location")
  var obj = JSON.parse(location)
  var myLatlng = { lat: Number(obj.lat),lng: Number(obj.lng)}
  map = new google.maps.Map(document.getElementById("map"), {
    mapId: "c95fe25931e24faf",
    center: myLatlng,
    zoom: 150,
  });
  // Create the initial InfoWindow.
  let infoWindow = new google.maps.InfoWindow({
    position: myLatlng,
    content: "You are around here."
  });
  ///initialize current server's location
  infoWindow.open(map)
  setTimeout(function (){
    infoWindow.close()
  },3000)
  coordinates = myLatlng
  //infoWindow.open(map);
  // Configure the click listener.
  map.addListener("click", (mapsMouseEvent) => {
    // Close the current InfoWindow.
    //infoWindow.close();
    // Create a new InfoWindow.
    // infoWindow = new google.maps.InfoWindow({
    //   position: mapsMouseEvent.latLng,
    // });
    // infoWindow.setContent(
    //   JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
    // );
    // infoWindow.open(map);
    placeMarkerAndPanTo(mapsMouseEvent.latLng,map);
    appendMarkers(mapsMouseEvent.latLng.toJSON());
  });
  console.log(map)
}
function placeMarkerAndPanTo(latLng, map) {
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
  });
  map.panTo(latLng);
  markerarr.push(marker)
}
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // true for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function httpPost(theUrl,obj)
{
  var xhr = new XMLHttpRequest();
  xhr.open("POST", theUrl, false);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    value: obj
}));
  return xhr.responseText
}
function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
function appendMarkers(latLng)
{
  let obj = document.createElement("p");
  obj.innerHTML = flags + 1 + "\t" + "Latitude: " + latLng.lat + "\t" +"|"+"\t" + "Longitude: "+latLng.lng;
  document.getElementById("markers").appendChild(obj);
  flags += 1;
  markers.push(latLng);
}
document.getElementById("submit").addEventListener("click", function (e){
    var result = httpPost("/submit",markers);
    console.log(result)
})

document.getElementById("del").addEventListener("click",function(){
  var markertobedel = markerarr[markerarr.length - 1];
  markerarr.pop();
  markertobedel.setMap(null);
});