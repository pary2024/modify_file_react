import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  message,
  Space,
  Typography,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  FiEdit2,
  FiTrash2,
  FiFileText,
  FiLoader,
  FiSave,
  FiX,
  FiInfo,
} from "react-icons/fi";

import moment from "moment";
import { ThemeContext } from "../Colors/Themes";
import useSelection from "antd/es/table/hooks/useSelection";
import { useDispatch, useSelector } from "react-redux";
import { createPay, fetchPays } from "../stores/paySlice";
// Make sure you import your API instance if using Axios

const { Title } = Typography;

const PaymentMethod = () => {
  const { isDark } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { pays } = useSelector((state) => state.pay);
  const [alertMessage, setAlertMessage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [name, setName] = useState("");
  useEffect(() => {
    dispatch(fetchPays());
  }, [dispatch]);
  useEffect(() => {
    if (alertMessage) {
      Swal.fire({
        icon: alertMessage.type,
        title: alertMessage.text,
        showConfirmButton: false,
        timer: 1500,
        position: "top-end",
      });
      setAlertMessage(null); // clear after showing
    }
  }, [alertMessage]);

  const handleSave = async (e) => {
    e.preventDefault();
    const data = {
      name: name,
    };
    try {
      await dispatch(createPay(data));
      dispatch(fetchPays());
      Swal.fire({
        icon: "success",
        title: "Method created successfully!",
        showConfirmButton: false,
        timer: 1500,
        position: "top-end",
      });
      setIsModalVisible(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      className={`${
        isDark ? "bg-[#1f1f1f] text-white" : "bg-white text-black"
      } rounded-lg shadow-sm p-6`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2
          className={`text-xl font-semibold ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Payment Methods
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Input
            placeholder="Search methods..."
            prefix={<SearchOutlined className="text-gray-400" />}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className={`w-full md:w-64 rounded-lg ${
              isDark
                ? "bg-[#333] text-white placeholder:text-gray-400 border border-gray-600"
                : ""
            }`}
          />
          <div className="flex gap-3">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setIsModalVisible(true);
              }}
              className="flex items-center"
            >
              <span className="hidden sm:inline">New Method</span>
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => fetchPaymentMethods({ pagination })}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table
          className={`min-w-full divide-y ${
            isDark ? "divide-gray-700 bg-[#1f1f1f]" : "divide-gray-200 bg-white"
          }`}
        >
          <thead className={isDark ? "bg-[#2a2a2a]" : "bg-gray-50"}>
            <tr>
              <th
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium ${
                  isDark ? "text-gray-300" : "text-gray-500"
                } uppercase tracking-wider`}
              >
                #
              </th>
              <th
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium ${
                  isDark ? "text-gray-300" : "text-gray-500"
                } uppercase tracking-wider`}
              >
                Name
              </th>
              <th
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium ${
                  isDark ? "text-gray-300" : "text-gray-500"
                } uppercase tracking-wider`}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isDark
                ? "divide-gray-700 bg-[#1f1f1f]"
                : "divide-gray-200 bg-white"
            }`}
          >
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`h-4 rounded ${
                        isDark ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    ></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`h-4 rounded ${
                        isDark ? "bg-gray-700" : "bg-gray-200"
                      }`}
                      style={{ width: `${Math.random() * 100 + 50}px` }}
                    ></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <div
                        className={`h-8 w-8 rounded ${
                          isDark ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      ></div>
                      <div
                        className={`h-8 w-8 rounded ${
                          isDark ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : pays && pays.length > 0 ? (
              pays.map((item, index) => (
                <tr
                  key={item.id}
                  className={`${
                    isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-50"
                  } transition-colors duration-150`}
                >
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {index + 1}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className={`p-2 rounded-md ${
                          isDark
                            ? "text-blue-400 hover:bg-gray-700"
                            : "text-blue-600 hover:bg-gray-100"
                        } transition-colors`}
                        title="Edit"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        className={`p-2 rounded-md ${
                          isDark
                            ? "text-red-400 hover:bg-gray-700"
                            : "text-red-600 hover:bg-gray-100"
                        } transition-colors`}
                        title="Delete"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <FiFileText
                      className={`w-12 h-12 mx-auto ${
                        isDark ? "text-gray-600" : "text-gray-400"
                      } mb-4`}
                    />
                    <h3
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      No payment methods found
                    </h3>
                    <p
                      className={`mt-1 text-sm ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      Add a new payment method to get started
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        title={editingId ? "Edit Payment Method" : "Create Payment Method"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          resetForm();
        }}
        okText={editingId ? "Update" : "Create"}
        confirmLoading={loading}
        className={`${
          isDark
            ? "[&_.ant-modal-content]:bg-[#2c2c2c] [&_.ant-modal-content]:text-white"
            : ""
        } [&_.ant-modal-content]:rounded-lg`}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 font-medium">
              Method Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={255}
              required
              placeholder="e.g. Cash, Credit Card, Insurance"
              className={`rounded-lg p-2 border ${
                isDark
                  ? "bg-[#333] text-white border-gray-600"
                  : "border-gray-300"
              } `}
            />
          </div>

          {editingId && (
            <div className="flex items-center gap-2">
              <label htmlFor="is_active" className="font-medium">
                Status
              </label>
              <input type="checkbox" id="is_active" name="is_active" />
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default PaymentMethod;
