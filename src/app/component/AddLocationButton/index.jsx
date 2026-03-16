import { Button, Dropdown } from "antd";
import { floatingButtonStyle } from "./styles";
import { PlusOutlined } from "@ant-design/icons";
import PlaceService from "../../core/services/placeService";
import { useState } from "react";
import CreateSavedPlace from "../Modal/CreateSavedPlace";
import usePlaces from "../../core/hooks/usePlace";
import SavedListPlace from "../Modal/SavedListPlace";

export default function AddLocationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenList, setIsOpenList] = useState(false);

  const { getSavedPlaceList } = usePlaces();

  const items = [
    {
      key: "VIEW_LIST_PLACE",
      label: "Saved Place",
      onClick: async () => {
        setIsOpenList(true);
        await getSavedPlaceList();
      },
    },
    {
      key: "CREATE_SAVED_PLACE",
      label: "Saved Place Create",
      onClick: async () => {
        setIsOpen(true);
        // await PlaceService.createPlace();
      },
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]} placement="topRight">
        <Button style={floatingButtonStyle} icon={<PlusOutlined />} />
      </Dropdown>

      {isOpen && (
        <CreateSavedPlace open={isOpen} onClose={() => setIsOpen(false)} />
      )}
      {isOpenList && (
        <SavedListPlace
          open={isOpenList}
          onClose={() => setIsOpenList(false)}
        />
      )}
    </>
  );
}
