import HttpResponse from "../utils/http_response";
import axios from "axios";

const HttpService = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/api/v1`,
});

const PlaceService = {
  getSavedPlace: async () => {
    try {
      const response = await HttpService.get("/place");
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  createPlace: async (body) => {
    try {
      const response = await HttpService.post("/place/create/saved", body);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  deletesSavedPlace: async (id) => {
    try {
      const response = await HttpService.delete(`/place/${id}`);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
};

export default PlaceService;
