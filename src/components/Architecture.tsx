import { useState } from "react";
import { ArrowUpRight, Braces, Network, Layers3 } from "lucide-react";
import type { ProjectKind } from "../data";
const layers = [
  {
    name: "Systems",
    icon: Braces,
    label: "01 / THE FOUNDATION",
    title: "Understand the machine.",
    description:
      "Memory, processes, sockets. Building with the primitives that everything else depends on.",
    tag: "C · C++ · UNIX",
    project: "webserv",
  },
  {
    name: "Backend",
    icon: Network,
    label: "02 / THE CONNECTIONS",
    title: "Make the pieces work together.",
    description:
      "Protocols, task execution, and coordination across independent processes.",
    tag: "JAVA · TCP/IP · MAVEN",
    project: "distributed",
  },
  {
    name: "Infrastructure",
    icon: Layers3,
    label: "03 / THE ENVIRONMENT",
    title: "Give software a solid home.",
    description:
      "Isolated services, explicit configuration, and repeatable container builds.",
    tag: "DOCKER · LINUX · NGINX",
    project: "inception",
  },
] as const;
export function Architecture({
  onProject,
}: {
  onProject: (id: ProjectKind) => void;
}) {
  const [selected, setSelected] = useState(0);
  const layer = layers[selected];
  return (
    <div className="architecture">
      <div className="architecture-top">
        <span className="mono">
          <i /> ENGINEERING, LAYER BY LAYER
        </span>
        <span>+</span>
      </div>
      <div className="stack-art" aria-hidden="true">
        <svg viewBox="0 0 520 315" fill="none">
          <defs>
            <pattern
              id="grid"
              width="22"
              height="22"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="#a5c6b5" opacity=".17" />
            </pattern>
            <linearGradient id="plane">
              <stop stopColor="#42695b" />
              <stop offset="1" stopColor="#244238" />
            </linearGradient>
          </defs>
          <rect width="520" height="315" fill="url(#grid)" />
          <path
            d="M260 26V288M58 157H462"
            stroke="#517063"
            strokeDasharray="3 7"
          />
          {[2, 1, 0].map((i) => (
            <g
              key={i}
              className={`stack-plane ${selected === i ? "is-active" : ""}`}
            >
              <path
                d={`M260 ${29 + i * 53} 423 ${105 + i * 53} 260 ${182 + i * 53} 97 ${105 + i * 53}Z`}
                fill={selected === i ? "#d4ec95" : "url(#plane)"}
                stroke={selected === i ? "#e5fac1" : "#749282"}
              />
              <path
                d={`M97 ${105 + i * 53}v9L260 ${191 + i * 53} 423 ${114 + i * 53}v-9L260 ${182 + i * 53}Z`}
                fill={selected === i ? "#90ac63" : "#1a352b"}
                stroke={selected === i ? "#b0cd7b" : "#749282"}
              />
              <path
                d={`M164 ${105 + i * 53} 260 ${60 + i * 53} 356 ${105 + i * 53} 260 ${150 + i * 53}Z`}
                stroke={selected === i ? "#698548" : "#789585"}
                strokeDasharray="4 4"
              />
              <path
                d={`M231 ${104 + i * 53} 250 ${95 + i * 53}m20 0 19 9m-58 0 19 9m20 0 19-9M260 ${93 + i * 53}v22`}
                stroke={selected === i ? "#335039" : "#b6cbbb"}
                strokeWidth="2"
              />
            </g>
          ))}
        </svg>
        <span className="stack-note left mono">
          FIRST
          <br />
          PRINCIPLES
        </span>
        <span className="stack-note right mono">
          BUILT TO
          <br />
          CONNECT
        </span>
      </div>
      <div
        className="architecture-tabs"
        aria-label="Explore engineering disciplines"
      >
        {layers.map((item, i) => (
          <button
            key={item.name}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            <item.icon size={14} />
            {item.name}
          </button>
        ))}
      </div>
      <div className="architecture-caption" aria-live="polite">
        <span className="mono architecture-eyebrow">{layer.label}</span>
        <h3>{layer.title}</h3>
        <p>{layer.description}</p>
        <div className="architecture-bottom">
          <span className="mono">{layer.tag}</span>
          <button
            onClick={() => onProject(layer.project)}
            aria-label={`Explore ${layer.name.toLowerCase()} project`}
          >
            <ArrowUpRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
export function ProjectArt({ kind }: { kind: ProjectKind }) {
  if (kind === "minishell")
    return (
      <div className="project-art terminal-art" aria-hidden="true">
        <div className="window-bar">
          <span>
            <i />
            <i />
            <i />
          </span>
          <span>minishell — bash-inspired</span>
          <span>⌘</span>
        </div>
        <div className="terminal-body">
          <p>
            <b>➜</b> <span>~/minishell</span> ./minishell
          </p>
          <p>
            <b>$</b> echo "built from scratch"
          </p>
          <p className="terminal-output">built from scratch</p>
          <p>
            <b>$</b> ls -l | grep minishell
          </p>
          <p className="terminal-output">
            -rwxr-xr-x &nbsp; abenajib &nbsp; minishell
          </p>
          <p>
            <b>$</b> <span className="terminal-cursor" />
          </p>
        </div>
        <span className="art-corner mono">FORK → EXEC → WAIT</span>
      </div>
    );
  if (kind === "inception" || kind === "distributed") {
    const infra = kind === "inception";
    return (
      <div
        className={`project-art ${infra ? "infra-art" : "distributed-art"}`}
        aria-hidden="true"
      >
        <span className="art-label mono">
          {infra
            ? "INCEPTION / SERVICE TOPOLOGY"
            : "DISTRIBUTED TASK EXECUTION"}
        </span>
        <svg viewBox="0 0 520 230">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            className="diagram-lines"
          >
            <path
              d={
                infra
                  ? "M260 53V85M260 128V175M178 107H100V175M319 193H361"
                  : "M260 53V85M260 128V145H100V175M260 145V175M260 145H420V175"
              }
            />
            {infra && (
              <rect
                x="27"
                y="69"
                width="466"
                height="155"
                rx="8"
                strokeDasharray="5 6"
              />
            )}
          </g>
          <g className="diagram-box">
            <rect x="201" y="13" width="118" height="40" rx="5" />
            <rect x="178" y="85" width="164" height="43" rx="5" />
            <rect x="41" y="175" width="118" height="36" rx="5" />
            <rect x="201" y="175" width="118" height="36" rx="5" />
            <rect x="361" y="175" width="118" height="36" rx="5" />
          </g>
          <g className="diagram-text" textAnchor="middle">
            <text x="260" y="38">
              {infra ? "NGINX / TLS" : "Client / CLI"}
            </text>
            <text x="260" y="112">
              {infra ? "WordPress / PHP" : "Coordinator"}
            </text>
            <text x="100" y="198">
              {infra ? "Redis" : "Worker 01"}
            </text>
            <text x="260" y="198">
              {infra ? "MariaDB" : "Worker 02"}
            </text>
            <text x="420" y="198">
              {infra ? "Adminer" : "Worker 03"}
            </text>
          </g>
        </svg>
        <span className="art-corner mono">
          {infra
            ? "ISOLATED SERVICES. SHARED NETWORK."
            : "DISPATCH → PROCESS → MERGE"}
        </span>
      </div>
    );
  }
  return (
    <div className="project-art webserv-art" aria-hidden="true">
      <span className="art-label mono">WEBSERV / CONNECTION LIFECYCLE</span>
      <div className="request-line mono">
        <span>GET</span> /index.html <span>HTTP/1.1</span>
      </div>
      <div className="event-engine">
        <div className="socket-list mono">
          <span>
            <i />
            client :01
          </span>
          <span>
            <i />
            client :02
          </span>
          <span>
            <i />
            client :03
          </span>
        </div>
        <div className="event-connector" />
        <div className="event-loop">
          <span className="loop-symbol">↻</span>
          <span>Event loop</span>
          <small className="mono">I/O MULTIPLEXING</small>
        </div>
        <div className="event-connector" />
        <div className="response-chip mono">
          HTTP
          <br />
          <b>response</b>
        </div>
      </div>
      <span className="art-corner mono">ONE LOOP. MULTIPLE CONNECTIONS.</span>
    </div>
  );
}
