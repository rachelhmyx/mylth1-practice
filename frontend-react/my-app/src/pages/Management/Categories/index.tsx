import React from "react";
import { axiosClient } from "../../../libraries/axiosClient"; //fetching data
import { Table, Form, Input, Button, message, Space, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function CategoryPage() {
  const categoryColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "40%",
      render: (text: any) => {
        return <strong style={{ color: "blue" }}>{text}</strong>;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      Width: "40%",
    },
    {
      title: "",
      key: "actions",
      Width: "10%",
      render: (record: any) => {
        <Space>
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => {
              //DELETE Data:
              const id = record._id;
              axiosClient
                .delete("/categories/" + id)
                .then((response) => {
                  message.success("Deleted Successful !");
                  setRefresh((f) => {
                    return f + 1;
                  });
                })
                .catch((error) => {
                  message.error("Deleted failed !");
                  console.log("Error:", error);
                });
            }}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button type="dashed" icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </Space>;
      },
    },
  ];

  //Set useState:
  const [categories, setCategories] = React.useState([]);
  const [refresh, setRefresh] = React.useState(0);

  //Set useEffect:
  React.useEffect(() => {
    axiosClient
      .get("/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((err) => {
        console.log("🧨", err);
      });
  }, [refresh]);

  //Form thêm mới data:

  const onFinish = (values: any) => {
    axiosClient
      .post("/categories", values)
      .then((response) => {
        setRefresh((f) => {
          return f + 1;
        });
        message.success("Add New Successfully!");
        createForm.resetFields();
      })
      .catch((err) => {
        console.log("🧨", err);
      });
  };

  const onFinishFailed = (error: any) => {
    console.log("🧨", error);
  };

  const [createForm] = Form.useForm();
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
        <Form.Item
          label="Name"
          name="Name"
          rules={[
            {
              required: true,
              message: "Please input category name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description">
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
      <Table dataSource={categories} columns={categoryColumns} />
    </div>
  );
}

export default CategoryPage;
