import React from "react";
import {
  Table,
  Form,
  Button,
  InputNumber,
  Input,
  Select,
  message,
  Space,
  Popconfirm,
  Modal,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { axiosClient } from "../../../libraries/axiosClient";
import numeral from "numeral";

function ProductPage() {
  //set useState:
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [suppliers, setSuppliers] = React.useState([]);
  const [refresh, setRefresh] = React.useState(0);
  const [selectedRecord, setSelectedRecord] = React.useState<any>(null);
  const [isVisibleEditForm, setIsVisibleEditForm] = React.useState(false);

  const productColumns: any = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "12%",
      filters:
        categories &&
        categories.map((c: any) => {
          return {
            text: c.name,
            value: c.name,
          };
        }),
      filterSearch: true,
      filterMode: "tree",
      onFilter: (value: any, record: any) => {
        return record?.category?.name.startsWith(value);
      },
      render: (text: any, record: any) => {
        return (
          <strong style={{ color: "blue" }}>{record?.category?.name}</strong>
        );
      },
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
      width: "12%",
      filters:
        suppliers &&
        suppliers.map((s: any) => {
          return {
            text: s.name,
            value: s.name,
          };
        }),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value: any, record: any) => {
        return record?.supplier?.name.startsWith(value);
      },

      ellipsis: true,
      render: (supplier: any) => {
        return <strong style={{ color: "blue" }}>{supplier?.name}</strong>;
      },
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      width: "12%",
      render: (text: string) => {
        return <strong style={{ color: "blue" }}>{text}</strong>;
      },
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: (a: any, b: any) => a.stock - b.stock,
      width: "12%",
      ellipsis: true,
      render: (text: number) => {
        return <span>{numeral(text).format("0,0")}</span>;
      },
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      width: "12%",
      sorter: (a: any, b: any) => a.discount - b.discount,
      ellipsis: true,
      render: (text: number) => {
        return (
          <strong style={{ color: "red" }}>
            {numeral(text).format("0,0")}%
          </strong>
        );
      },
    },
    {
      title: "Total Price",
      dataIndex: "total",
      key: "total",
      width: "12%",
      sorter: (a: any, b: any) => a.total - b.total,
      ellipsis: true,
      render: (text: number) => {
        return (
          <strong style={{ color: "green" }}>
            {numeral(text).format("0,0$")}
          </strong>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "12%",
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
                  .delete("/products/" + id)
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
                setSelectedRecord(record);
                setIsVisibleEditForm(true);
                updateForm.setFieldsValue(record);
                console.log("Selected record:", record);
              }}
            ></Button>
          </Space>
        );
      },
    },
  ];

  //set useEffect:
  React.useEffect(() => {
    axiosClient.get("/products").then((response) => {
      setProducts(response.data);
      console.log(response.data);
    });
  }, [refresh]);

  React.useEffect(() => {
    axiosClient.get("/categories").then((response) => {
      setCategories(response.data);
    });
  }, []);

  React.useEffect(() => {
    axiosClient.get("/suppliers").then((response) => {
      setSuppliers(response.data);
    });
  }, []);

  //Thêm mới data:
  const onFinish = (values: any) => {
    axiosClient
      .post("/products", values)
      .then((response) => {
        message.success("Added new successfully!");
        setRefresh((f) => {
          return f + 1;
        });
        createForm.resetFields();
      })
      .catch((error: any) => {
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
      .patch("/products/" + selectedRecord._id, values)
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
          label="Category"
          name="categoryId"
          rules={[
            {
              required: true,
              message: "Please input category name!",
            },
          ]}
        >
          <Select
            options={
              categories &&
              categories.map((c: any) => {
                return {
                  value: c._id,
                  label: c.name,
                };
              })
            }
          />
        </Form.Item>
        <Form.Item
          label="Supplier"
          name="supplierId"
          rules={[
            {
              required: true,
              message: "Please input supplier name!",
            },
          ]}
        >
          <Select
            options={
              suppliers &&
              suppliers.map((s: any) => {
                return {
                  value: s._id,
                  label: s.name,
                };
              })
            }
          />
        </Form.Item>

        <Form.Item
          label="Product Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input product name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Stock"
          name="stock"
          rules={[
            {
              required: true,
              message: "Please input product stock!",
            },
          ]}
        >
          <InputNumber style={{ minWidth: 200 }} />
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
          rules={[
            {
              required: true,
              message: "Please input product price!",
            },
          ]}
        >
          <InputNumber style={{ minWidth: 200 }} />
        </Form.Item>
        <Form.Item label="Discount" name="discount">
          <InputNumber style={{ minWidth: 200 }} />
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

      <Table
        rowKey="_id"
        dataSource={products}
        columns={productColumns}
        scroll={{
          y: 300,
        }}
      />

      <Modal
        centered
        title="Update Product Info"
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
            label="Category"
            name="categoryId"
            rules={[
              {
                required: true,
                message: "Please input category name!",
              },
            ]}
          >
            <Select
              options={
                categories &&
                categories.map((c: any) => {
                  return {
                    value: c._id,
                    label: c.name,
                  };
                })
              }
            />
          </Form.Item>
          <Form.Item
            label="Supplier"
            name="supplierId"
            rules={[
              {
                required: true,
                message: "Please input supplier name!",
              },
            ]}
          >
            <Select
              options={
                suppliers &&
                suppliers.map((s: any) => {
                  return {
                    value: s._id,
                    label: s.name,
                  };
                })
              }
            />
          </Form.Item>

          <Form.Item
            label="Product Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input product name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Stock"
            name="stock"
            rules={[
              {
                required: true,
                message: "Please input product stock!",
              },
            ]}
          >
            <InputNumber style={{ minWidth: 200 }} />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[
              {
                required: true,
                message: "Please input product price!",
              },
            ]}
          >
            <InputNumber style={{ minWidth: 200 }} />
          </Form.Item>
          <Form.Item label="Discount" name="discount">
            <InputNumber style={{ minWidth: 200 }} />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ProductPage;
