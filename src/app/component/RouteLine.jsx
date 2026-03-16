"use client";

import { useEffect, useRef, useState } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Button } from "antd";

export default function RouteLine({ from, to }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");

  const rendererRef = useRef(null);
  const [info, setInfo] = useState(null);

  // Create renderer once
  useEffect(() => {
    if (!map || !routesLibrary) return;

    const { DirectionsRenderer } = routesLibrary;

    if (!rendererRef.current) {
      rendererRef.current = new DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#1677ff",
          strokeWeight: 5,
        },
      });

      rendererRef.current.setMap(map);
    }
  }, [map, routesLibrary]);

  // Draw route
  useEffect(() => {
    if (!map || !routesLibrary || !from || !to) return;

    const { DirectionsService, TravelMode } = routesLibrary;

    const directionsService = new DirectionsService();

    directionsService.route(
      {
        origin: from,
        destination: to,
        travelMode: TravelMode.DRIVING,
      },
      (result, status) => {
        console.log("direction status:", status);

        if (status === "OK") {
          rendererRef.current.setDirections(result);

          const leg = result.routes[0].legs[0];

          setInfo({
            distance: leg.distance.text,
            duration: leg.duration.text,
          });

          map.fitBounds(result.routes[0].bounds);
        }
      },
    );
  }, [from, to, map, routesLibrary]);

  // ✅ clear polyline
  const clearRoute = () => {
    rendererRef.current?.setDirections({ routes: [] });
    setInfo(null);
  };

  if (!info) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        background: "white",
        padding: "10px 14px",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        fontWeight: 500,
        color: "black",
      }}
    >
      🚗 {info.distance} | ⏱ {info.duration}
      <div style={{ marginTop: 8 }}>
        <Button size="small" danger onClick={clearRoute}>
          Clear
        </Button>
      </div>
    </div>
  );
}
