<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { MapObject } from '@/types/model/map-object.model';
import { getTypeColor, getTypeLabel, getStatusLabel } from '@/utils/helpers';
import { hexToRgba, markerStyle, createPopupContent } from '@/utils/map-view.helpers';

const props = defineProps<{
  objects: MapObject[];
  selectedObject: MapObject | null;
}>();

const emit = defineEmits<{
  selectObject: [obj: MapObject];
  mapDblClick: [coords: [number, number]];
}>();

const mapContainer = ref<HTMLDivElement | null>(null);
let map: maplibregl.Map | null = null;
let markers: maplibregl.Marker[] = [];

let clickCount = 0;
let clickTimer: ReturnType<typeof setTimeout> | undefined;

function resetClicks(): void {
  clickCount = 0;
  clickTimer = undefined;
}

function renderMarkers(): void {
  if (!map) return;

  markers.forEach((marker) => marker.remove());
  markers = [];

  for (const obj of props.objects) {
    const selected = props.selectedObject?.id === obj.id;
    const el = document.createElement('div');
    el.className = selected ? 'map-marker map-marker--selected' : 'map-marker';
    el.style.cssText = markerStyle(obj, selected);
    if (selected) {
      const color = getTypeColor(obj.type);
      el.style.setProperty('--pulse-color', hexToRgba(color, 0.6));
      el.style.setProperty('--pulse-fade', hexToRgba(color, 0));
    }
    el.title = `${getTypeLabel(obj.type)}: ${obj.title} — ${getStatusLabel(obj.status)}`;

    const popup = new maplibregl.Popup({ offset: 15 }).setHTML(createPopupContent(obj));
    const marker = new maplibregl.Marker({ element: el })
      .setLngLat(obj.coordinates)
      .setPopup(popup)
      .addTo(map);

    el.addEventListener('click', (event) => {
      event.stopPropagation();
      emit('selectObject', obj);
    });

    markers.push(marker);
  }
}

function flyToObject(obj: MapObject): void {
  if (!map) return;
  map.flyTo({ center: obj.coordinates, zoom: 13 });
}

onMounted(() => {
  if (!mapContainer.value) return;

  map = new maplibregl.Map({
    container: mapContainer.value,
    style: {
      version: 8,
      name: 'OSM',
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap contributors',
        },
      },
      layers: [
        { id: 'osm-tiles', type: 'raster', source: 'osm', minzoom: 0, maxzoom: 19 },
      ],
    },
    center: [56.3167, 58.0000],
    zoom: 10,
  });

  map.addControl(new maplibregl.NavigationControl(), 'top-right');
  // Disable the built-in double-click zoom: we use double-click to add an
  // object and triple-click to zoom in instead.
  map.doubleClickZoom.disable();

  map.on('load', () => {
    renderMarkers();
  });

  map.on('click', (e) => {
    clickCount += 1;
    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = undefined;
    }

    if (clickCount === 1) {
      clickTimer = setTimeout(resetClicks, 300);
    } else if (clickCount === 2) {
      const at = e.lngLat;
      clickTimer = setTimeout(() => {
        emit('mapDblClick', [at.lng, at.lat]);
        resetClicks();
      }, 250);
    } else if (clickCount === 3) {
      resetClicks();
      if (map) map.zoomIn();
    }
  });
});

watch(
  () => props.objects,
  () => renderMarkers(),
  { deep: true }
);

watch(
  () => props.selectedObject,
  (obj) => {
    if (obj) flyToObject(obj);
    renderMarkers();
  }
);

onBeforeUnmount(() => {
  if (clickTimer) clearTimeout(clickTimer);
  markers.forEach((marker) => marker.remove());
  markers = [];
  map?.remove();
  map = null;
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}
</style>

<style>
/* Markers are created dynamically inside the MapLibre container, so they are
   not covered by the scoped style above — these rules must be global. */
.map-marker {
  transition: width 0.15s ease, height 0.15s ease, border-color 0.15s ease;
}

.map-marker--selected {
  z-index: 5;
  animation: marker-pulse 1.3s ease-out infinite;
}

@keyframes marker-pulse {
  0% {
    box-shadow: 0 0 0 0 var(--pulse-color, rgba(59, 130, 246, 0.6));
  }
  70% {
    box-shadow: 0 0 0 14px var(--pulse-fade, rgba(59, 130, 246, 0));
  }
  100% {
    box-shadow: 0 0 0 0 var(--pulse-fade, rgba(59, 130, 246, 0));
  }
}
</style>
