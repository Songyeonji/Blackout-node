import { useTodosState } from "../hooks";
import Calendar from "./CalendarPage";

export default function MainPage() {

  const todosState = useTodosState();


  return (
    <>
      <Calendar/>
    </>
  );
}
