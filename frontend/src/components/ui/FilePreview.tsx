import { Card, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { selectFile } from "../../store/slices/fileSlice";
import { useEffect, useState } from "react";
import { useSendMockMutation } from "../../api/dbApi";
import { useError } from "../../context/useError.jsx";
import getSplitDiffRows, { SplitRow } from "../../utils/myersdiff";
import DiffComponent from "./DiffComponent";

const FilePreview = () => {
  const selectedFile = useSelector(selectFile);
  const { showError } = useError() as {
    showError: (msg: string, title?: string) => void;
  };
  const [splitRows, setSplitRows] = useState<SplitRow[]>([]);
  const [sendMock, { data, error, isLoading }] = useSendMockMutation();

  // console.log(selectedFile);
  //

  useEffect(() => {
    if (!selectedFile) {
      return;
    }

    const fetchResponse = async () => {
      const beforeProcessing = await selectedFile.text();

      try {
        const response = await sendMock({ file: selectedFile }).unwrap();
        const filtered = response.split("\n").filter((line, idx) => idx % 2);
        filtered.push("blaba added 1 ");
        filtered.push("blaba added 2 ");
        filtered.push("blaba added 3 ");
        filtered.push("blaba added 4 ");

        console.log("got response");

        const _splitRows = getSplitDiffRows(
          beforeProcessing.split("\n"),
          filtered,
        );

        setSplitRows(_splitRows);
        console.log(splitRows);
      } catch (error: any) {
        showError(error.error, `Status: ${error.status}`);
      }
    };

    fetchResponse();
  }, [selectedFile]);

  // TODO: nicer progress handling, maybe display on button, maybe show original file while loading
  return isLoading ? (
    <CircularProgress />
  ) : (
    <Card sx={{ minWidth: "800px", marginTop: 2, marginBottom: 2 }}>
      {selectedFile && splitRows.length > 0 && (
        <DiffComponent fileName={selectedFile.name} splitRows={splitRows} />
      )}
    </Card>
  );
};

export default FilePreview;
