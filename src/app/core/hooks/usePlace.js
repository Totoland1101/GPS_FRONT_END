import { useDataContext } from "../context/DataContext";
import PlaceService from "../services/placeService";

const usePlaces = () => {
  const { state, updateState } = useDataContext();

  const {
    loading = false,
    activeID = null,
    placeList = [],
    routeList = [],
  } = state?.place ?? {};

  const onChangeState = (value) => {
    updateState(value, "place");
  };

  const onUpdatedMap = (value) => {
    onChangeState({
      routeList: value,
    });
  };

  const getSavedPlaceList = async ({ page, pageSize, search } = {}) => {
    try {
      onChangeState({ loading: true });

      const { success, data } = await PlaceService.getSavedPlace({
        page,
        pageSize,
        search,
      });

      if (success) {
        onChangeState({
          placeList: data?.result ?? [],
          loading: false,
        });
      } else {
        onChangeState({
          placeList: [],
          loading: false,
        });
      }
    } catch (error) {
      onChangeState({
        placeList: [],
        loading: false,
      });
    }
  };

  return {
    loading,
    activeID,
    placeList,
    routeList,
    getSavedPlaceList,
    onUpdatedMap,
  };
};

export default usePlaces;
