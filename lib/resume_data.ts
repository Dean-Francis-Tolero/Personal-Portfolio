export type Experience = {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string | "Present";
  bullets: string[];
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  location?: string;
  startDate: string;
  endDate: string;
  bullets?: string[];
};

export type SkillGroup = {
  category: string;
  items: string[];
};

export type ProjectFigure = {
  // photo or screen-recording demo (.mp4/.webm/.mov — auto-detected by extension)
  src: string;
  // optional: what the lightbox opens to when this figure's cell is
  // clicked, if it should differ from the `src` thumbnail (e.g. the
  // original photo behind a shared placeholder thumbnail). Falls back to
  // `src` when unset.
  full?: string;
  // a sentence or two on what the image actually shows, rendered next to it
  // as its own captioned section on the project entry page.
  caption: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  // short, first-person, conversational — why this project got built.
  // Rendered as its own beat on the project entry page, between the hero
  // and the gallery. Optional: skipped entirely if unset.
  problem?: string;
  bullets?: string[];
  // forward-looking follow-ups ("what's next"), rendered alongside bullets
  // on the entry page's closing section. Optional.
  future?: string[];
  link?: string;
  tech?: string[];
  // falls back to a bg-muted/25 placeholder block (see ProjectCard) until
  // set. Used by the Projects listing card (`project_parallax.tsx`), OG/social
  // metadata, AND as the entry page gallery's cover cell — unless
  // `coverThumbnail` below overrides just that last one.
  image?: string;
  // optional: shown in the entry page gallery's cover cell instead of
  // `image` (e.g. a shared placeholder thumbnail) — clicking it still opens
  // the real `image`. Only affects the gallery; the listing card and OG
  // metadata always use `image` directly. Falls back to `image` when unset.
  coverThumbnail?: string;
  // extra figures (diagrams, screenshots, charts) discussed one at a time
  // further down the project entry page. Entirely optional.
  figures?: ProjectFigure[];
  // path to a PDF write-up/paper in public/ (e.g. "/FLARE/Paper.pdf"),
  // rendered as a "Read the Paper" chip next to the GitHub link.
  paper?: string;
};

export const experience: Experience[] = [
  {
    id: "ai-research-assistant",
    title: "Artificial Intelligence Research Assistant",
    company: "Dr. Sahil Garg, Canadian University Dubai",
    location: "Dubai, United Arab Emirates",
    startDate: "Sep. 2025",
    endDate: "May 2026",
    bullets: [
      "Co-authored an IEEE paper on Agentic AI (Osmotic Intelligence), focusing on explainable and sustainable training.",
      "Contributed to a $250,000 AWS research grant proposal by conducting cost-performance analysis for sustainable LLM training.",
      "Co-authoring a book for Springer Nature on Agentic AI, contributing research, content structuring, and technical analysis.",
      "Contributed to the development of the \"Osmotic Intelligence\" framework, assisting with cloud-edge workload distribution, Reinforcement Learning experiments, and XAI integration (Integrated Gradients).",
    ],
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    company: "Namat Events Managing & Organizing",
    location: "Dubai, United Arab Emirates",
    startDate: "Nov. 2025",
    endDate: "Dec. 2025",
    bullets: [
      "Managed and analyzed real-time transportation data during events to ensure smooth logistics and operations.",
      "Collected, verified, and entered live data accurately to support decision-making for the transportation team.",
      "Collaborated with Patek Philippe, ensuring client requirements and standards were met.",
    ],
  },
  {
    id: "software-engineer-movlogs",
    title: "Software Engineer",
    company: "MoVlogs - Vibes Family Management",
    location: "Dubai, United Arab Emirates",
    startDate: "May 2025",
    endDate: "Sep. 2025",
    bullets: [
      "Designed and deployed responsive websites (MoVlogs.com, MakeFym.com, MummyMo.com) using modern web technologies, ensuring 100% cross-device compatibility.",
      "Automated LinkedIn outreach with Python scripts, scaling client acquisition by 300% and reducing manual workload by 80%, enabling data-driven lead generation.",
      "Developed a Python application for international phone number analysis, automatically detecting country of origin and metadata with 98% accuracy, improving contact database quality and verification efficiency.",
    ],
  },
];

export const education: Education[] = [
  {
    id: "cud",
    institution: "Canadian University Dubai",
    degree: "Bachelor in Computer Science (GPA: 3.81/4.0)",
    location: "Dubai, United Arab Emirates",
    startDate: "Aug. 2022",
    endDate: "May 2026",
    bullets: [
      "Graduated Magna Cum Laude",
      "Winner, Canadian University Coding Competition 2022",
      "Dean's List | Scholar",
    ],
  },
];

