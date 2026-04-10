import { formatDate } from "./dateHelpers";
export const filterBorrowedBooks = (books, status = "all") => {
  const now = new Date();
  return books.filter((b) => {
    const due = new Date(b.dueDate);
    const over = due < now;
    if (status === "active") return !over;
    if (status === "overdue") return over;
    return true;
  });
};
export const sortByDate = (books, order = "asc") =>
  [...books].sort((a, b) => {
    const da = new Date(a.borrowDate);
    const db = new Date(b.borrowDate);
    return order === "asc" ? da - db : db - da;
  });
export const calculateFineForBook = (d) => {
  const now = new Date();
  const due = new Date(d);
  const hrs = Math.max(0, (now - due) / (1000 * 60 * 60));
  return Math.ceil(hrs * 0.1);
};
