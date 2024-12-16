import moment from "moment";
import { Fragment, memo, useEffect, useState } from "react";

import { ChevronLeft } from "react-feather";
import { injectIntl } from "react-intl";

import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import { Card, Col, Row } from "reactstrap";

import Service from "../../../services/request";
import "./messages.scss";

function Messages({ intl }) {
  const history = useHistory();
  const { state } = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(state || {});

  function fetchMessages(isNoLoading, messageId) {
    if (!isNoLoading) {
      setIsLoading(true);
    }

    Service.send({
      method: "POST",
      path: "CustomerMessage/getDetailById",
      data: {
        id: messageId,
      },
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res;

        if (statusCode === 200) {
          setMessage(data);
        } else {
          toast.warn(
            intl.formatMessage(
              { id: "actionFailed" },
              { action: intl.formatMessage({ id: "fetchData" }) }
            )
          );
          history.push("/pages/sent-messages");
          return;
        }
      }

      if (!isNoLoading) {
        setIsLoading(false);
      }
    });
  }

  useEffect(() => {
    fetchMessages(false, message?.messageCustomerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message?.messageCustomerId]);

  return (
    <Fragment>
      <Card>
        <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
          <ChevronLeft />
          {intl.formatMessage({ id: "goBack" })}
        </div>

        <h1 className="text-center my-4">
          {intl.formatMessage({ id: "table-message-detail" })}
        </h1>

        <Row>
          <Col md="6">
            <Row>
              <Col className="d-flex align-items-center mt-sm-0 mt-1 px-4 pb-1"><h3>Thông tin SMS</h3></Col>
            
              <Col
                sm="12"
                className="d-flex align-items-center mt-sm-0 mt-1 px-4 pb-1"
              >
                <label className="mb-0 width-180">
                  {intl.formatMessage({
                    id: "messagesDetail-messageCustomerId",
                  })}
                  :
                </label>
                <span>{message?.messageCustomerId}</span>
              </Col>
              <Col
                sm="12"
                className="d-flex align-items-center mt-sm-0 mt-1 px-4 pb-1"
              >
                <label className="mb-0 width-180">
                  {intl.formatMessage({
                    id: "messagesDetail-customerMessagePhone",
                  })}
                  :
                </label>
                <span>{message?.customerMessagePhone}</span>
              </Col>

              <Col
                sm="12"
                className="d-flex align-items-center mt-sm-0 mt-1 px-4 pb-1"
              >
                <label className="mb-0 width-180">
                  {intl.formatMessage({
                    id: "messagesDetail-customerMessagePlateNumber",
                  })}
                  :
                </label>
                <span>{message?.customerMessagePlateNumber}</span>
              </Col>
              <Col
                sm="12"
                className="d-flex align-items-center mt-sm-0 mt-1 px-4 pb-1"
              >
                <label className="mb-0 width-180">
                  {intl.formatMessage({ id: "messagesDetail-stationsName" })}:
                </label>
                <span>{message?.stationsName}</span>
              </Col>
              <Col
                sm="12"
                className="d-flex align-items-center mt-sm-0 mt-1 px-4 pb-1"
              >
                <label className="mb-0 width-180">
                  {intl.formatMessage({
                    id: "messagesDetail-messageSendStatus",
                  })}
                  :
                </label>
                <span>
                  {intl.formatMessage({
                    id: message?.messageSendStatus?.toLowerCase(),
                  })}
                </span>
              </Col>
              <Col
                sm="12"
                className="d-flex align-items-center mt-sm-0 mt-1 px-4 pb-1"
              >
                <label className="mb-0 width-180">
                  {intl.formatMessage({
                    id: "messagesDetail-customerMessageTitle",
                  })}
                  :
                </label>
                <span>{message?.customerMessageTitle}</span>
              </Col>
              <Col
                sm="12"
                className="d-flex align-items-center mt-sm-0 mt-1 px-4 pb-1"
              >
                <label className="mb-0 width-180">
                  {intl.formatMessage({
                    id: "messagesDetail-customerMessageContent",
                  })}
                  :
                </label>
                <span>{message?.customerMessageContent}</span>
              </Col>
              <Col
                sm="12"
                className="d-flex align-items-center mt-sm-0 mt-1 px-4 pb-1"
              >
                <label className="mb-0 width-180">
                  {intl.formatMessage({ id: "messagesDetail-createdAt" })}:
                </label>
                <span>
                  {message?.createdAt &&
                    moment(message.createdAt).format("hh:mm DD/MM/YYYY")}
                </span>
              </Col>
              <Col
                sm="12"
                className="d-flex align-items-center mt-sm-0 mt-1 px-4 pb-1"
              >
                <label className="mb-0 width-180">
                  {intl.formatMessage({ id: "messagesDetail-messageNote" })}:
                </label>
                <span>{message?.messageNote}</span>
              </Col>
            </Row>
          </Col>

          <Col md="6">
            <Row>
              <Col className="d-flex align-items-center mt-sm-0 mt-1 px-4 pb-1"><h3>Thông tin nhà cung cấp</h3></Col>
              <Col
                sm="12"
                className="d-flex align-items-center mt-sm-0 mt-1 px-4 pb-1"
              >
                <label className="mb-0 width-180">
                  {intl.formatMessage({
                    id: "messagesDetail-externalProvider",
                  })}
                  :
                </label>
                <span>{message?.externalProvider}</span>
              </Col>
              <Col
                sm="12"
                className="d-flex align-items-center mt-sm-0 mt-1 px-4 pb-1"
              >
                <label className="mb-0 width-180">
                  {intl.formatMessage({ id: "messagesDetail-messageSendDate" })}
                  :
                </label>
                <span>
                  {message?.messageSendDate &&
                    moment(message.messageSendDate).format("hh:mm DD/MM/YYYY")}
                </span>
              </Col>

              <Col
                sm="12"
                className="d-flex align-items-center mt-sm-0 mt-1 px-4 pb-1"
              >
                <label className="mb-0 width-180">
                  {intl.formatMessage({
                    id: "messagesDetail-customerReceiveDate",
                  })}
                  :
                </label>
                <span>
                  {message?.customerReceiveDate &&
                    moment(message.customerReceiveDate).format(
                      "hh:mm DD/MM/YYYY"
                    )}
                </span>
              </Col>
              <Col
                sm="12"
                className="d-flex align-items-center mt-sm-0 mt-1 px-4 pb-1"
              >
                <label className="mb-0 width-180">
                  {intl.formatMessage({
                    id: "messagesDetail-externalReceiveDate",
                  })}
                  :
                </label>
                <span>
                  {message?.externalReceiveDate &&
                    moment(message.externalReceiveDate).format(
                      "hh:mm DD/MM/YYYY"
                    )}
                </span>
              </Col>

              <Col
                sm="12"
                className="d-flex align-items-center mt-sm-0 mt-1 px-4 pb-1"
              >
                <label className="mb-0 width-180">
                  {intl.formatMessage({ id: "messagesDetail-externalResult" })}:
                </label>
                <span>{message?.externalResult}</span>
              </Col>
              <Col
                sm="12"
                className="d-flex align-items-center mt-sm-0 mt-1 px-4 pb-1"
              >
                <label className="mb-0 width-180">
                  {intl.formatMessage({ id: "messagesDetail-externalInfo" })}:
                </label>
                <span>{message?.externalInfo}</span>
              </Col>
              {/* . */}
            </Row>
          </Col>
        </Row>
      </Card>
    </Fragment>
  );
}

export default injectIntl(memo(Messages));
