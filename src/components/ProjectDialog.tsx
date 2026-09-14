import { useEffect, useRef } from "react";
import { ArrowUpRight, X, Terminal } from "lucide-react";
import type { Project } from "../data";
import { ProjectArt } from "./Architecture";
export default function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | undefined;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!project || !dialog) return;
    const focused = document.activeElement as HTMLElement | null;
    dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      focused?.focus({ preventScroll: true });
    };
  }, [project]);
  return (
    <dialog
      ref={ref}
      className="project-dialog"
      aria-labelledby="project-dialog-title"
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const items = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'button, a[href], input, textarea, [tabindex="0"]',
          ),
        );
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const r = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < r.left ||
            event.clientX > r.right ||
            event.clientY < r.top ||
            event.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      {project && (
        <>
          <div className="dialog-bar">
            <span className="mono">
              PROJECT {project.number} / ENGINEERING NOTES
            </span>
            <button
              className="icon-button"
              autoFocus
              onClick={onClose}
              aria-label="Close project details"
            >
              <X size={21} />
            </button>
          </div>
          <div className="dialog-body">
            <p className="eyebrow">
              {project.category} · {project.date}
            </p>
            <h2 id="project-dialog-title">{project.title}</h2>
            <p className="dialog-subtitle">{project.subtitle}</p>
            <p className="role-label">{project.role}</p>
            <ProjectArt kind={project.id} />
            <section>
              <h3>The challenge</h3>
              <p>{project.challenge}</p>
            </section>
            <section>
              <h3>Engineering decisions</h3>
              <div className="decision-list">
                {project.decisions.map((d, i) => (
                  <div key={d.title}>
                    <span className="mono">0{i + 1}</span>
                    <div>
                      <h4>{d.title}</h4>
                      <p>{d.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h3>The result</h3>
              <p>{project.outcome}</p>
              <p className="scope-note">{project.scope}</p>
            </section>
            <section>
              <h3>
                <Terminal size={18} /> Explore locally
              </h3>
              <pre>
                <code>{project.commands.join("\n")}</code>
              </pre>
              <p className="small-text">
                See the repository README for prerequisites and complete setup
                instructions.
              </p>
            </section>
            <a
              className="button button-primary"
              href={`https://github.com/AbdoCooder/${project.repo}`}
              target="_blank"
              rel="noreferrer"
            >
              Explore the source <ArrowUpRight size={17} />
            </a>
          </div>
        </>
      )}
    </dialog>
  );
}
