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

// Real pixel dimensions (natural width/height of the source file) — the
// carousel sizes each photo's box from these directly (aspect-ratio), so a
// portrait photo gets a tall narrow box and a wide screenshot gets a short
// wide one, never a fixed generic crop.
export type ImageDimensions = {
  width: number;
  height: number;
};

export type ProjectFigure = {
  // photo or screen-recording demo (.mp4/.webm/.mov — auto-detected by extension),
  // shown full-size as its own slide, never cropped or thumbnailed.
  src: string;
  // a sentence or two on what the image actually shows, rendered beneath it
  // as its own captioned slide on the project entry page.
  caption: string;
} & ImageDimensions;

export type ProcessStep = {
  // one clear sentence on what happens at this stage
  caption: string;
};

export type DemoClip = {
  // screenshot or screen-recording (.mp4/.webm/.mov — auto-detected by extension)
  src: string;
  // what's happening in this frame: what the user just did, what changed
  caption: string;
} & ImageDimensions;

export type ProcessDiagram = {
  src: string;
} & ImageDimensions;

export type Stat = {
  value: string;
  label: string;
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
  // metadata, AND as the entry page gallery's first slide.
  image?: string;
  // `image`'s natural pixel dimensions — only consulted by the Gallery
  // carousel (see `image` above) to size its cover box; the listing card
  // and OG metadata use `image` directly and don't need it.
  imageDimensions?: ImageDimensions;
  // extra figures (diagrams, screenshots, charts), each its own full-size
  // slide further down the project entry page. Entirely optional.
  figures?: ProjectFigure[];
  // path to a PDF write-up/paper in public/ (e.g. "/FLARE/Paper.pdf"),
  // rendered as a "Read the Paper" chip next to the GitHub link.
  paper?: string;
  // "How It Works" entry-page beat (between Problem and In Action): a
  // one-line headline on the core mechanism, up to a few numbered steps
  // (text slide), and an optional architecture diagram shown as its own
  // big, uncropped, straight-edged photo slide right after. Every field is
  // independently optional; the whole beat is skipped if none are set.
  processHeadline?: string;
  processDiagram?: ProcessDiagram;
  processSteps?: ProcessStep[];
  // "In Action" beat: a one-line headline (text slide) followed by one big,
  // uncropped, straight-edged photo slide per demo clip (screenshot or
  // screen recording) walking through the product running.
  demoHeadline?: string;
  demoClips?: DemoClip[];
  // "By the Numbers" beat: a few headline stats pulled out of `bullets`.
  stats?: Stat[];
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
      "This one started as my graduation project, built around a single constraint: catch phishing emails without anyone's inbox ever leaving their device. Most phishing filters I looked at wanted the opposite: pool everyone's data centrally, train one big model, and hope people trust you with their inboxes along the way.\n\nI wanted to see if federated learning could actually pull off the alternative in practice, not just on paper. That meant building the whole loop myself: a local client that trains on-device, a central server that aggregates weight deltas instead of raw data, and a scheduling strategy that doesn't fall apart the moment a client goes offline mid-round.\n\nThe Chrome extension came last, but it's the part that made the whole thing feel real: watching a warning pop up on an actual phishing email, knowing the model behind it never once saw anyone's actual mail.",
    future: [
      "Add a functional LLM fallback for low-confidence predictions.",
      "Build a central-server dashboard for monitoring every connected client.",
    ],
    tech: ["Python", "PyTorch", "FastAPI", "SQLAlchemy", "Chrome Extension (MV3)"],
    image: "/FLARE/Flare_logo.png",
    imageDimensions: { width: 1440, height: 1024 },
    figures: [
      {
        src: "/FLARE/System_Diagram.png",
        width: 1060,
        height: 579,
        caption:
          "The federated topology: browser extensions talk to an FL client, which reports up to the central FL server, corporate deployments included.",
      },
    ],
    link: "https://github.com/Dean-Francis-Tolero/Flare",
    paper: "/FLARE/Paper.pdf",
    processHeadline: "Training happens on-device; only weight deltas ever leave it.",
    processDiagram: { src: "/FLARE/Architecture.png", width: 1299, height: 905 },
    processSteps: [
      { caption: "Each client trains locally on-device, computing only weight deltas, raw emails never leave the browser." },
      { caption: "A FastAPI aggregation server runs FedAvg across client updates, weighted by local sample count." },
      { caption: "The updated global model ships back down, and the Chrome extension flags phishing emails in real time." },
    ],
    demoHeadline: "The admin dashboard, watching the model work in real time.",
    demoClips: [
      {
        src: "/FLARE/Admin_Overview.png",
        width: 1072,
        height: 717,
        caption: "Total flags, false positives, and false negatives tracked live across every connected client.",
      },
      {
        src: "/FLARE/Flagged_Emails.png",
        width: 1273,
        height: 717,
        caption: "Every flagged email, with the model's confidence and a manual override if it got the call wrong.",
      },
      {
        src: "/FLARE/Latency_Chart.png",
        width: 1378,
        height: 815,
        caption: "Prediction latency stays under 15ms even on long emails, benchmarked across 100 requests each.",
      },
    ],
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
      "I didn't want a model that just spits out \"AD\" or \"CN\" and calls it a day. I wanted to know it was looking at the right thing before I trusted it. A classifier that's right for the wrong reasons isn't actually useful in a clinical-adjacent setting, even a coursework one.\n\nSo this became less about squeezing out another percentage point of accuracy and more about building explainability in from the start. I used Integrated Gradients to trace every prediction back to the pixels that drove it, and checked those attribution maps against where atrophy is actually expected to show up.\n\nThe small custom CNN was a deliberate choice too: a lighter model is easier to reason about, and it kept the explainability step tractable instead of turning into its own research project.",
    tech: ["Python", "PyTorch", "NiBabel", "Captum"],
    image: "/Dementia_MRI_Classifier/cnn_logo.jpg",
    imageDimensions: { width: 1440, height: 1024 },
    figures: [
      {
        src: "/Dementia_MRI_Classifier/MMSE_vs_Volume.png",
        width: 566,
        height: 455,
        caption:
          "Cognition (MMSE score) plotted against normalized brain volume, AD cases cluster lower on both axes.",
      },
      {
        src: "/Dementia_MRI_Classifier/Age_Distribution.png",
        width: 562,
        height: 455,
        caption: "Age distribution across the OASIS-1 dataset, split by diagnosis.",
      },
      {
        src: "/Dementia_MRI_Classifier/Loss_Curve.png",
        width: 855,
        height: 547,
        caption:
          "Training vs. validation loss over 25 epochs, early stopping catches the overfit right as it starts around epoch 15.",
      },
    ],
    link: "https://github.com/Dean-Francis-Tolero/dementia-mri-classifier",
    paper: "/Dementia_MRI_Classifier/Paper.pdf",
    processHeadline: "Every prediction traces back to the exact pixels that drove it.",
    processDiagram: { src: "/Dementia_MRI_Classifier/Explainability.png", width: 1770, height: 886 },
    processSteps: [
      { caption: "3D MRI volumes get sliced into 2D, then filtered, normalized, and augmented before training." },
      { caption: "A lightweight, ~100K-parameter CNN classifies each slice as CN or AD." },
      { caption: "Integrated Gradients attributes every prediction back to the voxels that actually drove it." },
    ],
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
      "A school I knew needed a way to track attendance without a teacher manually taking roll call every single period. It sounded like a small problem until I actually sat with how much class time it was eating, every day, across every classroom.\n\nSo I built them a real system: RFID cards at the door, a teacher-facing dashboard with live and historical attendance, and a separate parent portal scoped to just their own kid's check-ins. Both update over WebSocket, not polling, so nobody's staring at a page waiting for it to refresh.\n\nI ended up selling it to them instead of just shipping it as a portfolio piece: the first time something I built went from a personal project to a system real people used every day.",
    tech: ["JavaScript", "MySQL", "Node.js", "Express.js"],
    image: "/RFID_Attendance_Scanner/RFID_logo.png",
    imageDimensions: { width: 1440, height: 1024 },
    figures: [
      {
        src: "/RFID_Attendance_Scanner/building_the_rfid_picture.jpeg",
        width: 1170,
        height: 2080,
        caption: "The build setup: breadboard, RC522 reader, and a battery pack going together on the desk.",
      },
      {
        src: "/RFID_Attendance_Scanner/rfid_materials.jpeg",
        width: 1170,
        height: 2080,
        caption: "Parts list: jumper wires, a breadboard, blank RFID cards, and the Arduino UNO.",
      },
      {
        src: "/RFID_Attendance_Scanner/solar_pannel_showcase.jpeg",
        width: 1170,
        height: 2080,
        caption: "A small solar panel wired in as a backup power source for the reader.",
      },
    ],
    link: "https://github.com/Dean-Francis-Tolero/RFID-Attendance-Scanner",
    processHeadline: "A tap at the door, live on two dashboards a second later.",
    processDiagram: { src: "/RFID_Attendance_Scanner/building_the_rfid_picture_2.jpeg", width: 1170, height: 2080 },
    processSteps: [
      { caption: "An RC522 reader wired to an Arduino UNO reads each student's RFID card on tap." },
      { caption: "The scan posts to a Node.js/Express backend, which logs it to MySQL and pushes it out over WebSocket." },
      { caption: "Teacher and parent dashboards update live, no polling, no refresh." },
    ],
    demoHeadline: "The scanner running end to end, card tap to dashboard update.",
    demoClips: [
      {
        src: "/RFID_Attendance_Scanner/working_demo.mov",
        // real dimensions unavailable (no codec metadata reader for .mov here) —
        // matches the phone-portrait aspect of every other RFID photo above.
        width: 1170,
        height: 2080,
        caption: "A card tap registering and showing up on the live attendance dashboard.",
      },
    ],
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
      "For an Algorithms II midterm, I kept noticing that algorithms like matrix chain multiplication are easy enough to code but hard to actually build real intuition for just by reading the code. You can trace through a DP table on paper once and still not really feel why it works.\n\nSo instead of writing a script that prints an answer, I built a visualizer that animates every step: the DP cost and split tables filling in cell by cell, the recursion tree for merge sort branching out with a live Gantt chart of processor utilization, the Extended Euclidean algorithm unwinding one recursive call at a time.\n\nEverything renders natively in SVG, with pseudocode highlighting synced to whatever's animating, so you can watch the code and the visual update together instead of trying to hold both in your head at once.",
    tech: ["JavaScript", "HTML", "SVG"],
    image: "/Algorithms_II/Algorithms_logo.png",
    imageDimensions: { width: 1440, height: 1024 },
    figures: [
      {
        src: "/Algorithms_II/extended_euclidean_demo_picture.png",
        width: 1065,
        height: 594,
        caption:
          "The Extended Euclidean Algorithm's steps laid out: the Euclidean algorithm's remainders, the GCD result, then back-substitution.",
      },
    ],
    link: "https://github.com/Dean-Francis-Tolero/Algorithms",
    processHeadline: "Watch the pseudocode and the animation move together, line by line.",
    processDiagram: { src: "/Algorithms_II/parallel_merge_sort_demo_picture_2.png", width: 1919, height: 990 },
    processSteps: [
      { caption: "Pick an algorithm, Matrix Chain DP, Parallel Merge Sort, or Extended Euclidean, and step through it one move at a time." },
      { caption: "Every animation frame syncs to the exact pseudocode line driving it." },
      { caption: "A live Brent's theorem bound tracks the parallel merge sort's theoretical vs. actual speedup as it runs." },
    ],
    demoHeadline: "Three algorithms, three ways of watching them think.",
    demoClips: [
      {
        src: "/Algorithms_II/matrix_chain_demo_picture.png",
        width: 1919,
        height: 990,
        caption: "Matrix Chain Multiplication: the DP cost and split tables filling in cell by cell.",
      },
      {
        src: "/Algorithms_II/parallel_merge_sort_demo_picture.png",
        width: 1919,
        height: 989,
        caption: "Parallel Merge Sort's recursion tree branching out, with a live Gantt chart of processor utilization underneath.",
      },
      {
        src: "/Algorithms_II/extended_euclidean_demo_picture_2.png",
        width: 1919,
        height: 988,
        caption: "The Extended Euclidean Algorithm unwinding to its final gcd, x, and y.",
      },
    ],
    bullets: [
      "Built three fully animated visualizations (Matrix Chain Multiplication using dynamic programming, Parallel Merge Sort using a fork-join model, and the Extended Euclidean Algorithm), each with step-by-step playback and pseudocode highlighting.",
      "Rendered every visualization natively in SVG, including DP cost/split tables, recursion trees, and a Gantt chart of processor utilization, with no canvas API or external charting library.",
      "Computed a live Brent's theorem bound (T_p ≤ W/p + D) alongside the Gantt chart to show the parallel merge sort's theoretical vs. visualized speedup.",
      "Shipped as a single self-contained HTML file with no build step or dependencies, with dark/light theming persisted via localStorage.",
    ],
  },
];