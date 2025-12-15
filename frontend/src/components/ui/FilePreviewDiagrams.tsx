import { Card } from "@mui/material";
import { useSelector } from "react-redux";
import { selectFile, selectFileReduced } from "../../store/slices/fileSlice";
import { selectSelectedAlgorithm } from "../../store/slices/algorithmSlice";
import { useEffect, useState } from "react";
import { logger } from "../../utils/logger";
import getSplitDiffRows, {
  normalizeLineEndings,
  SplitRow,
} from "../../utils/myersdiff";
import DiffComponent from "./DiffComponent";
import { algorithms } from "../../pages/DiagramPage/DiagramPage";

const FilePreviewDiagrams = () => {
  const selectedFile = useSelector(selectFile);
  const selectedFileReduced = useSelector(selectFileReduced);
  const selectedAlgorithmId = useSelector(selectSelectedAlgorithm);
  const selectedAlgorithmName =
    algorithms.find((a) => a.id === selectedAlgorithmId)?.name ?? "";

  const [splitRows, setSplitRows] = useState<SplitRow[]>([]);
  // const [sendMock, { data, error, isLoading }] = useSendMockMutation();

  // console.log(selectedFile);
  //

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
    selectedFile &&
    splitRows.length > 0 && (
      <Card sx={{ minWidth: "800px", marginTop: 2, marginBottom: 2 }}>
        <DiffComponent
          fileName={selectedFile.name}
          selectedAlgorithm={selectedAlgorithmName}
          splitRows={splitRows}
        />
      </Card>
    )
  );
};

export default FilePreviewDiagrams;
