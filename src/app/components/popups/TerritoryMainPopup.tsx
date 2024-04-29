import { useCallback, useEffect, useRef, useState } from "react";
//import moment from "moment";
import { BsTrash, BsCardImage } from "@/lib/icons";
import Modal from "./Modal";
import ConfirmPopup from "./ConfirmPopup";
import TerritoryInfoCardPopup from "./TerritoryInfoCardPopup";
import type { TTerritory } from "@/types/territory";
import type { TUser } from "@/types/user";
import { cc, rounded } from "@/utils";
import { format } from "date-fns";

type TTerritoryMainPopup = {
  popupData: TTerritory | null;
  isOpen: boolean;
  users?: Pick<TUser, "name" | "id">[];
  closeModal: () => void;
  giveTerritory: (data: any) => void;
  returnTerritory: (id: string) => void;
  updateTerritory: (data: any) => void;
  deleteTerritory: (id: string) => void;
};

const TerritoryMainPopup = ({
  popupData,
  isOpen,
  users,
  closeModal,
  giveTerritory,
  returnTerritory,
  updateTerritory,
  deleteTerritory,
}: TTerritoryMainPopup) => {
  const [publisherInfo, setPublisherInfo] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [given, setGiven] = useState<Date | undefined>(undefined);
  const [returned, setReturned] = useState<Date | undefined>(undefined);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const commentChanged = popupData?.comment !== comment;
  const givenChanged = popupData?.given !== given;

  useEffect(() => {
    if (textAreaRef?.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef?.current.scrollHeight + "px";
    }
  }, [comment, textAreaRef?.current]);

  useEffect(() => {
    if (popupData?.comment) {
      setComment(popupData.comment);
    }
    if (popupData?.given) {
      setGiven(popupData.given);
    }
    return () => {
      setGiven(undefined);
      setReturned(undefined);
      setComment("");
      setPublisherInfo(null);
    };
  }, [popupData]);

  const handleNameSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const dataset = e.target.options[e.target.selectedIndex].dataset;
      const value = e.target.value;

      return setPublisherInfo({
        name: value,
        id: dataset.id!,
      });
    },
    []
  );

  if (!popupData) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="w-[350px] fullheight"
        /* nested modal */ lockScroll
      >
        {/* <div className="modal w-[350px] fullheight"> */}
        {/* <div className='modal w-[350px] -ml-[175px] -top-[290px] fullheight'> */}
        <ConfirmPopup
          handleConfirm={() => {
            deleteTerritory(popupData.id);
            closeModal();
          }}
          text="Вы уверены, что хотели бы удалить эту территорию?"
          //top='-top-[100px]'
          btnClass="danger hover:bg-red-700"
          nested={true}
          button={
            <button className="absolute left-5 top-[1.1rem] outline-none">
              <BsTrash
                size={20}
                className="text-gray-400 hover:text-red-700 transition ease-in-out duration-250"
              />
            </button>
          }
        />

        {/*  <button className="close" onClick={closeModal}>
          &times;
        </button> */}
        {popupData && (
          <>
            <div
              className={cc(
                "header",
                rounded("t", "lg"),
                "text-center dark:text-gray-100"
              )}
            >
              {popupData.title}
            </div>
            <div className="content">
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <tbody className="dark:filter dark:brightness-90">
                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        Код
                      </th>
                      <td className="p-4 flex justify-between items-center">
                        {popupData.code}
                        <BsCardImage
                          size={26}
                          color="rosybrown"
                          cursor="pointer"
                          onClick={() => setOpen(true)}
                        />
                      </td>
                    </tr>
                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        Выдана
                      </th>
                      <td className="p-4">
                        {popupData?.given ? (
                          <input
                            type="date"
                            defaultValue={given && format(given, "yyyy-MM-dd")}
                            max={format(new Date(), "yyyy-MM-dd")}
                            onChange={(e) => setGiven(new Date(e.target.value))}
                            className="dark:focus:text-gray-800"
                          />
                        ) : (
                          "——"
                        )}
                      </td>
                    </tr>

                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        Возвещатель
                      </th>
                      <td
                        className={`py-3 ${
                          popupData.available ? "pl-4 pr-0" : "px-4"
                        }`}
                      >
                        {!popupData.available ? (
                          popupData.publisher
                        ) : (
                          <select
                            className={`${
                              publisherInfo?.name
                                ? "bg-white dark:bg-white"
                                : "bg-primary-white dark:bg-[#999999] rounded"
                            } py-1 text-sm font-normal dark:focus:text-gray-800 w-full dark:w-[90%] long_text outline-none`}
                            value={publisherInfo?.name}
                            id={publisherInfo?.id}
                            onChange={handleNameSelect}
                          >
                            <option value=""></option>
                            <option value="Группа">Группа</option>
                            {users?.map((u) => (
                              <option key={u.id} value={u.name} data-id={u.id}>
                                {u.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        Возвращена
                      </th>
                      <td className="p-4">
                        {!popupData?.given && !popupData?.returned ? (
                          <input
                            type="date"
                            defaultValue={
                              returned && format(returned, "yyyy-MM-dd")
                            }
                            max={format(new Date(), "yyyy-MM-dd")}
                            onChange={(e) =>
                              setReturned(new Date(e.target.value))
                            }
                            className="dark:focus:text-gray-800"
                          />
                        ) : popupData?.returned ? (
                          format(popupData.returned, "dd.MM.yyyy")
                        ) : (
                          "——"
                        )}
                      </td>
                    </tr>
                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        Заметки
                      </th>
                      <td className="pl-4 pr-0">
                        <textarea
                          rows={1}
                          value={comment}
                          className="w-full overflow-hidden text-sm font-normal dark:focus:text-gray-800 dark:w-[90%]"
                          ref={textAreaRef}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        В наличии
                      </th>
                      <td className="p-4 font-medium text-base">
                        {popupData.available ? (
                          <span className="text-[green]">Да</span>
                        ) : (
                          <span className="text-[red]">Нет</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {popupData.user && (
                  <span className="block text-end text-sm">
                    (
                    <em className="px-0.5">
                      {popupData.given ? "выдал: " : "принял: "}
                      {popupData.user.name}
                    </em>
                    )
                  </span>
                )}
              </div>
            </div>
          </>
        )}
        <div className={cc("actions", rounded("b", "lg"))}>
          {popupData && (
            <>
              <ConfirmPopup
                handleConfirm={() => {
                  closeModal();
                  return popupData?.available
                    ? giveTerritory({
                        id: popupData.id,
                        name: publisherInfo?.name,
                        publisherId: publisherInfo?.id,
                      })
                    : returnTerritory(popupData.id);
                }}
                text={
                  popupData?.available
                    ? `Вы уверены, что хотели бы выдать эту территорию возвещателю: "${publisherInfo?.name}"?`
                    : "Вы уверены, что хотели бы принять эту территорию?"
                }
                //top='-top-[100px]'
                nested
                button={
                  <button
                    className="button success hover:bg-green-600 transition ease-in-out duration-250 min-w-[76px]"
                    disabled={popupData?.available && !publisherInfo?.name}
                  >
                    {popupData.available ? "Выдать" : "Принять"}
                  </button>
                }
              />

              <ConfirmPopup
                handleConfirm={() => {
                  updateTerritory({
                    id: popupData.id,
                    comment: comment.trim(),
                    given: given && new Date(given),
                    returned: returned && new Date(returned),
                  });

                  closeModal();
                }}
                text={`Вы уверены, что хотели бы обновить ${
                  given || returned ? "данные территории" : "заметки"
                }?`}
                //top='-top-[100px]'
                nested
                button={
                  <button
                    className="button info hover:bg-blue-500 transition ease-in-out duration-250 min-w-[76px]"
                    disabled={
                      given
                        ? !commentChanged && !givenChanged
                        : !popupData.given && !popupData.returned
                        ? !returned
                        : !commentChanged || comment == popupData.comment
                    }
                  >
                    Изменить
                  </button>
                }
              />
            </>
          )}
          <button
            className="button hover:text-[#6992ca] hover:border-[#6992ca] transition ease-in-out duration-250 min-w-[76px]"
            onClick={closeModal}
          >
            Закрыть
          </button>
        </div>
        {/* </div> */}
      </Modal>
      {/* {open && ( */}
      <TerritoryInfoCardPopup
        isOpen={open}
        editable
        id={popupData.id}
        closeModal={() => setOpen(false)}
      />
      {/*  )} */}
    </>
  );
};

export default TerritoryMainPopup;
