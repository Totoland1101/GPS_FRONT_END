const HttpResponse = {
  success: (res) => {
    return {
      success: true,
      error: false,
      data: res?.data,
    };
  },

  errorIgnoreRediectionSigin: (error) => {
    let e = error?.toJSON?.();

    if (error?.response?.status === 404) {
      return {
        success: false,
        error: {
          message: "API not found",
        },
      };
    }

    if (error?.response?.status === 401) {
      if (error?.response?.data?.message) {
        return {
          success: false,
          error: {
            message: error.response.data.message,
          },
        };
      }

      return {
        success: false,
        error: {
          message: error.response?.data,
        },
      };
    }

    if (error?.response) {
      e = error.response.data;
    } else if (error?.request) {
      // console.log(error.request);
    }

    return {
      success: false,
      error: e,
    };
  },

  error: (error) => {
    let e = error?.toJSON?.();

    if (error?.response?.status === 404) {
      return {
        success: false,
        error: {
          message: "API not found",
        },
      };
    }

    if (error?.response) {
      e = error.response.data;
    } else if (error?.request) {
      // console.log(error.request);
    }

    return {
      success: false,
      error: e,
    };
  },
};

export default HttpResponse;
