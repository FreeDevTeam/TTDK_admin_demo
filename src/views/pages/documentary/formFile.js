import React, { Fragment, useState, memo, useEffect } from 'react'
import { ChevronLeft } from 'react-feather'
import { injectIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { Card, Input, Label, Row, Col, Button, FormGroup, Form, CardHeader, CardBody, CardText } from 'reactstrap'
import { useForm } from 'react-hook-form'
import ReactQuill from 'react-quill';
import Service from '../../../services/request'
import { toast } from 'react-toastify'
import Flatpickr from 'react-flatpickr'
import 'react-quill/dist/quill.snow.css';
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import FileUploadDrag from './FileUploadDrag'
import { convertFileToBase64 } from '../../../helper/common'
import DocumentService from '../../../services/documentService'
import StationDocumentFileSercive from '../../../services/StationDocumentFileSercive'
import SpinnerTextAlignment from '../../components/spinners/SpinnerTextAlignment'

const EDITOR_FORMAT = ['bold', 'italic', 'underline', 'strike', 'link']
const EDITOR_CONFIG = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike', 'link'],
  ]
}

const fileOptions = [
  {value : 1, label : 'OFFICIAL_LETTER'},
  {value : 2, label : 'ESTABLISHMENT_APPOINTMENT_DOCUMENT'},
  {value : 3, label : 'PERIODIC_INSPECTION_DOCUMENT'},
  {value : 4, label : 'TASK_ASSIGNMENT_FORM'},
]

