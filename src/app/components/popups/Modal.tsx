import type { RoundedSize } from '@/types/modal'
import { cc, rounded } from '@/utils'
import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type ModalCommonProps = {
  hasCloseBtn?: boolean
  lockScroll?: boolean
  //nested?: boolean;
  closeOnDocumentClick?: boolean
  className?: string
  classNameLeftIcon?: string
  roundedSize?: RoundedSize
  children: ReactNode
}

export type ModalPassedProps = Omit<ModalCommonProps, 'children'>

// interface ModalCommonProps extends PropsWithChildren {
//     hasCloseBtn?: boolean;
//     lockScroll?: boolean;
//     nested?: boolean;
//     closeOnDocumentClick?: boolean;
//     className?: string;
//   }

type ModalProps = (
  | { trigger: ReactNode; isOpen?: never; onClose?: never }
  | { trigger?: never; isOpen: boolean; onClose: () => void }
) &
  ModalCommonProps

export default function Modal({
  isOpen,
  onClose,
  hasCloseBtn = true,
  lockScroll = true,
  closeOnDocumentClick = true,
  className = 'w-[350px] drop-shadow',
  classNameLeftIcon = '',
  roundedSize = 'lg',
  children,
  trigger,
}: ModalProps) {
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLElement | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const [triggerIsOpen, setTriggerIsOpen] = useState(false)
  const prevIsOpen = useRef<boolean>()

  const open = trigger ? triggerIsOpen : isOpen

  const close = useCallback(() => (onClose ? onClose() : setTriggerIsOpen(false)), [])

  useEffect(() => {
    ref.current = document.querySelector('#modal-container')
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useLayoutEffect(() => {
    if (!open && prevIsOpen.current) {
      setIsClosing(true)
    }

    prevIsOpen.current = open
  }, [open, isClosing])

  useEffect(() => {
    /* fix if there are nesting modals  */
    const nodes = ref.current?.querySelector('.modal-wrapper:not(.closing)')

    if (open || nodes) {
      if (lockScroll) {
        document.body.style.overflow = 'hidden'
      }
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [open, lockScroll, ref.current])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handler)

    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [close])

  if (!open && !isClosing) {
    if (trigger) {
      return (
        <div className={classNameLeftIcon} onClick={() => setTriggerIsOpen(true)}>
          {trigger}
        </div>
      )
    } else {
      return null
    }
  }

  return (
    <>
      {trigger && trigger}
      {mounted
        ? createPortal(
            <div
              onAnimationEnd={() => setIsClosing(false)}
              className={cc('modal-wrapper z-40', isClosing && 'closing')}
            >
              {/* backdrop */}
              <div
                className='overlay fixed inset-0 flex justify-center items-center'
                onClick={closeOnDocumentClick ? close : () => {}}
              >
                {/* modal */}
                <div
                  onClick={e => e.stopPropagation()}
                  className={cc('modal-new', className, rounded('all', roundedSize))}
                >
                  {hasCloseBtn && (
                    <button className='close z-30' onClick={close}>
                      &times;
                    </button>
                  )}

                  {trigger
                    ? //@ts-expect-error
                      children(close)
                    : children}
                </div>
              </div>
            </div>,
            ref.current as HTMLElement
          )
        : null}
    </>
  )
}
