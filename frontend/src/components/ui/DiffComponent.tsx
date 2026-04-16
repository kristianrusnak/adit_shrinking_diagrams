import { SplitRow } from "@/utils/myersdiff";
import { Box, Button, Modal, Divider, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useState } from "react";
import { encodePlantUml } from "@/utils/pumlencoder";

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
  const [modalOpen, setModalOpen] = useState(false);
  const getDiffTexts = (splitRows: SplitRow[]): string[][] => {
    const before: string[] = [];
    const after: string[] = [];
    let reduced: string[] = [];

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

      reduced.push(row.right); // reduced diagram without diff symbols
    });

    return [before, after, reduced];
  };

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const PUML_URL_BASE = "https://www.plantuml.com/plantuml/png/";

  const [before, after, reduced] = getDiffTexts(splitRows);
  const encoded = encodePlantUml(reduced.join("\n"));
  const pumlUrl = PUML_URL_BASE + encoded;

  const bg1 = grey[50];
  const neutralBg = grey[200];

  const getLineBackground = (line: string, isRightColumn: boolean) => {
    const firstChar = line.charAt(0);
    if (firstChar === "+") {
      return isRightColumn ? "success.main" : "success.light";
    }
    if (firstChar === "-") {
      return isRightColumn ? "error.main" : "error.light";
    }
    return neutralBg;
  };

  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          top: 5,
          right: 10,
          position: "absolute",
          textTransform: "none",
        }}
      >
        Show Diagram
      </Button>

      <Modal open={modalOpen} onClose={handleClose}>
        <Box
          sx={(theme) => ({
            position: "absolute",
            top: "50%",
            backgroundColor: "white !important",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: 24,
            borderRadius: 2,
            border: `2px solid ${theme.palette.primary.main} !important`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          })}
        >
          <img
            src={pumlUrl}
            alt="PlantUML Diagram"
            style={{
              width: "auto",
              maxWidth: "90vw",
              height: "auto",
              maxHeight: "90vh",
              objectFit: "contain",
            }}
          />
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{
              m: 1,
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
      <Box
        sx={{
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
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            color: "#000",
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: `${bg1}`,
          }}
        >
          <Box sx={{ p: 2, paddingRight: 1 }}>
            <Typography variant="h6" gutterBottom>
              {fileName}
            </Typography>
          </Box>
          <Box sx={{ p: 2, paddingLeft: 1 }}>
            <Typography variant="h6" gutterBottom>
              {selectedAlgorithm}
            </Typography>
          </Box>
        </Box>
        <Divider />

        <Box sx={{ color: "#000" }}>
          {before.map((leftLine, idx) => {
            const rightLine = after[idx] ?? " ";
            return (
              <Box
                key={idx}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  alignItems: "stretch",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    px: 2,
                    py: 0.25,
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                    lineHeight: 1.5,
                    backgroundColor: getLineBackground(leftLine, false),
                  }}
                >
                  {leftLine}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    px: 2,
                    py: 0.25,
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                    lineHeight: 1.5,
                    backgroundColor: getLineBackground(rightLine, true),
                  }}
                >
                  {rightLine}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default DiffComponent;
