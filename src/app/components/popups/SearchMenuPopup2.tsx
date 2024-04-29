'use client'

import { useState } from 'react'
import PopupWrapper from './PopupWrapper'
import IconComponent from '../IconComponent'
import { PopupPosition } from 'reactjs-popup/dist/types'
import { useTranslations } from 'next-intl'

type Props = {
  titles: string[]
  updateSearchTitle: (data: string) => void
  activeTitle: string | null
  icon: any
  iconInner?: any
  position: PopupPosition
  offsetY?: number
  offsetX?: number
  arrow?: boolean
  simple?: boolean
}

const SearchMenuPopup2 = ({
  titles,
  updateSearchTitle,
  activeTitle,
  icon,
  iconInner,
  position /*  = 'right top' */,
  offsetY = 0,
  offsetX = 0,
  arrow = true,
}: //simple = false,
Props) => {
  //const [active, setActive] = useState(filter)
  //const [open, setOpen] = useState(simple ? !!!activeTitle : false);
  const [open, setOpen] = useState(!!!activeTitle)

  const toggleOpen = () => setOpen(open => !open)
  const closeModal = () => setOpen(false)

  const t = useTranslations('Common')

  return (
    <PopupWrapper
      open={open}
      trigger={
        <button>
          <IconComponent icon={icon} size={28} color={activeTitle ? 'rosybrown' : 'lightslategrey'} cursor='pointer' />
        </button>
      }
      position={position}
      //position='bottom left'
      offsetY={offsetY}
      offsetX={offsetX}
      //on={['hover', 'click']}
      closeOnDocumentClick
      mouseLeaveDelay={300}
      mouseEnterDelay={0}
      contentStyle={{ padding: '0px', border: 'none' }}
      onClose={closeModal}
      onOpen={toggleOpen}
      arrow={arrow}
      arrowStyle={{ color: 'rgb(229,231,235)' /* , filter: 'none' */ }}
    >
      <ul className='flex flex-col w-[194px] max-h-[72vh] overflow-y-auto bg-white border-2 border-gray-200 dark:border-gray-500 rounded-md divide-y shadow-lg dark:bg-gray-600'>
        <li
          className='relative min-h-11 dark:border-dashed dark:border-gray-400'
          onClick={() => {
            //setActive(simple ? 'all' : '')
            //updateSearchTitle(simple ? "all" : "");
            updateSearchTitle('all')
            closeModal()
          }}
        >
          <span
            className={`absolute w-[95%] h-[82%] m-1 pt-2 px-4 hover:bg-gray-100 cursor-pointer rounded-md ${
              activeTitle === 'all'
                ? 'active-dropdownlink'
                : 'text-gray-600 hover:text-yellow-800 dark:text-gray-100 dark:hover:text-yellow-800'
            }`}
          >
            {`- - - ${t('all')} - - -`}
          </span>
        </li>
        {titles?.map((t, idx) => (
          <li
            className='relative min-h-11 mx-1 dark:border-dashed dark:border-gray-400'
            key={idx}
            onClick={() => {
              //setActive(t)
              updateSearchTitle(t)
              closeModal()
            }}
          >
            <span
              className={`flex items-center gap-6 absolute w-full h-[82%] my-1 hover:bg-gray-100 cursor-pointer rounded-md ${
                activeTitle === t
                  ? 'active-dropdownlink'
                  : 'hover:text-yellow-800 text-gray-600 dark:text-gray-100 dark:hover:text-yellow-800'
              }`}
            >
              <span className='w-[16px] pl-3'>
                <IconComponent icon={iconInner} size={20} color={activeTitle !== t ? 'lightgray' : 'inherit'} />
              </span>

              <span className='long_text'>{t}</span>
            </span>
          </li>
        ))}
      </ul>
    </PopupWrapper>
  )
}

export default SearchMenuPopup2
