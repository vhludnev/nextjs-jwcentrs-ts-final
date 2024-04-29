import Image from "next/image";
import { useRef, useEffect } from "react";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import {
  MdOutlineMapsHomeWork,
  AiOutlineCloudUpload,
  TbZoomReset,
  BiZoomIn,
  BiZoomOut,
} from "@/lib/icons";
import Modal from "./Modal";
import Spinner from "../Spinner";
import { handleAddImage, handleDeleteImage } from "@/lib/cloudinary";
import { useTerritoryInfoCard } from "@/lib/territories";
import {
  cc,
  /* convertUrlToBase64, convertFileToBase64, */ placeholder,
  rounded,
} from "@/utils";
//import ConfirmPopup from './ConfirmPopup'

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="flex gap-2 md:gap-3 absolute left-2 top-1 md:top-2 z-50 opacity-60 bg-primary-white p-1 rounded-md">
      <BiZoomIn
        cursor="pointer"
        className="text-xl md:text-2xl text-gray-600"
        onClick={() => zoomIn()}
      />
      <BiZoomOut
        cursor="pointer"
        className="text-xl md:text-2xl text-gray-600"
        onClick={() => zoomOut()}
      />
      <TbZoomReset
        cursor="pointer"
        className="text-xl md:text-2xl text-gray-600"
        onClick={() => resetTransform()}
      />
    </div>
  );
};

type TTerritoryInfoCardPopup = {
  id: string;
  isOpen: boolean;
  //nested?: boolean;
  closeModal: () => void;
  editable: boolean;
  lockScroll?: boolean;
};