export const skills: SkillGroup[] = [
  {
    category: "Libraries",
    items: ["PyTorch", "Scikit-learn", "NumPy", "pandas", "Captum", "NiBabel"],
  },
  {
    category: "Languages",
    items: ["Python", "C++", "SQL", "Java", "JavaScript"],
  },
  {
    category: "Frameworks",
    items: ["Node.js", "Express", "FastAPI", "Flask"],
  },
  {
    category: "Systems",
    items: ["Git", "Docker", "Linux", "Arduino"],
  },
];

export const projects: Project[] = [
  {
    id: "federated-learning-phishing-defense",
    name: "FLARE: Federated Learning Phishing Defense System",
    description:
      "A federated learning system for phishing email detection, aggregating client model updates without transmitting raw data.",
    problem:
      "This one started as my graduation project, built around a single constraint: catch phishing emails without anyone's inbox ever leaving their device. Most phishing filters I looked at wanted the opposite — pool everyone's data centrally, train one big model, and hope people trust you with their inboxes along the way.\n\nI wanted to see if federated learning could actually pull off the alternative in practice, not just on paper. That meant building the whole loop myself: a local client that trains on-device, a central server that aggregates weight deltas instead of raw data, and a scheduling strategy that doesn't fall apart the moment a client goes offline mid-round.\n\nThe Chrome extension came last, but it's the part that made the whole thing feel real — watching a warning pop up on an actual phishing email, knowing the model behind it never once saw anyone's actual mail.",
    future: [
      "Add a functional LLM fallback for low-confidence predictions.",
      "Build a central-server dashboard for monitoring every connected client.",
    ],
    tech: ["Python", "PyTorch", "FastAPI", "SQLAlchemy", "Chrome Extension (MV3)"],
    image: "/FLARE/Flare_logo.png",
    coverThumbnail: "/Cover.png",
    figures: [
      { src: "/Prototype.png", full: "/FLARE/Architecture.png", caption: "Prototype" },
      { src: "/Result.png", full: "/FLARE/System_Diagram.png", caption: "Result" },
      { src: "/Details.png", full: "/FLARE/Admin_Overview.png", caption: "Details" },
    ],
    link: "https://github.com/Dean-Francis-Tolero/Flare",
    paper: "/FLARE/Paper.pdf",
    bullets: [
      "Fine-tuned DistilBERT for phishing email detection, achieving 96.3% accuracy and 0.963 F1 on a held-out test set.",
      "Implemented FedAvg in a custom FastAPI aggregation server, weighting client updates by local sample count and handling non-IID data distributions across clients.",
      "Designed a hybrid threshold/timeout round-scheduling strategy to balance aggregation latency against client availability, with SQLAlchemy-backed persistence for round state and weight updates.",
      "Engineered the on-device training loop to compute and transmit weight deltas only, eliminating raw data transmission and validating correctness with a pytest integration suite.",
      "Built a Gmail-integrated Chrome MV3 extension with an admin dashboard, giving users live phishing warnings and letting them flag/correct predictions to feed local retraining.",
    ],
  },
  {
    id: "dementia-mri-classifier",
    name: "Dementia MRI Classifier",
    description:
      "A deep learning pipeline for classifying dementia (CN/AD) from 3D MRI volumes, with explainability built in.",
    problem:
      "I didn't want a model that just spits out \"AD\" or \"CN\" and calls it a day — I wanted to know it was looking at the right thing before I trusted it. A classifier that's right for the wrong reasons isn't actually useful in a clinical-adjacent setting, even a coursework one.\n\nSo this became less about squeezing out another percentage point of accuracy and more about building explainability in from the start. I used Integrated Gradients to trace every prediction back to the pixels that drove it, and checked those attribution maps against where atrophy is actually expected to show up.\n\nThe small custom CNN was a deliberate choice too — a lighter model is easier to reason about, and it kept the explainability step tractable instead of turning into its own research project.",
    tech: ["Python", "PyTorch", "NiBabel", "Captum"],
    image: "/Dementia_MRI_Classifier/cnn_logo.jpg",
    coverThumbnail: "/Cover.png",
    figures: [
      {
        src: "/Prototype.png",
        full: "/Dementia_MRI_Classifier/Explainability.png",
        caption: "Prototype",
      },
      {
        src: "/Result.png",
        full: "/Dementia_MRI_Classifier/MMSE_vs_Volume.png",
        caption: "Result",
      },
      {
        src: "/Details.png",
        full: "/Dementia_MRI_Classifier/Age_Distribution.png",
        caption: "Details",
      },
    ],
    link: "https://github.com/Dean-Francis-Tolero/dementia-mri-classifier",
    paper: "/Dementia_MRI_Classifier/Paper.pdf",
    bullets: [
      "Developed a pipeline to convert 3D MRI volumes into 2D slices, performing filtering, normalization, and augmentation for CN/AD classification.",
      "Built a custom lightweight CNN (~100K parameters) with batch normalization, dropout, and He initialization for robust binary classification on imbalanced datasets.",
      "Integrated Explainable AI (Integrated Gradients) to visualize predictions, compute deletion/insertion metrics, and interpret key brain regions influencing model decisions.",
      "Designed a reproducible end-to-end training workflow with early stopping, learning rate scheduling, gradient clipping, and result visualization for model evaluation and improvement.",
    ],
  },
  {
    id: "rfid-attendance-scanner",
    name: "RFID Attendance Scanner",
    description:
      "A web-based RFID attendance system built and sold to a school, with real-time tracking and parent notifications.",
    problem:
      "A school I knew needed a way to track attendance without a teacher manually taking roll call every single period. It sounded like a small problem until I actually sat with how much class time it was eating, every day, across every classroom.\n\nSo I built them a real system: RFID cards at the door, a teacher-facing dashboard with live and historical attendance, and a separate parent portal scoped to just their own kid's check-ins. Both update over WebSocket, not polling, so nobody's staring at a page waiting for it to refresh.\n\nI ended up selling it to them instead of just shipping it as a portfolio piece — the first time something I built went from a personal project to a system real people used every day.",
    tech: ["JavaScript", "MySQL", "Node.js", "Express.js"],
    image: "/RFID_Attendance_Scanner/RFID_logo.png",
    coverThumbnail: "/Cover.png",
    figures: [
      { src: "/Prototype.png", caption: "Prototype" },
      { src: "/Result.png", caption: "Result" },
      { src: "/Details.png", caption: "Details" },
    ],
    link: "https://github.com/Dean-Francis-Tolero/RFID-Attendance-Scanner",
    bullets: [
      "Successfully developed and sold a web-based RFID attendance system for a school, generating approximately 1,000 AED in revenue.",
      "Developed a system with real-time student tracking and automated parent notifications.",
      "Designed and maintained the database using MySQL to manage student and attendance data efficiently.",
      "Implemented the backend with Node.js and Express.js, facilitating smooth interaction between server and frontend.",
    ],
  },
  {
    id: "algorithms-visualizer",
    name: "Algorithms II Visualizer",
    description:
      "An interactive, single-page visualizer covering three Algorithms II topics, built for a university midterm with step-by-step animation and pseudocode highlighting.",
    problem:
      "For an Algorithms II midterm, I kept noticing that algorithms like matrix chain multiplication are easy enough to code but hard to actually build real intuition for just by reading the code. You can trace through a DP table on paper once and still not really feel why it works.\n\nSo instead of writing a script that prints an answer, I built a visualizer that animates every step — the DP cost and split tables filling in cell by cell, the recursion tree for merge sort branching out with a live Gantt chart of processor utilization, the Extended Euclidean algorithm unwinding one recursive call at a time.\n\nEverything renders natively in SVG, with pseudocode highlighting synced to whatever's animating, so you can watch the code and the visual update together instead of trying to hold both in your head at once.",
    tech: ["JavaScript", "HTML", "SVG"],
    image: "/Algorithms_II/Algorithms_logo.png",
    coverThumbnail: "/Cover.png",
    figures: [
      { src: "/Prototype.png", caption: "Prototype" },
      { src: "/Result.png", caption: "Result" },
      { src: "/Details.png", caption: "Details" },
    ],
    link: "https://github.com/Dean-Francis-Tolero/Algorithms",
    bullets: [
      "Built three fully animated visualizations (Matrix Chain Multiplication using dynamic programming, Parallel Merge Sort using a fork-join model, and the Extended Euclidean Algorithm), each with step-by-step playback and pseudocode highlighting.",
      "Rendered every visualization natively in SVG, including DP cost/split tables, recursion trees, and a Gantt chart of processor utilization, with no canvas API or external charting library.",
      "Computed a live Brent's theorem bound (T_p ≤ W/p + D) alongside the Gantt chart to show the parallel merge sort's theoretical vs. visualized speedup.",
      "Shipped as a single self-contained HTML file with no build step or dependencies, with dark/light theming persisted via localStorage.",
    ],
  },
];