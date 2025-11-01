import { Box, Typography } from "@mui/material";

interface BasicChatProps {
  text: string;
}

export default function BasicChat({ text }: BasicChatProps) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: "#e0e0e0",
        color: "#000",
        maxWidth: "600px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        mt: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant="body1">{text}</Typography>
    </Box>
  );
}

