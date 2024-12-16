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
import FileUploadMultiple from '../../forms/form-elements/file-uploader/FileUploadMultiple'
import { convertFileToBase64 } from '../../../helper/common'

const AddDocument = ({ intl }) => {
  const history = useHistory()
  const [dataFiles, setDataFiles] = useState([])
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})
  const [date, setDate] = useState('')
  const [expireDay, setExpireDay] = useState('')

  const location = useLocation()

  function insertDocument(data) {
    Service.send({
      method: 'POST',
      path: 'StationDocument/insert',
      data: data,
      query: null
    }).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'add_new' }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
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
    return Service.send({
      method: 'POST',
      path: 'Upload/uploadMediaFile',
      data: newItem,
      query: null
    })
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
                <CardText className="mt-2 h2">{intl.formatMessage({ id: 'add_document' })}</CardText>
              ) : (
                <CardText className="mt-2 h2">{intl.formatMessage({ id: 'detail-documentary' })}</CardText>
              )}
            </CardHeader>
            <hr color="#808080" />
            <CardBody className="justify-content-center flex-column">
              <Form
                onSubmit={handleSubmit(async (data) => {
                  let documentFileUrlList = await Promise.all(
                    dataFiles.map((item) => {
                      return handleUpload(item)
                    })
                  )
                  documentFileUrlList = documentFileUrlList.map((item) => {
                    return item.data
                  })

                  insertDocument({
                    ...data,
                    documentPublishedDay: date,
                    documentExpireDay : expireDay,
                    documentFileUrlList
                  })
                })}>

                <Row>
                  <Col className='col-xs-12'>
                <Col>
                  <Label for="documentCode">
                    {intl.formatMessage({ id: "documentCode" })}
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
                    {intl.formatMessage({ id: "documentTitle" })}
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
                <Row>
                <Col>
                  <Label for="documentPublishedDay">
                    {intl.formatMessage({ id: "documentPublishedDay" })}
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
                    {intl.formatMessage({ id: "documentExpireDay" })}
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
                  <Input
                    id="documentContent"
                    type="textarea"
                    rows={8}
                    name="documentContent"
                    // innerRef={register({ required: true })}
                    invalid={errors.documentContent && true}
                    value={userData.documentContent || ""}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                    className='col-sm-12 col-xs-12'
                  />
                </Col>
                </Row>

                <FormGroup>
                  <FileUploadMultiple setDataFiles={setDataFiles} userData={{}} documentFiles={[]} />
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

export default injectIntl(memo(AddDocument))
