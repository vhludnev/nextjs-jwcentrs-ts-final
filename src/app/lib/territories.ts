import { TUser } from "./../types/user";
import type { TSortOrder, TTerritory, TAccessor } from "@/types/territory";
import { useCallback, useState } from "react";
import {
  useQueries,
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from "react-query";
import { toast } from "react-toastify";

//const oneHour = 1000 * 60;
const fiveMinutes = 1000 * 5;

const getUserObj = (id: any, queryClient: QueryClient) => {
  const usersData: Pick<TUser, "name" | "id">[] =
    queryClient.getQueryData("users")!;
  const user = usersData.find((u) => u.id == String(id));
  if (user) {
    return {
      id: user.id,
      name: user.name,
    };
  }
};

const filterSortData = (
  array: TTerritory[],
  order: TSortOrder,
  sortField: Exclude<TAccessor, "number" | "title" | "available">
) => {
  const sortingOrder = order == "asc" ? 1 : -1;

  if (!array) return;
  return array.sort((a, b) => {
    if (
      a[sortField] === null ||
      a[sortField] === undefined ||
      a[sortField] === ""
    )
      return 1;
    if (
      b[sortField] === null ||
      b[sortField] === undefined ||
      b[sortField] === ""
    )
      return -1;
    if (a[sortField] === null && b[sortField] === null) return 0;
    if (a[sortField] === undefined && b[sortField] === undefined) return 0;
    if (["given", "returned"].includes(sortField))
      return (
        (new Date(b[sortField]).valueOf() - new Date(a[sortField]).valueOf()) *
        sortingOrder
      );
    if (sortField == "code") {
      return (
        a[sortField].localeCompare(b[sortField], undefined, {
          numeric: true,
          sensitivity: "base",
        }) * sortingOrder
      );
    }
    return (
      a[sortField].toString().localeCompare(b[sortField].toString(), "ru", {
        numeric: true,
      }) * sortingOrder
    );
  });
};

const filteredAndSortedData = (data: TTerritory[], params: any) => {
  const { page, count, sortField, sortOrder, /* filter, */ criteria } = params;

  if (!data) return;
  let arrayData = data;

  //const sortAndFilter = sortField && filter && !criteria

  /* if (sortAndFilter) {
    arrayData = arrayData.filter(d => d.title === filter)
  } else */ if (criteria) {
    const regex = new RegExp(criteria, "i");
    // if (filter) {
    //   arrayData = arrayData
    //     .filter(d => d.title === filter)
    //     .filter(({ code, title, publisher }) =>
    //       //[code, title, publisher].some(item => item && item.toString().toLowerCase().includes(criteria.toLowerCase()))
    //       [code, title, publisher].some(item => regex.test(item?.toString().toLowerCase()))
    //     )
    // } else {
    arrayData = arrayData.filter(({ code, title, publisher }) =>
      [code, title, publisher].some((item) =>
        regex.test(item?.toString().toLowerCase())
      )
    );
    //}
  }

  const dataArray = filterSortData(arrayData, sortOrder, sortField);
  const paginatedDataArray = dataArray?.slice(count * (page - 1), count * page);
  const hasMore = dataArray && dataArray.length / (page * count) > 1;
  const totalPages = dataArray && Math.ceil(dataArray.length / count);

  return { territories: paginatedDataArray, hasMore, totalPages };
};

/* Functions for Queries */

// const fetchAllTerData = async () => {
//   const response = await fetch('/api/protected/territories')
//   const { data } = await response.json()
//   return data
// }

const fetchTerrsByTitle = async ({ queryKey }: any) => {
  const title = queryKey[1];

  const response = await fetch(`/api/protected/territories?title=${title}`);
  const { data } = await response.json();
  return data;
};

// const fetchTerData = async (page, count, sortField, sortOrder, filter, criteria) => {
//   const response = await fetch(
//     `/api/protected/territories/paginate?page=${page}&count=${count}&sort=${sortField}&order=${sortOrder}&filter=${filter}&search=${criteria}`
//   )
//   const { data } = await response.json()
//   return data
// }

const fetchUsersNames = async () => {
  const response = await fetch("/api/protected/users/names");
  const { data } = await response.json();
  return data as Pick<TUser, "name" | "id">[];
};

const fetchTerTitles = async () => {
  const response = await fetch("/api/protected/territories/titles");
  const { data } = await response.json();
  return data as string[];
};

const fetchTerInfo = async (id: string) => {
  const response = await fetch(`/api/territoryinfo/${id}`);
  const { data } = await response.json();
  return data as TTerritory;
};

/* QUERIES */

const convertedTitles = (data: string[]) => {
  const arr: string[] = []
  data.map(el => { 
    if (/ - |;/.test(el)) {
      return el.split(/ - |;/).map(el => arr.push(el.trim().split(/\s/)[0])) 
    } else 
      return arr.push(el.split(" ")[0])
  }
  );
  const collator = new Intl.Collator('lv');

  return Array.from(new Set(arr)).sort((a, b) => collator.compare(a, b));
}

export const useTerritoryQueries = (params: any) => {
  //const { page, count, sortField, sortOrder, filter, criteria } = params

  //   const {
  //     isLoading: loadingData,
  //     //isError,
  //     //error,
  //     data: newData,
  //     isFetching: fetchingData,
  //     isPreviousData,
  //   } = useQuery({
  //     queryKey: ['territories', ...Object.values(params)],
  //     queryFn: () => fetchTerData(page, count, sortField, sortOrder, filter, criteria),
  //     keepPreviousData: true,
  //     refetchOnWindowFocus: false,
  //     //staleTime: 5000,
  //   })

  const [
    { isLoading: loadingUsersList, data: users },
    { isLoading: loadingTitles, data: titles },
    {
      isLoading: loadingData,
      isFetching: fetchingData,
      data: newData /* , isPreviousData */,
    },
  ] = useQueries([
    {
      queryKey: ["users"],
      queryFn: fetchUsersNames,
      staleTime:
        fiveMinutes /* keepPreviousData: true, refetchOnWindowFocus: false */,
    },
    {
      queryKey: ["titles"],
      queryFn: fetchTerTitles,
      staleTime:
        fiveMinutes /* keepPreviousData: true, refetchOnWindowFocus: false */,
      select: useCallback(
          (data: string[]) => convertedTitles(data),
          [params]
        )
        
    },
    {
      queryKey: ["territories", params.filter],
      queryFn: fetchTerrsByTitle,
      enabled: !!params.filter,
      /* keepPreviousData: true,
      refetchOnWindowFocus: false, */
      select: useCallback(
        (data: TTerritory[]) => filteredAndSortedData(data, params),
        [params]
      ),
    },
  ]);

  // Prefetch the next page!
  //   useEffect(() => {
  //     if (newData?.hasMore) {
  //       queryClient.prefetchQuery(['territories', page + 1, count, sortField, sortOrder, filter], () =>
  //         fetchTerData(page + 1, count, sortField, sortOrder, filter)
  //       )
  //     }
  //   }, [newData, sortField, sortOrder, filter, page, count, queryClient])

  return {
    loadingData,
    fetchingData,
    newData,
    //isPreviousData,
    loadingUsersList,
    users,
    loadingTitles,
    titles,
    //filteredAndSortedData: newData ? filteredAndSortedData(newData, params) : [],
  };
};

/* Functions for mutations */

const createNewTerritory = async (newTerritory: Partial<TTerritory>) => {
  const { title, code } = newTerritory;
  if (title && code) {
    const response = await fetch("/api/protected/territories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTerritory),
    });

    if (!response.ok) {
      //throw new Error(response);
      console.log(response);
    }
    return await response.json();
  }
};

