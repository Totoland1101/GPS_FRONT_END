"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

import SearchBoxGL from "../../component/SearchBoxGL";
import AddLocationButton from "../../component/AddLocationButton";
import RouteLine from "../../component/RouteLine";
import SavedListPlace from "../../component/Modal/SavedListPlace";

import { DataProvider } from "../../core/context/DataContext";
import usePlace from "../../core/hooks/usePlace";
import { isEmpty } from "lodash";

function MapContent() {
  const [route, setRoute] = useState(null);
  const [openSaved, setOpenSaved] = useState(false);

  const { routeList } = usePlace() ?? {};
  console.log("routeeee", routeList);

  useEffect(() => {
    if (isEmpty(routeList)) {
      return;
    }
    if (routeList) {
      setRoute(routeList);
    }
  }, [routeList]);

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
      libraries={["places", "routes"]}
    >
      <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
        <Map
          style={{ width: "100%", height: "100%" }}
          defaultCenter={{ lat: 13.750292607129476, lng: 100.50499781047478 }}
          defaultZoom={14}
          streetViewControl={false}
          mapTypeControl={false}
          clickableIcons={false}
          fullscreenControl={false}
        >
          {route?.from && <Marker position={route.from} />}
          {route?.to && <Marker position={route.to} />}

          <RouteLine from={route?.from} to={route?.to} />
        </Map>

        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            width: 350,
            zIndex: 1000,
          }}
        >
          <SearchBoxGL />
        </div>

        <AddLocationButton
          onCreatePlace={(data) => {
            setRoute(data);
          }}
        />

        <SavedListPlace
          open={openSaved}
          onClose={() => setOpenSaved(false)}
          onViewRoute={(_, data) => {
            setRoute(data);
          }}
        />
      </div>
    </APIProvider>
  );
}

export default function MainPage() {
  return (
    <DataProvider>
      <MapContent />
    </DataProvider>
  );
}
