import React from "react";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  DatabaseOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const items = [
  {
    label: "Home",
    key: "Home",
    icon: <HomeOutlined />,
  },
  {
    label: "Data Management",
    key: "data/management",
    icon: <DatabaseOutlined />,
    children: [
      {
        label: "Categories",
        key: "management/categories",
      },
      {
        label: "Customer",
        key: "management/customers",
      },
      {
        label: "Employees",
        key: "management/employees",
      },
      {
        label: "Products",
        key: "management/products",
      },
      {
        label: "Suppliers",
        key: "management/suppliers",
      },
    ],
  },
  {
    label: "Setting",
    key: "setting",
    icon: <SettingOutlined />,
  },
];

const SideMenuBar = () => {
  const navigate = useNavigate();
  const onClick = ({ key }) => {
    navigate("/" + key);
  };
  return (
    <div style={{ minHeight: "100vh" }}>
      <Menu theme="dark" onClick={onClick} mode="inline" items={items} />
    </div>
  );
};

export default SideMenuBar;
