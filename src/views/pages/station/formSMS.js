// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from "react";
// ** Store & Actions
import { toast } from "react-toastify";
import _ from "lodash";
import "./index.scss";
import { useForm } from "react-hook-form";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Service from "../../../services/request";
import "uppy/dist/uppy.css";
import "@uppy/status-bar/dist/style.css";
import "@styles/react/libs/file-uploader/file-uploader.scss";
import {
  Card,
  Input,
  Label,
  Row,
  Col,
  Button,
  FormGroup,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useLocation } from "react-router-dom";
import { injectIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import MySwitch from "../../components/switch/index";
import { ChevronLeft } from "react-feather";

const FormSMS = ({ intl }) => {
  // ** Store Vars
  const { state } = useLocation();
  const [userData, setUserData] = useState({});
  const [useUserSMSBrandConfig, setUseUserSMSBrandConfig] = useState(0);
  const [stationEnableUseSMS, setStationEnableUseSMS] = useState(0);
  const [isOpenModalTestSMS, setIsOpenModalTestSMS] = useState(false);
  const [smsType, setSmsType] = useState(userData.smsProvider || "");
  const history = useHistory();
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {},
  });

  useEffect(() => {
    if (state && Object.keys(state).length > 0) {
      const stationCustomSMSBrandConfig = state.stationCustomSMSBrandConfig
        ? JSON.parse(state.stationCustomSMSBrandConfig)
        : {};
      setUserData(stationCustomSMSBrandConfig);
      setSmsType(stationCustomSMSBrandConfig?.smsProvider || "");
      setStationEnableUseSMS(state.stationEnableUseSMS);
      setUseUserSMSBrandConfig(state.stationUseCustomSMSBrand);
    }
  }, [state]);

  function handleUpdateData(data) {
    if (stationEnableUseSMS === 1 && useUserSMSBrandConfig === 1) {
      if (Object.keys(errors).length === 0) {
        const params = {
          stationsId: state.stationsId,
          smsUrl: data.smsUrl,
          smsUserName: data.smsUserName,
          smsPassword: data.smsPassword,
          smsBrand: data.smsBrand,
          smsCPCode: data.smsCPCode,
          smsServiceId: data.smsServiceId,
          smsProvider: smsType,
        };
        Service.send({
          method: "POST",
          path: "Stations/updateConfigSMS",
          data: params,
          query: null,
        }).then((res) => {
          if (res) {
            const { statusCode } = res;
            if (statusCode === 200) {
              toast.success(
                intl.formatMessage(
                  { id: "actionSuccess" },
                  { action: intl.formatMessage({ id: "update" }) }
                )
              );
              setTimeout(() => {
                history.push("/pages/station");
              }, 1000);
            } else {
              toast.warn(
                intl.formatMessage(
                  { id: "actionFailed" },
                  { action: intl.formatMessage({ id: "update" }) }
                )
              );
            }
          }
        });
      }
    } else {
      toast.success(
        intl.formatMessage(
          { id: "actionSuccess" },
          { action: intl.formatMessage({ id: "update" }) }
        )
      );
      setTimeout(() => {
        history.push("/pages/station");
      }, 1000);
    }
  }

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const onChangeUseCustomSMSBrand = (newValue) => {
    Service.send({
      method: "POST",
      path: "Stations/updateCustomSMSBrand",
      data: {
        stationsId: state.stationsId,
        stationUseCustomSMSBrand: newValue,
      },
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode } = res;
        if (statusCode === 200) {
          setUseUserSMSBrandConfig(newValue);
        } else {
          toast.warn(
            intl.formatMessage(
              { id: "actionFailed" },
              { action: intl.formatMessage({ id: "update" }) }
            )
          );
        }
      }
    });
  };

  const onUpdateStationEnableUseSMS = (newValue) => {
    Service.send({
      method: "POST",
      path: "Stations/updateById",
      data: {
        id: state.stationsId,
        data: {
          stationEnableUseSMS: newValue,
        },
      },
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode } = res;
        if (statusCode === 200) {
          setStationEnableUseSMS(newValue);
        } else {
          toast.warn(
            intl.formatMessage(
              { id: "actionFailed" },
              { action: intl.formatMessage({ id: "update" }) }
            )
          );
        }
      }
    });
  };

  function handleSelectSMSType(e) {
    const { value } = e.target;
    let newValue = userData;
    setUserData(newValue);
    setSmsType(value);
    handleChange();
  }

  function handleSendTestSMS(value) {
    const params = {
      phoneNumber: value,
      smsConfig: {
        smsUrl: userData.smsUrl,
        smsUserName: userData.smsUserName,
        smsPassword: userData.smsPassword,
        smsCPCode: userData.smsCPCode,
        smsServiceId: userData.smsServiceId,
        smsBrand: userData.smsBrand,
        smsProvider: smsType,
      },
    };
    // if (smsType === "") {
    //   params.smsConfig.smsProvider = userData.smsProvider;
    // }
    switch (smsType) {
      case "":
        params.smsConfig.smsProvider = userData.smsProvider;
        break;
      case "VIETTEL":
        params.smsConfig.smsBrand = undefined;
        break;
      case "VIVAS":
        params.smsConfig.smsServiceId = undefined;
        params.smsConfig.smsCPCode = undefined;
        break;
      default:
        break;
    }
    Service.send({
      method: "POST",
      path: "CustomerMessage/sendTestSMS",
      data: params,
    }).then((result) => {
      if (result && result.statusCode === 200) {
        toast.success(intl.formatMessage({ id: "sent" }, { type: "" }));
        setIsOpenModalTestSMS(false);
      } else {
        toast.error(
          intl.formatMessage({ id: "sendSMSTestFailed" }, { type: "" })
        );
      }
    });
  }

  const handleChange = () => {
    switch (userData.smsProvider && smsType) {
      case "VIETTEL":
        return (
          <>
            <FormGroup row>
              <Label sm="3" for="smsCPCode">
                {intl.formatMessage({ id: "smsCPCode" })}
              </Label>

              <Col sm="5">
                <Input
                  name="smsCPCode"
                  id="smsCPCode"
                  disabled={
                    useUserSMSBrandConfig === 1 && stationEnableUseSMS === 1
                      ? false
                      : true
                  }
                  innerRef={register({
                    required:
                      useUserSMSBrandConfig === 1 && stationEnableUseSMS === 1
                        ? true
                        : false,
                  })}
                  invalid={errors.smsCPCode && true}
                  value={(userData && userData.smsCPCode) || ""}
                  placeholder={intl.formatMessage({ id: "smsCPCode" })}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleOnchange(name, value);
                  }}
                />
              </Col>
              <Col sm="4">
                <i>Ví dụ: abc-123</i>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label sm="3" for="smsServiceId">
                {intl.formatMessage({ id: "smsServiceId" })}
              </Label>

              <Col sm="5">
                <Input
                  name="smsServiceId"
                  id="smsServiceId"
                  disabled={
                    useUserSMSBrandConfig === 1 && stationEnableUseSMS === 1
                      ? false
                      : true
                  }
                  innerRef={register({
                    required:
                      useUserSMSBrandConfig === 1 && stationEnableUseSMS === 1
                        ? true
                        : false,
                  })}
                  invalid={errors.smsServiceId && true}
                  value={(userData && userData.smsServiceId) || ""}
                  placeholder={intl.formatMessage({ id: "smsServiceId" })}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleOnchange(name, value);
                  }}
                />
              </Col>
              <Col sm="4">
                <i>Ví dụ: ...abc123</i>
              </Col>
            </FormGroup>
          </>
        );
      case "VIVAS":
        return (
          <FormGroup row>
            <Label sm="3" for="smsBrand">
              {intl.formatMessage({ id: "smsBrand" })}
            </Label>

            <Col sm="5">
              <Input
                name="smsBrand"
                id="smsBrand"
                disabled={
                  useUserSMSBrandConfig === 1 && stationEnableUseSMS === 1
                    ? false
                    : true
                }
                innerRef={register({
                  required:
                    useUserSMSBrandConfig === 1 && stationEnableUseSMS === 1
                      ? true
                      : false,
                })}
                invalid={errors.smsBrand && true}
                value={(userData && userData.smsBrand) || ""}
                placeholder={intl.formatMessage({ id: "smsBrand" })}
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleOnchange(name, value);
                }}
              />
            </Col>
            <Col sm="4">
              <i>Ví dụ: KiemDinhOto</i>
            </Col>
          </FormGroup>
        );
      default:
        break;
    }
  };

  return (
    <Fragment>
      <Card>
        <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
          <ChevronLeft />
          {intl.formatMessage({ id: "goBack" })}
        </div>
        <div className="accountAdmin">
          <h1 className="accountAdmin__title">
            {intl.formatMessage({ id: "info" }, { type: "SMS" }).toUpperCase()}
          </h1>
          <Row>
            <Col sm="12" md="8">
              <Form
                onSubmit={handleSubmit((data) => {
                  handleUpdateData({
                    ...data,
                  });
                })}
              >
                <FormGroup row>
                  <Label sm="3" for="smsUrl">
                    SMS Enable
                  </Label>
                  <Col sm="9">
                    <MySwitch
                      checked={stationEnableUseSMS === 1 ? true : false}
                      onChange={(e) => {
                        onUpdateStationEnableUseSMS(e.target.checked ? 1 : 0);
                      }}
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="3" for="smsProvider">
                    {intl.formatMessage({ id: "supplier" }, { type: "SMS" })}
                  </Label>

                  <Col sm="5">
                    <Input
                      className="w-100"
                      id="smsProvider"
                      type="select"
                      invalid={errors.smsProvider && true}
                      innerRef={register({ required: true })}
                      name="smsProvider"
                      bsSize="sm"
                      value={smsType || userData.smsProvider}
                      onChange={handleSelectSMSType}
                      disabled={stationEnableUseSMS === 1 ? false : true}
                    >
                      <option value="">
                        {intl.formatMessage({ id: "selectService" })}
                      </option>
                      <option value="VIETTEL">Viettel</option>
                      <option value="VIVAS">Vivas</option>
                    </Input>
                  </Col>
                  <Col sm="4" />
                </FormGroup>

                <div className="row">
                  <Label sm="3">
                    {intl.formatMessage(
                      { id: "stationUseCustomSMSBrand" },
                      { type: "SMS Brandname" }
                    )}
                  </Label>

                  <Col sm="9">
                    <MySwitch
                      checked={useUserSMSBrandConfig === 1 ? true : false}
                      onChange={(e) => {
                        onChangeUseCustomSMSBrand(e.target.checked ? 1 : 0);
                      }}
                      disabled={stationEnableUseSMS === 1 ? false : true}
                    />
                  </Col>
                </div>

                <FormGroup row className="mt-1">
                  <Label sm="3" for="smsUrl">
                    SMS Url
                  </Label>
                  <Col sm="5">
                    <Input
                      id="smsUrl"
                      name="smsUrl"
                      disabled={
                        useUserSMSBrandConfig === 1 && stationEnableUseSMS === 1
                          ? false
                          : true
                      }
                      innerRef={register({
                        required:
                          useUserSMSBrandConfig === 1 &&
                          stationEnableUseSMS === 1
                            ? true
                            : false,
                      })}
                      invalid={errors.smsUrl && true}
                      placeholder="SMS Url"
                      value={(userData && userData.smsUrl) || ""}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleOnchange(name, value);
                      }}
                    />
                  </Col>
                  <Col sm="4">
                    <i>Ví dụ: https://example.vn/SMS</i>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="3" for="smsUserName">
                    {intl.formatMessage({ id: "smsUsername" }, { type: "SMS" })}
                  </Label>

                  <Col sm="5">
                    <Input
                      id="smsUserName"
                      name="smsUserName"
                      disabled={
                        useUserSMSBrandConfig === 1 && stationEnableUseSMS === 1
                          ? false
                          : true
                      }
                      innerRef={register({
                        required:
                          useUserSMSBrandConfig === 1 &&
                          stationEnableUseSMS === 1
                            ? true
                            : false,
                      })}
                      invalid={errors.smsUserName && true}
                      placeholder={intl.formatMessage(
                        { id: "smsUsername" },
                        { type: "SMS" }
                      )}
                      value={(userData && userData.smsUserName) || ""}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleOnchange(name, value);
                      }}
                    />
                  </Col>
                  <Col sm="4">
                    <i>Ví dụ: example123</i>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="3" for="smsPassword">
                    {intl.formatMessage({ id: "smsPassword" }, { type: "SMS" })}
                  </Label>

                  <Col sm="5">
                    <Input
                      name="smsPassword"
                      id="smsPassword"
                      disabled={
                        useUserSMSBrandConfig === 1 && stationEnableUseSMS === 1
                          ? false
                          : true
                      }
                      innerRef={register({
                        required:
                          useUserSMSBrandConfig === 1 &&
                          stationEnableUseSMS === 1
                            ? true
                            : false,
                      })}
                      invalid={errors.smsPassword && true}
                      value={(userData && userData.smsPassword) || ""}
                      placeholder={intl.formatMessage(
                        { id: "smsPassword" },
                        { type: "SMS" }
                      )}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleOnchange(name, value);
                      }}
                    />
                  </Col>
                  <Col sm="4">
                    <i>Ví dụ: ...abc123</i>
                  </Col>
                </FormGroup>
                {handleChange()}
                {userData.smsProvider === "VIETTEL" && smsType === "" && (
                  <>
                    <FormGroup row>
                      <Label sm="3" for="smsCPCode">
                        {intl.formatMessage({ id: "smsCPCode" })}
                      </Label>

                      <Col sm="5">
                        <Input
                          name="smsCPCode"
                          id="smsCPCode"
                          disabled={
                            useUserSMSBrandConfig === 1 &&
                            stationEnableUseSMS === 1
                              ? false
                              : true
                          }
                          innerRef={register({
                            required:
                              useUserSMSBrandConfig === 1 &&
                              stationEnableUseSMS === 1
                                ? true
                                : false,
                          })}
                          invalid={errors.smsCPCode && true}
                          value={(userData && userData.smsCPCode) || ""}
                          placeholder={intl.formatMessage({ id: "smsCPCode" })}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleOnchange(name, value);
                          }}
                        />
                      </Col>
                      <Col sm="4">
                        <i>Ví dụ: abc-123</i>
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Label sm="3" for="smsServiceId">
                        {intl.formatMessage({ id: "smsServiceId" })}
                      </Label>

                      <Col sm="5">
                        <Input
                          name="smsServiceId"
                          id="smsServiceId"
                          disabled={
                            useUserSMSBrandConfig === 1 &&
                            stationEnableUseSMS === 1
                              ? false
                              : true
                          }
                          innerRef={register({
                            required:
                              useUserSMSBrandConfig === 1 &&
                              stationEnableUseSMS === 1
                                ? true
                                : false,
                          })}
                          invalid={errors.smsServiceId && true}
                          value={(userData && userData.smsServiceId) || ""}
                          placeholder={intl.formatMessage({
                            id: "smsServiceId",
                          })}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleOnchange(name, value);
                          }}
                        />
                      </Col>
                      <Col sm="4">
                        <i>Ví dụ: ...abc123</i>
                      </Col>
                    </FormGroup>
                  </>
                )}
                {userData.smsProvider === undefined && smsType === "VIETTEL" && (
                  <>
                    <FormGroup row>
                      <Label sm="3" for="smsCPCode">
                        {intl.formatMessage({ id: "smsCPCode" })}
                      </Label>

                      <Col sm="5">
                        <Input
                          name="smsCPCode"
                          id="smsCPCode"
                          disabled={
                            useUserSMSBrandConfig === 1 &&
                            stationEnableUseSMS === 1
                              ? false
                              : true
                          }
                          innerRef={register({
                            required:
                              useUserSMSBrandConfig === 1 &&
                              stationEnableUseSMS === 1
                                ? true
                                : false,
                          })}
                          invalid={errors.smsCPCode && true}
                          value={(userData && userData.smsCPCode) || ""}
                          placeholder={intl.formatMessage({ id: "smsCPCode" })}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleOnchange(name, value);
                          }}
                        />
                      </Col>
                      <Col sm="4">
                        <i>Ví dụ: abc-123</i>
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Label sm="3" for="smsServiceId">
                        {intl.formatMessage({ id: "smsServiceId" })}
                      </Label>

                      <Col sm="5">
                        <Input
                          name="smsServiceId"
                          id="smsServiceId"
                          disabled={
                            useUserSMSBrandConfig === 1 &&
                            stationEnableUseSMS === 1
                              ? false
                              : true
                          }
                          innerRef={register({
                            required:
                              useUserSMSBrandConfig === 1 &&
                              stationEnableUseSMS === 1
                                ? true
                                : false,
                          })}
                          invalid={errors.smsServiceId && true}
                          value={(userData && userData.smsServiceId) || ""}
                          placeholder={intl.formatMessage({
                            id: "smsServiceId",
                          })}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleOnchange(name, value);
                          }}
                        />
                      </Col>
                      <Col sm="4">
                        <i>Ví dụ: ...abc123</i>
                      </Col>
                    </FormGroup>
                  </>
                )}
                {userData.smsProvider === "VIVAS" && smsType === "" && (
                  <>
                    <FormGroup row>
                      <Label sm="3" for="smsBrand">
                        {intl.formatMessage({ id: "smsBrand" })}
                      </Label>

                      <Col sm="5">
                        <Input
                          name="smsBrand"
                          id="smsBrand"
                          disabled={
                            useUserSMSBrandConfig === 1 &&
                            stationEnableUseSMS === 1
                              ? false
                              : true
                          }
                          innerRef={register({
                            required:
                              useUserSMSBrandConfig === 1 &&
                              stationEnableUseSMS === 1
                                ? true
                                : false,
                          })}
                          invalid={errors.smsBrand && true}
                          value={(userData && userData.smsBrand) || ""}
                          placeholder={intl.formatMessage({ id: "smsBrand" })}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleOnchange(name, value);
                          }}
                        />
                      </Col>
                      <Col sm="4">
                        <i>Ví dụ: KiemDinhOto</i>
                      </Col>
                    </FormGroup>
                  </>
                )}
                {userData.smsProvider === undefined && smsType === "VIVAS" && (
                  <>
                    <FormGroup row>
                      <Label sm="3" for="smsBrand">
                        {intl.formatMessage({ id: "smsBrand" })}
                      </Label>

                      <Col sm="5">
                        <Input
                          name="smsBrand"
                          id="smsBrand"
                          disabled={
                            useUserSMSBrandConfig === 1 &&
                            stationEnableUseSMS === 1
                              ? false
                              : true
                          }
                          innerRef={register({
                            required:
                              useUserSMSBrandConfig === 1 &&
                              stationEnableUseSMS === 1
                                ? true
                                : false,
                          })}
                          invalid={errors.smsBrand && true}
                          value={(userData && userData.smsBrand) || ""}
                          placeholder={intl.formatMessage({ id: "smsBrand" })}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleOnchange(name, value);
                          }}
                        />
                      </Col>
                      <Col sm="4">
                        <i>Ví dụ: KiemDinhOto</i>
                      </Col>
                    </FormGroup>
                  </>
                )}
                <div className="row m-0 mt-3">
                  <FormGroup className="p-0 col-12 col-sm-3">
                    <Button.Ripple
                      className="w-100"
                      color="primary"
                      type="submit"
                    >
                      {intl.formatMessage({ id: "submit" })}
                    </Button.Ripple>
                  </FormGroup>
                  <div className="col-1" />
                  {useUserSMSBrandConfig === 1 && stationEnableUseSMS === 1 && (
                    <FormGroup className="col-12 col-sm-3 p-0">
                      <Button.Ripple
                        className="w-100"
                        color="primary"
                        onClick={() => setIsOpenModalTestSMS(true)}
                      >
                        Test SMS
                      </Button.Ripple>
                    </FormGroup>
                  )}
                </div>
              </Form>
            </Col>
          </Row>
        </div>
      </Card>

      <Modal
        isOpen={isOpenModalTestSMS}
        toggle={() => setIsOpenModalTestSMS(!isOpenModalTestSMS)}
      >
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            const input = document.getElementById("testSMS");
            if (input.value) {
              handleSendTestSMS(input.value);
            }
          }}
        >
          <ModalHeader
            toggle={() => setIsOpenModalTestSMS(!isOpenModalTestSMS)}
          >
            {intl.formatMessage({ id: "checkSMS" })}
          </ModalHeader>
          <ModalBody>
            <label htmlFor="testSMS">
              {intl.formatMessage({ id: "enterPhoneSendSMS" })}
            </label>
            <FormGroup>
              <Input
                name="testSMS"
                id="testSMS"
                placeholder="Nhập SĐT"
                type="SMS"
                required
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <FormGroup>
              <Button color="primary" type="submit">
                {intl.formatMessage({ id: "send" })}
              </Button>
            </FormGroup>
          </ModalFooter>
        </Form>
      </Modal>
    </Fragment>
  );
};
export default injectIntl(memo(FormSMS));
