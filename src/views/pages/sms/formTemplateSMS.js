import "./sms.scss";
import { Fragment, memo, useEffect, useState } from "react";
import { ChevronLeft, XCircle } from "react-feather";
import { injectIntl } from "react-intl";
import { useHistory, useLocation } from "react-router-dom";
import Handlebars from "handlebars";
import {
  Button,
  Card,
  Col,
  CustomInput,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import _ from "lodash";
import moment from "moment";

import Service from "../../../services/request";
import { xoa_dau } from "../../../helper/common";

const STATIONS_FIELD = (intl) => {
  return {
    stationsBrandname: intl.formatMessage({ id: "stationsName" }),
    stationsAddress: intl.formatMessage({ id: "stationsAddress" }),
    customerRecordPlatenumber: intl.formatMessage({ id: "customerRecordPlatenumber" }),
    customerRecordCheckExpiredDate: intl.formatMessage({ id: "customerRecordCheckExpiredDate" }),
    stationsHotline: intl.formatMessage({ id: "stationsHotline" }),
  }
}

const FormTemplateSMS = ({ intl }) => {
  const { state } = useLocation()
  const history = useHistory()

  const [form, setForm] = useState(state || {})
  const [isLoading, setIsLoading] = useState(false)

  const [modalStations, setModalStations] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [stations, setStations] = useState([])
  const [stationsSelected, setStationsSelected] = useState({})

  const [modalPreview, setModalPreview] = useState(false)
  const [previewContent, setPreviewContent] = useState('')

  const hasMessageTemplateContent = form.messageTemplateName && form.messageTemplateContent

  const [messageTemplateContentPosition, setMessageTemplateContentPosition] = useState(0)
  const stationsField = STATIONS_FIELD(intl)

  const { register, handleSubmit } = useForm({
    defaultValues: {},
  });

  const handleOnchange = (name, value) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmitForm = (data) => {
    let { stationsName, ...newData } = data;
    const { stationsId } = form
    newData = {
      stationsId,
      ...newData
    }
    if (form.messageTemplateId) {
      // update case
      submitUpdateForm(newData);
      return;
    }

    // create case
    submitCreateForm(newData);
  };

  const submitUpdateForm = (data, messageSuccess) => {
    setIsLoading(true);

    const newData = {
      id: form.messageTemplateId,
      data: {
        ...data,
      },
    };

    Service.send({
      method: "POST",
      path: "MessageTemplate/updateById",
      data: newData,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          toast.success(
            intl.formatMessage(
              { id: "actionSuccess" },
              { action: intl.formatMessage({ id: "update" }) }
            )
          );
          setIsLoading(false);
          setTimeout(() => {
            history.push("/pages/sms")
          }, 1000);
        }
      } else {
        setIsLoading(false)
        toast.warn(
          intl.formatMessage(
            { id: "actionFailed" },
            { action: intl.formatMessage({ id: "update" }) }
          )
        );
      }
    })
  };

  const submitCreateForm = (data, messageSuccess) => {
    setIsLoading(true);

    const newData = {
      ...data,
    };

    Service.send({
      method: "POST",
      path: "MessageTemplate/insert",
      data: newData,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          toast.success(
            intl.formatMessage(
              { id: "actionSuccess" },
              { action: intl.formatMessage({ id: "add" }) }
            )
          );
          setTimeout(() => {
            history.push("/pages/sms")
          }, 1000);
        }
      } else {
        setIsLoading(false)
        toast.warn(
          intl.formatMessage(
            { id: "actionFailed" },
            { action: intl.formatMessage({ id: "add" }) }
          )
        );
      }
    });
  };

  // ** Function to handle filter
  const handleFilterStations = (e) => {
    if (e.keyCode === 13) {
      const { value } = e.target;
      setSearchValue();
      const newParams = {
        filter: {},
        searchText: value,
        skip: 0,
      };
      getStationsSearch(newParams);
    }
  };

  const handleClickStationsField = (key) => {
    const { messageTemplateContent = '' } = form
    let newText = ''
    if (messageTemplateContentPosition === 0) {
      newText = `{{${key}}} ${messageTemplateContent}`
    }
    const startText = messageTemplateContent.slice(0, messageTemplateContentPosition)
    const endText = messageTemplateContent.slice(messageTemplateContentPosition, messageTemplateContentPosition.length)

    newText = `${startText} {{${key}}} ${endText}`

    setForm({
      ...form,
      messageTemplateContent: newText
    })
  }

  const getStationsSearch = _.debounce((params) => {
    getStations(params, true);
  }, 2000);

  function getStations(params, isNoLoading) {
    const newParams = {
      ...params,
    };
    if (!isNoLoading) {
      setIsLoading(true);
    }

    Service.send({
      method: "POST",
      path: "Stations/getList",
      data: newParams,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res;
        if (statusCode === 200) {
          setStations(data.data);
        } else {
          toast.warn(
            intl.formatMessage(
              { id: "actionFailed" },
              { action: intl.formatMessage({ id: "fetchData" }) }
            )
          );
        }
      } else {
        setStations([]);
      }
      if (!isNoLoading) {
        setIsLoading(false);
      }
    });
  }

  useEffect(() => {
    // update stationsSelected
    const { stationsId, stationsName } = form
    setStationsSelected({
      stationsId,
      stationsName,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.stationsId, form.stationsName])

  return (
    <Fragment>
      <Card>
        <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
          <ChevronLeft />
          {intl.formatMessage({ id: "goBack" })}
        </div>
        <div className="accountAdmin">
          <h1 className="accountAdmin__title">
            {intl.formatMessage({ id: "info" }, { type: "sms" }).toUpperCase()}
          </h1>
          <Row>
            <Col sm="12" md="7">
              <Form
                onSubmit={handleSubmit((data) => {
                  handleSubmitForm(data);
                })}
              >
                <FormGroup row>
                  <Label sm="3" for="messageTemplateName">
                    {intl.formatMessage({ id: "name" })}
                  </Label>
                  <Col sm="9">
                    <Input
                      id="messageTemplateName"
                      name="messageTemplateName"
                      innerRef={register({ required: true })}
                      placeholder="Name"
                      value={form.messageTemplateName || ""}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleOnchange(name, value);
                      }}
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="3" for="messageTemplateContent">
                    {intl.formatMessage({ id: "content" })}
                  </Label>
                  <Col sm="9">
                    <div className="stations-field">
                      {
                        Object.keys(stationsField).map((key) => {
                          return (
                            <Button onClick={() => {handleClickStationsField(key)}} key={key} color="info" className="mr-1 mt-1">
                              { stationsField[key] }
                            </Button>
                          )
                        })
                      }
                    </div>
                    <Input
                      className="mt-1"
                      type="textarea"
                      rows={12}
                      id="messageTemplateContent"
                      name="messageTemplateContent"
                      innerRef={register({ required: true })}
                      placeholder="Name"
                      value={form.messageTemplateContent || ""}
                      onChange={(e) => {
                        const { name, value, selectionStart } = e.target;
                        handleOnchange(name, value);
                        setMessageTemplateContentPosition(selectionStart)
                      }}
                      onClick={(e) => {
                        const { selectionStart } = e.target;
                        setMessageTemplateContentPosition(selectionStart)
                      }}

                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="3" for="stationsName">
                    {intl.formatMessage({ id: "apply" })}
                  </Label>
                  <Col sm="9">
                    <FormGroup row>
                      <Col sm="8" className="relative">
                        <Input
                          id="stationsName"
                          name="stationsName"
                          innerRef={register({ required: true })}
                          placeholder="Name"
                          value={
                            form.stationsName ||
                            intl.formatMessage({ id: "stationsAll" })
                          }
                          disabled
                        />
                        <XCircle
                          onClick={() => {
                            // remove stationsId & stationsName
                            setForm({
                              ...form,
                              stationsId: null,
                              stationsName: null,
                            });
                          }}
                          className="close-btn"
                        />
                      </Col>
                      <Col sm="4">
                        <Button.Ripple
                          color="info"
                          type="button"
                          onClick={() => {
                            setModalStations(true)
                          }}
                        >
                          {intl.formatMessage({ id: "edit" })}
                        </Button.Ripple>
                      </Col>
                    </FormGroup>
                  </Col>
                </FormGroup>

                <FormGroup className="d-flex mb-0 justify-content-center">
                  <Button.Ripple
                    color="primary"
                    type="submit"
                    disabled={isLoading}
                  >
                    {intl.formatMessage({ id: "submit" })}
                  </Button.Ripple>
                  <Button.Ripple
                    className="ml-1"
                    color="success"
                    type="button"
                    disabled={!hasMessageTemplateContent}
                    onClick={() => { setModalPreview(true) }}
                  >
                    {intl.formatMessage({ id: "preview" })}
                  </Button.Ripple>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </div>
      </Card>

      <Modal
        isOpen={modalStations}
        toggle={() => setModalStations(false)}
        className={`modal-dialog-centered `}
        fullscreen="lg"
        onClosed={() => {
          // reset
          setSearchValue('');
        }}
        onOpened={() => {
          const newParams = {
            filter: {},
            searchText: '',
            skip: 0,
            limit: 10,
            order: {
              key: "createdAt",
              value: "desc"
            }
          };
          getStations(newParams);
        }}
      >
        <ModalHeader toggle={() => setModalStations(false)}>
          {intl.formatMessage({ id: "Search" })}
        </ModalHeader>
        <ModalBody>
          <>
            <FormGroup row className="align-items-center">
              <Label sm="3" for="search-input-stations-name">
                {intl.formatMessage({ id: "stationsName" })}
              </Label>
              <Col sm="9">
                <Input
                  className="dataTable-filter"
                  type="text"
                  bsSize="sm"
                  id="search-input-stations-name"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setStationsSelected({});
                  }}
                  onKeyDown={handleFilterStations}
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col sm="12">
                {stations.map((stattion) => {
                  const { stationsId, stationsName } = stattion;

                  return (
                    <CustomInput
                      key={`search-${stationsId}`}
                      type="radio"
                      className="custom-control-Primary mt-1"
                      name="stationsName"
                      id={`search-${stationsId}`}
                      label={stattion.stationsName}
                      checked={ stationsId === stationsSelected.stationsId}
                      onChange={(e) => {
                        if (!e.target.checked) { return }
                        setStationsSelected({
                          stationsId,
                          stationsName,
                        })
                      }}
                    />
                  );
                })}
              </Col>
            </FormGroup>

            <FormGroup className="d-flex mt-2 mb-0">
              <Button.Ripple
                className="mr-1"
                color="primary"
                type="submit"
                disabled={!stations.length && _.isEmpty(stationsSelected)}
                onClick={() => {
                  const { stationsId, stationsName } = stationsSelected
                  setForm({
                    ...form,
                    stationsId,
                    stationsName,
                  })
                  setModalStations(false)
                }}
              >
                {intl.formatMessage({ id: "Select" })}
              </Button.Ripple>
            </FormGroup>
          </>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={modalPreview}
        toggle={() => setModalPreview(false)}
        className={`modal-dialog-centered `}
        fullscreen="lg"
        onOpened={() => {
          const FORM_DATA = { 
            dateSchedule: moment().format("DD/MM/YYYY"),
            time: '7h-7h30',
            customerRecordPlatenumber: "99A999999", 
            customerRecordCheckExpiredDate: moment().format("DD/MM/YYYY"),
            stationsBrandname: form.stationsName || 'Trạm Đăng Kiểm',
            stationsHotline: "1900-123-123"
          }

          const template = Handlebars.compile(form.messageTemplateContent)
          const content = xoa_dau(template(FORM_DATA))
          setPreviewContent(content)
        }}
      >
        <ModalHeader toggle={() => setModalPreview(false)}>
          {intl.formatMessage({ id: "preview" })}
        </ModalHeader>
        <ModalBody>
          <>
            <FormGroup row className="align-items-center">
              <Label sm="3">
                <b>{intl.formatMessage({ id: "title" })}</b>
              </Label>
              <Col sm="9">
                {form.messageTemplateName}
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col sm="12">
                <b>{intl.formatMessage({ id: "content" })}</b>
              </Col>
              <Col sm="12" className="mt-1">
                {
                  previewContent
                }
              </Col>
            </FormGroup>

            <FormGroup className="d-flex mt-2 mb-0">
              <Button.Ripple
                color="primary"
                type="button"
                onClick={() => {
                  setModalPreview(false)
                }}
              >
                {intl.formatMessage({ id: "close" })}
              </Button.Ripple>
            </FormGroup>
          </>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default injectIntl(memo(FormTemplateSMS))
