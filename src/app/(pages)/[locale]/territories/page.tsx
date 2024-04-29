'use client'

import dynamic from 'next/dynamic'
//import moment from "moment";
import { FormEvent, useCallback, useRef, useState } from 'react'
//import "moment/locale/ru";
import { BsBuilding, BsBuildingAdd, BsFillArrowUpCircleFill, BsFillArrowDownCircleFill, FaTreeCity } from '@/lib/icons'
import Spinner from '@/components/Spinner'
import Pagination from '@/components/Pagination'
import NewTerritoryPopup from '@/components/popups/NewTerritoryPopup'
import TerritoryHistoryPopup from '@/components/popups/TerritoryHistoryPopup'
import SearchMenuPopup2 from '@/components/popups/SearchMenuPopup2'
import { COLUMNS, TERRITORIES_PER_PAGE } from '@/constants'
import { useTerritoryQueries, useTerritoryMutations } from '@/lib/territories'
import useDebounce from '@/hooks/useDebounce'
import SearchBox from '@/components/SearchBox'
import SearchIcon from '@/components/SearchIcon'
import type { TSortOrder, TTerritory, TAccessor } from '@/types/territory'
import IconComponent from '@/components/IconComponent'
import { differenceInMonths, format } from 'date-fns'
import { useTranslations } from 'next-intl'

//moment.locale("ru");

const TerritoryMainPopup = dynamic(() => import('@/components/popups/TerritoryMainPopup'))
const BackToTopButton = dynamic(() => import('@/components/BackToTopButton'))

type Props = {
  handleSorting: (accessor: TAccessor, order: TSortOrder) => void
  sortField: string
  sortOrder: TSortOrder
  t: (key: string) => string
}

const SearchComponent = ({ handleSearch, criteria }: { handleSearch: (data: string) => void; criteria: string }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const filterBySearch = (event: { target: HTMLInputElement }) => {
    // Access input value
    const query = event.target?.value
    handleSearch(query)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    inputRef.current?.blur()
  }

  return <SearchBox ref={inputRef} onChange={filterBySearch} criteria={criteria} onSubmit={onSubmit} />
}

const TableHead = ({ handleSorting, sortField, sortOrder, t }: Props) => {
  //const [newSortField, setNewSortField] = useState(sortField)
  //const [order, setOrder] = useState(sortOrder)

  const handleSortingChange = useCallback(
    (accessor: TAccessor, sortable: boolean) => {
      if (!sortable) return

      //const newSortOrder = accessor === newSortField && order === 'asc' ? 'desc' : 'asc'
      //setNewSortField(accessor)
      //setOrder(newSortOrder)
      //const order = sortOrder === 'desc' ? 'asc' : 'desc'

      const order = sortField === accessor ? (sortOrder === 'desc' ? 'asc' : 'desc') : sortOrder

      handleSorting(accessor, order)
    },
    [sortField, sortOrder]
  )

  return (
    <thead className='text-teal border dark:filter dark:brightness-75 dark:border-gray-400'>
      <tr className='bg-gray-200 table-row rounded-l-lg rounded-none mb-4 md:mb-0 text-center dark:text-gray-900'>
        {COLUMNS.map(({ /* label, */ accessor, sortable }) => {
          const cl = sortable
            ? sortField === accessor && sortOrder === 'asc'
              ? 'up'
              : sortField === accessor && sortOrder === 'desc'
              ? 'down'
              : 'default'
            : ''

          const view = ['publisher', 'given'].includes(accessor) ? 'hidden sm:visible sm:table-cell' : ''
          const gr = ['given', 'returned'].includes(accessor)
            ? 'sm:w-[110px] lg:w-[140px] md:max-w-[125px] lg:max-w-none'
            : ''
          const num = accessor === 'number' ? 'text-center' : ''
          const availb = accessor === 'available' ? 'text-transparent text-[4px] md:text-base md:text-inherit' : ''
          return (
            <th
              className={`px-3 py-1 h-[42px] ${cl} ${view} ${num} ${gr} ${availb}`}
              key={accessor}
              onClick={() => handleSortingChange(accessor, sortable)}
            >
              {t(accessor)}
            </th>
          )
        })}
      </tr>
    </thead>
  )
}

