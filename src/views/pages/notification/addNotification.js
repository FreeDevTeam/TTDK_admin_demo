import React, { Fragment, useState, memo} from 'react'
import { ChevronLeft } from 'react-feather'
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
    CardHeader,
    CardBody,
    CardText
} from 'reactstrap'
import { useForm } from 'react-hook-form'
import Service from '../../../services/request'
import { toast } from 'react-toastify'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import FileUpload from '../../forms/form-elements/file-uploader/FileUpload'
import { convertFileToBase64 } from '../../../helper/common'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import NotificationService from '../../../services/notificationService'

const EDITOR_FORMAT = ['bold', 'italic', 'underline', 'strike', 'link']
const EDITOR_CONFIG = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike', 'link'],
    ]
}

const AddNotification = ({ intl }) => {
    const history = useHistory()
    const [dataFiles, setDataFiles] = useState('')
    const { register, errors, handleSubmit } = useForm({
        defaultValues: {}
    })
    const [data, setData] = useState({})
    const [link, setLink] = useState('')
    const [text, setText] = useState('')
    const [file, setFile] = useState('')
    const location = useLocation()

    function insertNotification(data) {
        return Service.send({
            method: 'POST',
            path: 'StaffNotification/insert',
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

     const handleUpload = async (file, files) => {
        if(!file){
            setTimeout(() => {
                insertNotification ({
                    ...files,
                        notificationImageUrl : undefined,
                        notificationContent: text
                })
               }, 2000);
        } else {
            const dataUrl = convertFileToBase64(file).then((res) =>{
                const ima = res.split(',').pop()
                const newItem = {
                    imageData: ima,
                    imageFormat: 'png'
                   }
               return NotificationService.uploadImage(newItem).then((res) => {
                   if (res) {
                       const { statusCode, data } = res;
                       if (statusCode === 200) {
                           setLink(data)
                           setTimeout(() => {
                            insertNotification ({
                                ...files,
                                    notificationImageUrl : data,
                                    notificationContent: text
                            })
                           }, 2000);
                       }
                   }
               });
            })
        }
    }

    const handleOnchange = (name, value) => {
        setData({
            ...data,
            [name]: value
        })
    }
    const onData = (string) =>{
        setDataFiles(string)
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
                                <CardText className="mt-2 h2">{intl.formatMessage({ id: 'add-notification' })}</CardText>
                            ) : (
                                <CardText className="mt-2 h2">{intl.formatMessage({ id: 'detail-notification' })}</CardText>
                            )}
                        </CardHeader>
                        <hr color="#808080" />
                        <CardBody className="justify-content-center flex-column">
                            <Form
                                onSubmit={handleSubmit(async (data) => {
                                         handleUpload(file, data)
                                })}>

                                <Row >
                                    <Col xs='12' sm='6'>
                                        <Col>
                                            <Label for="code">
                                                {intl.formatMessage({ id: "code" })}
                                            </Label>
                                            <Input
                                                id="stationsId"
                                                name="stationsId"
                                                innerRef={register({ required: true })}
                                                invalid={errors.stationsId && true}
                                                value={data.stationsId || ""}
                                                onChange={(e) => {
                                                    const { name, value } = e.target;
                                                    handleOnchange(name, value);
                                                }}
                                                className='col-sm-12 mb-2 col-xs-12'
                                            />
                                        </Col>
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
                                            value={text || ""}
                                            onChange={(value) => setText(value)}
                                        />
                                    </Col>
                                </Row>
                                <FormGroup >
                                    <Input 
                                    type='file'
                                    className='mt-1'
                                    name='notificationImageUrl'
                                    id="notificationImageUrl"
                                    onChange={(evt) =>{
                                        setFile(evt.target.files[0])
                                    }}/>
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

export default injectIntl(memo(AddNotification))
