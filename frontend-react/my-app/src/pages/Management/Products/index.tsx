import React from "react";
import { Table } from "antd";
import { axiosClient } from "../../../libraries/axiosClient";
import numeral from "numeral";

function ProductPage() {
  const productColumns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "12%",
      render: (record: any) => {
        return (
          <strong style={{ color: "blue" }}>{record?.category?.name}</strong>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "12%",
      render: (text: string) => {
        return <strong style={{ color: "blue" }}>{text}</strong>;
      },
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
      width: "12%",
      render: (record: any) => {
        return (
          <strong style={{ color: "burlywood" }}>
            {record?.supplier?.name}
          </strong>
        );
      },
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      width: "12%",
      render: (text: number) => {
        return <span>{numeral(text).format("0,0")}</span>;
      },
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      width: "12%",
      render: (text: number) => {
        return <span>{numeral(text).format("0,0")}%</span>;
      },
    },
    {
      title: "Total Price",
      dataIndex: "total",
      key: "total",
      width: "12%",
      render: (text: number) => {
        return <span>{numeral(text).format("0,0$")}</span>;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "12%",
      render: (text: string) => {
        return <span>{text}</span>;
      },
    },
  ];

  //set useState:
  const [products, setProducts] = React.useState([]);
  //   const [categories, setCategories] = React.useState([]);
  //   const [suppliers, setSuppliers] = React.useState([]);

  //set useEffect:
  React.useEffect(() => {
    axiosClient.get("/products").then((response) => {
      setProducts(response.data);
    });
  }, []);

  //   React.useEffect(() => {
  //     axiosClient.get("/categories").then((response) => {
  //       setCategories(response.data);
  //     });
  //   }, []);

  //   React.useEffect(() => {
  //     axiosClient.get("/suppliers").then((response) => {
  //       setSuppliers(response.data);
  //     });
  //   }, []);

  return (
    <div style={{ padding: "50px" }}>
      <Table rowKey="_id" dataSource={products} columns={productColumns} />
    </div>
  );
}

export default ProductPage;
