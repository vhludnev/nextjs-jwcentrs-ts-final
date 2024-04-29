//import dynamic from "next/dynamic";
import { RoundedSize } from '@/types/modal'
import Modal from './Modal'
//import PopupWrapper from "./PopupWrapper";
import { PiWarningBold } from '@/lib/icons'
import { cc, rounded } from '@/utils'
import { useTranslations } from 'next-intl'

//const Modal = dynamic(() => import("./Modal"));

type Props = {
  btnClass?: string
  text: string
  warning?: string
  handleConfirm: () => void
  //top: string;
  //closeHeaderBtn?: boolean;
  nested?: boolean
  lockScroll?: boolean
  closeOnDocumentClick?: boolean
  button: React.ReactElement
  //lang?: string;
  roundedSize?: RoundedSize
}

const ConfirmPopup = ({
  btnClass = 'success hover:bg-green-600',
  text,
  warning,
  handleConfirm = () => {},
  //closeHeaderBtn = false,
  nested = false,
  lockScroll,
  closeOnDocumentClick,
  button,
  //lang = "ru",
  roundedSize = 'lg',
}: Props) => {
  //   const handleClose = (close: any) => {
  //     close();
  //     lockScroll && document.body.style.overflow === "unset";
  //   };
  const t = useTranslations('Popups')

  return (
    <Modal
      trigger={button}
      //modal
      className={`${nested ? 'w-[320px]' : 'w-[344px]'} drop-shadow-xl`}
      lockScroll={lockScroll}
      closeOnDocumentClick={closeOnDocumentClick}
      hasCloseBtn={false}
      roundedSize={roundedSize}
    >
      {
        ((close: any) => (
          <>
            <div className={cc('header', rounded('t', roundedSize), 'bg-white h-12 dark:bg-[#454b4d]')}></div>
            <div className='content pt-0 pb-2 px-6 flex flex-col gap-3.5'>
              <span className={`text-base ${warning ? 'px-5' : 'text-center'}`}>{text}</span>
              {warning && (
                <span className='flex gap-4 items-center'>
                  <PiWarningBold className='min-w-[24px]' color='orangered' size={24} />
                  <b className='text-base self-end tracking-tight'>{warning}</b>
                </span>
              )}
            </div>
            <div className={cc('actions', rounded('b', roundedSize), 'bg-white dark:bg-[#454b4d]')}>
              <button
                className='button w-20 border-[#6992ca] text-[#6992ca] dark:border-blue-300 dark:text-blue-300 dark:hover:text-white hover:text-white hover:bg-[#6992ca] transition ease-in-out duration-250'
                onClick={close}
              >
                {t('cancel')}
              </button>
              <button
                className={`button min-w-16 ${btnClass} transition ease-in-out duration-250`}
                onClick={() => {
                  handleConfirm()
                  close()
                }}
              >
                {t('confirm')}
              </button>
            </div>
          </>
        )) as unknown as React.ReactNode
      }
    </Modal>
  )
}

export default ConfirmPopup
