import React from "react";
import ReactDOM from "react-dom/client";
// import { SnackbarProvider } from "material-ui-snackbar-provider";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

import App from "./App";

// // @ts-ignore
// type SnackbarProviderProps = Parameters<typeof SnackbarProvider>[0];

// type SnackbarComponent = SnackbarProviderProps["SnackbarComponent"];
// // @ts-ignore
// type SnackbarComponentProps = Parameters<SnackbarComponent>[0];

// type DefaultSnackbarCustomParameters = SnackbarComponentProps['customParameters'] & {
//   severity: AlertProps['severity']
// }

// type DefaultSnackbarProps = SnackbarComponentProps & {
//   customParameters: DefaultSnackbarCustomParameters;
// };

// function DefaultSnackbar({
//   message,
//   action,
//   ButtonProps,
//   SnackbarProps,
//   customParameters,
// }: DefaultSnackbarProps) {
//   return (
//     <Snackbar
//       {...SnackbarProps}
//       message={message || ""}
//       action={
//         action != null && (
//           <Button color="secondary" size="small" {...ButtonProps}>
//             {action}
//           </Button>
//         )
//       }
//     >
//       <Alert
//         onClose={() => SnackbarProps["onClose"]?.(null as any, "escapeKeyDown")}
//         severity="error"
//         variant="filled"
//         sx={{ width: "100%" }}
//       >
//         {message}
//       </Alert>
//     </Snackbar>
//   );
// }

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <SnackbarProvider autoHideDuration={4000}>
      <App />
    </SnackbarProvider>
  </React.StrictMode>
);
