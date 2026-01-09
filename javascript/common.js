function isToday(d) {
  const t = new Date();
  return d.toDateString() === t.toDateString();
}

function formatDate(d) {
  return d.toISOString().split("T")[0];
}
