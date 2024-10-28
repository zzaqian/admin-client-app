// src/components/Loading.tsx
import { Typography } from "@mui/material";

const Loading: React.FC = () => {
  return (
    <Typography variant="h4" component="h2" gutterBottom>
      Loading...
    </Typography>
  ); // Display a loading state while fetching role
};

export default Loading;
