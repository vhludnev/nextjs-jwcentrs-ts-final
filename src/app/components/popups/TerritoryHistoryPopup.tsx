import type { TTerritory } from "@/types/territory";
import Modal from "./Modal";
import { format } from "date-fns";
//import moment from "moment";

const TerritoryHistoryPopup = ({ data }: { data: TTerritory }) => {
  //   const handleClose = (close: any) => {
  //     close();
  //     //document.body.style.overflow = "unset";
  //   };
  return (
    <>
      {data.history.length ? (
        <Modal
          trigger={<div className="cursor-pointer">{data.code}</div>}
          //modal
          lockScroll
          closeOnDocumentClick={false}
          className="w-auto"
        >
          {
            ((close: any) => (
              <>
                {/* <div className="modal-new w-[350px] md:w-auto"> */}
                {/* <div className='modal w-[350px] md:w-auto -ml-[175px] -top-[165px]'> */}
                {/* <button className="close" onClick={() => handleClose(close)}>
                  &times;
                </button> */}
                <div className="header text-center long_text dark:text-gray-100">
                  {data.code}: {data.title}
                </div>
                <div className="content px-0 md:px-2">
                  <div className="relative px-2 overflow-x-hidden max-h-[300px] md:max-h-[50vh] w-[350px]">
                    <table className="w-full text-sm text-left text-gray-600 table-fixed">
                      <thead className="text-teal border">
                        <tr className="bg-gray-200 table-row border-grey-light border mb-4 md:mb-0 text-left md:text-center">
                          <th className="p-3 h-[49px] w-[28%]">Выдана</th>
                          <th className="p-3 h-[49px] w-[28%]">Принята</th>
                          <th className="p-3 h-[49px] w-[44%] long_text">
                            Возвещатель
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {data.given && (
                          <tr className="table-row mb-4 md:mb-0 dark:text-gray-100">
                            <td className="p-3 h-[49px] border-grey-light border md:text-center">
                              {format(data.given, "dd.MM.yyyy")}
                            </td>
                            <td className="p-3 h-[49px] border-grey-light border md:text-center"></td>
                            <td className="p-3 h-[49px] border-grey-light border md:text-center long_text">
                              {data.publisher}
                            </td>
                          </tr>
                        )}
                        {data.history
                          .sort(
                            (a, b) =>
                              new Date(b.given).valueOf() -
                              new Date(a.given).valueOf()
                          )
                          .map(({ given, returned, publisher }, idx) => (
                            <tr
                              className="table-row mb-4 md:mb-0 dark:text-gray-100"
                              key={idx}
                            >
                              <td className="p-3 h-[49px] border-grey-light border md:text-center">
                                {format(given, "dd.MM.yyyy")}
                              </td>
                              <td className="p-3 h-[49px] border-grey-light border md:text-center">
                                {format(returned, "dd.MM.yyyy")}
                              </td>
                              <td className="p-3 h-[49px] border-grey-light border md:text-center long_text">
                                {publisher}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="actions">
                  <button className="button" onClick={close}>
                    Закрыть
                  </button>
                </div>
                {/* </div> */}
              </>
            )) as unknown as React.ReactNode
          }
        </Modal>
      ) : (
        <>{data.code}</>
      )}
    </>
  );
};

export default TerritoryHistoryPopup;
