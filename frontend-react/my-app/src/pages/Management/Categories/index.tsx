import React from "react";
import { axiosClient } from "../../../libraries/axiosClient"; //fetching data
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

function CategoryPage() {
  const categoryColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "40%",
      render: (text: string) => {
        return <strong style={{ color: "blue" }}>{text}</strong>;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "40%",
    },
    {
      title: "",
      key: "actions",
      width: "10%",
      render: (record: any) => {
        return (
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
              <Button type="dashed" icon={<DeleteOutlined />} danger></Button>
            </Popconfirm>
            <Button
              type="dashed"
              icon={<EditOutlined />}
              onClick={() => {
                setIsVisibleEditForm(true);
                setSelectedRecord(record);
                console.log("Selected Record:", record);
                updateForm.setFieldsValue(record);
              }}
            ></Button>
          </Space>
        );
      },
    },
  ];

  //Set useState:
  const [categories, setCategories] = React.useState([]);
  const [refresh, setRefresh] = React.useState(0);
  const [isVisibleEditForm, setIsVisibleEditForm] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState<any>(null);

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
  //Update Form:
  const onUpdateFinish = (values: any) => {
    axiosClient
      .patch("/categories/" + selectedRecord._id, values)
      .then((response) => {
        message.success("Updated Successfully!");
        updateForm.resetFields();
        setIsVisibleEditForm(false);
        setRefresh((f) => {
          return f + 1;
        });
      })
      .catch((err) => {
        message.error("Updated Failed!");
        console.log("🧨Error:", err);
      });
  };
  const onUpdateFinishFailed = (error: any) => {
    console.log("🧨Error:", error);
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
        <Form.Item
          label="Name"
          name="name"
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

      <Modal
        centered
        title="Update Category Data"
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
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
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
        </Form>
      </Modal>
    </div>
  );
}

export default CategoryPage;
