// @ts-nocheck
// ** React Imports
import { Fragment, useState, memo, useEffect } from "react";
// ** Store & Actions
import { toast } from "react-toastify";
import { ChevronLeft } from "react-feather";
import _ from "lodash";
import "./index.scss";
import { useForm } from "react-hook-form";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Service from "../../../services/request";
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
  Button,
  FormGroup,
  Form,
  Nav,
  NavLink,
  NavItem,
  TabContent,
  TabPane,
} from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { useLocation } from "react-router-dom";
import { injectIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import classnames from "classnames";
import MySwitch from "../../components/switch";
import Instruction from "../../../assets/images/gif/instruction.gif";
import { capitalizeTheFirstLetterOfEachWord } from "../../../helper/common";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";

const FormStation = ({ intl }) => {
  // ** Store Vars
  const { state } = useLocation();

  const [hasImage, setHasImage] = useState(!!state.stationsLogo);

  const [previewArr, setPreviewArr] = useState([]);
  const [previewLeftBanner, setPreviewLeftBanner] = useState([]);
  const [previewRightBanner, setPreviewRightBanner] = useState([]);
  const [userData, setUserData] = useState(state || {});
  const history = useHistory();
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {},
  });

  const [activeTab, setActiveTab] = useState("1");
  const [stationReport, setStationReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [contractStatus, setContractStatus] = useState(1);
  const [area, setArea] = useState([])
  const [stationArea, setStationArea] = useState('')

  const CONTRACT_STATUS = [
    { value: 1, label: intl.formatMessage({ id: "new-contract" }) },
    { value: 10, label: intl.formatMessage({ id: "processing-contract" }) },
    { value: 20, label: intl.formatMessage({ id: "pending-contract" }) },
    { value: 30, label: intl.formatMessage({ id: "completed-contract" }) },
    { value: 40, label: intl.formatMessage({ id: "canceled-contract" }) },
    { value: 50, label: intl.formatMessage({ id: "destroyed-contract" }) },
  ];

  function fetchAllStationsArea(){
    Service.send({
      method: 'POST',
      path: 'Stations/getAllStationArea',
      data : null
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          // setArea(data)
          setArea(
            data.map((area) => {
              return { label: area.value, value: area.value }
            })
          )
        } else {
          toast.warn(
            intl.formatMessage(
              { id: 'actionFailed' },
              { action: intl.formatMessage({ id: 'fetchData' }) }
            )
          )
        }
      }
    })
  }

  useEffect(() => {
    const getStaion = () => {
      Service.send({
        method: "POST",
        path: "Stations/getDetailById",
        data: {
          id: userData.stationsId,
        },
        query: null,
      }).then((res) => {
        if (res) {
          const { data, statusCode } = res;
          if (statusCode === 200) {
            setStationReport(data.report);
          } else {
            toast.warn(
              intl.formatMessage(
                { id: "actionFailed" },
                { action: intl.formatMessage({ id: "fetchData" }) }
              )
            );
          }
        }
        setIsLoading(false);
      });
    };


    setContractStatus(userData.stationContractStatus);
    if (userData.stationsId) {
      // edit case
      setIsLoading(true);

      getStaion();
    }
    fetchAllStationsArea()
  }, []);

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
        stationMapSource: data.data.stationMapSource,
        stationsManager: data.data.stationsManager,
        stationsLicense: data.data.stationsLicense,
        stationsCertification: data.data.stationsCertification,
        stationsVerifyStatus: Number(userData.stationsVerifyStatus),
        stationStatus: Number(userData.stationStatus),
        stationsNote: data.data.stationsNote,
        stationContractStatus: contractStatus,
        stationArea : stationArea
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
      params.data.stationsLogo = !hasImage ? "" : userData.stationsLogo;
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
    Object.keys(item).forEach((key) => {
      if (!item[key]) delete item[key];
    });

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

  if (isLoading) {
    return <ComponentSpinner />;
  }

  return (
    <Fragment>
      <Card className="pb-4">
        <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
          <ChevronLeft />
          {intl.formatMessage({ id: "goBack" })}
        </div>
        <div className="accountAdmin">
          <h3 className="accountAdmin__title">
            {" "}
            {userData.stationsId
              ? intl.formatMessage({ id: "edit" })
              : intl.formatMessage({ id: "add" })}{" "}
            {intl.formatMessage(
              { id: "info" },
              { type: intl.formatMessage({ id: "stations" }) }
            )}
          </h3>

          {userData.stationsId && (
            <>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === "1",
                    })}
                    onClick={() => {
                      setActiveTab("1");
                    }}
                  >
                    {capitalizeTheFirstLetterOfEachWord(
                      intl.formatMessage(
                        { id: "info" },
                        { type: intl.formatMessage({ id: "general" }) }
                      )
                    )}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === "2",
                    })}
                    onClick={() => {
                      setActiveTab("2");
                    }}
                  >
                    {capitalizeTheFirstLetterOfEachWord(
                      intl.formatMessage(
                        { id: "info" },
                        { type: intl.formatMessage({ id: "statistical" }) }
                      )
                    )}
                  </NavLink>
                </NavItem>
              </Nav>
            </>
          )}

          <TabContent className="mt-4" activeTab={activeTab}>
            <TabPane tabId="1">
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
                      <Label sm="3" for="stationCode">
                        {intl.formatMessage({ id: "stationCode" })}
                      </Label>

                      <Col sm="9">
                        <Input
                          name="stationCode"
                          id="stationCode"
                          innerRef={register()}
                          value={userData.stationCode || ""}
                          placeholder={intl.formatMessage({
                            id: "stationCode",
                          })}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleOnchange(name, value);
                          }}
                          disabled={!!userData.stationsId}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm="3" for="stationsName">
                        {intl.formatMessage({ id: "name" })}
                      </Label>
                      <Col sm="9">
                        <Input
                          id="stationsName"
                          name="stationsName"
                          innerRef={register({ required: true })}
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
                      <Label sm="3" for="stationStatus">
                        {intl.formatMessage({ id: "stationStatus" })}
                      </Label>

                      <Col sm="9">
                        <Input
                          type="select"
                          name="stationStatus"
                          id="stationStatus"
                          onChange={(e) =>
                            handleOnchange(
                              "stationStatus",
                              e.target.value
                            )
                          }
                        >
                          <option
                            selected={
                              userData.stationStatus?.toString() === "0"
                            }
                            value="0"
                          >
                            {intl.formatMessage({ id: "not-active" })}
                          </option>
                          <option
                            selected={
                              userData.stationStatus?.toString() === "1"
                            }
                            value="1"
                          >
                            {intl.formatMessage({ id: "actived" })}
                          </option>
                        </Input>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm="3" for="stationsLogo">
                        Logo
                      </Label>

                      <Col sm="9">
                        <FileUploaderBasic
                          setHasImage={setHasImage}
                          hasImage={hasImage}
                          setPreviewArr={setPreviewArr}
                          previewArr={previewArr}
                          stationsLogo={userData.stationsLogo}
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
                      <Label sm="3" for="Area">
                        {intl.formatMessage({ id: "Area" })}
                      </Label>

                      <Col sm="9">
                        <Select
                          theme={selectThemeColors}
                          className="react-select w-100"
                          classNamePrefix="select"
                          name="stationArea"
                          id="stationArea"
                          isClearable={false}
                          placeholder={intl.formatMessage({ id: "chose-area" })}
                          options={_.uniqBy(area, (e) => e.value)}
                          onChange={(row) => {
                            const { value } = row;
                            setStationArea(value)
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
                          value={userData.stationsAddress || ""}
                          placeholder={intl.formatMessage({ id: "address" })}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleOnchange(name, value);
                          }}
                        />
                      </Col>
                    </FormGroup>
                    {userData.stationsId && (
                      <>
                        <FormGroup row>
                          <Label sm="3" for="stationLandingPageUrl">
                            {intl.formatMessage({
                              id: "stationLandingPageUrl",
                            })}
                          </Label>

                          <Col sm="9">
                            <Input
                              name="stationLandingPageUrl"
                              id="stationLandingPageUrl"
                              innerRef={register()}
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
                              placeholder={intl.formatMessage({
                                id: "station_url",
                              })}
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
                          <Label sm="3" for="stationMapSource">
                            {intl.formatMessage({ id: "stationMapSource" })}
                          </Label>

                          <Col sm="9">
                            <Input
                              name="stationMapSource"
                              id="stationMapSource"
                              innerRef={register()}
                              value={userData.stationMapSource || ""}
                              placeholder={intl.formatMessage({
                                id: "stationMapSource",
                              })}
                              onChange={(e) => {
                                const { name, value } = e.target;
                                handleOnchange(name, value);
                              }}
                            />
                            <div>
                              {userData.stationMapSource &&
                                !userData.stationMapSource.startsWith(
                                  "<iframe src="
                                ) && (
                                  <div className="text-danger mb-1">
                                    {intl.formatMessage({
                                      id: "stationMapSourceError",
                                    })}
                                  </div>
                                )}
                              <h3 className="mt-2 mb-2">
                                {intl.formatMessage({ id: "instruction" })}:
                              </h3>
                              <img
                                src={Instruction}
                                alt={"instruction"}
                                width="100%"
                              />
                              {userData.stationMapSource &&
                                userData.stationMapSource.startsWith(
                                  "<iframe src="
                                ) && (
                                  <>
                                    <h3 className="mt-2 mb-2">
                                      {intl.formatMessage({ id: "previewMap" })}
                                      :
                                    </h3>
                                    <div
                                      className="map-iframe"
                                      dangerouslySetInnerHTML={{
                                        __html: userData.stationMapSource,
                                      }}
                                    ></div>
                                  </>
                                )}
                            </div>
                          </Col>
                        </FormGroup>
                      </>
                    )}

                    {userData.stationsId && (
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
                    )}

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
                    <FormGroup row>
                      <Label sm="3" for="stationsManager">
                        {intl.formatMessage({ id: "stationsManager" })}
                      </Label>

                      <Col sm="9">
                        <Input
                          name="stationsManager"
                          id="stationsManager"
                          innerRef={register()}
                          value={userData.stationsManager || ""}
                          placeholder={intl.formatMessage({
                            id: "stationsManager",
                          })}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleOnchange(name, value);
                          }}
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Label sm="3" for="stationsLicense">
                        {intl.formatMessage({ id: "stationsLicense" })}
                      </Label>

                      <Col sm="9">
                        <Input
                          name="stationsLicense"
                          id="stationsLicense"
                          innerRef={register()}
                          value={userData.stationsLicense || ""}
                          placeholder={intl.formatMessage({
                            id: "stationsLicense",
                          })}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleOnchange(name, value);
                          }}
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Label sm="3" for="stationsCertification">
                        {intl.formatMessage({ id: "stationsCertification" })}
                      </Label>

                      <Col sm="9">
                        <Input
                          name="stationsCertification"
                          id="stationsCertification"
                          innerRef={register()}
                          value={userData.stationsCertification || ""}
                          placeholder={intl.formatMessage({
                            id: "stationsCertification",
                          })}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleOnchange(name, value);
                          }}
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Label sm="3" for="stationContractStatus">
                        {intl.formatMessage({ id: "stationContractStatus" })}
                      </Label>

                      <Col sm="9">
                        <Select
                          theme={selectThemeColors}
                          className="react-select w-100"
                          classNamePrefix="select"
                          name="stationsCertification"
                          id="stationsCertification"
                          isClearable={false}
                          defaultValue={{
                            value: CONTRACT_STATUS.find(status => status.value === userData.stationContractStatus)?.value || CONTRACT_STATUS[0].value,
                            label: CONTRACT_STATUS.find(status => status.value === userData.stationContractStatus)?.label || CONTRACT_STATUS[0].label,
                          }}
                          options={CONTRACT_STATUS}
                          onChange={(row) => {
                            const { value } = row;
                            setContractStatus(value)
                          }}
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Label sm="3" for="stationsVerifyStatus">
                        {intl.formatMessage({ id: "stationsVerifyStatus" })}
                      </Label>

                      <Col sm="9">
                        <Input
                          type="select"
                          name="stationsVerifyStatus"
                          id="stationsVerifyStatus"
                          onChange={(e) =>
                            handleOnchange(
                              "stationsVerifyStatus",
                              e.target.value
                            )
                          }
                        >
                          <option
                            selected={
                              userData.stationsVerifyStatus?.toString() === "0"
                            }
                            value="0"
                          >
                            {intl.formatMessage({ id: "not-verified" })}
                          </option>
                          <option
                            selected={
                              userData.stationsVerifyStatus?.toString() === "1"
                            }
                            value="1"
                          >
                            {intl.formatMessage({ id: "verified" })}
                          </option>
                          <option
                            selected={
                              userData.stationsVerifyStatus?.toString() === "2"
                            }
                            value="2"
                          >
                            {intl.formatMessage({ id: "verified-BCT" })}
                          </option>
                        </Input>
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Label sm="3" for="stationsNote">
                        {intl.formatMessage({ id: "stationsNote" })}
                      </Label>

                      <Col sm="9">
                        <Input
                          name="stationsNote"
                          id="stationsNote"
                          innerRef={register()}
                          value={userData.stationsNote || ""}
                          placeholder={intl.formatMessage({
                            id: "stationsNote",
                          })}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleOnchange(name, value);
                          }}
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup className="d-flex mb-0 justify-content-center">
                      <Button.Ripple
                        disabled={
                          userData.stationMapSource &&
                          !userData.stationMapSource.startsWith("<iframe src=")
                        }
                        className="mr-1"
                        color="primary"
                        type="submit"
                      >
                        {intl.formatMessage({ id: "submit" })}
                      </Button.Ripple>
                    </FormGroup>
                  </Form>
                </Col>
              </Row>
            </TabPane>

            {userData.stationsId && (
              <TabPane tabId="2">
                <Row>
                  <Col sm="12">
                    {!stationReport && (
                      <h4>{intl.formatMessage({ id: "empty" })}</h4>
                    )}

                    {stationReport && (
                      <>
                        <div className="mb-3">
                          <p className="mb-50">
                            {intl.formatMessage(
                              { id: "total" },
                              { type: "SMS" }
                            )}
                            : {stationReport.totalSMS.message}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p className="mb-50">
                            {intl.formatMessage(
                              { id: "total" },
                              { type: "Email" }
                            )}
                            : {stationReport.totalEmails}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p className="mb-50">
                            {intl.formatMessage(
                              { id: "total" },
                              { type: "ZNS" }
                            )}
                            : {stationReport.totalZNS}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p className="mb-50">
                            {intl.formatMessage(
                              { id: "total" },
                              { type: intl.formatMessage({ id: "customers" }) }
                            )}
                            : {stationReport.totalCustomers}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p className="mb-50">
                            {intl.formatMessage(
                              { id: "total" },
                              { type: intl.formatMessage({ id: "schedules" }) }
                            )}
                            : {stationReport.totalSchedules}
                          </p>
                        </div>
                      </>
                    )}
                  </Col>
                </Row>
              </TabPane>
            )}
          </TabContent>
        </div>
      </Card>
    </Fragment>
  );
};
export default injectIntl(memo(FormStation));