const TerritoryInfoCardPopup = ({
  id,
  isOpen,
  //nested = true,
  closeModal,
  editable = false,
  lockScroll = false,
}: TTerritoryInfoCardPopup) => {
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    loadingTerrInfoCard,
    terrInfoCardData,
    handleUpdateTerritoryAddress,
    address,
    setAddress,
    handleUpdateTerritoryImage,
    //handleReturnMyTerritory,
    imagePreview,
  } = useTerritoryInfoCard(id, isOpen);

  useEffect(() => {
    if (textAreaRef?.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef?.current.scrollHeight + "px";
    }
  }, [address, textAreaRef?.current]);

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const submitImage = async (image: any) => {
    if (!image) return;

    // Convert to base64 data url:
    // const base64Image = await convertFileToBase64(image)

    const imageUrl = await handleAddImage(image);

    if (imagePreview) {
      const publicId =
        //@ts-expect-error
        "territories" + "/" + imagePreview.split("/").pop().split(".")[0];

      await handleDeleteImage(publicId);
    }

    handleUpdateTerritoryImage({ id, imageUrl });
  };

  const resizeFile = (file: File) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1200,
        1000,
        "webp",
        90,
        0,
        (uri) => {
          resolve(uri);
        },
        "file"
      );
    });

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget as HTMLInputElement;
    const file = target.files?.[0];

    const fileMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/bmp",
      "image/webp",
    ];

    if (!file) return;

    const mimetype = fileMimeTypes.includes(file.type);
    const fileSize = file.size < 2097152; // 2 Mb

    if (!mimetype) {
      return toast.error("Только JPG/JPEG/PNG/BMP/WEBP!");
    }

    if (!fileSize) {
      return toast.error("Размер не более 2 Мб!");
    }

    const newImage = await resizeFile(file);

    await submitImage(newImage);
  };

  return (
    <Modal
      //nested={nested}
      isOpen={isOpen}
      onClose={closeModal}
      className="popupwidth md:min-h-[500px] previewcard"
      lockScroll={lockScroll}
      closeOnDocumentClick={false}
    >
      {/* <div className="modal-new w-[360px] md:w-auto md:min-h-[500px] rounded-xl border border-gray-300 drop-shadow-lg previewcard"> */}
      {/* <div className='modal w-[360px] md:w-auto -ml-[180px] -top-[290px] md:-top-[345px] md:-ml-[310px] md:min-h-[500px] rounded-xl border border-gray-300 drop-shadow-lg previewcard'> */}
      {/* {!editable && (
          <ConfirmPopup
            handleConfirm={() => {
              handleReturnMyTerritory(id)
              closeModal()
              return
            }}
            text='Вы уверены, что хотели бы вернуть этот участок?'
            top='-top-[100px]'
            btnClass='secondary hover:bg-orange-500 transition ease-in-out duration-250'
            nested={true}
            button={
              <button className='absolute left-5 top-[1.1rem] outline-none'>
                <Image src='icons/back.svg' width={26} height={26} alt='back button' />
              </button>
            }
          />
        )} */}
      {/*  <button className="close" onClick={closeModal}>
          &times;
        </button> */}
      
      <div
        className={cc(
          "content",
          rounded("b", "lg"),
          "px-0 md:px-2 py-2 bg-primary-white dark:bg-[#454b4d] -mt-0.5"
        )}
      >
        <div className="text-base relative pb-7 md:overflow-auto w-full md:min-w-[600px] flex flex-col items-center">
          <div
            className={cc(
              "header px-10 pt-4 pb-0 leading-tight line-clamp-2",
              rounded("t", "lg"),
              "bg-primary-white h-14 dark:bg-[#454b4d] text-center leading-8 min-h-14"
            )}
          >
            {terrInfoCardData && `${terrInfoCardData.code} - ${terrInfoCardData.title}`}
          </div>
          {(!terrInfoCardData || loadingTerrInfoCard) && <Spinner />}
          <div className="w-full relative mb-6">
            {imagePreview && !loadingTerrInfoCard ? (
              <div className="flex justify-center items-center">
              {/* <div className="flex justify-center items-center h-[200px] md:h-[400px]"> */}
                <TransformWrapper wheel={{ step: 0.3, smoothStep: 0.003 }} maxScale={16} centerZoomedOut>
                  <Controls />
                  <TransformComponent wrapperStyle={{ overflow: "visible" }}>
                    <Image
                      //className="h-[200px] md:h-[400px] rounded object-contain"
                      src={imagePreview}
                      //width={1200}
                      //height={1000}
                      alt={terrInfoCardData?.code ?? ""}
                      placeholder={placeholder}
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="w-full h-[200px] md:h-[400px] rounded"
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>
            ) : !imagePreview && !loadingTerrInfoCard ? (
              <div className="w-full text-center">
                <MdOutlineMapsHomeWork
                  color="#6992ca"
                  className="h-[200px] md:h-[400px] rounded inline-block w-full"
                  size={120}
                />
              </div>
            ) : (
              <div className="h-[193px] md:h-[393px] inline-block">
                {/* <Spinner /> */}
              </div>
            )}

            {editable && (
              <AiOutlineCloudUpload
                color="#6992ca"
                size={35}
                className="cursor-pointer absolute right-2 top-1 md:top-0 rounded-full filter drop-shadow-lg bg-primary-white p-1 hover:text-green-600 transition ease-in-out duration-250"
                onClick={handleClick}
              />
            )}
          </div>

          {editable ? (
            <>
              <form>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onInputChange}
                  ref={hiddenFileInput}
                  className="hidden"
                />
              </form>
              <div className="w-[90%] text-center">
                <span>Местонахождение:</span>
                <br />
                <textarea
                  className="text-base dark:text-gray-100 text-center font-semibold placeholder:italic placeholder:font-normal placeholder:text-[#6992CA] dark:placeholder:text-blue-200"
                  value={address}
                  ref={textAreaRef}
                  rows={1}
                  placeholder="Введите местонахождение"
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={() =>
                    address && handleUpdateTerritoryAddress({ id, address })
                  }
                />
              </div>
            </>
          ) : (
            <div className="dark:text-gray-100 px-2 w-full text-center">
              <span>Местонахождение:</span>
              <br />
              <b className="whitespace-break-spaces">
                {address ?? "Нет информации"}
              </b>
            </div>
          )}
          {terrInfoCardData?.comment && (
            <div className="dark:text-gray-100 pt-4 px-2 w-full text-center">
              <span>Заметки:</span>
              <br />
              <b className="whitespace-break-spaces">
                {terrInfoCardData.comment}
              </b>
            </div>
          )}
        </div>
      </div>
      {/* </div> */}
    </Modal>
  );
};

export default TerritoryInfoCardPopup;
