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
import FileUploadConfig from "../../components/fileUpload";
import PreviewNotification from './previewNotification'

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
    const [file, setFile] = useState('')
    const [text, setText] = useState('')
    const [link, setLink] = useState('')

    const handleUpload = async (file, files) => {
        if(!file){
            setTimeout(() => {
                updateNotificationId ({
                    id : staffNotificationId,
                    data : {
                        ...files,
                        notificationImageUrl : undefined,
                        notificationContent: text
                    }
                })
               }, 2000);
        } else {
            const dataUrl = convertFileToBase64(file).then((res) =>{
                const ima = res.split(',').pop()
                const newItem = {
                    imageData: ima,
                    imageFormat: 'png'
                   }
                NotificationService.uploadImage(newItem).then((res) => {
                   if (res) {
                       const { statusCode, data } = res;
                       if (statusCode === 200) {
                        setTimeout(() => {
                            updateNotificationId ({
                                id : staffNotificationId,
                                data : {
                                    ...files,
                                    notificationImageUrl : data,
                                    notificationContent: text
                                }
                            })
                           }, 2000);
                        }
                    }
                });
            })
        }
    }
    
    const getDetailById = (notificationId) => {
        NotificationService.getDetailById(notificationId).then((res) => {
            if (res) {
                const { statusCode, data } = res
                if (statusCode === 200) {
                    setData(data)
                    setText(data.notificationContent)
                    setLink(data.notificationImageUrl)
                }
            }
        });
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
        setData(data => ({
            ...data,
            [name]: value
        }))
        setText(value)
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
                <Col className="col-12 col-xs-12 col-md-12 col-lg-6">
                    <Card className="mt-4">
                        <CardHeader className="justify-content-center flex-column">
                            <CardText className="mt-2 h2">{intl.formatMessage({ id: 'notification-detail' })}</CardText>
                        </CardHeader>
                        <hr color="#808080" />
                        <CardBody className="justify-content-center flex-column">
                            <Form
                                onSubmit={handleSubmit(async (data) => {
                                    handleUpload(file, data)
                                })}>
                                {/* <Row> */}
                                    {/* <Col className='col-xs-12'> */}
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
                                            value={data.notificationContent || ""}
                                            onChange={(value) => handleOnchange('notificationContent', value)}
                                        />
                                    </Col>
                                {/* </Row> */}
                                <Col className='mt-2'>
                                    <FileUploadConfig 
                                      type='file'
                                      name='notificationImageUrl'
                                      onChange={(evt) =>{
                                        setFile(evt.target.files[0])
                                      }}
                                      file={file}
                                      intl={intl}
                                    />
                                </Col>

                                <FormGroup className="d-flex mb-0 justify-content-center">
                                    <Button.Ripple className="mr-1 mt-1" color="primary" type="submit">
                                        {intl.formatMessage({ id: 'submit' })}
                                    </Button.Ripple>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
                <Col className="col-12 col-xs-12 col-md-12 col-lg-6">
                    <Card className="mt-4 p-1">
                        <h3 className='text-center'>
                            {intl.formatMessage({ id: 'show-notification' })}
                        </h3>
                        <PreviewNotification
                            title={data.notificationTitle}
                            desc={text}
                            image={link || file}
                        />
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}
export default injectIntl(memo(FormNotification))