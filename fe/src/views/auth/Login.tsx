import styled from "styled-components";
import { Input, Form, Button } from "antd";
import logo from "../../assets/iconplus-login.png";
import { useNavigate } from "react-router-dom";
import axios from "../../interceptors/axios";
import { TErrors } from "../../datatype";
import { VErrors } from "../../datatype/value";
import Cookies from "js-cookie";

// HANDLE REDUX
import { useDispatch } from "react-redux";
import { authLogin } from "../../redux/auth/action";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<TErrors>();
  const [loading, setLoading] = useState<boolean>(false);

  const toSignIn = async () => {
    setErrors(VErrors);
    setLoading(true);
    try {
      const response = await axios.post("/api/v1/auth/signin", {
        username: username,
        password: password,
      });
      Cookies.set("authToken", response.data.token);
      dispatch(authLogin(response.data.data));
      if (
        response.data.data.role === "superadmin" ||
        response.data.data.role === "admin"
      ) {
        navigate("/dashboard");
      } else {
        navigate("/meeting");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrors(error.response.data.errors);
      setLoading(false);
    }
  };

  return (
    <Div>
      <div className="c-login-container">
        <div>
          <div className="text-center">
            <img src={logo} alt={logo} width={120} />
          </div>
          <div className="c-login-title mt-2 mb-4">
            <h5>Hai,</h5>
            <h4>Silahkan Login</h4>
          </div>
        </div>
        <div className="c-login-content">
          <form>
            <div className="form-group mt-3">
              <Form.Item>
                <Input
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
              </Form.Item>
              {errors && errors.param === "username" ? (
                <p className="text-danger px-2">{errors.msg}</p>
              ) : (
                ""
              )}
            </div>
            <div className="form-group mt-3">
              <Form.Item>
                <Input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </Form.Item>
              {errors && errors.param === "password" ? (
                <p className="text-danger px-2">{errors.msg}</p>
              ) : (
                ""
              )}
            </div>
            <div className="c-login-footer mt-3">
              <Button
                type="primary"
                size="large"
                className="btn c-btn-login"
                disabled={loading}
                loading={loading}
                onClick={() => toSignIn()}
              >
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Div>
  );
}

const Div = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  .c-login-container {
    width: 300px;
    background-color: #fff;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 20px #6a6a6a1a;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
  .ant-input,
  .ant-row,
  .ant-input-affix-wrapper {
    background-color: #afecff;
    backdrop-filter: blur(5px) !important;
    -webkit-backdrop-filter: blur(5px) !important;
    border-radius: 10px;
    border-radius: 20px;
    padding: 4px 11px;
    border: 1px solid transparent !important;
  }
  .ant-input-password {
    box-shadow: none !important;
    border: 1px solid transparent !important;
  }
  .ant-input:focus,
  .ant-input-password:hover,
  .ant-input-password:focus {
    box-shadow: none !important;
    border: 1px solid transparent !important;
  }
  .c-btn-login {
    border-radius: 20px;
    width: 100%;
    color: white;
    font-size: 14px;
    padding: 9px 0;
    background-color: #397e95;
  }
  .c-btn-login:hover {
    background-color: #296377 !important;
  }
`;
