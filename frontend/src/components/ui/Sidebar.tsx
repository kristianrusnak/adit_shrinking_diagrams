import { FC, useCallback, useState } from "react";
import { Box, Button, List, ListItemButton, ListItemText, Tooltip, Typography, CircularProgress, IconButton, TextField} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useGetChatThreadsQuery, useRenameThreadMutation, useDeleteThreadMutation } from "@/api/api";
import { useNavigate, useParams } from "react-router-dom";
import type { ChatThread } from "@/api/types";
import { useDispatch } from "react-redux";
import { clearMessages } from "@/store/slices/messageSlice";
import { setFile, setFileReduced, setMessage } from "@/store/slices/fileSlice";

interface SidebarProps {
  onToggle?: () => void;
  onThreadSelect?: () => void;
}

const Sidebar: FC<SidebarProps> = ({ onToggle, onThreadSelect }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { threadId } = useParams<{ threadId?: string }>();
  
  const { data: threads, isLoading, error } = useGetChatThreadsQuery();
  const [renameThread] = useRenameThreadMutation();
  const [deleteThread] = useDeleteThreadMutation();
  
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");

  const handleNewChat = useCallback(() => {
    dispatch(clearMessages());
    dispatch(setFile(null));
    dispatch(setFileReduced(null));
    dispatch(setMessage(""));
    navigate("/app");
  }, [navigate, dispatch]);

  const handleThreadClick = useCallback(
    (threadIdentifier: string) => {
      navigate(`/app/chat/${threadIdentifier}`);
      // Na mobile automaticky zavrieť sidebar po výbere konverzácie
      if (onThreadSelect) {
        onThreadSelect();
      }
    },
    [navigate, onThreadSelect]
  );

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max - 3) + "..." : text;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleStartEdit = useCallback((thread: ChatThread, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingThreadId(thread.id);
    setEditingTitle(thread.title);
  }, []);

  const handleCancelEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingThreadId(null);
    setEditingTitle("");
  }, []);

  const handleSaveEdit = useCallback(async (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingTitle.trim()) {
      try {
        await renameThread({ thread_id: threadId, new_title: editingTitle.trim() }).unwrap();
        setEditingThreadId(null);
        setEditingTitle("");
      } catch (error) {
        console.error("Failed to rename thread:", error);
      }
    }
  }, [editingTitle, renameThread]);

  const handleDelete = useCallback(async (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this chat?")) {
      try {
        await deleteThread(threadId).unwrap();
        if (threadId === threadId) {
          navigate("/app");
        }
      } catch (error) {
        console.error("Failed to delete thread:", error);
      }
    }
  }, [deleteThread, navigate, threadId]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "1rem",
        gap: "1rem",
        position: 'relative',
      }}
    >
      {/* Toggle button vpravo hore v sidebari */}
      {onToggle && (
        <IconButton
          onClick={onToggle}
          sx={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            zIndex: 10,
          }}
          size="small"
        >
          <MenuOpenIcon />
        </IconButton>
      )}
      
      <Button
        variant="text"
        color="inherit"
        startIcon={<AddOutlinedIcon />}
        onClick={handleNewChat}
      >
        New Chat
      </Button>

      <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
        Your chats
      </Typography>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {error && (
        <Typography variant="body2" color="error" sx={{ padding: "1rem" }}>
          Failed to load chats
        </Typography>
      )}

      {threads && threads.length === 0 && (
        <Typography variant="body2" sx={{ opacity: 0.6, padding: "1rem" }}>
          No chats yet
        </Typography>
      )}

      <List sx={{ padding: 0, overflow: "auto" }}>
        {threads?.map((thread: ChatThread) => (
          <Tooltip key={thread.id} title={editingThreadId === thread.id ? "" : thread.title} placement="right" arrow>
            <ListItemButton
              onClick={() => editingThreadId !== thread.id && handleThreadClick(thread.id)}
              selected={threadId === thread.id}
              sx={{
                borderRadius: "8px",
                marginBottom: "4px",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "8px 12px",
                "&.Mui-selected": {
                  backgroundColor: "rgba(144, 202, 249, 0.16)",
                  "&:hover": {
                    backgroundColor: "rgba(144, 202, 249, 0.24)",
                  },
                },
              }}
            >
              {editingThreadId === thread.id ? (
                <>
                  <Box sx={{ width: "100%" }}>
                    <TextField
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveEdit(thread.id, e as any);
                        } else if (e.key === "Escape") {
                          handleCancelEdit(e as any);
                        }
                      }}
                      size="small"
                      autoFocus
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ display: "flex", gap: 0.5, marginTop: "4px" }}>
                    <IconButton
                      size="small"
                      onClick={(e) => handleSaveEdit(thread.id, e)}
                      sx={{ padding: "2px" }}
                    >
                      <CheckIcon sx={{ fontSize: "16px" }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={handleCancelEdit}
                      sx={{ padding: "2px" }}
                    >
                      <CloseIcon sx={{ fontSize: "16px" }} />
                    </IconButton>
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={{ width: "100%" }}>
                    <ListItemText
                      primary={truncate(thread.title, 25)}
                      secondary={
                        thread.last_message_at
                          ? formatDate(thread.last_message_at)
                          : formatDate(thread.updated_at)
                      }
                      slotProps={{
                        primary: {
                          sx: { marginBottom: "2px" },
                        },
                        secondary: {
                          variant: "caption",
                          sx: { opacity: 0.6 },
                        },
                      }}
                      sx={{ margin: 0 }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", gap: 0.5, opacity: 0.5, marginTop: "4px" }}>
                    <IconButton
                      size="small"
                      onClick={(e) => handleStartEdit(thread, e)}
                      sx={{ padding: "2px" }}
                    >
                      <EditOutlinedIcon sx={{ fontSize: "16px" }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleDelete(thread.id, e)}
                      sx={{ padding: "2px" }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: "16px" }} />
                    </IconButton>
                  </Box>
                </>
              )}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
