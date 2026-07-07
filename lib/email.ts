export function openInGmail(to: string, subject: string, body: string) {
  const gmailUrl =
    `https://mail.google.com/mail/?view=cm&fs=1` +
    `&to=${encodeURIComponent(to)}` +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  window.open(gmailUrl, "_blank", "noopener,noreferrer");
}
