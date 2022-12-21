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
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { axiosClient } from "../../../libraries/axiosClient";

function SupplierPage() {
  //set useState:
  const [suppliers, setSuppliers] = React.useState([]);
  const [refresh, setRefresh] = React.useState(0);
  const [selectedRecord, setSelectedRecord] = React.useState<any>(null);
  const [isVisibleEditForm, setIsVisibleEditForm] = React.useState(false);

  const supplierColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "22%",
      render: (text: string) => {
        return <strong style={{ color: "blue" }}>{text}</strong>;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "22%",
      render: (text: string) => {
        return <span style={{ color: "brown" }}>{text}</span>;
      },
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "22%",
      render: (text: string) => {
        return <span>{text}</span>;
      },
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "22%",
      render: (text: string) => {
        return <span>{text}</span>;
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
                //Xóa data:
                const id = record._id;
                axiosClient
                  .delete("/suppliers/" + id)
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
              }}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button type="dashed" danger icon={<DeleteOutlined />} />
            </Popconfirm>

            <Button
              type="dashed"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedRecord(record);
                setIsVisibleEditForm(true);
                updateForm.setFieldsValue(record);
                console.log(record);
              }}
            />
          </Space>
        );
      },
    },
  ];

  //set useEffect:
  React.useEffect(() => {
    axiosClient.get("/suppliers").then((response) => {
      setSuppliers(response.data);
      console.log(response.data);
    });
  }, [refresh]);

  //Thêm mới data:
  const onFinish = (values: any) => {
    axiosClient
      .post("/suppliers", values)
      .then((response) => {
        message.success("Added new successfully!");
        setRefresh((f) => {
          return f + 1;
        });
        createForm.resetFields();
      })
      .catch((error) => {
        message.error("Added new failed!");
        console.log("Error:", error);
      });
  };
  const onFinishFailed = (err: any) => {
    console.log("Error:", err);
  };

  //Chỉnh sửa data:
  const onUpdateFinish = (values: any) => {
    axiosClient
      .patch("/suppliers/" + selectedRecord._id, values)
      .then((response) => {
        message.success("Updated successfully!");
        setRefresh((f) => {
          return f + 1;
        });
        updateForm.resetFields();
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
        autoComplete="on"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input supplier name!",
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
              message: "Please input supplier email!",
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
              message: "Please input supplier phone number!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Address" name="address">
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
      <Table rowKey="_id" dataSource={suppliers} columns={supplierColumns} />
      <Modal
        centered
        title="Update Supplier Info"
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
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input supplier name!",
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
                message: "Please input supplier email!",
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
                message: "Please input supplier phone number!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default SupplierPage;