const updateTerritory = async ({
  id,
  comment,
  given,
  returned,
}: {
  id: TTerritory["id"];
  comment: TTerritory["comment"];
  given: TTerritory["given"];
  returned: TTerritory["returned"];
}) => {
  const response = await fetch(`/api/protected/territories/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment, given, returned }),
  });

  if (!response.ok) {
    //throw new Error(response);
    console.log(response);
  }
  return await response.json();
};

const returnTerritory = async (id: TTerritory["id"]) => {
  const response = await fetch(`/api/protected/territories/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ returning: true }),
  });

  return await response.json();
};

const giveTerritory = async ({
  id,
  name,
  publisherId,
}: {
  id: TTerritory["id"];
  name: string;
  publisherId: TTerritory["publisherId"];
}) => {
  if (name) {
    const response = await fetch(`/api/protected/territories/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, publisherId }),
    });

    return await response.json();
  }
};

const updateTerritoryAddress = async ({
  id,
  address,
}: {
  id: TTerritory["id"];
  address: TTerritory["address"];
}) => {
  const response = await fetch(`/api/protected/territories/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address }),
  });

  return await response.json();
};

const updateTerritoryImage = async ({
  id,
  imageUrl,
}: {
  id: TTerritory["id"];
  imageUrl: TTerritory["image"];
}) => {
  const response = await fetch(`/api/protected/territories/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: imageUrl /* , base64Image */ }),
  });

  return await response.json();
};

const deleteTerritory = async (id: TTerritory["id"]) => {
  const response = await fetch(`/api/protected/territories/${id}`, {
    method: "DELETE",
  });

  return await response.json();
};

/* MUTATIONS */

export const useTerritoryMutations = (filter: string | null) => {
  const queryKey = ["territories", filter];
  const queryClient = useQueryClient();
  const { mutate: handleCreateNewTerritory } = useMutation(createNewTerritory, {
    retry: 1,

    onSuccess: (data: { data: TTerritory }) => {
      /** 2) Handling Mutation Response to instantly update query and the list */
      queryClient.setQueryData<TTerritory[] | undefined>(
        queryKey,
        (oldQueryData) => oldQueryData?.concat(data.data)
      );

      queryClient.invalidateQueries(["titles"]);
      toast.success(`Новая территория ${data.data.code} успешно добавлена!`, {
        autoClose: 2000,
      });
    },
    onError: (error: string) => {
      toast.error(error);
    },
  });

  const { mutate: handleUpdateTerritory } = useMutation(updateTerritory, {
    retry: 1,

    onMutate: async (terr) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(queryKey);
      // Snapshot the previous value
      const previousTerrData: TTerritory[] | undefined =
        queryClient.getQueryData(queryKey);
      // Optimistically update to the new value
      queryClient.setQueryData<TTerritory[] | undefined>(
        queryKey,
        (oldQueryData) =>
          oldQueryData?.map((t) => (t.id === terr.id ? { ...t, ...terr } : t))
      );

      return { previousTerrData };
    },
    onSuccess: () => {
      toast.success("Территория успешно обнавлена!", { autoClose: 2000 });
    },
    onError: (error: string, _data, context) => {
      toast.error(error);
      queryClient.setQueryData(queryKey, context?.previousTerrData);
    },
  });

  const { mutate: handleReturnTerritory } = useMutation(returnTerritory, {
    retry: 1,
    onSuccess: (data: { data: TTerritory }) => {
      const userObj = getUserObj(data.data.user, queryClient);

      /** 2) Handling Mutation Response to instantly update query and the list */
      queryClient.setQueryData<TTerritory[] | undefined>(
        queryKey,
        (oldQueryData) =>
          oldQueryData?.map((ter) => {
            if (ter.id === data.data.id) {
              return { ...data.data, user: userObj };
            }
            return ter;
          })
      );

      toast.success("Территория успешно возвращена!", { autoClose: 2000 });
    },
    onError: (error: string, _data, _context) => {
      toast.error(error);
    },
  });

  const { mutate: handleGiveTerritory } = useMutation(giveTerritory, {
    retry: 1,
    onSuccess: (data: { data: TTerritory }) => {
      const userObj = getUserObj(data.data.user, queryClient);

      /** 2) Handling Mutation Response to instantly update query and the list */
      queryClient.setQueryData<TTerritory[] | undefined>(
        queryKey,
        (oldQueryData) =>
          oldQueryData?.map((ter) => {
            if (ter.id === data.data.id) {
              return { ...data.data, user: userObj };
            }
            return ter;
          })
      );

      toast.success("Территория успешно выдана!", { autoClose: 2000 });
    },
    onError: (error: string) => {
      toast.error(error);
    },
  });

  const { mutate: handleDeleteTerritory } = useMutation(deleteTerritory, {
    retry: 1,
    onMutate: (id) => {
      // Return a context containing data to use when for example rolling back
      return { id };
    },
    onSuccess: (_data, _variables, context) => {
      /** 2) Handling Mutation Response to instantly update query and the list */
      queryClient.setQueryData<TTerritory[] | undefined>(
        queryKey,
        (oldQueryData) => oldQueryData?.filter((ter) => ter.id !== context?.id)
      );

      toast.success("Территория успешно удалена!", { autoClose: 2000 });
    },
    onError: (error: string) => {
      toast.error(error);
    },
  });

  return {
    handleCreateNewTerritory,
    handleUpdateTerritory,
    handleReturnTerritory,
    handleGiveTerritory,
    handleDeleteTerritory,
  };
};

/*
 */
/* QUERY for My Territories */
/*
 */

const fetchMyTerritories = async () => {
  const response = await fetch("/api/territoryinfo");
  return await response.json();
};

// const returnMyTerritory = async id => {
//   const response = await fetch(`/api/territoryinfo/${id}`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ returning: true }),
//   })
//   //fetch('https://dummyjson.com/products/1')

//   return await response.json()
// }

export const useMyTerritoriesQuery = () => {
  const oneDay = 1000 * 60 * 60 * 24; // for 1 day stale time

  const { isLoading: loadingMyTerritories, data: myTerritoriesList } = useQuery(
    {
      queryKey: ["myterritories"],
      queryFn: fetchMyTerritories,
      staleTime: oneDay,
      select: useCallback((data: { data: TTerritory[] }) => data.data, []),
    }
  );

  return {
    loadingMyTerritories,
    myTerritoriesList,
  };
};

/*
 */
/* QUERY and MUTATIONS for TerritoryInfoCard */
/*
 */

export const useTerritoryInfoCard = (id: TTerritory["id"], isOpen: boolean) => {
  const { isLoading: loadingTerrInfoCard, data: terrInfoCardData } = useQuery({
    queryKey: ["territoryinfo", id],
    //queryFn: ({ queryKey }) => fetchTerInfo(queryKey[1]),
    queryFn: () => fetchTerInfo(id),
    enabled: isOpen,
    keepPreviousData: false,
  });

  const [imagePreview, setImagePreview] = useState<string>();
  const [address, setAddress] = useState<string>();
  const queryClient = useQueryClient();

  const {
    mutate: handleUpdateTerritoryImage /* , isLoading: loadingImagePreview */,
  } = useMutation(updateTerritoryImage, {
    retry: 1,
    onMutate: () => {
      // remove local state so that server state is taken instead
      setImagePreview(undefined);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["territoryinfo", variables.id], data.data);
      setImagePreview(data.data.image);
      toast.success("Карта территории успешно обнавлена!", { autoClose: 2000 });
    },
    onError: (error: string) => {
      toast.error(error);
    },
  });

  const { mutate: handleUpdateTerritoryAddress } = useMutation(
    updateTerritoryAddress,
    {
      retry: 1,
      onSuccess: (data, variables) => {
        if (variables.address) {
          queryClient.setQueryData(["territoryinfo", variables.id], data.data);
          setAddress(data.data.address);
          toast.success("Адрес территории успешно обнавлён!", {
            autoClose: 2000,
          });
        } else {
          toast.error("Заполните данные адреса!", { autoClose: 2000 });
        }
      },
      onError: (error: string) => {
        toast.error(error);
      },
    }
  );

  //   const { mutate: handleReturnMyTerritory } = useMutation(returnMyTerritory, {
  //     retry: 1,
  //     onSuccess: () => {
  //       queryClient.removeQueries(['territoryinfo', id])

  //       queryClient.setQueryData('myterritories', oldQueryData => {
  //         return {
  //           data: oldQueryData?.data.filter(t => t.id !== id),
  //         }
  //       })

  //       toast.success('Территория успешно возвращена!', { autoClose: 2000 })
  //     },
  //     onError: (error, _data, _context) => {
  //       console.log(error)
  //       toast.error(error)
  //     },
  //   })

  return {
    loadingTerrInfoCard,
    terrInfoCardData,
    handleUpdateTerritoryAddress,
    address: address ?? terrInfoCardData?.address,
    setAddress,
    handleUpdateTerritoryImage,
    //handleReturnMyTerritory,
    imagePreview: imagePreview ?? terrInfoCardData?.image,
  };
};
