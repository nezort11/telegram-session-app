import {
  useState,
  useRef,
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
import axios from "axios";
// import { TelegramClient, sessions } from "telegram";
// import { API_HASH, API_ID } from "../env";

// const { StringSession } = sessions;

const telegramSessionClient = axios.create({
  baseURL: "https://telegram-session-api.vercel.app/api/",
});

type LoginConfirmResponse = {
  session: string;
};

export const LoginUsingCode = () => {
  const { enqueueSnackbar } = useSnackbar();

  // const client = useRef(
  //   new TelegramClient(new StringSession(""), API_ID, API_HASH, {
  //     connectionRetries: 5,
  //   })
  // ).current;

  const [phoneNumber, setPhoneNumber] = useState("");
  // const [forceSms, setForceSms] = useState(false);
  const [password, setPassword] = useState("");
  const [isSendingLoginCode, setIsSendingLoginCode] = useState(false);
  const [isLoginCodeSent, setIsLoginCodeSent] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [loginCode, setLoginCode] = useState("");

  // const [handleLogin, setHandleLogin] = useState<FormEventHandler | undefined>(
  //   undefined
  // );

  const [session, setSession] = useState("");

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

  const handleLoginCodeChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setLoginCode(event.target.value);
  };

  const handleSendLoginCode: FormEventHandler = async (event) => {
    event.preventDefault();

    setIsSendingLoginCode(true);
    try {
      await telegramSessionClient.post("/login", {
        phoneNumber,
      });
      setIsLoginCodeSent(true);
    } catch (error) {
      console.error(error);
      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        enqueueSnackbar(error.message, { variant: "error" });
      }
    } finally {
      setIsSendingLoginCode(false);
    }
  };

  const handleLogin: FormEventHandler = async (event) => {
    event.preventDefault();

    setIsLoggingIn(true);
    try {
      const loginResponse =
        await telegramSessionClient.post<LoginConfirmResponse>(
          "/login/confirm",
          {
            phoneNumber,
            password,
            phoneCode: loginCode,
          }
        );
      setIsLoggedIn(true);

      const session_ = loginResponse.data.session;
      console.log(session_);
      setSession(session_);
    } catch (error) {
      console.error(error);
      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        enqueueSnackbar(error.message, { variant: "error" });
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // const handleSendLoginCode: FormEventHandler = async (event) => {
  //   event.preventDefault();

  //   setIsSendingLoginCode(true);

  //   try {
  //     // client.start (client.signIn) does client.connect and client.sendCode internally
  //     // https://github.com/gram-js/gramjs/blob/master/gramjs/client/auth.ts
  //     await client.start({
  //       phoneNumber,
  //       password: async () => password,
  //       forceSMS: forceSms,
  //       phoneCode: (isCodeViaApp) => {
  //         setIsSendingLoginCode(false);

  //         return new Promise((resolve, reject) => {
  //           enqueueSnackbar(
  //             isCodeViaApp
  //               ? "Sent login code via Telegram"
  //               : "Sent login code via SMS",
  //             { variant: "success" }
  //           );
  //           setHandleLogin(() => {
  //             return (event: FormEvent) => {
  //               event.preventDefault();

  //               setLoginCode((currentLoginCode) => {
  //                 resolve(currentLoginCode);

  //                 return currentLoginCode;
  //               });
  //             };
  //           });
  //         });
  //       },
  //       onError: async (error) => {
  //         console.error(error);

  //         enqueueSnackbar(error.message, { variant: "error" });

  //         return true;
  //       },
  //     });

  //     // await client.sendMessage("me", {
  //     //   message: "You're successfully logged in!",
  //     // });

  //     enqueueSnackbar("Logged into Telegram", { variant: "success" });

  //     setHandleLogin(undefined);

  //     // @ts-expect-error wrong return type
  //     const sessionIdentifier_ = client.session.save() as string;
  //     console.log(sessionIdentifier_);

  //     setSessionIdentifier(sessionIdentifier_);
  //   } finally {
  //     setIsSendingLoginCode(false);
  //   }
  // };

  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Login using code
        {/* (Browser platform) */}
      </Typography>

      <Stack component="form" onSubmit={handleSendLoginCode} spacing={1}>
        <Box>
          <MuiTelInput
            required
            fullWidth
            disabled={isSendingLoginCode}
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
        </Box>
        <Box>
          <TextField
            label="Password"
            type="password"
            fullWidth
            // disabled={!!handleLogin}
            disabled={isSendingLoginCode}
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
          disabled={!phoneNumber || isSendingLoginCode}
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
            disabled={!isLoginCodeSent || isLoggingIn}
            onChange={handleLoginCodeChange}
          />
        </Box>
        <Button
          variant="contained"
          type="submit"
          disabled={!isLoginCodeSent || isLoggingIn}
        >
          Login
        </Button>
      </Stack>

      <br />

      <TextField
        label="Session identifier"
        placeholder="There will be your session identifier after login"
        InputProps={{
          readOnly: true,
          // disableUnderline: true,
        }}
        multiline
        fullWidth
        rows={6}
        value={session}
      />
    </Box>
  );
};
