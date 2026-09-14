export type ContactFields = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
};
export type ContactErrors = Partial<Record<keyof ContactFields, string>>;
export function validateContact(f: ContactFields): ContactErrors {
  const e: ContactErrors = {};
  if (f.name.trim().length < 2 || f.name.trim().length > 100)
    e.name = "Enter your name (2–100 characters).";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()) ||
    f.email.length > 254
  )
    e.email = "Enter a valid email address.";
  if (f.subject.trim().length < 3 || f.subject.trim().length > 150)
    e.subject = "Enter a subject (3–150 characters).";
  if (f.message.trim().length < 10 || f.message.trim().length > 5000)
    e.message = "Write a message between 10 and 5,000 characters.";
  return e;
}
export async function submitContact(f: ContactFields, signal: AbortSignal) {
  const recipient =
    import.meta.env.VITE_FORMSUBMIT_RECIPIENT?.trim() || "abdocooder@gmail.com";
  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`,
    {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: f.name.trim(),
        email: f.email.trim(),
        subject: f.subject.trim(),
        message: f.message.trim(),
        _subject: `Portfolio: ${f.subject.trim()}`,
        _replyto: f.email.trim(),
        _honey: f.website,
        _template: "table",
      }),
    },
  );
  const data = await response.json();
  if (!response.ok || !(data.success === true || data.success === "true"))
    throw new Error("Submission failed");
}
