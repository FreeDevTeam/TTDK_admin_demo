import React, { Fragment, useState, memo, useEffect, useRef } from 'react'
import { ChevronLeft, Square } from 'react-feather'
import { injectIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import {
  Card,
  Input,
  Label,
  Row,
  Col,
  Button,
  FormGroup,
  Form,
  Nav,
  NavLink,
  NavItem,
  TabContent,
  TabPane,
  CardHeader,
  CardBody,
  CardImg,
  CardText
} from 'reactstrap'
import { useForm } from 'react-hook-form'
import Service from '../../../services/request'
import { toast } from 'react-toastify'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import FileUploadDrag from './FileUploadDrag'
import { convertFileToBase64 } from '../../../helper/common'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DocumentService from '../../../services/documentService'


const EDITOR_FORMAT = ['bold', 'italic', 'underline', 'strike', 'link']
const EDITOR_CONFIG = {
  toolbar: [
    ['bold', 'italic', 'underline','strike', 'link'],
  ]
}

const fileOptions = [
  {value : 1, label : 'OFFICIAL_LETTER'}, 
  {value : 2, label : 'ESTABLISHMENT_APPOINTMENT_DOCUMENT'},
  {value : 3, label : 'PERIODIC_INSPECTION_DOCUMENT'},
  {value : 4, label : 'TASK_ASSIGNMENT_FORM'},
]

const AddDocumentFile = ({ intl }) => {
  const history = useHistory()
  const [dataFiles, setDataFiles] = useState([])
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })

  const [userData, setUserData] = useState({})
  const [date, setDate] = useState(moment(new Date()).format("DD/MM/YYYY"))
  const [expireDay, setExpireDay] = useState('')
  const [text, setText] = useState('')
  const location = useLocation()
  const [count, setCount] = useState(0);

  function insertDocument(data) {
    if(count >= 2){
      toast.warn(intl.formatMessage({ id: 'please_wait' }))
      return null
    } 
    if(data.documentPublishedDay > data.documentExpireDay){
      toast.warn(intl.formatMessage({ id: 'please_day' }))
      return null
    }
    DocumentService.insertDocumentFile(data).then((res) => {
        if (res) {
          const { statusCode } = res
          if (statusCode === 200) {
            setCount(1)
            toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'add_new' }) }))
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'add_new' }) }))
            setCount(1)
          }
        }
      })
  }

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

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value
    })
  }

  return (
    <Fragment>
      <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
        <ChevronLeft />
        {intl.formatMessage({ id: 'goBack' })}
      </div>
      <Row>
        <Col className="col-sm-12 col-xs-12">
          <Card className="mt-4">
            <CardHeader className="justify-content-center flex-column">
              {location.state === undefined ? (
                <CardText className="mt-2 h2">{intl.formatMessage({ id: 'add_file' })}</CardText>
              ) : (
                <CardText className="mt-2 h2">{intl.formatMessage({ id: 'detail-file' })}</CardText>
              )}
            </CardHeader>
            <hr color="#808080" />
            <CardBody className="justify-content-center flex-column">
              <Form
                onSubmit={handleSubmit(async (data) => {
                  let documentFileUrlList = await Promise.all(
                    dataFiles.map(async(item) => {
                      return {
                        url : await handleUpload(item.file) ,
                        name : item.name,
                        size : item.size,
                      }
                    })
                  )

                  documentFileUrlList = documentFileUrlList.map((item) => {
                    return {
                      documentFileUrl : item.url.data,
                      documentFileName : item.name,
                      documentFileSize : item.size,
                    }
                  })

                  insertDocument({
                    ...data,
                    stationsId:location.state,
                    documentPublishedDay: date,
                    documentExpireDay : expireDay,
                    documentFileUrlList ,
                    documentContent : text
                  })
                  setCount(count + 1)
                })}>
                              
                <Row>
                  <Col className='col-xs-12'>
                <Col>
                  <Label for="documentCode">
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
                  <Label for="documentTitle">
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
                  <Label for="documentPublishedDay">
                    {intl.formatMessage({ id: "filePublishedDay" })} <span style={{color:"red"}}>*</span>
                  </Label>
                  <Flatpickr
                   id='documentPublishedDay'
                   name="documentPublishedDay"
                   value='today'
                   options={{ mode : 'single', dateFormat: 'd/m/Y'}}
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
                  <Label for="documentExpireDay">
                    {intl.formatMessage({ id: "fileExpireDay" })} <span style={{color:"red"}}>*</span>
                  </Label>
                  <Flatpickr
                   id='documentExpireDay'
                   name="documentExpireDay"
                   value={userData.documentExpireDay || ""}
                   options={{ mode : 'single', dateFormat: 'd/m/Y',
                   showMonths : true }}
                   placeholder={intl.formatMessage({ id: "documentExpireDay" })}
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

                <Col className='col-xs-12'>
                  <Label for="documentContent">
                    {intl.formatMessage({ id: "content" })}
                  </Label>
                  <ReactQuill
                    theme="snow"
                    name="documentContent"
                    style={{height:"150px"}}
                    modules={EDITOR_CONFIG}
                    formats={EDITOR_FORMAT}
                    value={text || ""}
                    onChange={(value) => setText(value)}
                  />
                </Col>
                </Row>

                <FormGroup className='style_file'>
                  <FileUploadDrag setDataFiles={setDataFiles} userData={{}} documentFiles={[]} />
                </FormGroup>

                <FormGroup className="d-flex mb-0 justify-content-center">
                  <Button.Ripple className="mr-1" color="primary" type="submit">
                    {intl.formatMessage({ id: 'submit' })}
                  </Button.Ripple>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default injectIntl(memo(AddDocumentFile))
