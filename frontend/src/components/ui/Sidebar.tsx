import { FC, useCallback } from "react";
import {Box, Button, List, ListItemButton, ListItemText, Tooltip, Typography} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/Add";

interface Conversation {
  id: number;
  name: string;
}

const Sidebar: FC = () => {
  // Will be replaced with real conversation, when implemented
  const conversations: Conversation[] = [
    { id: 1, name: "UML bankovy system" },
    { id: 2, name: "Ako rychlo zarobit 1000 eur" },
    { id: 3, name: "Kedy skonci hmla v Bratislave" },
    { id: 4, name: "Domaca uloha collision detection" }
  ];

  const handleConversationClick = useCallback((name: string) => {
    console.log(name);
  }, []);

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max - 3) + "..." : text;

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
        onClick={() => console.log("New chat")}
      >
        New Chat
      </Button>

      <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
        Your chats
      </Typography>

      <List sx={{ padding: 0 }}>
        {conversations.map((c) => (
          <Tooltip title={c.name} placement="right" arrow>
            <ListItemButton
              key={c.id}
              onClick={() => handleConversationClick(c.name)}
              sx={{
                borderRadius: "8px",
                marginBottom: "4px",
              }}
            >
              <ListItemText
                primary={truncate(c.name, 25)}

              />
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
