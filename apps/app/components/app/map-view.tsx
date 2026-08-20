"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from "react-leaflet";
import { useMapStore } from "@/store/map-store";
import { SWITZERLAND_CENTER, SWITZERLAND_DEFAULT_ZOOM } from "@/data/locations";
import { CURATED_LOCATIONS } from "@/data/curated-locations";
import { categoryConfig } from "@/lib/utils";
import { haptics } from "@/lib/haptics";
import type { Location } from "@/types";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import L from "leaflet";
import "leaflet.markercluster";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

const TILE_SATELLITE = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`;
const TILE_DARK = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

const ATTR_SATELLITE = '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const ATTR_DARK = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Patch HMR re-mount issue in dev
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  const proto = L.Map.prototype as unknown as Record<string, unknown>;
  if (!proto.__patched_initContainer) {
    const orig = proto._initContainer as (id: HTMLElement | string) => void;
    proto._initContainer = function (id: HTMLElement | string) {
      const el = typeof id === "string" ? document.getElementById(id) : id;
      if (el) delete (el as unknown as Record<string, unknown>)._leaflet_id;
      return orig.call(this, id);
    };
    proto.__patched_initContainer = true;
  }
}

// Category-coloured map pins remain readable on both satellite and dark tiles.
// Their 46px hit area meets the mobile touch-target requirement.
function createLocationIcon(location: Location, isSelected: boolean) {
  const tint = categoryConfig[location.category]?.color ?? "#FFFFFF";
  const size = isSelected ? 46 : 40;
  const popClass = isSelected ? " leaflet-marker-pop" : "";

  return L.divIcon({
    html: `<div class="leaflet-location-pin${popClass}" style="width:46px;height:46px;display:flex;align-items:flex-start;justify-content:center;cursor:pointer">
      <svg width="${size}" height="${size}" viewBox="0 0 40 44" aria-hidden="true" style="filter:drop-shadow(0 4px 7px rgba(0,0,0,.48))">
        <path d="M20 42C17.8 37.8 5 27.1 5 17.4C5 8.9 11.7 2 20 2s15 6.9 15 15.4C35 27.1 22.2 37.8 20 42Z" fill="${tint}" stroke="rgba(255,255,255,.96)" stroke-width="2.3"/>
        <circle cx="20" cy="17" r="6.5" fill="rgba(9,15,24,.82)" stroke="rgba(255,255,255,.55)" stroke-width="1"/>
        <circle cx="20" cy="17" r="2.3" fill="white"/>
      </svg>
    </div>`,
    className: "",
    iconSize: [46, 46],
    iconAnchor: [23, 43],
    popupAnchor: [0, -40],
  });
}

function createClusterIcon(cluster: L.MarkerCluster) {
  const count = cluster.getChildCount();
  const size = count >= 50 ? 54 : count >= 10 ? 48 : 42;
  const colours = cluster.getAllChildMarkers().map((marker) =>
    (marker.options as L.MarkerOptions & { categoryColour?: string }).categoryColour ?? "#8FA3B8"
  );
  const totals = new Map<string, number>();
  colours.forEach((colour) => totals.set(colour, (totals.get(colour) ?? 0) + 1));
  let cursor = 0;
  const segments = [...totals.entries()].map(([colour, total]) => {
    const start = cursor;
    cursor += (total / colours.length) * 100;
    return `${colour} ${start.toFixed(2)}% ${cursor.toFixed(2)}%`;
  });
  const ring = `conic-gradient(${segments.join(",")})`;
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${ring};
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      border:2px solid rgba(255,255,255,.92);
      box-shadow:0 4px 16px rgba(0,0,0,.5);
    "><span style="
      width:${size - 13}px;height:${size - 13}px;
      background:rgba(9,15,24,.9);
      border:1px solid rgba(255,255,255,.38);
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      backdrop-filter:blur(7px);
    "><span style="
      color:#fff;
      font-size:${count >= 100 ? 11 : 13}px;
      font-weight:700;
      font-family:inherit;
      line-height:1;
      letter-spacing:-0.3px;
    ">${count}</span></span></div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function MapController() {
  const map = useMap();
  const { center, zoom } = useMapStore();

  useEffect(() => {
    map.setView([center.lat, center.lng], zoom, { animate: true });
  }, [center, zoom, map]);

  return null;
}

// When a marker is selected, pan so it lands in the visible band above the
// bottom sheet (~30% from the top), rather than hiding behind the sheet.
function RecenterController() {
  const map = useMap();
  const { selectedLocationId } = useMapStore();

  useEffect(() => {
    if (!selectedLocationId) return;
    const location = CURATED_LOCATIONS.find((l) => l.id === selectedLocationId);
    if (!location) return;

    const zoom = map.getZoom();
    const target = L.latLng(location.coordinates.lat, location.coordinates.lng);
    // Project the marker to a screen point, then derive the map centre that
    // places it ~30% from the top (the sheet covers roughly the bottom half).
    // The centre always sits at size.y/2 on screen, so shift by that delta.
    const size = map.getSize();
    const desiredY = size.y * 0.3;
    const point = map.project(target, zoom);
    const offset = size.y / 2 - desiredY;
    const newCenter = map.unproject(L.point(point.x, point.y + offset), zoom);

    map.panTo(newCenter, { animate: true, duration: 0.4 });
  }, [selectedLocationId, map]);

  return null;
}

function ClusterLayer({ locations }: { locations: Location[] }) {
  const map = useMap();
  const { openBottomSheet } = useMapStore();

  useEffect(() => {
    const group = L.markerClusterGroup({
      iconCreateFunction: createClusterIcon,
      maxClusterRadius: 60,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      animate: true,
      animateAddingMarkers: false,
      disableClusteringAtZoom: 13,
    });

    locations.forEach((loc) => {
      const markerOptions: L.MarkerOptions & { categoryColour: string } = {
        icon: createLocationIcon(loc, false),
        title: loc.name,
        alt: `${loc.name}, ${categoryConfig[loc.category]?.label ?? "location"}`,
        categoryColour: categoryConfig[loc.category]?.color ?? "#8FA3B8",
      };
      const marker = L.marker(
        [loc.coordinates.lat, loc.coordinates.lng],
        markerOptions
      );
      marker.on("click", () => {
        haptics.tap();
        openBottomSheet(loc.id);
      });
      group.addLayer(marker);
    });

    map.addLayer(group);
    return () => { map.removeLayer(group); };
  }, [map, openBottomSheet, locations]);

  return null;
}

function SelectedMarker() {
  const { selectedLocationId } = useMapStore();
  const location = CURATED_LOCATIONS.find((l) => l.id === selectedLocationId);
  if (!location) return null;
  return (
    <Marker
      position={[location.coordinates.lat, location.coordinates.lng]}
      icon={createLocationIcon(location, true)}
      zIndexOffset={1000}
    />
  );
}

interface MapViewProps {
  locations: Location[];
  isSatellite?: boolean;
}

export function MapView({ locations, isSatellite = true }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <MapContainer
      ref={mapRef}
      center={[SWITZERLAND_CENTER.lat, SWITZERLAND_CENTER.lng]}
      zoom={SWITZERLAND_DEFAULT_ZOOM}
      zoomControl={false}
      zoomSnap={0.25}
      zoomDelta={0.5}
      wheelPxPerZoomLevel={80}
      inertia
      inertiaDeceleration={2800}
      bounceAtZoomLimits
      className="w-full h-full"
      style={{ background: isSatellite ? "#1a2a1a" : "#0b0f1c" }}
    >
      <MapController />
      <RecenterController />

      <TileLayer
        key={isSatellite ? "satellite" : "dark"}
        url={isSatellite ? TILE_SATELLITE : TILE_DARK}
        attribution={isSatellite ? ATTR_SATELLITE : ATTR_DARK}
        subdomains={isSatellite ? "" : "abcd"}
        maxZoom={20}
      />

      <ZoomControl position="bottomleft" />
      <ClusterLayer locations={locations} />
      <SelectedMarker />
    </MapContainer>
  );
}
