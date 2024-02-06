import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
// import { API_HASH, API_ID } from "../env";
// import { StringSession } from "telegram/sessions";
// import { TelegramClient } from "telegram";

export const LoginUsingSession = () => {
  const [sessionIdentifier, setSessionIdentifier] = useState("");

  const handleSessionIdentifierChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setSessionIdentifier(event.target.value);
  };

  const handleLogin: FormEventHandler = async (event) => {
    event.preventDefault();

    // try {
    //   const client = new TelegramClient(
    //     new StringSession(sessionIdentifier),
    //     API_ID,
    //     API_HASH,
    //     {
    //       connectionRetries: 5,
    //     }
    //   );

    //   // await client.connect();
    //   // await client.checkAuthorization();

    //   // does client.connect() + client.checkAuthorization()
    //   await client.start({
    //     phoneNumber: "",
    //     phoneCode: async () => "",
    //     onError: async () => true,
    //   });
    // } catch (error) {
    //   console.error(error);
    // } finally {
    // }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Login using session (Browser platform)
      </Typography>

      <Stack component="form" onSubmit={handleLogin} spacing={1}>
        <TextField
          label="Session identifier"
          placeholder="Paste session identifier"
          helperText="Session identifier MUST BE from the same app and from the same platform (browser), because it's bound to Telegram API id and hash. Browser session don't work on CLI. CLI sessions work in the browser."
          multiline
          fullWidth
          rows={6}
          onChange={handleSessionIdentifierChange}
          // value={sessionIdentifier}
        />
        <Button variant="contained" type="submit" disabled={!sessionIdentifier}>
          Login
        </Button>
      </Stack>
    </Box>
  );
};
