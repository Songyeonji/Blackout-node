import React from "react";
import { atom, useRecoilState } from "recoil";
import {Alert as MuiAlert, Snackbar} from "@mui/material";

// Alert 컴포넌트: Material UI의 Alert 컴포넌트를 래핑하고, variant를 'filled'로 설정하여 스타일 지정
export const Alert = React.forwardRef((props, ref) => {
  return <MuiAlert {...props} ref={ref} variant="filled" />;
});


//림 상태를 전역적으로 관리하는 Recoil 상태
export const noticeSnackbarInfoAtom = atom({
    key: "app/noticeSnackbarInfoAtom",
    default: {
      opened: false,// 알림이 보이는지 여부
      autoHideDuration: 0,// 알림이 자동으로 사라지는 시간
      severity: "",// 알림의 중요도 (success, error 등)
      msg: "",// 알림 메시지
    },
  });
  //noticeSnackbarInfoAtom 상태를 사용하는 커스텀 훅
  export function useNoticeSnackbarState() {
    const [noticeSnackbarInfo, setNoticeSnackbarInfo] = useRecoilState(
      noticeSnackbarInfoAtom
    );
  
    const opened = noticeSnackbarInfo.opened;
    const autoHideDuration = noticeSnackbarInfo.autoHideDuration;
    const severity = noticeSnackbarInfo.severity;
    const msg = noticeSnackbarInfo.msg;

  // 구조 분해 할당을 사용하여 각 상태 값에 접근
    const open = (msg, severity = "success", autoHideDuration = 6000) => {
      setNoticeSnackbarInfo({
        opened: true,
        msg,
        severity,
        autoHideDuration,
      });
    };
  // close 함수: 알림을 닫기 위한 함수
    const close = () => {
      setNoticeSnackbarInfo({ ...noticeSnackbarInfo, opened: false });
    };
   // 커스텀 훅에서 반환되는 객체
    return {
      opened,
      open,
      close,
      autoHideDuration,
      severity,
      msg,
    };
  }
  // 페이지에 알림을 표시하는 컴포넌트
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
  };