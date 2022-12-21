import React from "react";
import {
  Table,
  Form,
  Input,
  Button,
  message,
  Space,
  Popconfirm,
  Modal,
} from "antd";
import moment from "moment";
import { axiosClient } from "../../../libraries/axiosClient";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
function EmployeePage() {
  const employeeColumns = [
    {
      title: "Fullname",
      dataIndex: "fullName",
      key: "fullName",
      width: "18%",
      render: (text: string) => {
        return <strong style={{ color: "blue" }}>{text}</strong>;
      },
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "18%",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "18%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "18%",
      render: (text: string) => {
        return <strong style={{ color: "green" }}>{text}</strong>;
      },
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "18%",
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      key: "birthday",
      width: "18%",
      render: (record: string) => {
        return <strong>{moment(record).format("DD/MM/yyyy")}</strong>;
      },
    },
    {
      title: "",
      key: "actions",
      width: "10%",
      render: (record: any) => {
        return (
          <Space>
            <Popconfirm
              title="Are you sure to delete this row?"
              onConfirm={() => {
                const id = record._id;
                //Delete:
                axiosClient
                  .delete("/employees/" + id)
                  .then((response) => {
                    message.success("Deleted successfully!");
                    setRefresh((f) => {
                      return f + 1;
                    });
                  })
                  .catch((error) => {
                    message.error("Deleted failed!");
                    console.log("Error:", error);
                  });

                console.log("Delete:", record);
              }}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button type="dashed" danger icon={<DeleteOutlined />}></Button>
            </Popconfirm>
            <Button
              type="dashed"
              icon={<EditOutlined />}
              onClick={() => {
                setIsVisibleEditForm(true);
                setSelectedRecord(record);
                updateForm.setFieldsValue(record);
                console.log("Selected record:", record);
              }}
            ></Button>
          </Space>
        );
      },
    },
  ];
  //set useState:
  const [employees, setEmployees] = React.useState([]);
  const [refresh, setRefresh] = React.useState(0);
  const [isVisibleEditForm, setIsVisibleEditForm] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState<any>(null);

  //set useEffect:
  React.useEffect(() => {
    axiosClient.get("/employees").then((response) => {
      setEmployees(response.data);
    });
  }, [refresh]);

  //Thêm mới data:
  const onFinish = (values: any) => {
    axiosClient
      .post("/employees", values)
      .then((response) => {
        message.success("Added new successfully!");
        setRefresh((f) => {
          return f + 1;
        });
        createForm.resetFields(); //reset lại các field của form như ban đầu
      })
      .catch((error) => {
        message.error("Added failed!");
        console.log("Error:", error);
      });
  };
  const onFinishFailed = (err: any) => {
    console.log("Error:", err);
  };

  //Chỉnh sửa data:
  const onUpdateFinish = (values: any) => {
    axiosClient
      .patch("/employees/" + selectedRecord._id, values)
      .then((response) => {
        message.success("Updated successfully!");
        setRefresh((f) => {
          return f + 1;
        });
        updateForm.resetFields();
        setIsVisibleEditForm(false);
      })
      .catch((err) => {
        message.error("Updated failed!");
        console.log("Error:", err);
      });
  };
  const onUpdateFinishFailed = (error: any) => {
    console.log("Error:", error);
  };

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  return (
    <div style={{ padding: "50px" }}>
      <Form
        form={createForm}
        name="create-form"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="on"
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[
            {
              required: true,
              message: "Please input data!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[
            {
              required: true,
              message: "Please input data!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            {
              required: true,
              message: "Please input data!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[
            {
              required: true,
              message: "Please input data!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input data!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Birthday"
          name="birthday"
          rules={[
            {
              required: true,
              message: "Please input data!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Table rowKey="_id" dataSource={employees} columns={employeeColumns} />
      <Modal
        centered
        title="Update Employees Info"
        open={isVisibleEditForm}
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setIsVisibleEditForm(false);
        }}
        okText="Save"
      >
        <Form
          form={updateForm}
          name="update-form"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onUpdateFinish}
          onFinishFailed={onUpdateFinishFailed}
          autoComplete="on"
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              {
                required: true,
                message: "Please input data!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              {
                required: true,
                message: "Please input data!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please input data!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: true,
                message: "Please input data!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input data!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Birthday"
            name="birthday"
            rules={[
              {
                required: true,
                message: "Please input data!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default EmployeePage;
