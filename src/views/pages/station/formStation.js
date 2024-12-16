// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from "react";
// ** Store & Actions
import { toast } from "react-toastify";
import {
  MoreVertical,
  Edit,
  Lock,
  Delete,
  DollarSign,
  Database,
  Shield,
  RefreshCcw,
  ChevronLeft,
} from "react-feather";
import _ from "lodash";
import "./index.scss";
import { useForm } from "react-hook-form";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Service from "../../../services/request";
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import { number_to_price, checkRole } from "./../../../helper/common";
import FileUploaderBasic from "../../forms/form-elements/file-uploader/FileUploaderBasic";
import "uppy/dist/uppy.css";
import "@uppy/status-bar/dist/style.css";
import "@styles/react/libs/file-uploader/file-uploader.scss";
import {
  Card,
  Input,
  Label,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  InputGroup,
  InputGroupButtonDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  FormGroup,
  Form,
} from "reactstrap";
import { useLocation } from "react-router-dom";
import { injectIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import MySwitch from "../../components/switch";

const FormStation = ({ intl }) => {
  // ** Store Vars
  const { state } = useLocation();
  const [previewArr, setPreviewArr] = useState([]);
  const [previewLeftBanner, setPreviewLeftBanner] = useState([]);
  const [previewRightBanner, setPreviewRightBanner] = useState([]);
  const [userData, setUserData] = useState(state || {});
  const history = useHistory();
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {},
  });

  function handleUpdateData(data, messageSuccess) {
    const params = {
      id: userData.stationsId,
      data: {
        stationsName: data.data.stationsName,
        stationsHotline: data.data.stationsHotline,
        stationsAddress: data.data.stationsAddress,
        stationUrl: data.data.stationUrl,
        stationWebhookUrl: data.data.stationWebhookUrl,
        stationLandingPageUrl: data.data.stationLandingPageUrl,
      },
    };
    if (previewArr[0]) {
      params.data.stationsLogo = previewArr[0].imageUrl;
    } else if (
      userData.stationsLogo === undefined ||
      userData.stationsLogo === null
    ) {
      return Service.send({
        method: "POST",
        path: "Stations/updateById",
        data: params,
        query: null,
      }).then((res) => {
        if (res) {
          const { statusCode, message } = res;
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
    } else {
      params.data.stationsLogo = userData.stationsLogo;
    }
    Service.send({
      method: "POST",
      path: "Stations/updateById",
      data: params,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, message } = res;
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

  function handleAddStation(item) {
    Service.send({
      method: "POST",
      path: "Stations/insert",
      data: item,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, message } = res;

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
              { action: intl.formatMessage({ id: "add" }) }
            )
          );
        }
      }
    });
  }

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const onChangeAdStatus = (newStatus) => {
    Service.send({
      method: "POST",
      path: "Stations/enableAdsForStation",
      data: newStatus,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode } = res;
        if (statusCode === 200) {
          setUserData({
            ...userData,
            stationsEnableAd: newStatus.stationsEnableAd,
          });
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

  function handleUpdateBanner(path, data) {
    Service.send({
      method: "POST",
      path: path,
      data: data,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode } = res;
        if (statusCode === 200) {
        } else {
          toast.warn(
            intl.formatMessage(
              { id: "actionFailed" },
              { action: intl.formatMessage({ id: "update" }) + "Ads" }
            )
          );
        }
      }
    });
  }

  return (
    <Fragment>
      <Card>
        <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
          <ChevronLeft />
          {intl.formatMessage({ id: "goBack" })}
        </div>
        <div className="accountAdmin">
          <h1 className="accountAdmin__title">
            {" "}
            {userData.stationsId
              ? intl.formatMessage({ id: "edit" })
              : intl.formatMessage({ id: "add" })}{" "}
            {intl.formatMessage(
              { id: "info" },
              { type: intl.formatMessage({ id: "stations" }) }
            )}
          </h1>
          <Row>
            <Col sm="12" md="7">
              <Form
                onSubmit={handleSubmit((data) => {
                  const newData = {
                    ...data,
                    stationsLogo:
                      previewArr && previewArr[0]
                        ? previewArr[0].imageUrl
                        : undefined,
                  };
                  if (userData.stationsId) {
                    handleUpdateData({
                      id: userData.stationsId,
                      data: newData,
                    });
                    if (
                      previewLeftBanner &&
                      previewLeftBanner[0] &&
                      previewLeftBanner[0].imageUrl
                    ) {
                      handleUpdateBanner("Stations/updateLeftAdBanner", {
                        stationsId: userData.stationsId,
                        stationsCustomAdBannerLeft:
                          previewLeftBanner[0].imageUrl,
                      });
                    }
                    if (
                      previewRightBanner &&
                      previewRightBanner[0] &&
                      previewRightBanner[0].imageUrl
                    ) {
                      handleUpdateBanner("Stations/updateRightAdBanner", {
                        stationsId: userData.stationsId,
                        stationsCustomAdBannerRight:
                          previewRightBanner[0].imageUrl,
                      });
                    }
                  } else {
                    handleAddStation(newData);
                  }
                })}
              >
                <FormGroup row>
                  <Label sm="3" for="stationsName">
                    {intl.formatMessage({ id: "name" })}
                  </Label>
                  <Col sm="9">
                    <Input
                      id="stationsName"
                      name="stationsName"
                      innerRef={register({ required: true })}
                      // invalid={errors.stationsName && true}
                      placeholder="Name"
                      value={userData.stationsName || ""}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleOnchange(name, value);
                      }}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3" for="stationsLogo">
                    Logo
                  </Label>

                  <Col sm="9">
                    <FileUploaderBasic
                      setPreviewArr={setPreviewArr}
                      previewArr={previewArr}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3" for="stationsHotline">
                    Hotline
                  </Label>

                  <Col sm="9">
                    <Input
                      id="stationsHotline"
                      name="stationsHotline"
                      innerRef={register()}
                      // invalid={errors.stationsHotline && true}
                      placeholder="Hotline"
                      value={userData.stationsHotline || ""}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleOnchange(name, value);
                      }}
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="3" for="stationsAddress">
                    {intl.formatMessage({ id: "address" })}
                  </Label>

                  <Col sm="9">
                    <Input
                      name="stationsAddress"
                      id="stationsAddress"
                      innerRef={register()}
                      // invalid={errors.stationsAddress && true}
                      value={userData.stationsAddress || ""}
                      placeholder={intl.formatMessage({ id: "address" })}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleOnchange(name, value);
                      }}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3" for="stationUrl">
                    {intl.formatMessage({ id: "station_url" })}
                  </Label>

                  <Col sm="9">
                    <Input
                      name="stationUrl"
                      id="stationUrl"
                      innerRef={register()}
                      // invalid={errors.stationUrl && true}
                      value={userData.stationUrl || ""}
                      placeholder={intl.formatMessage({ id: "station_url" })}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleOnchange(name, value);
                      }}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3" for="stationWebhookUrl">
                    {intl.formatMessage({ id: "stationWebhookUrl" })}
                  </Label>

                  <Col sm="9">
                    <Input
                      name="stationWebhookUrl"
                      id="stationWebhookUrl"
                      innerRef={register()}
                      // invalid={errors.stationWebhookUrl && true}
                      value={userData.stationWebhookUrl || ""}
                      placeholder={intl.formatMessage({
                        id: "stationWebhookUrl",
                      })}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleOnchange(name, value);
                      }}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3" for="stationLandingPageUrl">
                    {intl.formatMessage({ id: "stationLandingPageUrl" })}
                  </Label>

                  <Col sm="9">
                    <Input
                      name="stationLandingPageUrl"
                      id="stationLandingPageUrl"
                      innerRef={register()}
                      // invalid={errors.stationLandingPageUrl && true}
                      value={userData.stationLandingPageUrl || ""}
                      placeholder={intl.formatMessage({
                        id: "stationLandingPageUrl",
                      })}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleOnchange(name, value);
                      }}
                    />
                  </Col>
                </FormGroup>

                <div className="row">
                  <Label sm="3">
                    {intl.formatMessage(
                      { id: "stationUseCustomSMSBrand" },
                      {
                        type: intl
                          .formatMessage({ id: "advertising" })
                          .toLowerCase(),
                      }
                    )}
                  </Label>

                  <Col sm="9">
                    <MySwitch
                      checked={
                        userData && userData.stationsEnableAd === 1
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        onChangeAdStatus({
                          stationsId: userData.stationsId,
                          stationsEnableAd: e.target.checked ? 1 : 0,
                        });
                      }}
                    />
                  </Col>
                </div>

                {userData.stationsEnableAd === 1 ? (
                  <>
                    <FormGroup row>
                      <Label sm="3" for="stationsCustomAdBannerLeft">
                        {intl.formatMessage({ id: "leftBanner" })}
                      </Label>

                      <Col sm="9">
                        <FileUploaderBasic
                          setPreviewArr={setPreviewLeftBanner}
                          previewArr={previewLeftBanner}
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Label sm="3" for="stationsCustomAdBannerRight">
                        {intl.formatMessage({ id: "rightBanner" })}
                      </Label>

                      <Col sm="9">
                        <FileUploaderBasic
                          setPreviewArr={setPreviewRightBanner}
                          previewArr={previewRightBanner}
                        />
                      </Col>
                    </FormGroup>
                  </>
                ) : (
                  <> </>
                )}

                <FormGroup className="d-flex mb-0 justify-content-center">
                  <Button.Ripple className="mr-1" color="primary" type="submit">
                    {intl.formatMessage({ id: "submit" })}
                  </Button.Ripple>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </div>
      </Card>
    </Fragment>
  );
};
export default injectIntl(memo(FormStation));
