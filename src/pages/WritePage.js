import { TextField, Button } from "@mui/material";
import { useTodosState } from "../hooks";
import { useNoticeSnackbarState } from "../components/NoticeSnackbar";

export default function WritePage() {
  const noticeSnackbarState = useNoticeSnackbarState();
  const todosState = useTodosState();
  const onSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    if (form.performDate.value.length == 0) {
      alert("음주량를 입력해주세요.");
      form.performDate.focus();
      return;
    }

    if (form.content.value.length == 0) {
      alert("내용을 입력해주세요.");
      form.content.focus();
      return;
    }
    
    const newTodoId = todosState.addTodo(
      form.performDate.value,
      form.content.value
    );
    noticeSnackbarState.open(`${newTodoId}번 추억이 추가되었습니다.`);
    form.content.value = "";
    form.content.focus();
  };

  
  return (
    <>
      <form className="flex-1 flex p-10 flex-col gap-7" onSubmit={onSubmit}>
        <TextField
          label="얼마나 마셨나요?"
          focused
          type="datetime-local"
          name="performDate"
        />

        <TextField
          name="content"
          label="무슨일이 있었나요?"
          className="flex-1 flex"
          InputProps={{ className: "flex-1 flex-col" }}
          inputProps={{ className: "flex-1" }}
          multiline
        />

        <Button type="submit" variant="contained">
          <span>
            <i className="fa-solid fa-pencil"></i>
          </span>
          <span>&nbsp;</span>
          <span>할 일 추가</span>
        </Button>
      </form>
    </>
  );
}