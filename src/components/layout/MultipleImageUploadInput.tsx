import React from 'react'
import { GoStack } from 'react-icons/go';
import { IoCloseOutline, IoCloudDownloadOutline } from 'react-icons/io5';
import ReactImageUploading, { type ImageListType } from 'react-images-uploading'
import { RxUpdate } from 'react-icons/rx';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useWindowSize } from 'react-use';
import { toast } from 'sonner';


interface Props {
    images: ImageListType;
    productId?: string;
    setLoading?: (l: boolean) => void;
    handleChange: (imageList: ImageListType, addUpdateIndex: number[] | undefined) => void;
}

export default function MultipleImageUploadInput({ images, productId, handleChange }: Props) {    
    const { width } = useWindowSize();
    // const [removeImageFn, setRemoveImageFn] = useState<() => void>(() => {});
    // const [selectedIndex, setSelectedIndex] = useState(null);
    
    const maxImageAmount = 3;
    const maxSize = 4 * 1024 * 1024; // 4mb
    
    const handleError = function (errMessage: string) {
        toast.error(errMessage)
    }
    
    // const handleDeleteUploaded = function (onRemoveImage: (i: number) => void, index: number) {
    //     // this is to help us to store a function as state
    //     setRemoveImageFn(() => () => onRemoveImage(index));
    // }
    
    return (
        <React.Fragment>
            <ReactImageUploading
                multiple
                value={images}
                maxNumber={maxImageAmount}
                dataURLKey="data_url"
                acceptType={["jpg", "png", "jpeg"]}
                onChange={handleChange}
                maxFileSize={maxSize}
            >
                {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps, errors
                }) => (
                    <React.Fragment>
                        {errors && (
                            <>
                                {errors?.maxNumber && handleError("Number of selected images exceed max amount")}
                                {errors?.acceptType && handleError("Your selected file type is not allow")}
                                {errors?.maxFileSize && handleError("Selected file size exceed max file size")}
                                {errors?.resolution && handleError("Selected file is not match your desired resolution")}
                            </>
                        )}

                        <div className='form--image'>
                            {(imageList.length > 2 && width > 600) && (
                                <button type='button' style={{ margin: '-3.4rem 0 .6rem auto' }} onClick={onImageRemoveAll}>Remove All Images <IoCloseOutline /></button>
                            )}

                            {imageList?.length < 1 && (
                                <div onClick={onImageUpload} className={`form--img-box ${isDragging ? 'dropping' : ''}`} {...dragProps}>
                                    {isDragging ? (
                                        <span className='img--container'>
                                            <GoStack />
                                            <h3>Drop It</h3>
                                        </span>
                                    ) : (
                                        <span className='img--container' {...dragProps}>
                                            <IoCloudDownloadOutline style={{ color: '#ff7a49' }} />
                                            <h3>Click to upload or Drag n drop Image</h3>
                                            <p>Recommeded formats: PNG, JPEG, and JPG <br />Max Size 4Mb</p>
                                        </span>
                                    )}
                                </div>
                            )}

                            {imageList.length > 0 && (
                                <div className='img--grid'>
                                    {imageList?.map((image, index) => (
                                        <div key={index} className="img--item">
                                            <img src={image?.data_url} />
                                            <div className="img--item-btns">
                                                <button onClick={() => onImageUpdate(index)}><RxUpdate /> </button>
                                                <button onClick={() => {
                                                    onImageRemove(index)
                                                }}><RiDeleteBin6Line /></button>
                                            </div>
                                        </div>
                                    ))}

                                    {imageList.length < maxImageAmount && (
                                        <div onClick={onImageUpload} className={`form--img-box ${isDragging ? 'dropping' : ''}`} {...dragProps}>
                                            {isDragging ? (
                                                <span className='img--container'>
                                                    <GoStack />
                                                    <h3>Drop It</h3>
                                                </span>
                                            ) : (
                                                <span className='img--container' {...dragProps}>
                                                    <IoCloudDownloadOutline />
                                                    <p>Click or drop more!</p>
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {(imageList.length > 2 && width < 600 && !productId) && (
                                <button type='button' style={{ marginTop: '1rem' }} onClick={onImageRemoveAll}>Remove All Images <IoCloseOutline /></button>
                            )}
                        </div>
                    </React.Fragment>
                )}
            </ReactImageUploading>
        </React.Fragment>
    )
}