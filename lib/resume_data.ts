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

export type Project = {
  id: string;
  name: string;
  description: string;
  bullets?: string[];
  link?: string;
  tech?: string[];
  // falls back to a bg-muted/25 placeholder block (see ProjectCard) until set
  image?: string;
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
    name: "Federated Learning Phishing Defense System",
    description:
      "A federated learning system for phishing email detection, aggregating client model updates without transmitting raw data.",
    tech: ["Python", "PyTorch", "FastAPI", "SQLAlchemy"],
    bullets: [
      "Fine-tuned DistilBERT for phishing email detection, achieving 96.3% accuracy and 0.963 F1 on a held-out test set.",
      "Implemented FedAvg in a custom FastAPI aggregation server, weighting client updates by local sample count and handling non-IID data distributions across clients.",
      "Designed a hybrid threshold/timeout round-scheduling strategy to balance aggregation latency against client availability, with SQLAlchemy-backed persistence for round state and weight updates.",
      "Engineered the on-device training loop to compute and transmit weight deltas only, eliminating raw data transmission and validating correctness with a pytest integration suite.",
    ],
  },
  {
    id: "dementia-mri-classifier",
    name: "Dementia MRI Classifier",
    description:
      "A deep learning pipeline for classifying dementia (CN/AD) from 3D MRI volumes, with explainability built in.",
    tech: ["Python", "PyTorch", "NiBabel", "Captum"],
    image: "/Dementia_MRI_Classifier_logo.jpg",
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
    tech: ["JavaScript", "MySQL", "Node.js", "Express.js"],
    bullets: [
      "Successfully developed and sold a web-based RFID attendance system for a school, generating approximately 1,000 AED in revenue.",
      "Developed a system with real-time student tracking and automated parent notifications.",
      "Designed and maintained the database using MySQL to manage student and attendance data efficiently.",
      "Implemented the backend with Node.js and Express.js, facilitating smooth interaction between server and frontend.",
    ],
  },
];