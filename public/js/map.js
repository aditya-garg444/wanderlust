var map = L.map('map').setView([lat, lng], 10.5); // this lat and lng we are getting from show.ejs
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


const awesomeMarker = L.AwesomeMarkers.icon({
    icon: 'home', // Icon name (e.g., 'info', 'home', etc.)
    markerColor: 'red', // Marker color (e.g., 'red', 'blue', 'green')
    prefix: 'fa', // Font Awesome prefix
});

var marker = L.marker([lat, lng], { icon: awesomeMarker }).addTo(map);
marker.bindPopup("Exact location provided after booking.").openPopup();
var circle = L.circle([lat, lng], {
    color: 'transparent',
    fillColor: '#f03',
    fillOpacity: 0.3,
    radius: 4500
}).addTo(map);