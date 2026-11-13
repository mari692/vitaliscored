
/* ========================================
   MAPA INTERATIVO - VITALISCORE
======================================== */

let map = null;
let drawn = [];
let draftLayer = null;
let savedLayer = null;
const STORAGE_KEY = 'vitaliscoreHealthData';

const HealthStore = {
    get() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return { zones: [] };
        const data = JSON.parse(saved);
        return { zones: Array.isArray(data.zones) ? data.zones : [] };
    },
    add(collection, item) {
        if (collection !== 'zones') {
            throw new Error(`Coleção desconhecida: ${collection}`);
        }
        const data = this.get();
        data.zones.push(item);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
};

function esc(value) {
    const element = document.createElement('span');
    element.textContent = value;
    return element.innerHTML;
}

function refresh() {
    const list = document.getElementById('zone-list');
    if (!list) return;

    list.replaceChildren();
    HealthStore.get().zones.forEach(zone => {
        const item = document.createElement('article');
        item.className = 'produto';

        const title = document.createElement('h3');
        title.textContent = zone.name;
        item.appendChild(title);

        const reason = document.createElement('p');
        reason.textContent = zone.reason;
        item.appendChild(reason);

        const pointCount = document.createElement('p');
        pointCount.textContent = `${zone.points.length} pontos no contorno`;
        item.appendChild(pointCount);
        list.appendChild(item);
    });
}

/* INICIALIZAÇÃO DO MAPA */

function initMap() {

    const mapElement = document.getElementById('admin-map');

    if (!mapElement) return;

    if (!window.L) {
        mapElement.innerHTML =
            'Mapa indisponível. Verifique sua conexão.';
        return;
    }

    if (map) {
        setTimeout(() => map.invalidateSize(), 200);
        return;
    }

    map = L.map('admin-map').setView(
        [-23.0, -53.0],
        12
    );

    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution: '&copy; OpenStreetMap'
        }
    ).addTo(map);

    draftLayer = L.layerGroup().addTo(map);
    savedLayer = L.layerGroup().addTo(map);

    /* MARCAÇÃO DOS PONTOS */

    map.on('click', function(event) {

        const latitude = event.latlng.lat;
        const longitude = event.latlng.lng;

        drawn.push([latitude, longitude]);

        L.circleMarker(
            event.latlng,
            {
                radius: 5,
                color: '#16845a',
                fillColor: '#16845a',
                fillOpacity: 1
            }
        ).addTo(draftLayer);

        /* DESENHAR POLÍGONO */

        if (drawn.length >= 3) {

            draftLayer.eachLayer(layer => {
                if (layer instanceof L.Polygon &&
                    !(layer instanceof L.CircleMarker)) {
                    draftLayer.removeLayer(layer);
                }
            });

            L.polygon(
                drawn,
                {
                    color: '#16845a',
                    fillOpacity: 0.15
                }
            ).addTo(draftLayer);
        }

        document.getElementById('zone-points').textContent =
            `${drawn.length} ponto(s) marcado(s).`;
    });

    drawSavedZones();

    setTimeout(() => {
        map.invalidateSize();
    }, 200);
}

/* EXIBIR REGIÕES SALVAS */

function drawSavedZones() {

    if (!map || !savedLayer) return;

    savedLayer.clearLayers();

    const zones = HealthStore.get().zones;

    zones.forEach(zone => {

        if (zone.points && zone.points.length >= 3) {

            L.polygon(
                zone.points,
                {
                    color: '#c34d4d',
                    fillColor: '#c34d4d',
                    fillOpacity: 0.25
                }
            )
            .bindPopup(
                esc(zone.name)
            )
            .addTo(savedLayer);
        }
    });
}

/* LIMPAR PONTOS */

document.getElementById('clear-zone')
    .addEventListener('click', function() {

        drawn = [];

        if (draftLayer) draftLayer.clearLayers();

        document.getElementById('zone-points').textContent =
            'Nenhum ponto marcado.';
    });

/* CADASTRAR REGIÃO */

document.getElementById('zone-form')
    .addEventListener('submit', function(event) {

        event.preventDefault();

        if (drawn.length < 3) {

            alert(
                'Marque pelo menos 3 pontos no mapa para formar uma região.'
            );

            return;
        }

        const form = new FormData(event.target);

        HealthStore.add(
            'zones',
            {
                name: String(form.get('name')).trim(),
                reason: String(form.get('reason')).trim(),
                points: [...drawn]
            }
        );

        drawn = [];

        draftLayer.clearLayers();

        event.target.reset();

        document.getElementById('zone-points').textContent =
            'Nenhum ponto marcado.';

        refresh();

        drawSavedZones();

        alert(
            'Região cadastrada com sucesso!'
        );
    });

/* ABRIR ABA DO MAPA */

const mapTab = document.querySelector('[data-tab="mapa"]');

if (mapTab) {

    mapTab.addEventListener('click', function() {

        initMap();

        setTimeout(() => {
            if (map) map.invalidateSize();
        }, 300);
    });
}

/* ATUALIZAÇÃO DOS DADOS */

window.addEventListener(
    'healthdatachange',
    function() {
        refresh();
        drawSavedZones();
    }
);

/* INICIALIZAÇÃO */

initMap();
refresh();