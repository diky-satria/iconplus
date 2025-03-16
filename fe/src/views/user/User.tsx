/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Breadcrumb,
  Typography,
  Pagination,
  Select,
  Popconfirm,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "../../interceptors/axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import ToastSuccess from "../../components/ToastSuccess";
import ToastError from "../../components/ToastError";

export default function User() {
  const token = Cookies.get("authToken");
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, searchText]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `/api/v1/user?page=${pagination.current}&limit=${pagination.pageSize}&search=${searchText}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setData(response.data.data.rows);
      setPagination((prev) => ({
        ...prev,
        total: response.data.data.total_rows,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = debounce((e) => {
    setSearchText(e.target.value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, 500);

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (_: unknown, __: unknown, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Nama Unit",
      dataIndex: "nama_unit",
      key: "nama_unit",
    },
    {
      title: "Aksi",
      key: "action",
      render: (_: unknown, record: { id: number; username: string }) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            className="c-primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/user_edit/${record.id}`)}
          >
            Edit
          </Button>
          {record.username !== "superadmin" && (
            <Popconfirm
              placement="left"
              title={`Apa kamu yakin`}
              description={`Ingin menghapus data "${record.username}"`}
              onConfirm={() => deleteUser(record.id)}
              okText="Ya"
              cancelText="Tidak"
            >
              <Button color="danger" variant="text" icon={<DeleteOutlined />}>
                Hapus
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  const deleteUser = async (id: number) => {
    try {
      const response = await axios.delete(`/api/v1/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchData();
      ToastSuccess(response.data.msg, "top-right");
    } catch (e: any) {
      ToastError(e.response.data.errors, "top-right");
    }
  };

  return (
    <div>
      <div className="c-content-top">
        <div>
          <h3>User</h3>
          <Breadcrumb
            items={[
              {
                title: <span onClick={() => navigate("/user")}>User</span>,
              },
            ]}
          />
        </div>
        <Button
          className="c-primary"
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate("/user_add")}
        >
          Tambah User
        </Button>
      </div>

      <div className="c-content-bottom">
        <div className="row justify-content-between">
          <div className="col-12 col-md-2 mb-3">
            <Select
              size="large"
              value={pagination.pageSize}
              onChange={(size) =>
                setPagination((prev) => ({
                  ...prev,
                  pageSize: size,
                  current: 1,
                }))
              }
              options={[
                { value: 5, label: "5 / halaman" },
                { value: 10, label: "10 / halaman" },
                { value: 20, label: "20 / halaman" },
                { value: 50, label: "50 / halaman" },
              ]}
              style={{ width: 100 }}
            />
          </div>
          <div className="col-12 col-md-2 mb-3">
            <Input size="large" placeholder="Cari..." onChange={handleSearch} />
          </div>
        </div>

        <Table
          scroll={{ x: "max-content" }}
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={false}
          footer={() => (
            <div className="row justify-content-between align-items-center">
              <div className="col-12 col-md-3">
                <Typography.Text>
                  Menampilkan{" "}
                  {pagination.total > 0
                    ? (pagination.current - 1) * pagination.pageSize + 1
                    : 0}{" "}
                  sampai{" "}
                  {Math.min(
                    pagination.current * pagination.pageSize,
                    pagination.total
                  )}{" "}
                  dari {pagination.total} data
                </Typography.Text>
              </div>
              <div className="col-12 col-md-3">
                <Pagination
                  className="flex justify-content-end"
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={(page) =>
                    setPagination((prev) => ({ ...prev, current: page }))
                  }
                  onShowSizeChange={(_, size) =>
                    setPagination((prev) => ({
                      ...prev,
                      pageSize: size,
                      current: 1,
                    }))
                  }
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
