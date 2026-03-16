"use client";

import React, { useEffect, useState } from "react";
import { Modal, Select, Row, Col, Typography, Input, Form } from "antd";
import { Map, Marker, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import PlaceService from "../../core/services/placeService";

const { Text } = Typography;
const { TextArea } = Input;

function RouteDirections({ from, to, setInfo }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !from || !to) return;

    const directionsService = new google.maps.DirectionsService();

    const directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#1677ff",
        strokeWeight: 5,
      },
    });

    directionsRenderer.setMap(map);

    directionsService.route(
      {
        origin: from,
        destination: to,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);

          const leg = result.routes[0].legs[0];

          setInfo({
            distance: leg.distance.text,
            duration: leg.duration.text,
          });

          const bounds = new google.maps.LatLngBounds();
          bounds.extend(from);
          bounds.extend(to);
          map.fitBounds(bounds);
        }
      },
    );

    return () => directionsRenderer.setMap(null);
  }, [map, from, to]);

  return null;
}

export default function CreateSavedPlace({ open, onClose = () => {} }) {
  const places = useMapsLibrary("places");

  const [form] = Form.useForm();

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const [fromName, setFromName] = useState("");
  const [toName, setToName] = useState("");

  const [info, setInfo] = useState(null);

  const [fromOptions, setFromOptions] = useState([]);
  const [toOptions, setToOptions] = useState([]);

  const searchPlaces = (value, setOptions) => {
    if (!places || !value) return;

    const service = new places.AutocompleteService();

    service.getPlacePredictions(
      {
        input: value,
        componentRestrictions: { country: "th" },
        types: ["geocode", "establishment"],
      },
      (predictions) => {
        if (!predictions) {
          setOptions([]);
          return;
        }

        const options = predictions.map((p) => ({
          label: p.description,
          value: p.place_id,
        }));

        setOptions(options);
      },
    );
  };

  const selectPlace = (placeId, label, setLocation, setName) => {
    if (!places) return;

    const service = new google.maps.places.PlacesService(
      document.createElement("div"),
    );

    service.getDetails(
      {
        placeId,
        fields: ["geometry", "name"],
      },
      (place, status) => {
        if (status !== "OK" || !place.geometry) return;

        const loc = place.geometry.location;

        setLocation({
          lat: loc.lat(),
          lng: loc.lng(),
        });

        setName(place.name || label);
      },
    );
  };

  const handleOk = async () => {
    const values = await form.validateFields();

    const payload = {
      route_name: values.route_name,
      description: values.description,
      geo_location: [
        {
          place: fromName,
          lat: from?.lat,
          lng: from?.lng,
        },
        {
          place: toName,
          lat: to?.lat,
          lng: to?.lng,
        },
      ],
    };

    console.log("payload:", payload);

    await PlaceService.createPlace(payload);

    form.resetFields();
    onClose(payload);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title="Create Saved Route"
      width={750}
      okButtonProps={{ disabled: !from || !to }}
    >
      <Form form={form} layout="vertical">
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="route_name"
              label="Route Name"
              rules={[{ required: true, message: "Please input route name" }]}
            >
              <Input placeholder="Route Name" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="description" label="Description">
              <TextArea rows={3} placeholder="Description" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Select
              showSearch
              filterOption={false}
              placeholder="From"
              style={{ width: "100%" }}
              onSearch={(v) => searchPlaces(v, setFromOptions)}
              options={fromOptions}
              onSelect={(value, option) =>
                selectPlace(value, option.label, setFrom, setFromName)
              }
            />
          </Col>

          <Col span={12}>
            <Select
              showSearch
              filterOption={false}
              placeholder="To"
              style={{ width: "100%" }}
              onSearch={(v) => searchPlaces(v, setToOptions)}
              options={toOptions}
              onSelect={(value, option) =>
                selectPlace(value, option.label, setTo, setToName)
              }
            />
          </Col>
        </Row>

        {info && (
          <div style={{ marginTop: 10 }}>
            <Text strong>Distance:</Text> {info.distance} &nbsp;&nbsp;
            <Text strong>ETA:</Text> {info.duration}
          </div>
        )}

        <div style={{ height: 400, marginTop: 20 }}>
          <Map
            defaultZoom={14}
            defaultCenter={{ lat: 13.736717, lng: 100.523186 }}
            gestureHandling="greedy"
            streetViewControl={false}
            mapTypeControl={false}
            clickableIcons={false}
            fullscreenControl={false}
          >
            {from && <Marker position={from} />}
            {to && <Marker position={to} />}

            <RouteDirections from={from} to={to} setInfo={setInfo} />
          </Map>
        </div>
      </Form>
    </Modal>
  );
}
