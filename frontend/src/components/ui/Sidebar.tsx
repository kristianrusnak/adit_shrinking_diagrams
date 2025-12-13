import { FC, useCallback } from "react";
import { Box, Button, List, ListItemButton, ListItemText, Tooltip, Typography, CircularProgress} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/Add";
import { useGetChatThreadsQuery } from "@/api/dbApi";
import { useNavigate, useParams } from "react-router-dom";
import type { ChatThread } from "@/api/types";

const Sidebar: FC = () => {
  const navigate = useNavigate();
  const { threadId } = useParams<{ threadId?: string }>();
  
  const { data: threads, isLoading, error } = useGetChatThreadsQuery();

  const handleNewChat = useCallback(() => {
    navigate("/app");
  }, [navigate]);

  const handleThreadClick = useCallback(
    (threadIdentifier: string) => {
      navigate(`/app/chat/${threadIdentifier}`);
    },
    [navigate]
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "1rem",
        gap: "1rem",
      }}
    >
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
          <Tooltip key={thread.id} title={thread.title} placement="right" arrow>
            <ListItemButton
              onClick={() => handleThreadClick(thread.id)}
              selected={threadId === thread.id}
              sx={{
                borderRadius: "8px",
                marginBottom: "4px",
                "&.Mui-selected": {
                  backgroundColor: "rgba(144, 202, 249, 0.16)",
                  "&:hover": {
                    backgroundColor: "rgba(144, 202, 249, 0.24)",
                  },
                },
              }}
            >
              <ListItemText
                primary={truncate(thread.title, 25)}
                secondary={
                  thread.last_message_at
                    ? formatDate(thread.last_message_at)
                    : formatDate(thread.updated_at)
                }
                slotProps={{
                  secondary: {
                    variant: "caption",
                    sx: { opacity: 0.6 },
                  },
                }}
              />
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
