// src/components/modules/tasks/TaskKanbanBoard.jsx
"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import { App, Card, Tag, Empty } from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { changeTaskStatus } from "../../../store/slices/taskSlice";
import { renderTaskPriorityTag } from "../../../utils/statusTags";

const COLUMNS = [
  { id: "Todo", title: "To Do", accent: "border-slate-400" },
  { id: "In Progress", title: "In Progress", accent: "border-amber-500" },
  { id: "Completed", title: "Completed", accent: "border-emerald-500" },
];

export default function TaskKanbanBoard({ tasks }) {
  const dispatch = useDispatch();
  const { message } = App.useApp();
  const isDark = useSelector((state) => state.ui?.theme === "dark");

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id);
    return acc;
  }, {});

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    dispatch(changeTaskStatus({ id: draggableId, status: destination.droppableId }));
    message.success(`Task moved to "${destination.droppableId}"`);
  };

  const cardBg = isDark ? "#111827" : "#ffffff";
  const columnBg = isDark ? "#0f172a" : "#f8fafc";
  const columnDragBg = isDark ? "#1e293b" : "#eef2ff";

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <Droppable droppableId={col.id} key={col.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`rounded-xl border-t-4 ${col.accent} p-3 min-h-[320px] transition-colors`}
                style={{
                  backgroundColor: snapshot.isDraggingOver ? columnDragBg : columnBg,
                }}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {col.title}
                  </span>
                  <Tag color="default">{grouped[col.id].length}</Tag>
                </div>

                {grouped[col.id].length === 0 && !snapshot.isDraggingOver && (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span className="text-xs">Drop tasks here</span>}
                    className="opacity-60 mt-6"
                  />
                )}

                {grouped[col.id].map((task, index) => (
                  <Draggable draggableId={task.id} index={index} key={task.id}>
                    {(dragProvided, dragSnapshot) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        className="mb-2"
                        style={{
                          ...dragProvided.draggableProps.style,
                          opacity: dragSnapshot.isDragging ? 0.9 : 1,
                        }}
                      >
                        <Card
                          size="small"
                          variant="borderless"
                          className="shadow-sm rounded-lg cursor-grab active:cursor-grabbing"
                          style={{ backgroundColor: cardBg }}
                          styles={{ body: { padding: 12 } }}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                              {task.title}
                            </div>
                            {renderTaskPriorityTag(task.priority)}
                          </div>
                          {task.description && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
                              {task.description}
                            </div>
                          )}
                          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <UserOutlined /> {task.assignedTo}
                            </span>
                            {task.dueDate && (
                              <span className="flex items-center gap-1">
                                <CalendarOutlined /> {task.dueDate}
                              </span>
                            )}
                          </div>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
