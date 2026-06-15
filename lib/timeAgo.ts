export function timeAgo(timestamp?: string | null): string {
  if (!timestamp) return "Just now";

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "Just now";

  const diff = Date.now() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 7) return `${days} days ago`;
  return `${weeks} weeks ago`;
}