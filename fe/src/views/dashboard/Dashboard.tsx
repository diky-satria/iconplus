import React, { useEffect, useState } from "react";
import { Card, Select, Progress, Typography } from "antd";
import {
  RightOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "../../interceptors/axios";
import Cookies from "js-cookie";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const currentMonth = dayjs().format("YYYY-MM");

const itemSelect = [
  {
    value: "2025-04",
    label: "April 2025",
  },
  {
    value: "2025-03",
    label: "Maret 2025",
  },
];

export default function Dashboard() {
  const token = Cookies.get("authToken");
  const navigate = useNavigate();

  const [periode, setPeriode] = useState<string>(currentMonth);
  const [dataMain, setDataMain] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/v1/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = response.data.data;
      const filteredData = res.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any) => item.periode === currentMonth
      );

      setDataMain(res);
      if (filteredData.length > 0) {
        setData(filteredData[0].data);
      }
    } catch (error) {
      console.log("error ", error);
    }
  };

  const onChangePeriode = (value: string) => {
    setPeriode(value);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredData = dataMain.filter((item: any) => item.periode === value);
    setData(filteredData[0].data);
  };

  const numberFormat = (value1: number, value2: number, value3: number) => {
    const value = value1 + value2 + value3;
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <Div>
      <div className="c-navbar-dashboard">
        <div className="d-flex align-items-center gap-2">
          <SettingOutlined style={{ fontSize: 28 }} />
          <h5 style={{ marginBottom: 0 }}>DASHBOARD</h5>
        </div>
        <span
          onClick={() => navigate("/meeting")}
          style={{ cursor: "pointer" }}
        >
          <RightOutlined />
        </span>
      </div>
      <div className="c-content-dashboard">
        <div className="row">
          <div className="col-12 col-md-2 mb-3">
            <div style={{ marginBottom: 5, fontSize: 14 }}>Periode</div>
            <Select
              size="large"
              showSearch
              placeholder="Pilih Periode"
              defaultValue={currentMonth}
              optionFilterProp="label"
              onChange={onChangePeriode}
              options={itemSelect}
              value={periode}
            />
          </div>
        </div>
        <div style={{ marginBottom: 30 }}>
          <div className="row justify-content-between">
            {data.map((d, index) => {
              return (
                <div
                  className="col-12 col-md-4 col-lg-2 col-xl-2 mb-3"
                  key={index}
                >
                  <Title level={4} style={{ color: "#555" }}>
                    <ThunderboltOutlined
                      style={{
                        borderRadius: "50%",
                        border: "1px solid #555",
                        padding: 3,
                      }}
                    />{" "}
                    {d.officeName}
                  </Title>

                  {d.detailSummary.map((ds, i) => {
                    return (
                      <div className="row mx-1 mt-3" key={i}>
                        <Card>
                          <h6 style={{ color: "#555" }}>{ds.roomName}</h6>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 10,
                              marginTop: 15,
                            }}
                          >
                            <div>
                              <Text style={{ color: "#555" }}>
                                Persentase Pemakaian
                              </Text>
                              <h4 style={{ fontWeight: "bold" }}>
                                {ds.averageOccupancyPerMonth}%
                              </h4>
                            </div>
                            <Progress
                              type="circle"
                              percent={ds.averageOccupancyPerMonth}
                              size={50}
                              strokeWidth={20}
                              strokeColor={"#00A3E9"}
                              showInfo={false}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 10,
                              marginTop: 10,
                            }}
                          >
                            <div>
                              <Text style={{ color: "#555" }}>
                                Nominal Konsumsi
                              </Text>
                              <h4 style={{ fontWeight: "bold" }}>
                                Rp.{" "}
                                {numberFormat(
                                  ds.totalConsumption[0].totalPrice,
                                  ds.totalConsumption[1].totalPrice,
                                  ds.totalConsumption[2].totalPrice
                                )}
                              </h4>
                            </div>
                          </div>
                          <div className="mt-1">
                            <table width={"100%"}>
                              <tbody>
                                <tr>
                                  <td width={"40%"}>
                                    <Text style={{ fontWeight: "bold" }}>
                                      Snack Siang
                                    </Text>
                                  </td>
                                  <td>
                                    <Text>
                                      {ds.totalConsumption[0].totalPackage}
                                    </Text>
                                    <Progress
                                      strokeWidth={13}
                                      percent={
                                        (ds.totalConsumption[0].totalPackage /
                                          300) *
                                        100
                                      }
                                      percentPosition={{
                                        align: "start",
                                        type: "outer",
                                      }}
                                      style={{ paddingBottom: 10 }}
                                      showInfo={false}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <Text style={{ fontWeight: "bold" }}>
                                      Makan Siang
                                    </Text>
                                  </td>
                                  <td>
                                    <Text>
                                      {ds.totalConsumption[1].totalPackage}
                                    </Text>
                                    <Progress
                                      strokeWidth={13}
                                      percent={
                                        (ds.totalConsumption[1].totalPackage /
                                          300) *
                                        100
                                      }
                                      percentPosition={{
                                        align: "start",
                                        type: "outer",
                                      }}
                                      style={{ paddingBottom: 10 }}
                                      showInfo={false}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <Text style={{ fontWeight: "bold" }}>
                                      Snack Sore
                                    </Text>
                                  </td>
                                  <td>
                                    <Text>
                                      {ds.totalConsumption[2].totalPackage}
                                    </Text>
                                    <Progress
                                      strokeWidth={13}
                                      percent={
                                        (ds.totalConsumption[2].totalPackage /
                                          300) *
                                        100
                                      }
                                      percentPosition={{
                                        align: "start",
                                        type: "outer",
                                      }}
                                      style={{ paddingBottom: 10 }}
                                      showInfo={false}
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Div>
  );
}

const Div = styled.div`
  .c-navbar-dashboard {
    width: 100%;
    height: 56px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    border-bottom: 1px solid #e0e0e0;
    background-color: #fff;
    position: fixed;
    top: 0;
    z-index: 10;
  }
  .c-content-dashboard {
    margin-top: 80px;
    padding: 0 20px;
  }
  .ant-card {
    background-color: #f2f2f2;
    .ant-card-body {
      padding: 10px;
    }
  }
  .row {
    --bs-gutter-x: 0px !important;
  }
  .ant-progress-outer {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: baseline;
    gap: 6px;
  }
`;
