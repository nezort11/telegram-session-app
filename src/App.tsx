import { Box, Stack, Typography } from "@mui/material";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { LoginUsingCode } from "./pages/LoginUsingCode";
import { LoginUsingSession } from "./pages/LoginUsingSession";

export const App = () => {
  return (
    <BrowserRouter>
      <Box sx={{ textAlign: "center", maxWidth: 320, margin: "auto" }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Telegram Session App
        </Typography>

        <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
          <Typography component={Link} to="/login/code">
            Login using code
          </Typography>
          <Typography component={Link} to="/login/session">
            Login using session
          </Typography>
        </Stack>

        <Routes>
          <Route path="/login/code" element={<LoginUsingCode />} />
          <Route path="/login/session" element={<LoginUsingSession />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
};
