import React from "react";
import { message, Table } from "antd";
import { axiosClient } from "../../../libraries/axiosClient";
import { Form, Input, Button, Space, Popconfirm, Modal } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import moment from "moment";

function CustomerPage() {
  const customerColumns = [
    {
      title: "Fullname",
      dataIndex: "fullName",
      key: "name",
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
        return <strong style={{ color: "brown" }}>{text}</strong>;
      },
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      key: "birthday",
      width: "18%",
      render: (text: string) => {
        return <strong>{moment(text).format("DD/MM/yyyy")}</strong>;
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
                axiosClient
                  .delete("/customers/" + record._id)
                  .then((response) => {
                    message.success("Deleted successfully!");
                    setRefresh((f) => {
                      return f + 1;
                    });
                  })
                  .catch((errror) => {
                    message.error("Deleted failed!");
                    console.log("Error:", errror);
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
                setSelectedRecord(record);
                setIsVisibleEditForm(true);
                updateForm.setFieldsValue(record);
                console.log("Selected Record", record);
              }}
            ></Button>
          </Space>
        );
      },
    },
  ];
  //set useState:
  const [customers, setCustomers] = React.useState([]);
  const [refresh, setRefresh] = React.useState(0);
  const [isVisibleEditForm, setIsVisibleEditForm] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState<any>(null);

  //set useEffect:
  React.useEffect(() => {
    axiosClient.get("/customers").then((response) => {
      setCustomers(response.data);
    });
  }, [refresh]);

  //Th??m m???i data:
  const onFinish = (values: any) => {
    axiosClient
      .post("/customers", values)
      .then((response) => {
        message.success("Added new successfully!");
        setRefresh((f) => {
          return f + 1;
        });
        createForm.resetFields();
      })
      .catch((err) => {
        message.error("Added new failed!");
        console.log("Error:", err);
      });
  };
  const onFinishFailed = (error: any) => {
    console.log("Error:", error);
  };

  //S???a data:
  const onUpdateFinish = (values: any) => {
    axiosClient
      .patch("/customers/" + selectedRecord._id, values)
      .then((response) => {
        message.success("Updated successfully!");
        updateForm.resetFields();
        setRefresh((f) => {
          return f + 1;
        });
        setIsVisibleEditForm(false);
      })
      .catch((error) => {
        message.error("Updated failed!");
        console.log("Error:", error);
      });
  };
  const onUpdateFinishFailed = (err: any) => {
    console.log("Error:", err);
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
        autoComplete="off"
      >
        <Form.Item label="First Name" name="firstName">
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[
            {
              required: true,
              message: "Please input customer last name!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Address" name="address">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            {
              required: true,
              message: "Please input customer phonenumber!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Birthday" name="birthday">
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
      <Table rowKey="_id" dataSource={customers} columns={customerColumns} />

      <Modal
        centered
        title="Update Customer Info"
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
          <Form.Item label="First Name" name="firstName">
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              {
                required: true,
                message: "Please input customer last name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please input customer phonenumber!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Birthday" name="birthday">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CustomerPage;
