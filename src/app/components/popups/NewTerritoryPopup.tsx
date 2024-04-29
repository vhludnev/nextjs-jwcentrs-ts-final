import { useState } from 'react'
import { BsBuildingAdd } from '@/lib/icons'
import Modal from './Modal'
import ConfirmPopup from './ConfirmPopup'
import { cc, rounded } from '@/utils'

const initialValues = { title: '', code: 'FK-', comment: '' }

type TProps = {
  createNewTerritory: (data: { title: string; code: string; comment: string }) => void
  t: (key: string) => string
}

const NewTerritoryPopup = ({ createNewTerritory, t }: TProps) => {
  const [newTerritory, setNewTerritory] = useState(initialValues)

  const handleClose = (close: any) => {
    close()
    //document.body.style.overflow = "unset";
  }

  return (
    <Modal
      trigger={<BsBuildingAdd cursor='pointer' size={26} color='lightslategrey' />}
      className='w-[350px]'
      //modal
      //nested
      closeOnDocumentClick={false}
      lockScroll
    >
      {
        ((close: any) => (
          <>
            {/* <div className="modal-new min-w-[350px]"> */}
            {/* <div className='modal w-[350px] -ml-[175px] -top-[165px]'> */}
            {/* <button
              className="close"
              onClick={() => {
                setNewTerritory(initialValues);
                handleClose(close);
              }}
            >
              &times;
            </button> */}
            <div
              className={cc('header', rounded('t', 'lg'), 'text-center dark:text-white')}
              /* ="header text-center dark:text-white" */
            >
              {t('add-new')}
            </div>
            <div className='content px-0 md:px-2'>
              <div className='relative overflow-x-auto'>
                <table className='w-full text-sm text-left text-gray-600'>
                  <tbody className='dark:filter dark:brightness-90'>
                    <tr className='bg-white border-b'>
                      <th scope='row' className='pl-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
                        {t('code')} *
                      </th>
                      <td className='p-4'>
                        <input
                          type='text'
                          placeholder='Код'
                          value={newTerritory.code}
                          required
                          minLength={3}
                          className='text-sm font-normal placeholder:text-sm dark:focus:text-black'
                          onChange={e =>
                            setNewTerritory({
                              ...newTerritory,
                              code: e.target.value,
                            })
                          }
                        />
                      </td>
                    </tr>

                    <tr className='bg-white border-b'>
                      <th scope='row' className='pl-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
                        {t('title')} *
                      </th>
                      <td className='p-4'>
                        <input
                          type='text'
                          placeholder={t('title')}
                          value={newTerritory.title}
                          required
                          minLength={3}
                          className='text-sm font-normal placeholder:text-sm dark:focus:text-black'
                          onChange={e =>
                            setNewTerritory({
                              ...newTerritory,
                              title: e.target.value,
                            })
                          }
                        />
                      </td>
                    </tr>
                    <tr className='bg-white'>
                      <th scope='row' className='pl-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
                        {t('notes')}
                      </th>
                      <td className='p-4'>
                        <textarea
                          value={newTerritory.comment}
                          className='w-full overflow-hidden text-sm font-normal h-max dark:focus:text-black'
                          onChange={e =>
                            setNewTerritory({
                              ...newTerritory,
                              comment: e.target.value,
                            })
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className={cc('actions', rounded('b', 'lg'))}>
              <ConfirmPopup
                handleConfirm={async () => {
                  await createNewTerritory({
                    title: newTerritory.title.trim(),
                    code: newTerritory.code.trim(),
                    comment: newTerritory.comment.trim(),
                  })
                  setNewTerritory(initialValues)
                  handleClose(close)
                }}
                text={`${t('confirm-add')} ${newTerritory.title} (${newTerritory.code})?`}
                //top='-top-[85px]'
                nested={true}
                button={
                  <button
                    disabled={!newTerritory.code || !newTerritory.title}
                    className='button success hover:bg-green-600'
                  >
                    {t('add')}
                  </button>
                }
              />
              <button
                className='button'
                onClick={() => {
                  setNewTerritory(initialValues)
                  handleClose(close)
                }}
              >
                {t('close')}
              </button>
            </div>
          </>
          /* </div> */
        )) as unknown as React.ReactNode
      }
    </Modal>
  )
}

export default NewTerritoryPopup
