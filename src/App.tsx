import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ArrowUp,
  MapPin,
  Menu,
  Moon,
  Sun,
  X,
  Phone,
  BookOpen,
  Code2,
  Check,
  Copy,
  GraduationCap,
} from "lucide-react";
import { Github, Linkedin } from "./components/BrandIcons";
import { capabilities, education, profile, projects } from "./data";
import type { ProjectKind } from "./data";
import { Architecture, ProjectArt } from "./components/Architecture";
import ProjectDialog from "./components/ProjectDialog";
import ContactForm from "./components/ContactForm";
const navigation = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "expertise", label: "Expertise" },
  { id: "contact", label: "Contact" },
];
export default function App() {
  const [theme, setTheme] = useState(
    document.documentElement.dataset.theme || "light",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const [filter, setFilter] = useState("All work");
  const [projectId, setProjectId] = useState<ProjectKind>();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#111e1a" : "#f7f8f2");
    try {
      localStorage.setItem("ab-theme", theme);
    } catch {}
  }, [theme]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    navigation.forEach(({ id }) => {
      const s = document.getElementById(id);
      if (s) observer.observe(s);
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const read = () =>
      setProjectId(
        projects.find((p) => p.id === location.hash.replace("#project/", ""))
          ?.id,
      );
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    const click = (e: PointerEvent) => {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !menuButton.current?.contains(e.target as Node)
      )
        setMenuOpen(false);
    };
    window.addEventListener("keydown", key);
    window.addEventListener("pointerdown", click);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("pointerdown", click);
    };
  }, [menuOpen]);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  function openProject(id: ProjectKind) {
    setProjectId(id);
    history.pushState(null, "", `#project/${id}`);
  }
  function closeProject() {
    setProjectId(undefined);
    history.replaceState(null, "", "#work");
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }
  const filtered = projects.filter(
    (p) => filter === "All work" || p.category === filter,
  );
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand"
            href="#top"
            aria-label="Abdelkader Benajiba, back to top"
          >
            <span className="brand-mark">
              ab<span>.</span>
            </span>
            <span className="brand-name">
              Abdelkader Benajiba<span>SOFTWARE ENGINEER</span>
            </span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                aria-current={active === n.id ? "location" : undefined}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="icon-button theme-toggle"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <a href="#contact" className="header-cta">
              Let’s talk <ArrowUpRight size={16} />
            </a>
            <button
              ref={menuButton}
              className="icon-button menu-toggle"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
        <div
          ref={menuRef}
          id="mobile-nav"
          className={`mobile-nav ${menuOpen ? "open" : ""}`}
        >
          <nav aria-label="Mobile navigation">
            {navigation.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={() => setMenuOpen(false)}
              >
                {n.label}
                <ArrowUpRight size={17} />
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main id="main">
        <section id="top" className="hero container">
          <div className="hero-copy">
            <div className="availability">
              <span className="status-dot" />
              OPEN TO INTERNSHIPS · JAN / FEB 2027
            </div>
            <p className="hero-intro">Hi, I’m Abdelkader.</p>
            <h1>
              Good software.
              <br />
              From the
              <br />
              <span>inside out.</span>
            </h1>
            <p className="hero-description">
              Software engineer building at the intersection of{" "}
              <strong>systems, backend, and infrastructure.</strong> From the
              first socket to the final container.
            </p>
            <div className="hero-actions">
              <a href="#work" className="button button-primary">
                Explore my work <ArrowDown size={18} />
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="button button-quiet"
              >
                <Github size={18} />
                GitHub
                <ArrowUpRight size={15} />
              </a>
            </div>
            <div className="hero-location">
              <MapPin size={14} />
              <span>Tetouan, Morocco</span>
              <span className="location-divider" />
              <span>1337 / 42 Network</span>
            </div>
          </div>
          <Architecture onProject={openProject} />
        </section>
        <div className="foundation-strip container">
          <span className="mono">A FOUNDATION IN</span>
          <span>C / C++</span>
          <span>Unix systems</span>
          <span>Java</span>
          <span>Docker</span>
          <span>Software quality</span>
          <span className="strip-asterisk" aria-hidden="true">
            ✳
          </span>
        </div>
        <section className="section container" id="work">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span>01</span>SELECTED WORK
              </p>
              <h2>
                Less talk.
                <br />
                More source code.
              </h2>
            </div>
            <p>
              Real engineering problems.
              <br />
              Deliberate decisions. Open source.
            </p>
          </div>
          <div className="work-toolbar">
            <div className="filters" aria-label="Filter projects">
              {["All work", "Systems", "Infrastructure", "Backend"].map((f) => (
                <button
                  key={f}
                  className={filter === f ? "selected" : ""}
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                >
                  {f}
                  {f === "All work" && <span>04</span>}
                </button>
              ))}
            </div>
            <span className="mono work-count" aria-live="polite">
              {String(filtered.length).padStart(2, "0")} PROJECT
              {filtered.length !== 1 ? "S" : ""}
            </span>
          </div>
          <div className="projects-grid">
            {filtered.map((p) => (
              <article key={p.id} className="project-card">
                <button
                  className="project-art-button"
                  aria-label={`Read ${p.title} case study`}
                  onClick={() => openProject(p.id)}
                >
                  <ProjectArt kind={p.id} />
                  <span className="art-open">
                    <ArrowUpRight size={19} />
                  </span>
                </button>
                <div className="project-card-body">
                  <div className="project-kicker mono">
                    <span>
                      {p.number} / {p.category}
                    </span>
                    <span>{p.date}</span>
                  </div>
                  <h3>
                    <button onClick={() => openProject(p.id)}>{p.title}</button>
                  </h3>
                  <p>{p.summary}</p>
                  <div className="tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <div className="project-card-footer">
                    <button
                      className="text-link"
                      onClick={() => openProject(p.id)}
                    >
                      Read case study
                      <ArrowRight size={16} />
                    </button>
                    <a
                      href={`${profile.github}/${p.repo}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${p.title} source on GitHub`}
                    >
                      <Github size={19} />
                      <span>Source</span>
                      <ArrowUpRight size={13} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="more-work">
            <div className="more-work-heading">
              <span className="mono">ALSO ON MY WORKBENCH</span>
              <a
                className="text-link"
                href={`${profile.github}?tab=repositories`}
                target="_blank"
                rel="noreferrer"
              >
                All repositories
                <ArrowUpRight size={16} />
              </a>
            </div>
            <a
              className="archive-row"
              href={`${profile.github}/cub3d`}
              target="_blank"
              rel="noreferrer"
            >
              <Code2 size={22} />
              <span>
                <strong>cub3D</strong>
                <small>
                  A raycasting engine in C · textured walls, scene parsing,
                  real-time rendering
                </small>
              </span>
              <span className="archive-tag">C / GRAPHICS</span>
              <ArrowUpRight size={21} />
            </a>
            <a
              className="archive-row"
              href={`${profile.github}/Kubernetes-Infrastructure-for-University-Applications`}
              target="_blank"
              rel="noreferrer"
            >
              <BookOpen size={22} />
              <span>
                <strong>University infrastructure</strong>
                <small>
                  Kubernetes architecture exploration · phase-one design
                  documentation
                </small>
              </span>
              <span className="archive-tag">ARCHITECTURE DRAFT</span>
              <ArrowUpRight size={21} />
            </a>
          </div>
        </section>
        <section id="about" className="about-section">
          <div className="container about-grid">
            <div className="about-left">
              <p className="eyebrow">
                <span>02</span>THE ENGINEER
              </p>
              <h2>
                Curiosity goes deep.
                <br />
                <span>So does the work.</span>
              </h2>
              <div className="about-monogram" aria-hidden="true">
                <span>ab.</span>
                <div className="mono">
                  TETOUAN, MOROCCO
                  <br />
                  35.57° N / 5.37° W
                </div>
                <span className="monogram-plus">+</span>
              </div>
            </div>
            <div className="about-copy">
              <p className="about-lead">
                I like understanding what happens beneath the abstraction.
              </p>
              <p>
                At <strong>1337 Coding School, part of the 42 Network</strong>,
                I learn by building: managing memory in C, working with Unix
                processes, and writing a server’s event loop from scratch.
              </p>
              <p>
                Alongside that, I’m pursuing a{" "}
                <strong>
                  Master’s in Software Quality at Abdelmalek Essaadi University
                </strong>
                . It brings another lens to the same work: how to reason about
                correctness, test behavior, and make software easier to
                maintain.
              </p>
              <p>
                I’m looking for a team where I can contribute to meaningful
                systems, learn from experienced engineers, and keep asking
                better questions.
              </p>
              <div className="about-principles">
                <span>
                  <span>01</span>Understand the fundamentals
                </span>
                <span>
                  <span>02</span>Make decisions explicit
                </span>
                <span>
                  <span>03</span>Build, test, and iterate
                </span>
              </div>
              <a
                className="text-link"
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                More about me on LinkedIn
                <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>
        <section id="expertise" className="section container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span>03</span>TOOLS & FOUNDATIONS
              </p>
              <h2>
                The right tool.
                <br />A deeper understanding.
              </h2>
            </div>
            <p>
              A practical toolkit, built through
              <br />
              projects and continuous learning.
            </p>
          </div>
          <div className="capabilities-grid">
            {capabilities.map((g) => (
              <article className="capability" key={g.number}>
                <span className="capability-number mono">/{g.number}</span>
                <h3>{g.title}</h3>
                <p>{g.description}</p>
                <ul>
                  {g.skills.map((s) => (
                    <li key={s}>
                      <span />
                      {s}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="education">
            <div className="education-intro">
              <GraduationCap size={25} />
              <p className="eyebrow">THE LEARNING NEVER STOPS</p>
              <h3>
                Two paths.
                <br />
                One foundation.
              </h3>
              <p>
                Academic depth meets
                <br />
                hands-on, peer-driven learning.
              </p>
            </div>
            <div className="education-list">
              {education.map((e) => (
                <article key={e.title}>
                  <div className="education-date mono">
                    <span>{e.date}</span>
                    {e.current && <span className="ongoing">ONGOING</span>}
                  </div>
                  <h4>{e.title}</h4>
                  <p className="education-place">{e.place}</p>
                  <p>{e.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="contact" className="contact-section">
          <div className="container contact-grid">
            <div className="contact-copy">
              <p className="eyebrow">
                <span>04</span>LET’S CONNECT
              </p>
              <h2>
                Something good
                <br />
                starts with
                <br />
                <span>a conversation.</span>
              </h2>
              <p>
                I’m looking for a{" "}
                <strong>
                  six-month internship starting January or February 2027
                </strong>{" "}
                in systems, backend development, or DevOps.
              </p>
              <p>
                Have an opportunity, a technical question,
                <br />
                or an interesting problem? Let’s talk.
              </p>
              <div className="email-row">
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
                <button
                  className="icon-button"
                  onClick={copyEmail}
                  aria-label={
                    copied ? "Email address copied" : "Copy email address"
                  }
                >
                  {copied ? <Check size={18} /> : <Copy size={17} />}
                </button>
                <span className="sr-only" role="status">
                  {copied ? "Email address copied" : ""}
                </span>
              </div>
              <a className="phone-link" href="tel:+212682546206">
                <Phone size={15} />
                {profile.phone}
              </a>
              <div className="contact-socials">
                <a href={profile.github} target="_blank" rel="noreferrer">
                  <Github size={17} />
                  GitHub
                  <ArrowUpRight size={14} />
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin size={17} />
                  LinkedIn
                  <ArrowUpRight size={14} />
                </a>
                <a href={profile.devto} target="_blank" rel="noreferrer">
                  <BookOpen size={17} />
                  Dev.to
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <footer className="site-footer container">
        <a className="footer-brand" href="#top">
          ab<span>.</span>
        </a>
        <p>
          © {new Date().getFullYear()} Abdelkader Benajiba
          <span>Built with intention. And React.</span>
        </p>
        <a className="back-top" href="#top">
          Back to top
          <ArrowUp size={16} />
        </a>
      </footer>
      <ProjectDialog
        project={projects.find((p) => p.id === projectId)}
        onClose={closeProject}
      />
    </>
  );
}
