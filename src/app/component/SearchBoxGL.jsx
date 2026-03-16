"use client";

import React, { useState, useRef } from "react";
import { Select } from "antd";
import { useMap } from "@vis.gl/react-google-maps";
import usePlace from "../core/hooks/usePlace";
import { isEmpty } from "lodash";

export default function SearchBoxGL() {
  const map = useMap();
  const markerRef = useRef(null);
  const { placeList } = usePlace() ?? {};

  const HOME = {
    value: "home",
    label: "Home",
    place_id: "HOME",
    lat: 13.727204224607705,
    lng: 100.54726522883507,
  };

  const [options, setOptions] = useState([HOME]);

  const resetMap = () => {
    const location = new google.maps.LatLng(
      13.754771353567488,
      100.50410644210508,
    );
    map.panTo(location);
    map.setZoom(12);
    if (markerRef.current) {
      (markerRef.current.setMap(null), setOptions([HOME]));
    }
  };

  const searchPlace = (value) => {
    if (!window.google || !value) return;

    const service = new google.maps.places.AutocompleteService();

    service.getPlacePredictions({ input: value }, (predictions) => {
      if (!predictions) return;
      const results = predictions.map((p) => ({
        value: p.description,
        label: p.description,
        place_id: p.place_id,
      }));
      setOptions([
        { value: "home", label: "Home", place_id: "HOME" },
        ...results,
      ]);
    });
  };

  const selectPlace = (option) => {
    if (option.place_id === "HOME") {
      const location = new google.maps.LatLng(HOME.lat, HOME.lng);
      map.panTo(location);
      map.setZoom(16);
      if (markerRef.current) markerRef.current.setMap(null);
      markerRef.current = new google.maps.Marker({
        position: location,
        map,
      });
      return;
    }

    const placesService = new google.maps.places.PlacesService(map);

    placesService.getDetails({ placeId: option.place_id }, (place) => {
      if (!place?.geometry) return;

      const location = place.geometry.location;
      map.panTo(location);
      map.setZoom(15);

      if (markerRef.current) markerRef.current.setMap(null);

      markerRef.current = new google.maps.Marker({
        position: location,
        map,
        title: place.name,
      });
    });
  };

  return (
    <div
      style={{
        width: 300,
        background: "white",
        padding: 10,
        borderRadius: 8,
      }}
    >
      <Select
        showSearch
        allowClear
        placeholder="Search location"
        filterOption={false}
        onSearch={searchPlace}
        onSelect={(v, option) => selectPlace(option)}
        onClear={resetMap}
        options={options}
        style={{ width: "100%" }}
      />
    </div>
  );
}
