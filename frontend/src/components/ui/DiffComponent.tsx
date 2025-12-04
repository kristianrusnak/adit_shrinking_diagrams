import { SplitRow } from "@/utils/myersdiff";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
export interface DiffComponentProps {
  fileName: string;
  selectedAlgorithm: string;
  splitRows: SplitRow[];
}

// TODO: implement "replace". this happens when - is followed by + (a line is replaced by another)
const DiffComponent = ({
  splitRows,
  selectedAlgorithm,
  fileName,
}: DiffComponentProps) => {
  const getDiffTexts = (splitRows: SplitRow[]): string[][] => {
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

    return [before, after];
  };

  const [before, after] = getDiffTexts(splitRows);
  const bg1 = grey[50];

  return (
    <Stack
      direction="row"
      spacing={0}
      sx={{
        alignItems: "stretch",
        maxHeight: "250px",
        overflow: "auto",
        backgroundColor: `${bg1}`,
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
          color: "#000",
          p: 2,
          width: "50%",
          height: "100%",
          overflow: "hidden",
          paddingRight: 0,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {fileName}
        </Typography>
        <Divider />
        {before.map((line, idx) => {
          const firstChar = line.charAt(0);
          const sx = {
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            backgroundColor:
              firstChar === "+"
                ? "success.light"
                : firstChar === "-"
                  ? "error.light"
                  : "e0e0e0",
          };
          return (
            <Typography key={idx} variant="body2" sx={sx}>
              {line}
            </Typography>
          );
        })}
      </Box>
      <Box
        sx={{
          color: "#000",
          p: 2,
          width: "50%",
          height: "100%",
          overflow: "hidden",
          paddingLeft: 0,
        }}
      >
        <Typography paddingLeft={2} variant="h6" gutterBottom>
          {selectedAlgorithm}
        </Typography>
        <Divider />

        {after.map((line, idx) => {
          const firstChar = line.charAt(0);
          const sx = {
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            backgroundColor:
              firstChar === "+"
                ? "success.main"
                : firstChar === "-"
                  ? "error.main"
                  : "e0e0e0",
          };
          return (
            <Typography key={idx} variant="body2" sx={sx}>
              {line}
            </Typography>
          );
        })}
      </Box>
    </Stack>
  );
};

export default DiffComponent;
