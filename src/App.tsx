import {
  useState,
  type ChangeEventHandler,
  type FormEventHandler,
  type FormEvent,
} from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { MuiTelInput, MuiTelInputProps } from "mui-tel-input";
// import { useSnackbar } from "material-ui-snackbar-provider";
import { useSnackbar } from "notistack";
import { TelegramClient, sessions } from "telegram";
const { StringSession } = sessions;

const SESSION = new StringSession("");
const API_ID = +process.env.REACT_APP_API_ID;
const API_HASH = process.env.REACT_APP_API_HASH;

const client = new TelegramClient(SESSION, API_ID, API_HASH, {
  connectionRetries: 5,
}); // Immediately create a client using your application data

function App() {
  const { enqueueSnackbar } = useSnackbar();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [forceSms, setForceSms] = useState(false);
  const [password, setPassword] = useState("");
  const [isSendingLoginCode, setIsSendingLoginCode] = useState(false);

  const [loginCode, setLoginCode] = useState("");

  const [handleLogin, setHandleLogin] = useState<FormEventHandler | undefined>(
    undefined
  );

  const [sessionIdentifier, setSessionIdentifier] = useState("");

  const handlePhoneNumberChange: MuiTelInputProps["onChange"] = (
    newPhoneNumber
  ) => {
    setPhoneNumber(newPhoneNumber);
  };

  const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setPassword(event.target.value);
  };

  // const handleForceSmsChange: ChangeEventHandler<HTMLInputElement> = (
  //   event
  // ) => {
  //   setForceSms((previousForceSms) => !previousForceSms);
  // };

  const handleLoginCodeChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setLoginCode(event.target.value);
  };

  const handleSendLoginCode: FormEventHandler = async (event) => {
    event.preventDefault();

    setIsSendingLoginCode(true);

    try {
      // client.start (client.signIn) does client.connect and client.sendCode internally
      // https://github.com/gram-js/gramjs/blob/master/gramjs/client/auth.ts
      await client.start({
        phoneNumber,
        password: async () => password,
        forceSMS: forceSms,
        phoneCode: (isCodeViaApp) => {
          setIsSendingLoginCode(false);

          return new Promise((resolve, reject) => {
            enqueueSnackbar(
              isCodeViaApp
                ? "Sent login code via Telegram"
                : "Sent login code via SMS",
              { variant: "success" }
            );
            setHandleLogin(() => {
              return (event: FormEvent) => {
                event.preventDefault();

                setLoginCode((currentLoginCode) => {
                  resolve(currentLoginCode);

                  return currentLoginCode;
                });
              };
            });
          });
        },
        onError: async (error) => {
          console.error(error);

          enqueueSnackbar(error.message, { variant: "error" });

          return true;
        },
      });

      // await client.sendMessage("me", {
      //   message: "You're successfully logged in!",
      // });

      enqueueSnackbar("Logged into Telegram", { variant: "success" });

      setHandleLogin(undefined);

      // @ts-expect-error wrong return type
      const sessionIdentifier_ = client.session.save() as string;
      console.log(sessionIdentifier_);

      setSessionIdentifier(sessionIdentifier_);
    } finally {
      setIsSendingLoginCode(false);
    }
  };

  return (
    <Box sx={{ textAlign: "center", maxWidth: 320, margin: "auto" }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Telegram Session Login
      </Typography>

      <Stack component="form" onSubmit={handleSendLoginCode} spacing={1}>
        <Box>
          <MuiTelInput
            required
            fullWidth
            disabled={!!handleLogin}
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
        </Box>
        <Box>
          <TextField
            label="Password"
            type="password"
            fullWidth
            disabled={!!handleLogin}
            onChange={handlePasswordChange}
          />
        </Box>
        {/* SMS are no longer sent via alternative clients */}
        {/* <Box>
          <FormControlLabel
            control={
              <Checkbox
                required
                disabled={!!handleLogin}
                onChange={handleForceSmsChange}
              />
            }
            label="Force send SMS"
            required={false}
          />
        </Box> */}
        <LoadingButton
          loading={isSendingLoginCode}
          disabled={!phoneNumber || !!handleLogin}
          variant="contained"
          type="submit"
        >
          Send login code
        </LoadingButton>
      </Stack>

      <br />

      <Stack component="form" onSubmit={handleLogin} spacing={1}>
        <Box>
          <TextField
            label="Login code"
            type="text"
            required
            fullWidth
            disabled={!handleLogin}
            onChange={handleLoginCodeChange}
          />
        </Box>
        <Button variant="contained" type="submit" disabled={!handleLogin}>
          Login
        </Button>
      </Stack>

      <br />

      <TextField
        label="Session identifier"
        placeholder="There will be session identifier after login"
        InputProps={{
          readOnly: true,
          // disableUnderline: true,
        }}
        multiline
        fullWidth
        rows={6}
        value={sessionIdentifier}
      />
    </Box>
  );
}

export default App;
