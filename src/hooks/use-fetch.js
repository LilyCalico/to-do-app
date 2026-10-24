import { useCallback, useState } from "react";

const useFetch = () => {
  const [err, setError] = useState(null);

  const baseUrl = import.meta.env.REACT_APP_FIREBASE_URL;
  const endpoint = "tasks.json";
  const url = baseUrl + endpoint;

  const sendRequest = useCallback(
    async (requestConfig, applyData) => {
      setError(null);

      try {
        const response = await fetch(
          requestConfig.url ? requestConfig.url : url,
          {
            method: requestConfig.method ? requestConfig.method : "GET",
            headers: requestConfig.headers ? requestConfig.headers : {},
            body: requestConfig.body
              ? JSON.stringify(requestConfig.body)
              : null,
          }
        );

        if (!response.ok) {
          throw new Error("Requests failed!");
        }

        const data = await response.json();

        applyData(data);
      } catch (error) {
        console.log(error);
        setError(error.message || "Something went wrong in sending!");
      }
    },
    [url]
  );

  return {
    err,
    sendRequest,
  };
};

export default useFetch;
