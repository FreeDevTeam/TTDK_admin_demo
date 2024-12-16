import React, { Fragment, useState, memo, useEffect } from 'react'
import { ChevronLeft } from 'react-feather'
import { injectIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { Card, Input, Label, Row, Col, Button, FormGroup, Form, CardHeader, CardBody, CardText } from 'reactstrap'
import { useForm } from 'react-hook-form'
import ReactQuill from 'react-quill';
import { toast } from 'react-toastify'
import Flatpickr from 'react-flatpickr'
import 'react-quill/dist/quill.snow.css';
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import FileUpload from '../../forms/form-elements/file-uploader/FileUploadMultiple'
import { convertFileToBase64 } from '../../../helper/common'
import NotificationService from '../../../services/notificationService'
import Service from '../../../services/request'

const EDITOR_FORMAT = ['bold', 'italic', 'underline', 'strike', 'link']
const EDITOR_CONFIG = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike', 'link'],
    ]
}
const FormNotification = ({ intl }) => {

    const location = useLocation()
    const history = useHistory()
    const { staffNotificationId } = location.state
    const { register, errors, handleSubmit } = useForm({
        defaultValues: {}
    })
    const [data, setData] = useState({})
    const [dataFiles, setDataFiles] = useState([])
    const [date, setDate] = useState('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const handleUpload = async (file) => {
        const dataUrl = await convertFileToBase64(file)
        const arrayData = file?.name.split('.')
        const format = arrayData[arrayData.length - 1]

        const newItem = {
            imageData: dataUrl.replace('data:' + file?.type + ';base64,', ''),
            imageFormat: format
        }
        return NotificationService.uploadImage(newItem)
    }

    const getDetailById = (notificationId) => {
        NotificationService.getDetailById({
            id: notificationId
        }).then((res) => {
            if (res) {
                const { statusCode, data } = res
                if (statusCode === 200) {
                    setData(data)
                }
            }
        })
    }

    const updateNotificationId = (data) => {
        NotificationService.handleUpdate(data).then((res) => {
            if (res) {
                const { statusCode } = res
                if (statusCode === 200) {
                    toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
                } else {
                    toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
                }
            }
        })
    }

    const handleOnchange = (name, value) => {
        setData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    useEffect(() => {
        getDetailById(staffNotificationId)
    }, [])
    
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
                            <CardText className="mt-2 h2">{intl.formatMessage({ id: 'notification-detail' })}</CardText>
                        </CardHeader>
                        <hr color="#808080" />
                        <CardBody className="justify-content-center flex-column">
                            <Form
                                onSubmit={handleSubmit(async (data) => {
                                    let notificationFileUrlList = await Promise.all(
                                        dataFiles.map((item) => {
                                            return handleUpload(item)
                                        })
                                    )
                                    notificationFileUrlList = notificationFileUrlList.map((item) => {
                                        return item.data
                                    })

                                    updateNotificationId({
                                        id: staffNotificationId,
                                        data: {
                                            ...data,
                                            createdAt: date,
                                            notificationFileUrlList,
                                             notificationContent: content
                                        }
                                    })
                                })}>
                                <Row>
                                    <Col className='col-xs-12'>
                                        <Col>
                                            <Label for="Title">
                                                {intl.formatMessage({ id: "title" })}
                                            </Label>
                                            <Input
                                                id="notificationTitle"
                                                name="notificationTitle"
                                                innerRef={register({ required: true })}
                                                invalid={errors.notificationTitle && true}
                                                value={data.notificationTitle || ""}
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
                                                    <Label for="createdAt">
                                                        {intl.formatMessage({ id: "createdAt" })}
                                                    </Label>
                                                    <Flatpickr
                                                        id='createdAt'
                                                        name="createdAt"
                                                        value={data.createdAt || ""}
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
                                            </Row>
                                        </Col>
                                    </Col>

                                    <Col className='col-xs-12'>
                                        <Label for="notificationContent">
                                            {intl.formatMessage({ id: "content" })}
                                        </Label>
                                        <ReactQuill
                                            theme="snow"
                                            id="notificationContent"
                                            name="notificationContent"
                                            modules={EDITOR_CONFIG}
                                            formats={EDITOR_FORMAT}
                                            value={content || ""}
                                            onChange={(value) => setContent(value)}
                                        />
                                    </Col>
                                </Row>
                                <FormGroup>
                                    <FileUpload
                                        setDataFiles={setDataFiles}
                                        userData={data}
                                        documentFiles={data.documentFiles?.map((item) => {
                                            return item.documentFileUrl
                                        }) || []}
                                    />
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
export default injectIntl(memo(FormNotification))