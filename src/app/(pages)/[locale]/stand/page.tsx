'use client'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import dynamic from 'next/dynamic'
//import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  Calendar,
  //momentLocalizer,
  Navigate as navigate,
  Views,
  View,
  SlotInfo,
  NavigateAction,
  dateFnsLocalizer,
  DateLocalizer,
  Formats,
} from 'react-big-calendar'

import { format, parse, startOfWeek, getDay, set, addHours } from 'date-fns'
import { ru, lv } from 'date-fns/locale'
import {
  BsCalendarPlus,
  BsPerson,
  //BsTrash,
  BsCalendarDay,
  BsCalendar3,
  BsCalendar3Event,
  BsCalendar3Week,
  BiSolidChevronLeft,
  BiSolidChevronRight,
} from '@/lib/icons'

import {
  backgroundColor,
  overlappingHours,
  transformedData,
  resourceMap,
  //permissionClient,
  //formatDate,
} from '@/utils'
import Spinner from '@/components/Spinner'
import type { TEvent, TEventDate, TEventNewSlot } from '@/types/event'
import type { Locale } from '../../../../i18n.config'
import { useTranslations } from 'next-intl'
//import "moment/locale/ru";

//import { useFetch } from "@/hooks/useFetch";

//moment.locale("ru");

const locales = {
  ru: ru,
  lv: lv,
}

//const ConfirmPopup = dynamic(() => import('@/components/popups/ConfirmPopup'))
const ControlledPopup = dynamic(() => import('@/components/popups/ControlledPopup'))
const ControlledPopupEditable = dynamic(() => import('@/components/popups/ControlledPopupEditable'))

//const localizer = momentLocalizer(moment);
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

type ToolbarProps = {
  onNavigate: (navigate: NavigateAction, date?: Date) => void
  date: Date
  view: View
  label: string
}

// export const formatFn = (date: Date | string, transformString: string) => {
//   return format(date, transformString, { locale: ru } as any)
// }

