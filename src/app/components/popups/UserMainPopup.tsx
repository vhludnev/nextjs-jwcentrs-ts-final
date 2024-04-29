import { useState } from 'react'
import { useSession } from 'next-auth/react'
//import PopupWrapper from "./PopupWrapper";
import { BsTrash, RxUpdate, FcGoogle, AiOutlineGoogle } from '@/lib/icons'
import { cc, permissionClient, rounded } from '@/utils'
import ConfirmPopup from './ConfirmPopup'
import Modal from './Modal'
import type { TUser } from '@/types/user'
import type { RoundedSize } from '@/types/modal'
import { useTranslations } from 'next-intl'

// const statusMsg = (status: TUser['status'], t: (key: string) => string) => {
//   switch (status) {
//     case 'admin':
//       return 'присвоить ПОЛНЫЙ доступ'
//     default:
//       return 'убрать ПОЛНЫЙ доступ'
//   }
// }

type Props = {
  popupData: TUser
  open: boolean
  closeModal: () => void
  updateUserInfo: (id: TUser['id'], newInfoObj: Partial<TUser>) => void
  removeUser: (id: TUser['id']) => void
  roundedSize?: RoundedSize
  //t: (messageKey: string) => string
}

const UserMainPopup = ({ popupData, open, closeModal, updateUserInfo, removeUser, roundedSize = 'lg' }: Props) => {
  const [publisherName, setPublisherName] = useState(popupData?.name)
  const [publisherEmail, setPublisherEmail] = useState(popupData?.email)

  const { data: session } = useSession()
  const t = useTranslations('UsersPage')

  const newProvider = popupData?.provider === 'google' ? 'credentials' : 'google'

  return (
    <Modal
      isOpen={open}
      closeOnDocumentClick={false}
      onClose={closeModal}
      className='w-[350px] drop-shadow fullheight'
      roundedSize={roundedSize}
    >
      {/* <div className="modal w-[350px] fullheight"> */}
      {permissionClient('admin', session?.user) && (
        <ConfirmPopup
          handleConfirm={() => removeUser(popupData.id)}
          text={t('confirm.you-sure-wanting', { status: 'removeaccount' })}
          btnClass='danger hover:bg-red-700'
          nested={true}
          button={
            <button className='absolute left-5 top-[1.1rem] outline-none'>
              <BsTrash size={20} className='text-gray-400 hover:text-red-700 transition ease-in-out duration-250' />
            </button>
          }
        />
      )}
      {/* <button className="close" onClick={closeModal}>
          &times;
        </button> */}
      {popupData && (
        <>
          <div className={cc('header', rounded('t', roundedSize), 'text-center dark:text-white')}>
            {t('update-info')}
          </div>
          <div className='content'>
            <div className='relative'>
              <table className='w-full text-sm text-left text-gray-600'>
                <tbody className='bg-white dark:filter dark:brightness-90 divide-y dark:divide-gray-400'>
                  <tr>
                    <th scope='row' className='p-4 font-medium text-gray-900 whitespace-nowrap max-w-[106px]'>
                      {t('name')}
                    </th>
                    <td className='p-4 relative'>
                      <input
                        type='text'
                        name='name'
                        placeholder='Имя, Фамилия'
                        value={publisherName}
                        required
                        minLength={3}
                        className='pr-5 mb-0 max-w-[190px] text-sm font-normal placeholder:text-sm dark:focus:text-black dark:w-[95%]'
                        onChange={e => setPublisherName(e.target.value)}
                      />
                      {publisherName !== popupData?.name && (
                        <ConfirmPopup
                          handleConfirm={() =>
                            publisherName &&
                            updateUserInfo(popupData.id, {
                              name: publisherName,
                            })
                          }
                          text={`${t('confirm.you-sure-wanting', { status: 'rename' })} ${publisherName}?`}
                          nested={true}
                          button={
                            <span className='absolute top-1/2 -translate-y-1/2 right-2 bg-white border-2 border-gray-100 rounded-full p-1'>
                              <RxUpdate
                                cursor='pointer'
                                className='text-green-600 hover:text-green-400 transition ease-in-out duration-500'
                                size={14}
                              />
                            </span>
                          }
                        />
                      )}
                    </td>
                  </tr>

                  <tr>
                    <th scope='row' className='p-4 font-medium text-gray-900 whitespace-nowrap max-w-[106px]'>
                      {t('email')}
                    </th>
                    <td className='p-4 relative'>
                      <input
                        type='text'
                        name='email'
                        placeholder={t('email')}
                        value={publisherEmail}
                        required
                        minLength={3}
                        className='pr-5 mb-0 max-w-[190px] text-sm font-normal placeholder:text-sm dark:focus:text-black dark:w-[95%]'
                        onChange={e => setPublisherEmail(e.target.value)}
                      />
                      {publisherEmail !== popupData?.email && (
                        <ConfirmPopup
                          handleConfirm={() =>
                            publisherEmail &&
                            updateUserInfo(popupData.id, {
                              email: publisherEmail,
                            })
                          }
                          text={`${t('confirm.you-sure-wanting', { status: 'emailchange' })} ${publisherName} ${t(
                            'confirm.to'
                          )} ${publisherEmail}?`}
                          nested={true}
                          button={
                            <span className='absolute top-1/2 -translate-y-1/2 right-2 bg-white border-2 border-gray-100 rounded-full p-1'>
                              <RxUpdate
                                cursor='pointer'
                                className='text-green-600 hover:text-green-400 transition ease-in-out duration-500'
                                size={14}
                              />
                            </span>
                          }
                        />
                      )}
                      {popupData?.email.split('@')[1] === 'gmail.com' && (
                        <ConfirmPopup
                          handleConfirm={() =>
                            updateUserInfo(
                              popupData.id,
                              { provider: newProvider }
                              //newProvider
                            )
                          }
                          text={`${t('confirm.you-sure-wanting', { status: 'google' })} ${
                            popupData.provider === 'google' ? t('switch-off') : t('switch-on')
                          } ${t('confirm.google-btn-for')} ${publisherEmail}?`}
                          warning={t('google-access-change', { login: popupData.provider })}
                          nested={true}
                          button={
                            <span className='absolute top-1/2 -translate-y-1/2 -right-2.5 bg-white dark:border border-gray-100 rounded-full p-0.5'>
                              {popupData?.provider === 'google' ? (
                                <FcGoogle cursor='pointer' size={15} />
                              ) : (
                                <AiOutlineGoogle cursor='pointer' size={15} color='lightgray' />
                              )}
                            </span>
                          }
                        />
                      )}
                    </td>
                  </tr>

                  {popupData?.verified && (
                    <tr>
                      <th scope='row' className='p-4 font-medium text-gray-900 whitespace-nowrap max-w-[106px]'>
                        {t('access')}
                      </th>
                      <td className='p-4 text-base'>
                        {popupData.status === 'admin' ? (
                          <span className='font-semibold text-[green]'>{t('full')}</span>
                        ) : (
                          <span className='font-medium text-[grey]'>——</span>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      <div className={cc('actions', rounded('b', roundedSize), 'flex-col gap-2')}>
        {popupData?.verified ? (
          <>
            <div className='flex gap-2'>
              <ConfirmPopup
                handleConfirm={() => updateUserInfo(popupData.id, { status: 'admin' })}
                text={`${t('confirm.you-sure-wanting', { status: 'admin' })}?`}
                nested={true}
                button={
                  <button
                    className='button success hover:bg-green-600 transition ease-in-out duration-250 min-w-[95px]'
                    disabled={popupData.status === 'admin'}
                  >
                    {t('full')}
                  </button>
                }
              />

              <ConfirmPopup
                handleConfirm={() => updateUserInfo(popupData.id, { status: 'user' })}
                text={`${t('confirm.you-sure-wanting', { status: 'user' })}?`}
                btnClass='danger hover:bg-red-700'
                nested={true}
                button={
                  <button
                    disabled={popupData.status === 'user'}
                    className='button danger hover:bg-red-600  transition ease-in-out duration-350 min-w-[95px]'
                  >
                    {t('remove')}
                  </button>
                }
              />
            </div>
          </>
        ) : (
          <ConfirmPopup
            handleConfirm={() => updateUserInfo(popupData.id, { verified: true })}
            text={`${t('confirm.you-sure-wanting', { status: 'grantaccess' })}?`}
            nested={true}
            button={
              <button className='button success hover:bg-green-600 transition ease-in-out duration-250 min-w-[95px]'>
                {t('confirm.message')}
              </button>
            }
          />
        )}
      </div>
      {/* </div> */}
    </Modal>
  )
}

export default UserMainPopup
