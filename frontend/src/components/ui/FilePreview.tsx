import { Card, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { selectFile, selectFileReduced } from "../../store/slices/fileSlice";
import { useEffect, useState } from "react";
import { useProcessPumlMutation, useSendMockMutation } from "../../api/dbApi";
import { logger } from "../../utils/logger";
import { useError } from "../../context/useError.jsx";
import getSplitDiffRows, {
  normalizeLineEndings,
  SplitRow,
} from "../../utils/myersdiff";
import DiffComponent from "./DiffComponent";

const FilePreview = () => {
  const selectedFile = useSelector(selectFile);
  const selectedFileReduced = useSelector(selectFileReduced);
  const [splitRows, setSplitRows] = useState<SplitRow[]>([]);
  // const [sendMock, { data, error, isLoading }] = useSendMockMutation();


  useEffect(() => {
    if (!selectedFile || !selectedFileReduced) {
      return;
    }

    const buildDiff = async () => {
      const beforeProcessing = await selectedFile.text();
      const afterProcessing = await selectedFileReduced.text();

      const before = normalizeLineEndings(beforeProcessing).split("\n");
      const after = normalizeLineEndings(afterProcessing).split("\n");

      const _splitRows = getSplitDiffRows(before, after);

      logger.debug("_splitRows:", JSON.stringify(_splitRows));

      setSplitRows(_splitRows);
    };

    buildDiff();
  }, [selectedFile, selectedFileReduced]);

  return (
    <Card sx={{ minWidth: "800px", marginTop: 2, marginBottom: 2 }}>
      {selectedFile && splitRows.length > 0 && (
        <DiffComponent fileName={selectedFile.name} splitRows={splitRows} />
      )}
    </Card>
  );
};

export default FilePreview;
