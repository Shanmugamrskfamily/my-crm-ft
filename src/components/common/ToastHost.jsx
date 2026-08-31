// src/components/common/ToastHost.jsx
"use client";

import { useEffect } from "react";
import { App } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  dismissNotification,
  selectPendingNotifications,
} from "../../store/slices/notificationSlice";

/**
 * Bridges Redux notification queue -> AntD notification API.
 * Renders no UI; consumes items and pops them off the queue.
 */
export default function ToastHost() {
  const { notification } = App.useApp();
  const dispatch = useDispatch();
  const queue = useSelector(selectPendingNotifications);

  useEffect(() => {
    if (!queue.length) return;
    queue.forEach((item) => {
      notification[item.type]?.({
        message: item.message,
        description: item.description || undefined,
        duration: item.duration,
        key: item.id,
        placement: "topRight",
      });
      dispatch(dismissNotification(item.id));
    });
  }, [queue, notification, dispatch]);

  return null;
}
