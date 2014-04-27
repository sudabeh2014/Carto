//Geocoder Parameters
function getURLParameter(name) {
  return decodeURI(
  (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, ])[1]);
  };

var regionParameter = getURLParameter('region');
var region = (regionParameter === 'undefined') ? '' : regionParameter;
    
//Initialize Map
var map;
var satelliteURL   = "http://a.tiles.mapbox.com/v3/osaez.gkblk7bk/{z}/{x}/{y}.png";
var roadURL   = "http://a.tiles.mapbox.com/v3/osaez.gkbm3gfn/{z}/{x}/{y}.png";

function init() {    
  map = new L.Map('map', {
    center: [39.9573, -75.1585],
    zoom: 13,
    minZoom: 12,
    maxZoom: 18
    });
    
//Geocoder Controls
new L.Control.GeoSearch({
    provider: new L.GeoSearch.Provider.Google({
    region: region
    })}).addTo(map);
       
//BaseMap from Mapbox 
var baseLayer = L.tileLayer(satelliteURL, {
  attribution: '<a href="http://mapbox.com/about/maps/" target="_blank">w/ Mapbox</a>'
  }).addTo(map);

//CartoDB Parameters 
var layerUrl = 'http://vfm.cartodb.com/api/v2/viz/c89d73d2-c08a-11e3-aeb2-0e73339ffa50/viz.json';
var sublayers = [];

cartodb.createLayer(map, layerUrl)
.on('done', function (layer) {

var subLayerOptions = {
  sql: "SELECT * FROM philly_billboards",
  //cartocss: '#nyc{marker-width: 24;  marker-allow-overlap: true; marker-placement: point; } {#nyc[type="Billboard"] { marker-file: url(https://s3.amazonaws.com/cityscan-nyc-demo/billboard.png);} {#nyc[type="Fence"] { marker-file: url(https://s3.amazonaws.com/cityscan-nyc-demo/fence.png);} {#nyc[type="Awning"] { marker-file: url(https://s3.amazonaws.com/cityscan-nyc-demo/signpost.png);} {#nyc[type="Scaffolding"] { marker-file: url(https://s3.amazonaws.com/cityscan-nyc-demo/construction.png);}'        
  };

var sublayer = layer.getSubLayer(0);
sublayer.set(subLayerOptions);
sublayers.push(sublayer);

map.addLayer(layer);
layer.infowindow.set('template', $('#infowindow_template').html());
  }).on('error', function () {
  //Log the error
  });

//Layer Filter
var LayerActions = {
  bulletin: function() {
  sublayers[0].setSQL("SELECT * FROM philly_billboards WHERE type = 'Bulletin'")
  return true;
  },
  digital: function() {
  sublayers[0].setSQL("SELECT * FROM philly_billboards WHERE type = 'Digital'")
  return true;
  },
  poster: function() {
  sublayers[0].setSQL("SELECT * FROM philly_billboards WHERE type = 'Junior Poster'")
  return true;
  },
  walls: function() {
  sublayers[0].setSQL("SELECT * FROM philly_billboards WHERE type = 'Walls/Spectacular'")
  return true;
  },
  other: function() {
  sublayers[0].setSQL("SELECT * FROM philly_billboards WHERE type = 'Other'")
  return true;
  },
  all: function() {
  sublayers[0].setSQL("SELECT * FROM philly_billboards")
  return true;
  }};

$('.button').click(function() {
  $('.button').removeClass('selected');
  $(this).addClass('selected');
  LayerActions[$(this).attr('id')]();
  }); 

var hash = new L.Hash(map);
    
//Download KML format           
$('#downkml').click(function () {
  var nwlat = map.getBounds().getNorthWest().lat,
      nwlon = map.getBounds().getNorthWest().lng,
      selat = map.getBounds().getSouthEast().lat,
      selon = map.getBounds().getSouthEast().lng;
  //Enconded SQL string for data download
  var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20philly_billboards%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=kml";
      $(this).attr("href", new_sql);
    });

//Download Shapefile format           
$('#downshp').click(function () {
  var nwlat = map.getBounds().getNorthWest().lat,
      nwlon = map.getBounds().getNorthWest().lng,
      selat = map.getBounds().getSouthEast().lat,
      selon = map.getBounds().getSouthEast().lng;
  var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20philly_billboards%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=shp";
      $(this).attr("href", new_sql);
    });
    
//Download GeoJSON format           
$('#downgeojson').click(function () {
  var nwlat = map.getBounds().getNorthWest().lat,
      nwlon = map.getBounds().getNorthWest().lng,
      selat = map.getBounds().getSouthEast().lat,
      selon = map.getBounds().getSouthEast().lng;
  var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20philly_billboards%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=geojson";
      $(this).attr("href", new_sql);
    });
    
//Download CSV format           
$('#downcsv').click(function () {
  var nwlat = map.getBounds().getNorthWest().lat,
      nwlon = map.getBounds().getNorthWest().lng,
      selat = map.getBounds().getSouthEast().lat,
      selon = map.getBounds().getSouthEast().lng;
  var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20philly_billboards%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=csv";
      $(this).attr("href", new_sql);
    });

//BaseMap Layer Switchher (Testing 01/14/14)   
$( "#roadLayer" ).click(function() {
alert( "Roadlayer switch works");
var baseLayer2 = L.tileLayer(roadURL, {
  attribution: '<a href="http://mapbox.com/about/maps/" target="_blank">w/ Mapbox</a>'
  }).addTo(map);
  });

};