const TableBody = ({
  tableData = [],
  setPopupData,
  setMainOpen,
  page,
  count,
}: {
  tableData: TTerritory[]
  setMainOpen: (data: boolean) => void
  setPopupData: (data: TTerritory) => void
  page: number
  count: number
}) => {
  return (
    <tbody className='flex-none dark:filter dark:brightness-90'>
      {tableData.map((data, idx) => {
        const expired = data.given && differenceInMonths(new Date(), data.given) > 4
        const urgentToTake = data.returned && differenceInMonths(new Date(), data.returned) > 12

        const expiredOrUrgentStyle = expired
          ? 'bg-pink-200 hover:bg-pink-300'
          : urgentToTake
          ? 'bg-green-200 hover:bg-green-300'
          : 'bg-white hover:bg-gray-50'

        return (
          <tr className={`table-row mb-4 md:mb-0 dark:text-gray-800 ${expiredOrUrgentStyle}`} key={data.id}>
            {COLUMNS.map(({ accessor }) => {
              let tData
              switch (accessor) {
                case 'number':
                  tData = (page - 1) * count + idx + 1
                  break
                case 'code':
                  tData = <TerritoryHistoryPopup data={data} />
                  break
                case 'publisher':
                  tData = data.publisher
                  break
                case 'available':
                  tData = data.available ? (
                    <BsFillArrowDownCircleFill
                      cursor='pointer'
                      size={18}
                      className='mx-auto text-green-400 hover:text-green-500 transition ease-in-out duration-300'
                      //color='#07bc0c'
                      //color='limegreen'
                      aria-describedby='popup-root'
                      onClick={() => {
                        setPopupData(data)
                        setMainOpen(true)
                      }}
                    />
                  ) : (
                    <BsFillArrowUpCircleFill
                      cursor='pointer'
                      size={18}
                      className='mx-auto text-red-400 hover:text-red-500 transition ease-in-out duration-300'
                      //color='lightcoral'
                      aria-describedby='popup-root'
                      onClick={() => {
                        setPopupData(data)
                        setMainOpen(true)
                      }}
                    />
                  )
                  break
                case 'given':
                case 'returned':
                  tData = data[accessor] ? format(data[accessor], 'dd.MM.yyyy') : ''
                  break
                default:
                  tData = data[accessor]
                  break
              }

              const view = ['publisher', 'given'].includes(accessor) ? 'hidden sm:visible sm:table-cell' : ''
              const num = accessor === 'number' ? 'text-center' : ''
              const pub = ['title', 'publisher'].includes(accessor)
                ? 'sm:max-w-[120px] md:max-w-[205px] lg:max-w-none sm:truncate'
                : ''
              //const code = accessor === 'code' ? 'min-w-[90px] lg:min-w-0' : ''
              return (
                <td
                  className={`max-w-[100px] truncate px-1 md:px-2 py-1 h-[42px] border-grey-light border text-center dark:border-gray-400 ${view} ${num} ${pub}`}
                  key={accessor}
                >
                  {tData || ''}
                </td>
              )
            })}
          </tr>
        )
      })}
    </tbody>
  )
}

// type TerritoriesProps = {
//     onNavigate: (navigate: NavigateAction, date?: Date) => void;
//     date: Date;
//     view: View;
//     label: string;
//   };

