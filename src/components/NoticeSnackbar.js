import React from "react";
import { atom, useRecoilState } from "recoil";
import {Alert as MuiAlert, Snackbar} from "@mui/material";

export const Alert = React.forwardRef((props, ref) => {
  return <MuiAlert {...props} ref={ref} variant="filled" />;
});



export const noticeSnackbarInfoAtom = atom({
    key: "app/noticeSnackbarInfoAtom",
    default: {
      opened: false,
      autoHideDuration: 0,
      severity: "",
      msg: "",
    },
  });
  
  export function useNoticeSnackbarState() {
    const [noticeSnackbarInfo, setNoticeSnackbarInfo] = useRecoilState(
      noticeSnackbarInfoAtom
    );
  
    const opened = noticeSnackbarInfo.opened;
    const autoHideDuration = noticeSnackbarInfo.autoHideDuration;
    const severity = noticeSnackbarInfo.severity;
    const msg = noticeSnackbarInfo.msg;
  
    const open = (msg, severity = "success", autoHideDuration = 6000) => {
      setNoticeSnackbarInfo({
        opened: true,
        msg,
        severity,
        autoHideDuration,
      });
    };
  
    const close = () => {
      setNoticeSnackbarInfo({ ...noticeSnackbarInfo, opened: false });
    };
  
    return {
      opened,
      open,
      close,
      autoHideDuration,
      severity,
      msg,
    };
  }
  
  export function NoticeSnackbar() {
    const state = useNoticeSnackbarState();
  
    return (
      <>
        <Snackbar
          open={state.opened}
          autoHideDuration={state.autoHideDuration}
          onClose={state.close}
        >
          <Alert severity={state.severity}>{state.msg}</Alert>
        </Snackbar>
      </>
    );
  }