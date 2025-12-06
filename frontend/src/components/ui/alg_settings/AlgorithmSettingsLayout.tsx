import { Card, CardContent, Stack, Typography } from "@mui/material";

interface AlgorithmSettingsLayoutProps {
  title?: string;
  children?: React.ReactNode;
}

export const AlgorithmSettingsLayout = ({
  title,
  children,
}: AlgorithmSettingsLayoutProps) => {
  const hasChildren = !!children;
  return (
    <Card sx={{ p: 2, mb: 2, mt: 2, borderRadius: 5, boxShadow: 3 }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      <CardContent sx={{ p: 0 }}>
        {hasChildren ? (
          children
        ) : (
          <Typography color="text.secondary">No settings available</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AlgorithmSettingsLayout;
