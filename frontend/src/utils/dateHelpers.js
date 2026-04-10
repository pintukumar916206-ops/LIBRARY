export const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
export const formatDateTime = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleString("en-IN");
};
export const getDaysOverdue = (d) => {
  if (!d) return 0;
  const due = new Date(d);
  const now = new Date();
  const diff = Math.floor((now - due) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};
export const isOverdue = (d) => getDaysOverdue(d) > 0;
export const formatRemainingDays = (d) => {
  const days = Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
};
