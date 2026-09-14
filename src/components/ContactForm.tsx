import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { profile } from "../data";
import { submitContact, validateContact } from "../contact";
import type { ContactFields, ContactErrors } from "../contact";
const empty: ContactFields = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};
export default function ContactForm() {
  const [fields, setFields] = useState(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const inFlight = useRef(false);
  useEffect(() => () => controllerRef.current?.abort(), []);
  useEffect(() => {
    if (status === "success") resultRef.current?.focus();
  }, [status]);
  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || fields.website) return;
    const next = validateContact(fields);
    setErrors(next);
    if (Object.keys(next).length) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)
        ?.focus();
      return;
    }
    inFlight.current = true;
    setStatus("sending");
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      await submitContact(fields, controller.signal);
      setStatus("success");
      setFields(empty);
    } catch {
      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
      inFlight.current = false;
    }
  }
  function props(key: keyof ContactFields) {
    return {
      id: key,
      name: key,
      value: fields[key],
      "aria-invalid": Boolean(errors[key]),
      "aria-describedby": errors[key] ? `${key}-error` : undefined,
      onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setFields((f) => ({ ...f, [key]: event.target.value }));
        setErrors((e) => ({ ...e, [key]: undefined }));
        if (status === "error") setStatus("idle");
      },
    };
  }
  const error = (key: keyof ContactFields) =>
    errors[key] && (
      <span className="field-error" id={`${key}-error`}>
        {errors[key]}
      </span>
    );
  return (
    <div className="contact-form-card">
      <div className="form-title">
        <h3>Send a message</h3>
        <Send size={21} />
      </div>
      {status === "success" ? (
        <div
          className="form-success"
          role="status"
          tabIndex={-1}
          ref={resultRef}
        >
          <CheckCircle2 size={40} />
          <h4>Thanks for reaching out.</h4>
          <p>
            Your message was submitted. I look forward to connecting with you.
          </p>
          <button
            className="button button-primary"
            onClick={() => {
              setStatus("idle");
              setTimeout(() => document.getElementById("name")?.focus(), 0);
            }}
          >
            Write another message <ArrowUpRight size={17} />
          </button>
        </div>
      ) : (
        <form
          ref={formRef}
          noValidate
          onSubmit={handleSubmit}
          aria-busy={status === "sending"}
        >
          <div className="form-row">
            <div className="field">
              <label htmlFor="name">Your name</label>
              <input
                {...props("name")}
                autoComplete="name"
                placeholder="Alex Morgan"
                maxLength={100}
                required
              />
              {error("name")}
            </div>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                {...props("email")}
                type="email"
                autoComplete="email"
                placeholder="alex@company.com"
                maxLength={254}
                required
              />
              {error("email")}
            </div>
          </div>
          <div className="field">
            <label htmlFor="subject">Subject</label>
            <input
              {...props("subject")}
              placeholder="Let’s talk about an opportunity"
              maxLength={150}
              required
            />
            {error("subject")}
          </div>
          <div className="field">
            <label htmlFor="message">Your message</label>
            <textarea
              {...props("message")}
              rows={5}
              placeholder="Tell me a little about your team, project, or idea…"
              maxLength={5000}
              required
            />
            {error("message")}
          </div>
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="website">Leave this field empty</label>
            <input {...props("website")} tabIndex={-1} autoComplete="off" />
          </div>
          {status === "error" && (
            <p className="form-error" role="alert">
              Your message could not be submitted. Your text is still
              here—please retry, or{" "}
              <a href={`mailto:${profile.email}`}>email me directly</a>.
            </p>
          )}
          <button
            type="submit"
            className="button button-primary send-button"
            disabled={status === "sending"}
          >
            {status === "sending" ? (
              <>
                <LoaderCircle size={17} className="spin" />
                Sending…
              </>
            ) : (
              <>
                Send message <ArrowUpRight size={18} />
              </>
            )}
          </button>
          <p className="form-footnote">
            Your details are used only to reply to your message. Sent via{" "}
            <a
              href="https://formsubmit.co/privacy.pdf"
              target="_blank"
              rel="noreferrer"
            >
              FormSubmit
            </a>
            .
          </p>
        </form>
      )}
    </div>
  );
}
