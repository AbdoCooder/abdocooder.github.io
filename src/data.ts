export const profile = {
  name: "Abdelkader Benajiba",
  email: "abdocooder@gmail.com",
  phone: "+212 682 546 206",
  github: "https://github.com/AbdoCooder",
  linkedin: "https://linkedin.com/in/benajiba",
  devto: "https://dev.to/abdocooder",
  location: "Tetouan, Morocco",
};
export type ProjectKind = "webserv" | "inception" | "minishell" | "distributed";
export type Project = {
  id: ProjectKind;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  summary: string;
  tags: string[];
  repo: string;
  role: string;
  challenge: string;
  decisions: { title: string; text: string }[];
  outcome: string;
  scope: string;
  commands: string[];
};
export const projects: Project[] = [
  {
    id: "webserv",
    number: "01",
    title: "Webserv",
    subtitle: "An HTTP server, built from first principles.",
    category: "Systems",
    date: "2026",
    summary:
      "An HTTP/1.1 server in C++. I built the core architecture: sockets, I/O multiplexing, the event loop, and client connection management.",
    tags: ["C++", "POSIX sockets", "Non-blocking I/O"],
    repo: "webserv",
    role: "Core server architecture · team of 3",
    challenge:
      "Serve multiple clients without allowing one slow connection to block the entire server. The project supports static content and CGI-driven responses.",
    decisions: [
      {
        title: "One event loop, many clients",
        text: "Multiplex socket readiness so the server can manage multiple connections without a dedicated blocking thread for every client.",
      },
      {
        title: "Explicit connection ownership",
        text: "Keep socket creation, event registration, and client lifecycle management in the core architecture, with separately owned request and response handling.",
      },
      {
        title: "Defined team boundaries",
        text: "I owned the server core. Teammates owned HTTP handling and configuration/CGI. Bonus features were developed together.",
      },
    ],
    outcome:
      "A working HTTP server with concurrent connection handling, static website hosting, and CGI support. The repository documents how to build and run it with a configuration file.",
    scope:
      "42 curriculum project. A learning implementation, with no production SLA claimed.",
    commands: [
      "git clone https://github.com/AbdoCooder/webserv.git",
      "cd webserv",
      "make",
      "./webserv path/to/config.conf",
    ],
  },
  {
    id: "inception",
    number: "02",
    title: "Inception",
    subtitle: "Infrastructure with every layer accounted for.",
    category: "Infrastructure",
    date: "2026",
    summary:
      "A containerized WordPress stack with custom images, TLS termination, service isolation, persistent storage, and file-mounted secrets.",
    tags: ["Docker", "NGINX", "MariaDB", "Redis"],
    repo: "Inception",
    role: "Container infrastructure · 42 curriculum",
    challenge:
      "Build a complete web stack from Debian and Alpine base images, understanding each service instead of relying on preconfigured application images.",
    decisions: [
      {
        title: "A clear service boundary",
        text: "NGINX terminates TLS and forwards traffic to WordPress/PHP-FPM. MariaDB persists application data, while Redis provides object caching.",
      },
      {
        title: "Configuration outside the image",
        text: "Credentials are mounted as secret files under /run/secrets. A custom bridge network provides service-name discovery between containers.",
      },
      {
        title: "Repeatable operations",
        text: "Docker Compose and Make coordinate builds, startup, logs, and shutdown. Named volumes backed by host paths preserve data between container lifecycles.",
      },
    ],
    outcome:
      "A documented stack with NGINX, WordPress, MariaDB, Redis, FTP, Adminer, and a static website, plus developer and user operating guides.",
    scope:
      "Educational infrastructure with a self-signed TLS certificate. Host setup and secret files are required; follow the repository guide.",
    commands: [
      "git clone https://github.com/AbdoCooder/Inception.git",
      "cd Inception",
      "# Follow README prerequisites and secret configuration",
      "make",
      "make logs",
    ],
  },
  {
    id: "minishell",
    number: "03",
    title: "Minishell",
    subtitle: "Making the Unix process model tangible.",
    category: "Systems",
    date: "2025",
    summary:
      "A Bash-inspired shell in C with command execution, pipe chains, redirections, built-ins, environment expansion, and signal handling.",
    tags: ["C", "Unix", "Processes", "File descriptors"],
    repo: "Minishell",
    role: "Systems programming · team of 2",
    challenge:
      "Reproduce familiar shell behavior while manually managing child processes, memory, file descriptors, and the differences between interactive and executing states.",
    decisions: [
      {
        title: "Follow the Unix execution model",
        text: "Use fork, execve, and waitpid to create processes, execute programs, and collect their exit status.",
      },
      {
        title: "Connect commands explicitly",
        text: "Build pipe chains and input/output redirection with pipe and dup2, including append and heredoc syntax.",
      },
      {
        title: "Keep the shell interactive",
        text: "Support built-ins such as cd, export, and exit alongside environment-variable expansion and terminal signal behavior.",
      },
    ],
    outcome:
      "A working interactive shell developed with Othmane Zarwal. The repository provides build requirements and example commands for execution, pipes, and redirection.",
    scope:
      "A Bash-inspired subset built under 42 constraints, rather than a complete Bash replacement.",
    commands: [
      "git clone https://github.com/AbdoCooder/Minishell.git",
      "cd Minishell",
      "make",
      "./minishell",
    ],
  },
  {
    id: "distributed",
    number: "04",
    title: "Distributed Task Manager",
    subtitle: "From one task to coordinated workers.",
    category: "Backend",
    date: "2026",
    summary:
      "A Java coordinator/worker system that dispatches executable JAR tasks, supports split-and-merge processing, and runs through Docker Compose.",
    tags: ["Java", "TCP sockets", "Maven", "Docker"],
    repo: "distributed_masterslave_java_app",
    role: "Distributed computing · university project",
    challenge:
      "Coordinate task submission, worker execution, and result collection across separate processes, with a shared protocol and independently packaged task payloads.",
    decisions: [
      {
        title: "Separate coordination from execution",
        text: "The master node accepts clients and workers. Worker daemons execute payload JARs, while an interactive client submits tasks and input files.",
      },
      {
        title: "Share the protocol, not the implementation",
        text: "A shared library defines Message and TaskType. Maven modules separate the master, workers, client, payloads, and common protocol.",
      },
      {
        title: "Support two execution paths",
        text: "EXEC runs a task directly. SPLIT divides work and combines results, with examples for image filters and matrix computations.",
      },
    ],
    outcome:
      "A containerized application configured with three worker replicas, an interactive CLI, and documented end-to-end scenarios for matrix and image processing.",
    scope:
      "The repository documents manual end-to-end testing and currently has no automated src/test suite. Automatic task recovery is not claimed.",
    commands: [
      "git clone https://github.com/AbdoCooder/distributed_masterslave_java_app.git",
      "cd distributed_masterslave_java_app",
      "make",
      "make client",
    ],
  },
];
export const capabilities = [
  {
    number: "01",
    title: "Systems & networking",
    description: "Close to the machine. Clear about the details.",
    skills: [
      "C / C++",
      "POSIX sockets",
      "TCP/IP & HTTP",
      "Non-blocking I/O",
      "Processes & threads",
      "Memory management",
    ],
  },
  {
    number: "02",
    title: "Backend & data",
    description: "From protocols to useful applications.",
    skills: [
      "Java",
      "Python",
      "PHP",
      "MariaDB / MySQL",
      "Maven",
      "Distributed systems",
    ],
  },
  {
    number: "03",
    title: "Infrastructure & quality",
    description: "Build it. Understand it. Keep it maintainable.",
    skills: [
      "Docker & Compose",
      "Linux / Unix",
      "NGINX & TLS",
      "Bash & Make",
      "Git",
      "Testing & software quality",
    ],
  },
];
export const education = [
  {
    date: "2025 — Present",
    title: "Master’s in Software Quality",
    place: "Abdelmalek Essaadi University",
    detail:
      "Faculty of Sciences, Tetouan. Software quality engineering, testing methods, and quality assurance.",
    current: true,
  },
  {
    date: "2024 — Present",
    title: "1337 Coding School",
    place: "UM6P · 42 Network · Campus MED",
    detail:
      "Architecte en Technologie Numérique program. A project-driven, peer-to-peer curriculum in systems programming and software engineering.",
    current: true,
  },
  {
    date: "2022 — 2025",
    title: "Bachelor’s in Mathematics & Computer Science",
    place: "Abdelmalek Essaadi University",
    detail:
      "Faculty of Sciences, Tetouan. Algorithms, data structures, mathematics, databases, and software engineering foundations.",
    current: false,
  },
];