export default function BigCalendar({ params: { locale } }: { params: { locale: Locale } }) {
  const [open, setOpen] = useState(false)
  const [openEditable, setOpenEditable] = useState(false)
  const [data, setData] = useState<TEvent | TEventDate | TEventNewSlot | null>(null)
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState<TEvent[]>([])
  const [message, setMessage] = useState<
    | {
        status: string
        text: string
      }
    | undefined
  >(undefined)

  //console.log(crypto.randomUUID());

  const [view, setView] = useState(Views.MONTH as View)
  const [date, setDate] = useState<Date>(new Date())

  const t = useTranslations('StandPage')
  //   const { loading, data: eventsData } = useFetch("/api");

  //   useEffect(() => {
  //     eventsData?.data?.length &&
  //       setEvents(eventsData?.data.map((el: TEvent) => transformedData(el)));
  //   }, [eventsData?.data]);

  const closeModal = useCallback(() => {
    open ? setOpen(false) : setOpenEditable(false)
    //setData(null);
    setMessage(undefined)
    //document.body.style.overflow = "unset";
    setTimeout(() => setData(null), 600)
    return
  }, [open])

  const { data: session } = useSession()

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const response = await fetch(`/api`)
      const { data }: { data: TEvent[] } = await response.json()
      setEvents(data.map(el => transformedData(el)))
      setLoading(false)
    })()
  }, [])

  const updateMessage = (status: string, text: string) => {
    setMessage({ status, text })
  }

  const handleSave = useCallback(
    async (values: TEvent) => {
      const { id, ...rest } = values

      if (id) {
        const response = await fetch(`/api/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rest),
        })

        const { error } = await response.json()

        if (error) {
          updateMessage('error', error)
          setTimeout(() => setMessage(undefined), 5000)
          return
        }

        setEvents(events.map(event => (event.id === id ? values : event)))
      } else {
        const response = await fetch('/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rest),
        })

        const { data, error } = await response.json()

        if (error) {
          updateMessage('error', error)
          setTimeout(() => setMessage(undefined), 5000)
          return
        }

        setEvents([
          ...events,
          {
            ...transformedData(data),
          },
        ])
      }
      closeModal()
    },
    [events]
  )

  const handleDelete = useCallback(
    async (id: TEvent['id']) => {
      const { error }: any = await fetch(`/api/${id}`, {
        method: 'DELETE',
      })

      if (error) {
        updateMessage('error', error.response.data.error)
        setTimeout(() => setMessage(undefined), 5000)
        return
      }

      setEvents(events.filter(event => event.id !== id))
      closeModal()
    },
    [events]
  )

  const handleSelectEvent = useCallback(
    (event: TEvent) => {
      setData({
        ...event,
        title: event.title ? event.title : resourceMap.filter(r => r.resourceId === event.resourceId)[0].resourceTitle,
      })

      setOpen(true)
      return
    },
    [events]
  )

  const handleSelectSlot = useCallback(
    (slotEvent: SlotInfo) => {
      //console.log(slotEvent)

      const pickedDayAt6PM = new Date(
        set(slotEvent.start, {
          hours: 18,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        })
      )

      if (slotEvent.action === 'click' && pickedDayAt6PM >= new Date()) {
        /* click in day view calendar */
        if (slotEvent.slots) {
          if (slotEvent.slots.length === 2) {
            return (
              setData({
                date: slotEvent.start,
                end: slotEvent.end,
                title: resourceMap.find(r => r.resourceId === slotEvent.resourceId)!.resourceTitle,
              }),
              setOpenEditable(true)
            )
            /* tapping in month view calendar*/
          } else if (slotEvent.slots.length === 1) {
            return (
              setData({
                date: slotEvent.slots[0],
                end: addHours(slotEvent.slots[0], 1),
                //moment(slotEvent.slots[0]).add(1, 'hour').toDate(),
              }),
              setOpenEditable(true)
            )
          }
        }
        /* other clicks in month view */

        //return setData({ date: slotEvent.start, end: moment(slotEvent.end).add(1, 'hour') }), setOpenEditable(true)
        return setData({ date: slotEvent.start, end: addHours(slotEvent.end, 1) }), setOpenEditable(true)
      }
      /* no clicking to choose a new stand */
      // if (slotEvent.slots && slotEvent.slots.length < 3) {
      //   return
      // }
      /* no selecting in past due dates/time, only clicking existing allowed */
      if ((slotEvent.action === 'select' || slotEvent.action === 'click') && new Date(slotEvent.start) < new Date())
        return
      /* do not allow scrolling in Month view */
      if (slotEvent.action === 'select' && view === Views.MONTH) return
      /* no overlaping existing stands */
      if (overlappingHours(events, slotEvent)) return
      //console.log('2nd', slotEvent)

      return (
        setData({
          start: slotEvent.start,
          end: slotEvent.end,
          resourceId: slotEvent.resourceId,
          title: resourceMap.find(r => r.resourceId === slotEvent.resourceId)!.resourceTitle,
          //title: "",
        }),
        setOpen(true)
      )
    },
    [events, view]
  )

  // const pastEvents = useMemo(
  //   () => events.filter(event => isBefore(new Date(event.end), endOfMonth(subMonths(new Date(), 1)))),
  //   [events]
  // )

  // const handleDeleteMany = useCallback(async (): Promise<any> => {
  //   const { error }: any = await fetch('/api', {
  //     method: 'DELETE',
  //   })

  //   if (error) {
  //     return
  //   }

  //   return setEvents(events.filter(event => isAfter(endOfMonth(subMonths(new Date(), 1)), new Date(event.end))))
  // }, [events])

  const RBCToolbar = ({ onNavigate, date, view, label }: ToolbarProps) => {
    const changeView = (name: View) => {
      switch (name) {
        case 'month':
          //props.onView("month");
          setView('month')
          break
        case 'week':
          //props.onView("week");
          setView('week')
          break
        case 'day':
          //props.onView("day");
          setView('day')
          break
        default:
          //props.onView("month");
          setView('month')
          break
      }
    }

    const goToToday = () => onNavigate(navigate.TODAY)

    const goToBack = () => onNavigate(navigate.PREVIOUS)

    const goToNext = () => onNavigate(navigate.NEXT)

    const today = useMemo(() => format(date, 'dd-MM-yyyy') === format(new Date(), 'dd-MM-yyyy'), [date])
    return (
      <>
        <div className='flex items-center md:gap-5 h-12 min-h-[3rem] mb-2 md:mb-3 relative sm:justify-end'>
          <div className='flex flex-grow items-center'>
            <div className='font-sans inline-flex items-center text-base sm:text-xl md:text-2xl font-bold rounded gap-1 md:gap-6 text-[#6992ca] dark:text-primary-white sm:absolute sm:left-1/2 sm:justify-center sm:-translate-x-1/2'>
              <span className='cursor-pointer' id='prev-btn-icon' onClick={goToBack}>
                <BiSolidChevronLeft size={24} />
              </span>
              <span className='uppercase text-center'>{label}</span>
              <span className='cursor-pointer' id='next-btn-icon' onClick={goToNext}>
                <BiSolidChevronRight size={24} />
              </span>
            </div>
          </div>

          <div className='flex flex-row gap-3 md:gap-5'>
            <BsCalendarPlus
              name='addnew'
              cursor='pointer'
              className='text-green-600 text-xl md:text-2xl xl:text-3xl'
              onClick={() => {
                setData({ date }), setOpenEditable(true)
              }}
            />

            <BsCalendarDay
              name='today'
              cursor='pointer'
              className='text-xl md:text-2xl xl:text-3xl'
              color={today ? 'dodgerblue' : '#93c5fd'}
              onClick={goToToday}
            />

            <BsCalendar3
              name='month'
              cursor='pointer'
              className='text-xl md:text-2xl xl:text-3xl'
              color={view === 'month' ? 'dodgerblue' : '#93c5fd'}
              onClick={() => changeView('month')}
            />

            <BsCalendar3Week
              name='week'
              cursor='pointer'
              className='text-xl md:text-2xl xl:text-3xl'
              color={view === 'week' ? 'dodgerblue' : '#93c5fd'}
              onClick={() => changeView('week')}
            />

            <BsCalendar3Event
              name='day'
              cursor='pointer'
              className='text-xl md:text-2xl xl:text-3xl'
              color={view === 'day' ? 'dodgerblue' : '#93c5fd'}
              onClick={() => changeView('day')}
            />
          </div>
          {/* <Button onClick={() => props.onView("agenda")}>Month</Button>
          <Button onClick={() => props.onView("agenda")}>Bar</Button> */}
        </div>
      </>
    )
  }

  const { components, defaultDate, views, formats } = useMemo(
    () => ({
      dateFormat: 'dd',
      defaultDate: new Date(),
      views: ['month', 'week', 'day'] as View[],
      components: {
        event: (props: { event: TEvent }) => {
          const { title, name1, name2, start, end } = props.event
          return (
            <>
              <div>{title}</div>
              <div>
                <div>
                  <span role='img' aria-label='Bust in Silhouette'>
                    <BsPerson color='white' />
                  </span>{' '}
                  <span>{name1}</span>
                </div>

                <div>
                  <span role='img' aria-label='Bust in Silhouette'>
                    <BsPerson color='white' />
                  </span>{' '}
                  <span>{name2}</span>
                </div>
              </div>
              <div>{`${format(start, ' HH:mm')} - ${format(end, 'HH:mm')}`}</div>
            </>
          )
        },
        toolbar: RBCToolbar,
      },
      formats: {
        //weekdayFormat: (date: Date, culture: string) => formatDate(date, { weekday: 'short' }, culture),
        weekdayFormat: (date: Date, culture: string, localizer: DateLocalizer) =>
          localizer.format(date, 'eeeeee', culture),
        dayFormat: (date: Date, culture: string, localizer: DateLocalizer) =>
          localizer.format(date, 'd eeeeee', culture) /* + " " + formatDate(date, { weekday: 'short' }, culture) */,
        //monthHeaderFormat: (date: Date) => formatFn(date, "LLLL yyyy"),
        monthHeaderFormat: (date: Date, culture: string, localizer: DateLocalizer) =>
          localizer.format(date, 'LLLL yyyy', culture),
        //dayHeaderFormat: (date: Date) => formatFn(date, "EEEE d MMM"),
        dayHeaderFormat: (date: Date, culture: string, localizer: DateLocalizer) =>
          localizer.format(date, 'eeee dd MMM', culture),
        // eventTimeRangeFormat: () => "Расположение",
        dayRangeHeaderFormat: (
          {
            start,
            end,
          }: {
            start: TEvent['start']
            end: TEvent['end']
          },
          culture: string,
          localizer: DateLocalizer
        ) => localizer.format(start, 'd', culture) + ' - ' + localizer.format(end, 'd MMMM', culture),
      },
    }),
    []
  )

  // Create a function to handle the hover effect
  const eventStyleGetter = (event: TEvent /* , start, end, isSelected */) => {
    return {
      style: {
        backgroundColor: backgroundColor(event.title) /* : "#3f51b5" */,
        borderRadius: '8px',
        border: `1px solid ${backgroundColor(event.title)}`,
      },
    }
  }

  if (!session) return null

  // {permissionClient('admin', session?.user) && !!pastEvents.length && (
  //   <ConfirmPopup
  //     handleConfirm={handleDeleteMany}
  //     text='Вы уверены, что хотели бы удалить все стенды до начала этого месяца?'
  //     btnClass='danger hover:bg-red-700'
  //     lockScroll
  //     button={
  //       <button className='absolute right-1 top-1 sm:top-0 z-10'>
  //         <BsTrash size={20} className='hover:text-red-700' color='#d97706' />
  //       </button>
  //     }
  //   />
  // )}

  return (
    <>
      <h1 className='head_text blue_gradient text-center mt-0 md:mt-2'>{t('stand-service')}</h1>

      {data && (
        <>
          {!('date' in data) ? (
            <ControlledPopup
              open={open}
              closeModal={closeModal}
              data={data}
              format={format}
              handleSave={handleSave}
              handleDelete={handleDelete}
              message={message}
              roundedSize='lg'
              dateFnsLocale={locale === 'ru' ? ru : lv}
              // lockScroll={false}
            />
          ) : (
            <ControlledPopupEditable
              open={openEditable}
              closeModal={closeModal}
              data={data}
              format={format}
              handleSave={handleSave}
              message={message}
              events={events}
              updateMessage={updateMessage}
              // closeOnDocumentClick={false}
              roundedSize='lg'
              dateFnsLocale={locale === 'ru' ? ru : lv}
              // lockScroll={false}
            />
          )}
        </>
      )}

      <div className='mt-3 sm:mt-5 lg:mt-10'>
        {loading && <Spinner />}
        <Calendar
          culture={locale}
          localizer={localizer}
          events={events}
          //allDayAccessor="allDay"
          //startAccessor="start"
          //endAccessor="end"
          resourceIdAccessor='resourceId'
          resources={resourceMap}
          //resourceTitleAccessor='resourceTitle'
          resourceTitleAccessor='resourceShortTitle'
          defaultDate={defaultDate}
          defaultView='month'
          //popup
          //step={15}
          //popupOffset={{ x: 0, y: -150 }}
          //popupOffset={{ x: 0, y: 0 }}
          formats={formats as Formats}
          dayLayoutAlgorithm='no-overlap'
          //min={moment(`${new Date().toISOString().slice(0, 10)} 6:00`).toDate()}
          //max={moment(`${new Date().toISOString().slice(0, 10)} 19:00`).toDate()}
          min={new Date('2020-01-01T05:00:00')}
          max={new Date('2030-01-01T20:00:00')}
          //style={{ height: /* '100vh' */ '600px' }}
          //className='h-[calc(100vh-115px)] md:h-[calc(100vh-150px)]'
          //className="h-[calc(100dvh-140px)] xs:h-[calc(100dvh-120px)] md:h-[calc(100dvh-200px)] landscape:min-h-[500px]"
          className='h-[calc(100dvh-140px)] xs:h-[calc(100dvh-120px)] md:h-[calc(100dvh-200px)] landscape:min-h-[500px]'
          eventPropGetter={eventStyleGetter}
          // eventPropGetter={(event) => {
          //   return {
          //     style: {
          //       backgroundColor: backgroundColor(event.title) /* : "#3f51b5" */,
          //       borderRadius: "8px",
          //       border: `1px solid ${backgroundColor(event.title)}`,
          //     },
          //   };
          // }}
          //   formats={{
          //     dayHeaderFormat: (date) => moment(date).format("dddd - D MMM"),
          //   }}
          selectable
          views={views}
          messages={{
            allDay: 'Весь День',
            // next: (
            //   <span>
            //     Вперёд <ImArrowRight2 />
            //   </span>
            // ),
            // previous: (
            //   <span>
            //     <ImArrowLeft2 /> Назад
            //   </span>
            // ),
            today: 'Сегодня',
            month: 'Месяц',
            week: 'Неделя',
            day: 'День',
            agenda: 'Список',
            date: 'Дата',
            time: 'Время',
            event: 'События',
            noEventsInRange: 'Список стендов пуст',
            //showMore: total => `+ ${total} ${total > 5 ? 'стендов' : 'стенда'}`,
            showMore: total => t('stand', { count: total }),
          }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={slotEvent => handleSelectSlot(slotEvent)}
          components={components}
          view={view}
          date={date}
          onView={view => setView(view)}
          onNavigate={date => setDate(new Date(date))}
        />
      </div>
    </>
  )
}
