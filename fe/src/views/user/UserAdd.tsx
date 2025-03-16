import { Breadcrumb, Button, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "../../interceptors/axios";
import Cookies from "js-cookie";
import { TErrors, TUnit, TUnitOption } from "../../datatype";
import { VErrors } from "../../datatype/value";
import ToastSuccess from "../../components/ToastSuccess";

export default function UserAdd() {
  const token = Cookies.get("authToken");
  const navigate = useNavigate();

  const [masterUnit, setMasterUnit] = useState<TUnitOption[]>([]);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [idUnit, setIdUnit] = useState<string>("");
  const [namaUnit, setNamaUnit] = useState<string>("");

  const [errors, setErrors] = useState<TErrors>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://6666c7aea2f8516ff7a4e261.mockapi.io/api/dummy-data/masterOffice`
      );
      let data = response.data;
      if (data.length > 0) {
        data = data.map((item: TUnit) => {
          return {
            value: item.id,
            label: item.officeName,
          };
        });
        setMasterUnit(data);
      }
    } catch (error) {
      console.log("error ", error);
    }
  };

  const onChangeSelectUnit = (value: string) => {
    if (masterUnit.length > 0) {
      const selectedUnit: TUnitOption[] = masterUnit.filter(
        (item: TUnitOption) => item.value === value
      );
      if (selectedUnit.length > 0) {
        setIdUnit(selectedUnit[0].value);
        setNamaUnit(selectedUnit[0].label);
      }
    }
  };
  const onChangeSelectRole = (value: string) => {
    setRole(value);
  };

  const toAddUser = async () => {
    setErrors(VErrors);
    setLoading(true);
    try {
      const response = await axios.post(
        `/api/v1/user`,
        {
          username: username,
          password: password,
          konfirmasi_password: konfirmasiPassword,
          role: role,
          id_unit: idUnit,
          nama_unit: namaUnit,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      navigate("/user");
      ToastSuccess(response.data.msg, "top-right");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrors(error.response.data.errors);
      setLoading(false);
    }
  };

  return (
    <Div>
      <div className="c-content-top">
        <div className="c-content-top-left">
          <Button
            className="c-primary"
            type="primary"
            size="large"
            onClick={() => navigate("/user")}
          >
            <LeftOutlined />
          </Button>
          <div>
            <h3>Tambah User</h3>
            <Breadcrumb
              items={[
                {
                  title: <span onClick={() => navigate("/user")}>User</span>,
                },
                {
                  title: (
                    <span onClick={() => navigate("/user_add")}>
                      Tambah User
                    </span>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="c-content-bottom">
        <div className="c-content-bottom-top">
          <h4>Informasi User</h4>
          <div className="row">
            <div className="col-12 col-lg-2">
              <div className="mt-3 fw-bold" style={{ color: "#333333" }}>
                Unit
              </div>
              <Select
                size="large"
                showSearch
                placeholder="Pilih Unit"
                optionFilterProp="label"
                onChange={onChangeSelectUnit}
                options={masterUnit}
                value={idUnit}
              />
              {errors && errors.param === "id_unit" ? (
                <p className="text-danger">{errors.msg}</p>
              ) : (
                ""
              )}
            </div>
            <div className="col-12 col-lg-2">
              <div className="mt-3 fw-bold" style={{ color: "#333333" }}>
                Role
              </div>
              <Select
                size="large"
                showSearch
                placeholder="Pilih Role"
                optionFilterProp="label"
                onChange={onChangeSelectRole}
                options={[
                  {
                    value: "admin",
                    label: "Admin",
                  },
                  {
                    value: "user",
                    label: "User",
                  },
                ]}
                value={role}
              />
              {errors && errors.param === "role" ? (
                <p className="text-danger">{errors.msg}</p>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <hr style={{ margin: "30px 0", border: "2px solid #d9d9d9" }} />

        <div className="row">
          <div className="col-12 col-lg-2">
            <div className="mt-3 fw-bold" style={{ color: "#333333" }}>
              Username
            </div>
            <Input
              size="large"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            {errors && errors.param === "username" ? (
              <p className="text-danger">{errors.msg}</p>
            ) : (
              ""
            )}
          </div>
          <div className="col-12 col-lg-2">
            <div className="mt-3 fw-bold" style={{ color: "#333333" }}>
              Password
            </div>
            <Input
              type="password"
              size="large"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {errors && errors.param === "password" ? (
              <p className="text-danger">{errors.msg}</p>
            ) : (
              ""
            )}
          </div>
          <div className="col-12 col-lg-2">
            <div className="mt-3 fw-bold" style={{ color: "#333333" }}>
              Konfirmasi Password
            </div>
            <Input
              type="password"
              size="large"
              placeholder="Konfirmasi Password"
              onChange={(e) => setKonfirmasiPassword(e.target.value)}
              value={konfirmasiPassword}
            />
            {errors && errors.param === "konfirmasi_password" ? (
              <p className="text-danger">{errors.msg}</p>
            ) : (
              ""
            )}
          </div>
        </div>

        <hr style={{ margin: "30px 0", border: "2px solid #d9d9d9" }} />

        <div className="c-content-bottom-bottom">
          <Button
            color="danger"
            variant="text"
            size="large"
            onClick={() => navigate("/user")}
          >
            Batal
          </Button>
          <Button
            className="c-primary"
            type="primary"
            size="large"
            onClick={() => toAddUser()}
            disabled={loading}
            loading={loading}
          >
            Simpan
          </Button>
        </div>
      </div>
    </Div>
  );
}

const Div = styled.div`
  .c-content-top-left {
    display: flex;
    gap: 20px;
  }
  .c-content-bottom-bottom {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
`;
