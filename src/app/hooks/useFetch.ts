import { useEffect, useState } from "react";

export type TApiResponse = {
  data: any;
  error: any;
  loading: boolean;
};

export const useFetch = (url: string): TApiResponse => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    fetch(url, { signal: controller.signal })
      .then((response) => response.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));

    return () => {
      controller.abort();
    };
  }, [url]);

  //   const controller = new AbortController();

  //   const getAPIData = async () => {
  //     setLoading(true);
  //     try {
  //       const apiResponse = await fetch(url, { signal: controller.signal });
  //       const json = await apiResponse.json();
  //       setData(json);
  //     } catch (error) {
  //       setError(error);
  //     }
  //     setLoading(false);
  //   };

  //   useEffect(() => {
  //     getAPIData();
  //     return () => {
  //       controller.abort();
  //     };
  //   }, []);

  return { loading, data, error };
};
