// HARTA

const map = L.map('map')
.setView([46.8695, 23.0406], 15);


// TILE LAYER

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
    attribution: '&copy; OpenStreetMap'
}).addTo(map);


// ARRAY MARKERE

let markers = [];


// ÎNCĂRCARE JSON

fetch('data.json')

.then(response => response.json())

.then(data => {

    data.forEach(location => {

        // MARKER

        // ICON PERSONALIZAT

const customIcon = L.divIcon({

    className: '',

    html: `
        <div class="
            custom-marker
            marker-${location.category}
        "></div>
    `,

    iconSize: [20,20],
    iconAnchor: [10,10]

});


// MARKER

const marker = L.marker(
    [
        location.lat,
        location.lng
    ],
    {
        icon: customIcon
    }
).addTo(map);


        // GALERIE IMAGINI

        const imagesHtml = `
            <div class="popup-gallery">

                ${location.images.map(img => `
                    <img src="${img}">
                `).join('')}

            </div>
        `;


        // POPUP

        marker.bindPopup(`

            <div>

                <h2>${location.title}</h2>

                <br>

                <p>
                    <b>Categorie:</b>
                    ${location.category}
                </p>

                <p>
                    <b>An:</b>
                    ${location.year}
                </p>

                <p>
                    <b>Adresă:</b>
                    ${location.address}
                </p>

                <br>

                <p>
                    ${location.description}
                </p>

                ${imagesHtml}

            </div>

        `);


        // SALVARE MARKER

        markers.push({
            marker,
            data: location
        });


        // ADAUGĂ CARD SIDEBAR

        createSidebarCard(
            location,
            marker
        );

    });

});


// SIDEBAR CARD

function createSidebarCard(
    location,
    marker
){

    const card =
    document.createElement('div');

    card.className =
    'location-card';

    card.innerHTML = `

        <h3>
            ${location.title}
        </h3>

        <p>
            ${location.category}
        </p>

    `;


    // CLICK CARD

    card.addEventListener(
        'click',
        () => {

            map.setView(
                [
                    location.lat,
                    location.lng
                ],
                18
            );

            marker.openPopup();

        }
    );


    // ADAUGĂ ÎN LISTĂ

    document
    .getElementById(
        'locationsList'
    )
    .appendChild(card);

}


// CĂUTARE

document
.getElementById('searchInput')

.addEventListener(
    'input',

    function(){

        const value =
        this.value.toLowerCase();

        markers.forEach(item => {

            const visible =
            item.data.title
            .toLowerCase()
            .includes(value);

            if(visible){

                item.marker.addTo(map);

            }else{

                map.removeLayer(
                    item.marker
                );

            }

        });

    }

);


// FILTRARE CATEGORII

document
.getElementById(
    'categorySelect'
)

.addEventListener(
    'change',

    function(){

        const category =
        this.value;

        markers.forEach(item => {

            if(

                category === 'all'

                ||

                item.data.category
                === category

            ){

                item.marker.addTo(map);

            }else{

                map.removeLayer(
                    item.marker
                );

            }

        });

    }

);

// TIMELINE ISTORIC

document
.getElementById('yearRange')

.addEventListener(
    'input',

    function(){

        const selectedYear =
        parseInt(this.value);

        document
        .getElementById('yearLabel')
        .innerText =
        `Până în anul: ${selectedYear}`;

        markers.forEach(item => {

            const objectYear =
            parseInt(item.data.year);

            if(
                objectYear <= selectedYear
            ){

                item.marker.addTo(map);

            }else{

                map.removeLayer(
                    item.marker
                );

            }

        });

    }

);