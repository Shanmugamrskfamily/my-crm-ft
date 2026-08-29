// src/utils/confirmModal.js
import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

export const showConfirmDialog = ({
  title = "Are you sure?",
  content = "This action cannot be undone.",
  okText = "Confirm",
  okType = "danger",
  cancelText = "Cancel",
  onConfirm,
}) => {
  Modal.confirm({
    title,
    icon: <ExclamationCircleFilled />,
    content,
    okText,
    okType,
    cancelText,
    centered: true,
    onOk() {
      if (onConfirm) onConfirm();
    },
  });
};