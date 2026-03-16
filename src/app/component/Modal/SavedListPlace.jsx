import React from "react";
import { Modal, Table, Button } from "antd";
import usePlaces from "../../core/hooks/usePlace";
import { DeleteOutlined } from "@ant-design/icons";
import PlaceService from "../../core/services/placeService";

const SavedListPlace = ({ open, onClose, onViewRoute = () => {} }) => {
  const { placeList, onUpdatedMap } = usePlaces() ?? {};

  const columns = [
    {
      title: "Route Name",
      dataIndex: "routeName",
      key: "routeName",
    },
    {
      title: "From",
      key: "from",
      render: (_, record) => record?.geoLocation?.[0]?.place || "-",
    },
    {
      title: "To",
      key: "to",
      render: (_, record) =>
        record?.geoLocation?.[record?.geoLocation?.length - 1]?.place || "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            // type="link"
            onClick={() => {
              console.log("clicked record", record);
              if (!record?.geoLocation || record.geoLocation.length < 2) {
                console.log("geoLocation invalid");
                return;
              }

              const start = record.geoLocation[0];
              const end = record.geoLocation[record.geoLocation.length - 1];

              const routeData = {
                from: {
                  lat: Number(start.lat),
                  lng: Number(start.lng),
                },
                to: {
                  lat: Number(end.lat),
                  lng: Number(end.lng),
                },
              };
              console.log("sending route:", routeData);
              onUpdatedMap(routeData);
              onClose();
            }}
          >
            View
          </Button>
          <Button
            onClick={async () => {
              await PlaceService.deletesSavedPlace(record.id);
              onClose();
            }}
            icon={<DeleteOutlined />}
            style={{ color: "red" }}
          />
        </>
      ),
    },
  ];

  return (
    <Modal
      title="Saved Places"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Table
        columns={columns}
        dataSource={placeList || []}
        pagination={false}
        rowKey="id"
      />
    </Modal>
  );
};

export default SavedListPlace;