const Territories = () => {
  const [popupData, setPopupData] = useState<TTerritory | null>(null)
  const [mainOpen, setMainOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<string | null>(null)
  const [sortField, setSortField] = useState('returned')
  const [sortOrder, setSortOrder] = useState<TSortOrder>('desc')
  const [criteria, setCriteria] = useState('')

  const debounedCriteria: string = useDebounce(criteria, 300)

  const t = useTranslations('TerritoryPage')

  const count = TERRITORIES_PER_PAGE // number of territories per page
  //const openModal = (value: TTerritory) => setPopupData(value);
  const changePage = (value: number) => setPage(value) /* (value < 1 ? setPage(1) : setPage(value)) */

  const closeModal = useCallback(() => {
    setMainOpen(false)
    //setPopupData(null);
    //document.body.style.overflow = "unset";
    setTimeout(() => setPopupData(null), 600)
    return
  }, [])

  const params = {
    page,
    count,
    sortField,
    sortOrder,
    filter,
    criteria: debounedCriteria,
  }

  //console.log(moment(sortField).isValid())

  const {
    loadingData,
    fetchingData,
    newData,
    //filteredAndSortedData,
    //isPreviousData,
    loadingUsersList,
    users,
    loadingTitles,
    titles,
  } = useTerritoryQueries(params)

  const {
    handleCreateNewTerritory,
    handleUpdateTerritory,
    handleReturnTerritory,
    handleGiveTerritory,
    handleDeleteTerritory,
  } = useTerritoryMutations(filter)

  const handleSorting = useCallback(
    (newSortField: string, newSortOrder: TSortOrder) => {
      setSortField(newSortField)
      setSortOrder(newSortOrder)
      page !== 1 && setPage(1)
    },
    [page, setPage, setSortField, setSortOrder]
  )

  const updateSearchTitle = useCallback((value: string) => {
    value ? setFilter(value) : setFilter('all')
    setPage(1)
    setSortField(value ? 'code' : 'given')
    setSortOrder('asc')
  }, [])

  const handleSearch = useCallback(
    (string: string) => {
      /* if (string && string.length > 2) { */
      setCriteria(string)
      setPage(1)

      return
      /* } */
      /* return setCriteria(""); */
    },
    [setCriteria, setPage]
  )

  if (loadingUsersList || loadingData || loadingTitles) {
    return (
      <>
        <h1 className='head_text mt-0 md:mt-2 text-center'>
          <span className='blue_gradient'>{t('served-territories')}</span>
        </h1>
        <div className='flex items-center justify-between mt-6 md:mt-10 md:px-2 gap-2 sm:gap-4 h-10 md:h-12'>
          <BsBuilding size={28} color='lightslategrey' />
          <SearchIcon className='inset-y-0 my-auto h-8 w-12 px-3.5 stroke-gray-500' />
          <BsBuildingAdd size={26} color='lightslategrey' />
        </div>
        <Spinner wrapper />
      </>
    )
  }

  return (
    <>
      <h1 className='head_text blue_gradient mt-0 md:mt-2 text-center'>{t('served-territories')}</h1>
      <div className='flex items-center justify-between mt-6 md:mt-10 md:px-2 gap-2 sm:gap-4'>
        {titles && titles.length ? (
          <SearchMenuPopup2
            titles={titles}
            updateSearchTitle={updateSearchTitle}
            activeTitle={filter}
            icon={BsBuilding}
            iconInner={FaTreeCity}
            position='bottom left'
            //simple={true}
            offsetY={5}
          />
        ) : (
          <IconComponent icon={BsBuilding} size={28} color='lightslategrey' />
        )}

        {!!newData && <SearchComponent handleSearch={handleSearch} criteria={criteria} />}

        <NewTerritoryPopup createNewTerritory={handleCreateNewTerritory} t={t} />
      </div>

      {!fetchingData ? (
        <>
          <table className='w-full rounded-lg overflow-hidden md:shadow-lg my-5 text-sm md:text-base md:mx-auto'>
            <TableHead {...{ handleSorting, sortField, sortOrder, t }} />
            <TableBody
              {...{
                tableData: newData?.territories ?? [] /* filteredAndSortedData?.territories */,
                setPopupData,
                setMainOpen,
                page,
                count,
              }}
            />
          </table>
          {newData && typeof newData.totalPages === 'number' && newData.totalPages > 1 && (
            <Pagination page={page} changePage={changePage} hasMore={newData.hasMore} totalPages={newData.totalPages} />
          )}
          {/* <Pagination
            page={page}
            changePage={changePage}
            hasMore={newData?.hasMore}
            totalPages={newData?.totalPages}
            isPreviousData={isPreviousData}
          /> */}
        </>
      ) : (
        <Spinner wrapper />
      )}
      <BackToTopButton />
      {/* {popupData && users && ( */}
      <TerritoryMainPopup
        isOpen={mainOpen}
        popupData={popupData}
        users={users}
        closeModal={closeModal}
        //moment={moment}
        giveTerritory={handleGiveTerritory}
        returnTerritory={handleReturnTerritory}
        updateTerritory={handleUpdateTerritory}
        deleteTerritory={handleDeleteTerritory}
      />
      {/* )} */}
    </>
  )
}

export default Territories
