// src/app/(dashboard)/customers/[id]/page.jsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Descriptions,
  Button,
  Tabs,
  Timeline,
  Form,
  Input,
  List,
  Space,
  App,
  Tag,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  PlusOutlined,
  CommentOutlined,
  HistoryOutlined,
  CheckSquareOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { addCustomerNote, addCustomerActivity } from "../../../../store/slices/customerSlice";
import { renderCustomerStatusTag, renderTaskStatusTag, renderTaskPriorityTag } from "../../../../utils/statusTags";
import CustomerModal from "../../../../components/modules/customers/CustomerModal";

const { TextArea } = Input;

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { message } = App.useApp();
  const [noteForm] = Form.useForm();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const customerId = params.id;
  const customer = useSelector((state) =>
    state.customers.items.find((c) => c.id === customerId)
  );
  const currentUser = useSelector((state) => state.auth.user);
  const customerTasks = useSelector((state) =>
    state.tasks.items.filter((t) => t.customerId === customerId)
  );

  if (!customer) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-500">Customer account not found.</p>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/customers")}>
          Return to Customer List
        </Button>
      </div>
    );
  }

  const handleAddNote = (values) => {
    dispatch(
      addCustomerNote({
        customerId: customer.id,
        author: currentUser?.name || "Support Rep",
        content: values.content,
      })
    );
    dispatch(
      addCustomerActivity({
        customerId: customer.id,
        type: "Note Added",
        description: `New note added by ${currentUser?.name || "Support Rep"}`,
      })
    );
    noteForm.resetFields();
    message.success("Note added successfully");
  };

  const activityItems = (customer.activities || []).map((act) => ({
    color: act.type === "Created" ? "green" : "blue",
    children: (
      <div>
        <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
          {act.description}
        </span>
        <div className="text-[11px] text-slate-400">
          {new Date(act.timestamp).toLocaleString()}
        </div>
      </div>
    ),
  }));

  const tabItems = [
    {
      key: "notes",
      label: (
        <span>
          <CommentOutlined /> Notes ({(customer.notes || []).length})
        </span>
      ),
      children: (
        <div className="space-y-6">
          <Card size="small" title="Add New Note" className="bg-slate-50 dark:bg-slate-900">
            <Form form={noteForm} layout="vertical" onFinish={handleAddNote}>
              <Form.Item
                name="content"
                rules={[{ required: true, message: "Please enter note content" }]}
              >
                <TextArea rows={3} placeholder="Write a note about this customer..." />
              </Form.Item>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />} className="bg-indigo-600">
                Post Note
              </Button>
            </Form>
          </Card>

          <List
            itemLayout="vertical"
            dataSource={customer.notes || []}
            renderItem={(item) => (
              <List.Item className="border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-indigo-600">
                    {item.author}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {item.content}
                </p>
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      key: "tasks",
      label: (
        <span>
          <CheckSquareOutlined /> Tasks ({customerTasks.length})
        </span>
      ),
      children: (
        <List
          dataSource={customerTasks}
          renderItem={(task) => (
            <List.Item
              extra={
                <Space>
                  {renderTaskPriorityTag(task.priority)}
                  {renderTaskStatusTag(task.status)}
                </Space>
              }
            >
              <List.Item.Meta
                title={<span className="text-xs font-semibold">{task.title}</span>}
                description={
                  <div className="text-[11px] text-slate-400">
                    Assigned: {task.assignedTo} &bull; Due: {task.dueDate}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ),
    },
    {
      key: "activities",
      label: (
        <span>
          <HistoryOutlined /> Activity History ({(customer.activities || []).length})
        </span>
      ),
      children: <Timeline items={activityItems} className="mt-4" />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/customers")}
        >
          Back to Customers
        </Button>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => setIsEditModalOpen(true)}
          className="bg-indigo-600"
        >
          Edit Customer
        </Button>
      </div>

      <Card bordered={false} className="shadow-xs rounded-xl">
        <Descriptions
          title={
            <div className="flex items-center gap-2">
              <UserOutlined className="text-indigo-600" />
              <span>{customer.name}</span>
              {renderCustomerStatusTag(customer.status)}
            </div>
          }
          bordered
          size="small"
          column={{ xs: 1, sm: 2, md: 3 }}
        >
          <Descriptions.Item label="Company">{customer.company}</Descriptions.Item>
          <Descriptions.Item label="Email">{customer.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{customer.phone}</Descriptions.Item>
          <Descriptions.Item label="Location">{customer.location}</Descriptions.Item>
          <Descriptions.Item label="Assigned Rep">{customer.assignedEmployee}</Descriptions.Item>
          <Descriptions.Item label="Created Date">
            {new Date(customer.createdDate).toLocaleDateString()}
          </Descriptions.Item>
        </Descriptions>

        <Divider className="my-6" />

        <Tabs defaultActiveKey="notes" items={tabItems} />
      </Card>

      <CustomerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        customerToEdit={customer}
      />
    </div>
  );
}