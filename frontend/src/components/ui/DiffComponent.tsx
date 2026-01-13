import { SplitRow } from "@/utils/myersdiff";
import { Box, Button, Modal, Divider, Stack, Typography } from "@mui/material";
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
    </Box>
  );
};

export default DiffComponent;
