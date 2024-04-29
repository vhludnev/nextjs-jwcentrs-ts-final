import Image from 'next/image'
import { BsFillPersonFill } from '@/lib/icons'
//import moment from "moment";
//import PopupWrapper from "./PopupWrapper";
import type { TUser } from '@/types/user'
//import "moment/locale/ru";
import Modal from './Modal'
import type { RoundedSize } from '@/types/modal'
import { cc, rounded } from '@/utils'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

//moment.locale("ru");

const ThemeSelect = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className='z-30 absolute top-4 left-4'>
      <select
        className='bg-transparent border border-gray-400 outline-none text-sm'
        value={theme}
        onChange={e => setTheme(e.target.value)}
      >
        <option disabled className='dark:bg-gray-500 dark:disabled:text-white/70' value=''>
          Тема
        </option>
        <option className='dark:bg-gray-500' value='system'>
          Системная
        </option>
        <option className='dark:bg-gray-500' value='light'>
          Светлая
        </option>
        <option className='dark:bg-gray-500' value='dark'>
          Тёмная
        </option>
      </select>
    </div>
  )
}

const ProfilePopup = ({ data, roundedSize }: { data: TUser; roundedSize?: RoundedSize }) => {
  return (
    <Modal
      closeOnDocumentClick={false}
      trigger={
        <div className='cursor-pointer'>
          {data?.image ? (
            <Image src={data.image} width={37} height={37} className='rounded-full' alt='profile' />
          ) : (
            <BsFillPersonFill color='#6992ca' size={26} />
          )}
        </div>
      }
      roundedSize={roundedSize}
      //modal
    >
      {
        (() => (
          <>
            {/* <div className="modal w-[350px] md:w-auto rounded-xl border border-gray-300 drop-shadow-lg">
            <button className="close" onClick={close}>
              &times;
            </button> */}
            <div className={cc('header', rounded('t', roundedSize), 'bg-primary-white h-14 dark:bg-[#454b4d]')}>
              <ThemeSelect />
            </div>
            <div
              className={cc(
                'content',
                rounded('b', roundedSize),
                'px-0 md:px-2 py-2 bg-primary-white dark:bg-[#454b4d] -mt-0.5'
              )}
            >
              <div className='text-base relative px-2 pb-7 overflow-x-hidden max-h-[300px] md:max-h-[50vh] w-[350px] flex flex-col items-center gap-2'>
                <div className='pb-6'>
                  {data?.image ? (
                    <Image src={data.image} width={70} height={70} className='rounded-full' alt='profile' />
                  ) : (
                    <BsFillPersonFill color='#6992ca' size={70} />
                  )}
                </div>
                <div className='text-lg long_text dark:text-gray-100'>{data.name}</div>
                <div className='long_text dark:text-gray-100 pb-4'>{data.email}</div>
              </div>
            </div>
          </>
          /* </div> */
        )) as unknown as React.ReactNode
      }
    </Modal>
  )
}

export default ProfilePopup
