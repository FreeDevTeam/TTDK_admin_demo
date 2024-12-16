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
  Modal, ModalHeader, ModalBody
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
import Device from "./Device";
import Schedule from "./Schedule";
import Staff from "./Staff";
import SetAppointment from './setAppointment'
import SationService from '../../../services/station'
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
  const [modalone, setModalone] = useState(false)
  const [modaltwo, setModaltwo] = useState(false)

  let tabSchedule = '2'
  let tabStaff = '3'
  let tabDecive = '4' 
  let tabSetAppointment = '5'

  const CONTRACT_STATUS = [
    { value: 1, label: intl.formatMessage({ id: "new-contract" }) },
    { value: 10, label: intl.formatMessage({ id: "processing-contract" }) },
    { value: 20, label: intl.formatMessage({ id: "pending-contract" }) },
    { value: 30, label: intl.formatMessage({ id: "completed-contract" }) },
    { value: 40, label: intl.formatMessage({ id: "canceled-contract" }) },
    { value: 50, label: intl.formatMessage({ id: "destroyed-contract" }) },
  ];

  function fetchAllStationsArea(){
    SationService.fetchAllStationsArea().then((res) => {
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
      SationService.getStaionById({
        id: userData.stationsId,
      },).then((res) => {
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
        stationArea : userData.stationArea,
        stationsManagerPhone : userData.stationsManagerPhone
      },
    };
    if (previewArr[0]) {
      params.data.stationsLogo = previewArr[0].imageUrl;
    } else if (
      userData.stationsLogo === undefined ||
      userData.stationsLogo === null
    ) {
      return SationService.handleUpdateData(params).then((res) => {
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

    SationService.handleUpdateData(params).then((res) => {
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

    SationService.handleAddStation(item).then((res) => {
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
    SationService.onChangeAdStatus(newStatus).then((res) => {
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
                {/* <NavItem>  // tạm đóng
                  <NavLink
                    className={classnames({
                      active: activeTab === tabSchedule,
                    })}
                    onClick={() => {
                      setActiveTab(tabSchedule);
                    }}
                  >
                    {capitalizeTheFirstLetterOfEachWord(
                      intl.formatMessage({ id: "schedules" })
                    )}
                  </NavLink>
                </NavItem> */}
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === tabStaff,
                    })}
                    onClick={() => {
                      setActiveTab(tabStaff);
                    }}
                  >
                    {capitalizeTheFirstLetterOfEachWord(
                      intl.formatMessage({ id: "staff" })
                    )}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === tabDecive,
                    })}
                    onClick={() => {
                      setActiveTab(tabDecive);
                    }}
                  >
                    {capitalizeTheFirstLetterOfEachWord(
                      intl.formatMessage({ id: "devices" })
                    )}
                  </NavLink>
                </NavItem>
                {/* <NavItem>   // tạm đóng
                  <NavLink
                    className={classnames({
                      active: activeTab === tabSetAppointment,
                    })}
                    onClick={() => {
                      setActiveTab(tabSetAppointment);
                    }}
                  >
                    {capitalizeTheFirstLetterOfEachWord(
                      intl.formatMessage({ id: "set-appointment" })
                    )}
                  </NavLink>
                </NavItem> */}
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
                      <Label sm="3" for="Area">
                        {intl.formatMessage({ id: "Area" })}
                      </Label>
                      <Col sm="9">
                        <Input
                          name="stationArea"
                          id="stationArea"
                          type='select'
                          innerRef={register()}
                          value={userData.stationArea || ""}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleOnchange(name, value);
                          }}
                        >
                        {area?.map((item) => {
                        return <option value={item.value}>{item.label}</option>
                        })}
                        </Input>
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
                          <Label sm="3" for="stationMapSource">
                            {intl.formatMessage({ id: "stationMapSource" })}
                          </Label>

                          <Col sm="9">
                            <Input
                              name="stationMapSource"
                              id="stationMapSource"
                              type='textarea'
                              rows='3'
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
                              <Button 
                              className="mt-2 mb-2 mr-2" 
                              onClick={() => setModalone(true)}
                              color="success">
                                {intl.formatMessage({ id: "instruction" })}
                              </Button>
                              <Modal 
                                isOpen={modalone}
                                toggle={() => setModalone(false)}
                                size='lg'
                                className={`modal-dialog-centered `}
                                >
                                   <img
                                    src={Instruction}
                                    alt={"instruction"}
                                    width="100%"
                                    />
                              </Modal>
                                    <Button 
                                    className="mt-2 mb-2" 
                                    onClick={() => setModaltwo(true)}
                                    color="info">
                                      {intl.formatMessage({ id: "previewMap" })}
                                    </Button>
                                <Modal 
                                isOpen={modaltwo}
                                toggle={() => setModaltwo(false)}
                                size='lg'
                                className={`modal-dialog-centered `}
                                >
                                   
                                    <div
                                      className="map-iframe"
                                      dangerouslySetInnerHTML={{
                                        __html: userData.stationMapSource,
                                      }}
                                    ></div>
                              </Modal>
                            </div>
                          </Col>
                        </FormGroup>
                      </>
                    )}

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
                      <Label sm="3" for="email">
                      {intl.formatMessage({ id: "email" })}
                      </Label>

                      <Col sm="9">
                        <Input
                          id="stationsEmail"
                          name="stationsEmail"
                          innerRef={register()}
                          value={userData.stationsEmail || ""}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleOnchange(name, value);
                          }}
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Label sm="3" for="stationsManager">
                        {intl.formatMessage({ id: "stationsManager" })}
                      </Label>

                      <Col sm="9">
                        <Input
                          name="stationsResponsiblePersonName"
                          id="stationsResponsiblePersonName"
                          innerRef={register()}
                          value={userData.stationsResponsiblePersonName || ""}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleOnchange(name, value);
                          }}
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Label sm="3" for="station_director">
                        {intl.formatMessage({ id: "station_director" })}
                      </Label>

                      <Col sm="9">
                        <Input
                          name="stationsManager"
                          id="stationsManager"
                          innerRef={register()}
                          value={userData.stationsManager || ""}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleOnchange(name, value);
                          }}
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Label sm="3" for="director_phone">
                        {intl.formatMessage({ id: "director_phone" })}
                      </Label>

                      <Col sm="9">
                        <Input
                          name="stationsManagerPhone"
                          id="stationsManagerPhone"
                          innerRef={register()}
                          value={userData.stationsManagerPhone || ""}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleOnchange(name, value);
                          }}
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Label sm="3" for="director_email">
                        {intl.formatMessage({ id: "director_email" })}
                      </Label>

                      <Col sm="9">
                        <Input
                          name="stationsManagerEmail"
                          id="stationsManagerEmail"
                          innerRef={register()}
                          value={userData.stationsManagerEmail || ""}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleOnchange(name, value);
                          }}
                        />
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
                          type='textarea'
                          rows='5'
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

                    <FormGroup className="d-flex justify-content-center">
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
            <TabPane tabId={tabSchedule}>
              <Schedule stationsId = {userData.stationsId}/>
            </TabPane>
            <TabPane tabId={tabStaff}>
              <Staff stationsId = {userData.stationsId}/>
            </TabPane>
            <TabPane tabId={tabDecive}>
              <Device stationsId = {userData.stationsId}/>
            </TabPane>
            <TabPane tabId={tabSetAppointment}>
              <SetAppointment />
            </TabPane>
          </TabContent>
        </div>
      </Card>
    </Fragment>
  );
};
export default injectIntl(memo(FormStation));
