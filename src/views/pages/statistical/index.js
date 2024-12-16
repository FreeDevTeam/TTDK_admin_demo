import _ from "lodash";
import moment from "moment";
import { Fragment, memo, useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import {
  Card,
  Col,
  Row,
} from "reactstrap";

import Service from "../../../services/request";
import OverviewChart from "./OverviewChart";
import WidgetStatistic from "./WidgetStatistic";
import { toast } from "react-toastify";

function MessageStatitical({ intl }) {
  const [data, setData] = useState({});

  function fetchStatistic() {
    Service.send({
      method: "POST",
      path: "CustomerMessage/reportTotalSMSByStation",
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res;
        if (statusCode === 200) {
          setData(data);
        } else {
          toast.warn(
            intl.formatMessage(
              { id: "actionFailed" },
              { action: intl.formatMessage({ id: "fetchData" }) }
            )
          );
        }
      }
    });
  }

  useEffect(() => {
    fetchStatistic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <Card>
        <h1 className="text-center my-2">
          {intl.formatMessage({ id: "table-message-statistic" })}
        </h1>

        <Row>
          <Col md="4">
            <OverviewChart intl={intl} data={data} />
          </Col>

          <Col md="8">
            <WidgetStatistic intl={intl} data={data} />
          </Col>
        </Row>
      </Card>
    </Fragment>
  );
}

export default injectIntl(memo(MessageStatitical));
