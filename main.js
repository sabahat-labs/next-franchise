// =====================================================================
// EXERCISE 7 - SOLUTION
// Where should the next branch go?
// =====================================================================


const map = L.map('map');
map.setView([33.6900, 73.0400], 11);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 16,
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
}).addTo(map);

const outletIcon = L.divIcon({
    html: '<div style="background:#3A2E27;width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 4px rgba(0,0,0,.5)"></div>',
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11]
});


Promise.all([
    fetch('data/orders.geojson').then(function (r) { return r.json(); }),
    fetch('data/outlets.geojson').then(function (r) { return r.json(); })
])
.then(function (results) {

    const orders = results[0];
    const outlets = results[1];


    // 1. The cluster group.
    //    maxClusterRadius 50 rather than the default 80. Tighter groups,
    //    so neighbourhoods stay separate instead of merging into one
    //    blob over the city centre.
    const orderCluster = L.markerClusterGroup({
        maxClusterRadius: 50,
        showCoverageOnHover: true
    });


    // 2. Every order becomes a marker inside the group.
    //    GeoJSON stores [lng, lat]. Leaflet wants [lat, lng].
    const heatData = [];

    orders.features.forEach(function (feature) {

        const lng = feature.geometry.coordinates[0];
        const lat = feature.geometry.coordinates[1];
        const value = feature.properties.value;

        const marker = L.marker([lat, lng]);

        marker.bindPopup(`
            <strong>${feature.properties.id}</strong><br>
            Rs. ${value}
        `);

        orderCluster.addLayer(marker);


        // 3. The heat point, with the order value as the intensity.
        //
        //    This third number is the difference between a map of where
        //    orders are and a map of where the money is. Values run to
        //    about 5500, so divide to bring it near the 0 to 1 range
        //    the plugin expects.
        heatData.push([lat, lng, value / 3000]);
    });


    // 4. The heat layer.
    //    radius 25 keeps the hotspots readable as places. Push it much
    //    higher and everything melts into one warm smear, which looks
    //    impressive and tells you nothing.
    const demandHeat = L.heatLayer(heatData, {
        radius: 25,
        blur: 18,
        max: 1.0,
        gradient: {
            0.3: '#2c7bb6',
            0.5: '#ffffbf',
            0.7: '#fdae61',
            1.0: '#d7191c'
        }
    });

    // Stretch goal: the same data, one number different.
    const demandHeatWide = L.heatLayer(heatData, {
        radius: 45,
        blur: 25,
        max: 1.0
    });


    // 5. The eight existing shops.
    const outletLayer = L.layerGroup();

    outlets.features.forEach(function (feature) {

        const lng = feature.geometry.coordinates[0];
        const lat = feature.geometry.coordinates[1];

        const marker = L.marker([lat, lng], { icon: outletIcon });

        marker.bindPopup(`
            <div class="outlet-popup">
                <h3>${feature.properties.name}</h3>
                <p>Open since ${feature.properties.opened}</p>
            </div>
        `);

        outletLayer.addLayer(marker);
    });


    // 6. The control.
    //
    //    Demand and Outlets are on at load, Orders is off. That pairing
    //    is the whole answer: heat shows where the customers are, the
    //    dark dots show where we already serve them, and the gap between
    //    them is what the client is paying for.
    //
    //    Turn the order cluster on when you want to check a hotspot is
    //    real rather than one very large order.
    const overlays = {
        'Orders (clustered)': orderCluster,
        'Demand': demandHeat,
        'Demand, radius 45': demandHeatWide,
        'Existing outlets': outletLayer
    };

    L.control.layers(null, overlays, { collapsed: false }).addTo(map);

    demandHeat.addTo(map);
    outletLayer.addTo(map);


    // ------------------------------------------------------------------
    // WHAT THE MAP SAYS
    //
    // Two hot areas have no dark dot anywhere near them.
    //
    // E-11, in the west. 210 orders, the single largest number anywhere
    // on the map. Nearest shop is F-10, about 2.4 km away. But the
    // orders are small: roughly Rs. 169,000 in total.
    //
    // Bahria Town, out to the south east. Only 140 orders, and the
    // nearest shop is 7.5 km away. But the baskets are much bigger:
    // roughly Rs. 280,000, which is 65 percent more money from fewer
    // orders.
    //
    // So the two heatmaps disagree, and that is the interesting part.
    // Weighted by value, Bahria is the hotter spot. Count the orders
    // alone and E-11 wins.
    //
    // E-11 is the bigger gap by demand and sits close to the existing
    // supply chain. Bahria is the bigger gap by distance and by revenue.
    //
    // There is no single correct answer here. The map does not decide.
    // It puts the trade-off in front of a person who can, which is the
    // most a map should do.
    // ------------------------------------------------------------------

})
.catch(function (error) {
    console.error('Could not load the data:', error);
});