const FormDocumentary = ({ intl }) => {
  const location = useLocation()
  const history = useHistory()
  const { stationDocumentId } = location.state
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})
  const [dataFiles, setDataFiles] = useState([])
  const [content, setContent] = useState('')
  const [date, setDate] = useState('')
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [expireDay, setExpireDay] = useState('')

  const newArr = dataFiles?.map(item =>{
    return{
      documentFileName : item.name,
      documentFileUrl : item.url,
      documentFileSize : item.size
    }
  })

  async function handleUpload(file) {
    const dataUrl = await convertFileToBase64(file)
    const arrayData = file?.name.split('.')
    const format = arrayData[arrayData.length - 1]

    const newItem = {
      imageData: dataUrl.replace('data:' + file?.type + ';base64,', ''),
      imageFormat: format
    }
    return DocumentService.handleUpload(newItem)
  }

  const getDetailById = (stationDocumentId) => {
    setIsLoadingFile(true);
    DocumentService.getDetailById({
      id: stationDocumentId
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setUserData(data)
          setDate(data.documentPublishedDay)
          setExpireDay(data.documentExpireDay)
          setIsLoadingFile(false);
          setContent(data.documentContent)
        }
      }
    })
  }

  function updateStationDocumentById(data) {
    DocumentService.handleUpdate(data).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          // getDetailById(stationDocumentId)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value
    })
    // setContent(value)
  }

  useEffect(() => {
    getDetailById(stationDocumentId)
  }, [])

  async function insertStationDocumentFile(data) {
    return await StationDocumentFileSercive.insert(data)
  }

  function deleteStationDocumentFile(data) {
    setIsLoadingFile(true)
    StationDocumentFileSercive.deleteById(data).then(async (res) => {
      if (res) {
        const { isSuccess } = res
        if (isSuccess) {
          // toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'delete' }) }))
        } else {
          // toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'delete' }) }))
        }
        await getDetailById(stationDocumentId);
      }
    })
  }

  function updateStationDocumentFile(data) {
    setIsLoadingFile(true)
    StationDocumentFileSercive.updateById(data).then(async (res) => {
      if (res) {
        const { isSuccess } = res
        if (isSuccess) {
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
        await getDetailById(stationDocumentId);
      }
    })
  }
  return (
    <Fragment>
      <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
        <ChevronLeft />
        {intl.formatMessage({ id: 'goBack' })}
      </div>
          <Card >
            <CardHeader className="justify-content-center flex-column">
              <CardText className="mt-2 h2">{intl.formatMessage({ id: 'detail-file' })}</CardText>
            </CardHeader>
            <hr color="#808080" />
            <CardBody className="justify-content-center flex-column">
              <Form
                onSubmit={handleSubmit(async (data) => {
                  updateStationDocumentById({
                    id: stationDocumentId,
                    data: {
                      ...data,
                      documentPublishedDay: date,
                      documentExpireDay: expireDay,
                      documentContent: content,
                      documentFileUrlList : newArr
                    }
                  })
                })}>
                <Row>
                  <Col sm='6' xs='12'>
                    <Col>
                      <Label for="documentCode" className='text-small'>
                        {intl.formatMessage({ id: "fileCode" })} <span style={{color:"red"}}>*</span>
                      </Label>
                      <Input
                        id="documentCode"
                        name="documentCode"
                        innerRef={register({ required: true })}
                        invalid={errors.documentCode && true}
                        value={userData.documentCode || ""}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          handleOnchange(name, value);
                        }}
                        className='col-sm-12 mb-2 col-xs-12'
                      />
                    </Col>

                    <Col>
                      <Label for="documentTitle" className='text-small'>
                        {intl.formatMessage({ id: "fileTitle" })} <span style={{color:"red"}}>*</span>
                      </Label>
                      <Input
                        id="documentTitle"
                        name="documentTitle"
                        innerRef={register({ required: true })}
                        invalid={errors.documentTitle && true}
                        value={userData.documentTitle || ""}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          handleOnchange(name, value);
                        }}
                        className='col-sm-12 mb-2 col-xs-12'
                      />
                    </Col>
                    <Col>
                  <Label for="documentTitle">
                    {intl.formatMessage({ id: "file_type" })} <span style={{color:"red"}}>*</span>
                  </Label>
                  <Input
                        type="select"
                        className='col-sm-12 mb-2 col-xs-12'
                        id="documentCategory"
                        name="documentCategory"
                        bsSize="md"
                        innerRef={register({ required: true })}
                        invalid={errors.documentCategory && true}
                        value={userData.documentCategory || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}>
                        <option value={''}>{intl.formatMessage({ id: 'chose' })}</option>
                        {fileOptions.map((item) => {
                          return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
                        })}
                      </Input>
                </Col>
                    <Col>
                      <Row>
                        <Col>
                          <Label for="documentPublishedDay" className='text-small'>
                            {intl.formatMessage({ id: "filePublishedDay" })} <span style={{color:"red"}}>*</span>
                          </Label>
                          <Flatpickr
                            id='documentPublishedDay'
                            name="documentPublishedDay"
                            value={userData.documentPublishedDay || ""}
                            options={{ mode: 'single', dateFormat: 'd/m/Y' }}
                            placeholder={intl.formatMessage({ id: "release-date" })}
                            className='form-control col-sm-12 col-xs-12'
                            onChange={(date) => {
                              const newDateObj = date.toString()
                              const newDate = moment(newDateObj).format("DD/MM/YYYY")
                              setDate(newDate);
                            }}
                          />
                        </Col>
                        <Col>
                          <Label for="documentExpireDay" className='text-small'>
                            {intl.formatMessage({ id: "fileExpireDay" })} <span style={{color:"red"}}>*</span>
                          </Label>
                          <Flatpickr
                            id='documentExpireDay'
                            name="documentExpireDay"
                            value={userData.documentExpireDay || ""}
                            options={{
                              mode: 'single', dateFormat: 'd/m/Y',
                              showMonths: true
                            }}
                            placeholder={intl.formatMessage({ id: "fileExpireDay" })}
                            className='form-control col-sm-12 mb-3 col-xs-12'
                            onChange={(date) => {
                              const newDateObjs = date.toString()
                              const newDates = moment(newDateObjs).format("DD/MM/YYYY")
                              setExpireDay(newDates);
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Col>

                  <Col sm='6' xs='12'>
                    <Label for="documentContent" className='text-small'>
                      {intl.formatMessage({ id: "content" })}
                    </Label>
                    <ReactQuill
                      theme="snow"
                      name="documentContent"
                      modules={EDITOR_CONFIG}
                      formats={EDITOR_FORMAT}
                      value={content || ""}
                      onChange={(value) => setContent(value)}
                    />
                  </Col>
                </Row>
                {isLoadingFile ? (
                  <div className='my-2' style={{ width: 200 }}>
                    <SpinnerTextAlignment />
                  </div>
                ) : (
                  <FormGroup className='style_file'>
                    <FileUploadDrag
                      setDataFiles={setDataFiles}
                      userData={userData}
                      documentFiles={userData.documentFiles?.map((item, index) => ({
                        url: item.documentFileUrl,
                        name: item.documentFileName,
                        size: item.documentFileSize
                      })) || []}
                      onDelete={(id) => deleteStationDocumentFile({ id })}
                      onAdd={async (files) => {
                        setIsLoadingFile(true)
                        let documentFileUrlList = await Promise.all(
                          files.map(async (item) => {
                            return {
                              name: item.name,
                              size: item.size,
                              url: await handleUpload(item.file),
                            }
                          })
                        )

                        documentFileUrlList = documentFileUrlList.map((item) => {
                          return {
                            documentFileName: item.name,
                            documentFileSize: item.size,
                            documentFileUrl: item.url.data,
                            stationDocumentId
                          }
                        })

                        const getError = async () => {
                          let isError = false;
                          for (const item of documentFileUrlList) {
                            const res = await insertStationDocumentFile(item);
                            if (!res.isSuccess) {
                              isError = true;
                              break;
                            }
                          }
                          return isError;
                        }

                        const hasError = await getError();
                        if (!hasError) {
                          // toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'add' }) }))
                        } else {
                          // toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'add' }) }))
                        }
                        await getDetailById(stationDocumentId);
                      }}
                      onEdit={(data) => updateStationDocumentFile(data)}
                    />
                  </FormGroup>
                )}

                <FormGroup className="d-flex mb-0 justify-content-center">
                  <Button.Ripple className="mr-1" color="primary" type="submit">
                    {intl.formatMessage({ id: 'submit' })}
                  </Button.Ripple>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
    </Fragment >
  )
}

export default injectIntl(memo(FormDocumentary))
