let map;

if (!window.mapInitialized) {
  window.mapInitialized = true;

  mapboxgl.accessToken = mapToken;
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center:  listing.geometry.coordinates,
    zoom: 9
  });

  map.on("load", function () {
    map.resize();
    console.log("Map loaded properly");

    const marker = new mapboxgl.Marker({color:"red"})
      .setLngLat(listing.geometry.coordinates)
      .setPopup(new mapboxgl.Popup({offset:25})
       .setHTML(`<h4>${ listing.location}</h4><p> Exact location will be provided after booking </p>`))
      .addTo(map);
  });
}