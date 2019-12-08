export const convertTimestamp = unix_timestamp => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const date = new Date(unix_timestamp).getDate();
  const month = months[new Date(unix_timestamp).getMonth()];
  const newDate = `${date} ${month}`;

  return newDate;
};
