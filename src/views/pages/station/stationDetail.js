import { useState, useEffect } from "react";
import { Row, Col, Container, Button } from "reactstrap";
import { Plus, Info, Trash2 } from "react-feather";
import { Link } from "react-router-dom";
import Service from "../../../services/request";
import { toast } from "react-toastify";
import edit from "@src/assets/images/pages/edit-document.jpg";

const RowInfo = ({ label, value, type = "", valueType = "", status }) => (
  <Row id="general-row">
    <Col xs="4" id={type}>
      {label}
    </Col>
    {value && (
      <Col xs="8" id={valueType} data-status={status}>
        {value}
      </Col>
    )}
  </Row>
);

const RowSeparateLine = () => <div id="row-separateline"></div>;

const GeneralStationInfo = (props) => {
  const [generalInfo, setGeneralInfo] = useState({});
  function handleGetStatioById(id) {
    Service.send({
      method: "POST",
      path: "Stations/getDetailById",
      data: {
        id: id,
      },
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res;
        if (statusCode === 200) {
          setGeneralInfo(data);
        } else {
          toast.warn(
            props.intl.formatMessage(
              { id: "actionFailed" },
              { action: props.intl.formatMessage({ id: "add" }) }
            )
          );
        }
      }
    });
  }

  useEffect(() => {
    handleGetStatioById(props.generalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.generalId]);

  const { stationsName, stationsAddress, stationsEmail, stationsHotline } =
    generalInfo;
  return (
    <div id="general-form" style={{ marginBottom: "20px" }}>
      <div id="general-header">
        <div id="general-title">Thông tin chung</div>
        <div id="btn-update">
          Cập nhật <img src={edit} alt="update" className="img-fluid" />
        </div>
      </div>
      <Container>
        <RowInfo label="Tên trạm" value={stationsName} />
        <RowInfo label="Địa chỉ" value={stationsAddress} />
        <RowInfo label="Email" value={stationsEmail} />
        <RowInfo label="Số điện thoại" value={stationsHotline} />
        <RowInfo label="Fax" value={stationsHotline} />
      </Container>
      <RowSeparateLine />
      <Container>
        <RowInfo label="Giám đốc" value="Nguyễn Mạnh Hùng" />
        <RowInfo
          label="Địa chỉ"
          value="18 Phạm Hùng - P. Mỹ Đình 2 - Q. Nam Từ Liêm - TP. Hà Nội​"
        />
        <RowInfo label="Số điện thoại" value="(024) - 37684715" />
        <RowInfo label="Email" value="tonggiamdoc@ttkd.com.vn" />
      </Container>
      <RowSeparateLine />
      <Container>
        <RowInfo label="Phó giám đốc" value="Nguyễn Văn Anh" />
        <RowInfo
          label="Địa chỉ"
          value="18 Phạm Hùng - P. Mỹ Đình 2 - Q. Nam Từ Liêm - TP. Hà Nội​"
        />
        <RowInfo label="Số điện thoại" value="(024) - 37684715" />
        <RowInfo label="Email" value="tonggiamdoc@ttkd.com.vn" />
      </Container>
      <RowSeparateLine />
      <Container>
        <RowInfo label="Tổng số nhân viên" value="30" />
        <RowInfo label="Tổng số Camera tại trạm" value="12" />
      </Container>
    </div>
  );
};

const CameraCard = (props) => {
  const { index, status = true } = props;
  return (
    <>
      <RowSeparateLine />
      <Container>
        <RowInfo label={`Camera số ${index}`} type="camera-title" />
        <RowInfo label="Model" value="Hikvision DS-2CD1123G0E-I" />
        <RowInfo label="Số series" value="123456CAM2089" />
        <RowInfo label="Kết nối" value="RTSP" />
        <RowInfo
          label="Trạng thái"
          value={status ? "Hoạt động" : "Đã tắt"}
          status={status}
          valueType="camera-status"
        />
        <RowInfo label="Xem live" value={<Link>Xem live CAM</Link>} />
        <div className="d-flex">
          <Button className="mr-1" color="primary" outline>
            Chi tiết <Info className="pointer" size={14} />
          </Button>
          <Button color="danger" outline>
            Xoá <Trash2 className="pointer" size={14} />
          </Button>
        </div>
      </Container>
    </>
  );
};

export const ListCamera = ({ Paging }) => {
  return (
    <div id="camera-form">
      <div id="general-header">
        <div>
          <span id="page-title">Danh sách Camera</span>
          <span id="number-station">30 Camera</span>
        </div>
        <div id="btn-update">
          Thêm Camera <Plus className="pointer" size={14} />
        </div>
      </div>
      <CameraCard index="1" />
      <CameraCard index="2" status={false} />
      <CameraCard index="3" />
      <Paging />
    </div>
  );
};

export default GeneralStationInfo;
