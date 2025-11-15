import { SplitRow } from "@/utils/myersdiff";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useRef } from "react";

export interface DiffComponentProps {
  fileName: string;
  splitRows: SplitRow[];
}

const DiffComponent = ({ splitRows, fileName }: DiffComponentProps) => {
  const getDiffTexts = (splitRows: SplitRow[]): string[] => {
    const before: string[] = [];
    const after: string[] = [];
    splitRows.forEach((row) => {
      if (row.type === "+") {
        after.push(`+ ${row.right}`);
        before.push(" ");
      } else if (row.type === "-") {
        after.push(" ");
        before.push(`- ${row.left}`);
      } else {
        before.push(`  ${row.left}`);
        after.push(`  ${row.right}`);
      }
    });

    return [before.join("\n"), after.join("\n")];
  };

  const [before, after] = getDiffTexts(splitRows);

  console.log(before.split("\n").length);
  console.log(after.split("\n").length);

  // TODO: implement line background color for insert/delete like on github

  return (
    <Stack
      direction="row"
      spacing={0}
      sx={{
        alignItems: "stretch",
        maxHeight: "250px",
        overflow: "auto",

        "&::-webkit-scrollbar": {
          width: "5px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#888",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#e0e0e0",
          borderRadius: "2px",
        },
      }}
    >
      <Box
        sx={{
          backgroundColor: "#e0e0e0",
          color: "#000",
          p: 2,
          width: "50%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Typography variant="h6" gutterBottom>
          {fileName}
        </Typography>
        <Divider />

        <Typography
          variant="body2"
          textAlign="left"
          gutterBottom
          sx={{
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
          }}
        >
          {before}
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: "#e0e0e0",
          color: "#000",
          p: 2,
          width: "50%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Typography variant="h6" gutterBottom>
          {fileName}
        </Typography>
        <Divider />

        <Typography
          variant="body2"
          textAlign="left"
          gutterBottom
          sx={{
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
          }}
        >
          {after}
        </Typography>
      </Box>
    </Stack>
  );
};

export default DiffComponent;
