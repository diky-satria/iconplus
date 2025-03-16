import React, { useState } from "react";
import {
  HomeOutlined,
  FileOutlined,
  DownOutlined,
  BellOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { IoMegaphoneOutline } from "react-icons/io5";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  Space,
} from "antd";
import styled from "styled-components";
import iconplus from "../../assets/iconplus.png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authLogout } from "../../redux/auth/action";
import Cookies from "js-cookie";

const { Header, Sider, Content } = Layout;

type Props = {
  children: React.ReactNode;
};
type TUserLogin = {
  id: number;
  username: string;
};

const Layout1 = ({ children }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);

  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user } = useSelector((state: TUserLogin | any) => state.auth);

  const toSignOut = () => {
    dispatch(authLogout());
    Cookies.remove("authToken");
    navigate("/");
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <span onClick={() => toSignOut()}>Keluar</span>,
    },
  ];

  const getMenu = (role: string) => {
    if (role === "superadmin") {
      return [
        {
          key: "/dashboard",
          icon: <HomeOutlined />,
          label: (
            <NavLink to="/dashboard" style={{ textDecoration: "none" }}>
              Dashboard
            </NavLink>
          ),
        },
        {
          key: "/meeting",
          icon: <FileOutlined />,
          label: (
            <NavLink to="/meeting" style={{ textDecoration: "none" }}>
              Meeting
            </NavLink>
          ),
        },
        {
          key: "/user",
          icon: <UsergroupAddOutlined />,
          label: (
            <NavLink to="/user" style={{ textDecoration: "none" }}>
              User
            </NavLink>
          ),
        },
      ];
    } else {
      return [
        {
          key: "/dashboard",
          icon: <HomeOutlined />,
          label: (
            <NavLink to="/dashboard" style={{ textDecoration: "none" }}>
              Dashboard
            </NavLink>
          ),
        },
        {
          key: "/meeting",
          icon: <FileOutlined />,
          label: (
            <NavLink to="/meeting" style={{ textDecoration: "none" }}>
              Meeting
            </NavLink>
          ),
        },
      ];
    }
  };

  return (
    <Div>
      <Layout>
        <Header
          className="c-header"
          style={{
            position: "sticky",
            top: 0,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
          }}
        >
          <div className="c-header-left">
            <img src={iconplus} alt="iconplus" />
          </div>

          <div className="c-header-right">
            <Button
              className="c-primary"
              type="primary"
              icon={<IoMegaphoneOutline />}
            >
              Kontak Aduan
            </Button>
            <Badge>
              <BellOutlined className="c-header-right-bell" />
            </Badge>
            <Avatar
              className="c-header-right-avatar"
              src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
            />
            <Dropdown menu={{ items }} placement="bottomRight">
              <a onClick={(e) => e.preventDefault()}>
                <Space style={{ color: "#fff" }}>
                  {user.username}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        </Header>
        <Layout>
          <Sider
            trigger={null}
            className="c-sidebar"
            collapsible
            collapsed={collapsed}
            onMouseEnter={() => setCollapsed(false)}
            onMouseLeave={() => setCollapsed(true)}
          >
            <div className="demo-logo-vertical" />
            <Menu
              theme="light"
              mode="inline"
              defaultSelectedKeys={[location.pathname]}
              items={getMenu(user.role)}
            />
          </Sider>
        </Layout>
        <Content className="c-content">{children}</Content>
      </Layout>
    </Div>
  );
};

const Div = styled.div`
  .c-header {
    height: 68px;
    z-index: 1001;
    padding: 0;
    background-image: linear-gradient(to right, #18a2ba, #296377);
    .c-header-right {
      display: flex;
      align-items: center;
      gap: 20px;
      .c-header-right-bell {
        font-size: 20px;
        color: #fff;
      }
      .c-header-right-avatar {
        height: 40px;
        width: 40px;
        border-radius: 50%;
        box-shadow: 1px 1px 2px 1px #161616 !important;
      }
    }
  }
  .c-sidebar {
    background-color: #fff;
    box-shadow: 0 4px 20px #6a6a6a1a;
    height: calc(100vh - 64px);
    z-index: 1000;
    .ant-menu-item {
      margin-inline: 20px;
      margin-block: 20px;
      width: 80%;
    }
    .ant-menu-item.ant-menu-item-selected {
      background-color: #4a8394;
      color: #fff;
    }
    .ant-menu-inline-collapsed .ant-menu-item {
      padding-inline: calc(50% - 8px - 20px);
      margin-inline: 20px;
      margin-block: 20px;
    }
    .ant-menu-vertical .ant-menu-item {
      width: 50%;
    }
  }
  .ant-layout-sider-trigger {
    background-color: #18a2ba;
    color: black;
  }
  .c-content {
    height: calc(100vh - 64px);
    overflow-y: scroll;
    margin: 0 16px;
    padding: 24px;
    border-radius: 8px;
    position: fixed;
    top: 64px;
    left: 80px;
    width: calc(100% - 80px - 24px);
    .c-content-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .c-content-bottom {
      background-color: #fff;
      min-height: calc(100vh - 200px);
      margin-top: 40px;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 4px 20px #6a6a6a1a;
    }
  }
  .c-content::-webkit-scrollbar {
    width: 7px;
    background-color: transparent;
  }
  .c-content::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 3px;
  }
`;

export default Layout1;
