import React, { useEffect, useRef, memo, useState } from 'react'
import { injectIntl } from 'react-intl'
import ReactQuill from 'react-quill'
import { Form, Input, Label, Button } from 'reactstrap'
import { useForm } from 'react-hook-form'
import 'react-quill/dist/quill.snow.css'
import './index.scss'
import { ChevronLeft, Plus } from 'react-feather'
import SystemConfigurationsService from '../../../services/SystemConfigurationsService';
import { toast } from 'react-toastify'
import { convertFileToBase64 } from '../../../helper/common'
import addKeyLocalStorage from '../../../helper/localStorage'
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import { BANNER_TYPE } from '../../../constants/app'

const EDITOR_FORMAT = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video'
]
const EDITOR_CONFIG = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false
  }
}
const ASPECT_RATIO_X = 1976;
const ASPECT_RATIO_Y = 1165;
const DefaultFilter = {
  filter: {
  },
  skip: 0,
  limit: 20
}
function AddBanner({ intl }) {
  const location = useLocation();
  const history = useHistory()
  const [updatePost, setUpdatePost] = useState('')
  const [file, setFile] = useState()
  const inputFileRef = useRef(null)
  const [isDragEnter, setIsDragEnter] = useState(false)
  const [blob, setBlob] = useState('')
  const [bannerDetail, setBannerDetail] = useState(location?.state?.BannerDetail || '')
  const [updateBanner, setUpdateBanner] = useState(false)
  const [postData, setPostData] = useState({
    bannerName: "",
    bannerNote: "",
    bannerImageUrl: "",
    bannerSection:"",
  })
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })

  const handleOnchange = (name, value) => {
    setPostData({
      ...postData,
      [name]: value
    })
  }
  const handlePostBanner = async (file) => {
    const dataUrl = await convertFileToBase64(file)
    const arrayData = file?.name.split('.')
    const format = arrayData[arrayData?.length - 1]

    const newItem = {
      imageData: dataUrl.replace('data:' + file?.type + ';base64,', ''),
      imageFormat: format
    }
    return SystemConfigurationsService.handleUpload(newItem)
  }
  const handleOnSubmit = async (e) => {
    e.preventDefault()
    if(!updateBanner){
      if(!file){
        toast.error(intl.formatMessage({ id: 'input-image' }))
      }else{
        let fileImage = await handlePostBanner(file)
        let dataUpload = {
          bannerName: postData.bannerName,
          bannerNote: postData.bannerNote,
          bannerImageUrl: fileImage.data,
          bannerSection: postData.bannerSection,
        }
        SystemConfigurationsService.AddAdvertisingBanner(dataUpload).then((res) => {
          if (res) {
            const { statusCode, data, message } = res
            if (statusCode === 200) {
              setTimeout(() => {
                history.push('/pages/advertising-banner')                   
              }, 1000);
              toast.success(intl.formatMessage({ id: 'upload-post-success' }))
            } else {
              toast.warn(intl.formatMessage({ id: 'actionFailed' }))
            }
          }
        })
        
      }
    }else{
      if (file) {
        let fileImage = await handlePostBanner(file)
          let dataUpload = {
            id: postData.systemPromoBannersId,
            data : {
              bannerName: postData.bannerName,
              bannerNote: postData.bannerNote,
              bannerImageUrl: fileImage.data,
              bannerSection: postData.bannerSection,
            }
          }
          SystemConfigurationsService.handleUpdateBanner(dataUpload).then((res) => {
            if (res) {
              const { statusCode, data, message } = res
              if (statusCode === 200) {
                setTimeout(() => {
                  history.push('/pages/advertising-banner')                   
                }, 1000);
                toast.success(intl.formatMessage({ id: 'upload-post-success' }))
              } else {
                toast.warn(intl.formatMessage({ id: 'actionFailed' }))
              }
            }
          })
      } else {
        let dataUpload = {
          id: postData.systemPromoBannersId,
          data : {
            bannerName: postData.bannerName,
            bannerNote: postData.bannerNote,
            bannerSection: postData.bannerSection,
          }
        }
        SystemConfigurationsService.handleUpdateBanner(dataUpload).then((res) => {
          if (res) {
            const { statusCode, data, message } = res
            if (statusCode === 200) {
              setTimeout(() => {
                history.push('/pages/advertising-banner')                   
              }, 1000);
              toast.success(intl.formatMessage({ id: 'update-post-success' }))
            } else {
              toast.warn(intl.formatMessage({ id: 'actionFailed' }))
            }
          }
        })
      }
    }
  }

  useEffect(() => {
    if (file) {
      setBlob(URL.createObjectURL(file))
    }
    
    return () => {
      URL.revokeObjectURL(blob)
    }
  }, [file])

  const onFileChange = (e) => {
    const newFile = e.target.files[0]
    if (newFile) {
      if (!newFile.type.match('image.*')) {

      } else {
        inputFileRef.current && (inputFileRef.current.value = null)
        setFile(newFile)
      }
    }
  }

  const onDragLeave = () => {
    setIsDragEnter(false)
  }

  const onDragEnter = () => {
    setIsDragEnter(true)
  }

  const onDrop = (e) => {
    setIsDragEnter(false)
    const newFile = e.dataTransfer.files?.[0]
    if (newFile) {
      if (!newFile.type.match('image.*')) {
        //File không đúng định dạng
      } else {
        setFile(newFile)
      }
    }
  }
  const handleOnUpdate = async (e) => {
    e.preventDefault()
      
  }

  
  
  useEffect(() => {
    if(bannerDetail){
      setPostData(bannerDetail)
      setBlob(bannerDetail.bannerImageUrl)
      setUpdateBanner(true)
    }
    const handler = (e) => {
      e.preventDefault() // Disable open image in new tab
    }

    window.addEventListener('dragover', handler)
    window.addEventListener('drop', handler)

    return () => {
      window.removeEventListener('dragover', handler)
      window.removeEventListener('drop', handler)
    }
  }, [])

  return (
    <>
      <div className="pt-1 pl-1" style={{cursor:'pointer'}} onClick={history.goBack}>
        <ChevronLeft />
        {intl.formatMessage({ id: "goBack" })}
      </div>
      <div className='p-2'>
        <div>
          <h3>{!updateBanner ?  intl.formatMessage({ id: 'post' }) : intl.formatMessage({ id: 'update' })}</h3>
        </div>
        <div>
          <Form className="w-75" 
              onSubmit = {handleOnSubmit}
              id ="form-add-news">
            <Label>
              {intl.formatMessage({ id: 'name' })} <span className="text-danger">*</span>
            </Label>
            <Input
              id="bannerName"
              name="bannerName"
              required
              placeholder={intl.formatMessage({ id: 'fill-title' })}
              innerRef={register({ required: true })}
              invalid={errors.documentCode && true}
              value={postData?.bannerName || ''}
              onChange={(e) => {
                const { name, value } = e.target
                handleOnchange(name, value)
              }}
            />
            <Label className="mt-2">
              {intl.formatMessage({ id: 'note' })} <span className="text-danger">*</span>
            </Label>
            <ReactQuill
              theme="snow"
              required
              height="100px"
              name="bannerNote"
              placeholder={intl.formatMessage({ id: 'fill-title' })}
              modules={EDITOR_CONFIG}
              formats={EDITOR_FORMAT}
              value={postData?.bannerNote || ''}
              onChange={(value) =>
                setPostData({
                  ...postData,
                  bannerNote: value
                })
              }
            />
            <Label className="mt-2">
              {intl.formatMessage({ id: 'classify' })} <span className="text-danger">*</span>
            </Label>
            <Input
              id="bannerSection"
              name="bannerSection"
              type="select"
              invalid={errors.bannerSection && true}
              value={postData?.bannerSection || ''}
              onChange={(e) => {
                const { name, value } = e.target
                handleOnchange(name, value)
              }}>
              <option>Chọn danh mục</option>
              {Object.values(BANNER_TYPE)?.map((item) => {
                    return <option value={item.value}>{item.title}</option>
                })}
            </Input>
            
            <Label className="mt-2">
              {intl.formatMessage({ id: 'image' })} <span className="text-danger">*</span>
              <div>({ASPECT_RATIO_X}px x {ASPECT_RATIO_Y}px)</div>
            </Label>
            <div
              onDrop={onDrop}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onClick={() => inputFileRef.current && inputFileRef.current.click()}
              className={`drag-drop ${
                blob ? "before-bg-file" : ""
              }`}
              style={{
                "--bg": `url(${blob})`
              }}>
              <input ref={inputFileRef} onChange={onFileChange} type="file" accept="image/*" hidden />
              <p className="text-center my-3 pointer-events-none">
                <Plus size={50} className="icon" />
              </p>
              <p className="text-center text-[#F05123] pointer-events-none">
                {isDragEnter ? 'Thả ảnh vào đây' : 'Kéo thả ảnh vào đây, hoặc bấm để chọn ảnh'}
              </p>
            </div>
            <div className="d-flex mb-0 justify-content-center mt-2">
              {!updateBanner ? (
                <Button className="mr-1" color="primary" type="submit" 
                // onClick={handleOnSubmit}
                >
                  {intl.formatMessage({ id: 'post' })}
                </Button>
              ) : (
                <Button className="mr-1" color="primary" type="submit" 
                // onClick={handleOnUpdate}
                >
                  {intl.formatMessage({ id: 'update' })}
                </Button>
              )}
            </div>
          </Form>
        </div>
      </div>
    </>
  )
}
export default injectIntl(memo(AddBanner))
