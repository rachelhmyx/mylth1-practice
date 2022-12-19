import React from "react";
import { Table } from "antd";
import { axiosClient } from "../../../libraries/axiosClient";
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
  ];
  //set useState:
  const [customers, setCustomers] = React.useState([]);

  //set useEffect:
  React.useEffect(() => {
    axiosClient.get("/customers").then((response) => {
      setCustomers(response.data);
    });
  }, []);

  return (
    <div style={{ padding: "50px" }}>
      <Table dataSource={customers} columns={customerColumns} />
    </div>
  );
}

export default CustomerPage;
