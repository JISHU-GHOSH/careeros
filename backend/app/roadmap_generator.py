"""Universal Profession Roadmap Generator Engine.

Generates structured, visual roadmap data for any profession—from standard
technology careers to healthcare, creative arts, aviation, engineering, and trades.
"""

import re
from typing import List, Dict, Any, Optional
from app.models import (
    RoadmapNode,
    RoadmapStage,
    RoadmapResponse,
    RoadmapGenerateRequest,
)

# Pre-curated specialized knowledge bases for instant, rich industry-grade roadmaps
CURATED_ROADMAPS: Dict[str, Dict[str, Any]] = {
    "game_developer": {
        "title": "Game Developer",
        "summary": "Build immersive 2D and 3D games across indie and AAA studios, mastering game engines, physics, rendering, and gameplay programming.",
        "salary_range": "$75,000 - $150,000 / year",
        "estimated_months": 9,
        "stages": [
            {
                "stage_index": 1,
                "title": "Stage 1: Programming & Math Foundations",
                "estimated_weeks": 6,
                "node_ids": ["game-lang", "game-math"],
            },
            {
                "stage_index": 2,
                "title": "Stage 2: Game Engines & 2D Architecture",
                "estimated_weeks": 8,
                "node_ids": ["engine-choice", "game-loop-2d"],
            },
            {
                "stage_index": 3,
                "title": "Stage 3: 3D Graphics, Shaders & Physics",
                "estimated_weeks": 10,
                "node_ids": ["physics-3d", "shaders-lighting"],
            },
            {
                "stage_index": 4,
                "title": "Stage 4: Audio, AI & Multiplayer Networking",
                "estimated_weeks": 8,
                "node_ids": ["game-ai", "multiplayer-net"],
            },
            {
                "stage_index": 5,
                "title": "Stage 5: Polishing, Game Jams & Shipping",
                "estimated_weeks": 6,
                "node_ids": ["game-jam-portfolio"],
            },
        ],
        "nodes": [
            {
                "id": "game-lang",
                "title": "C++ or C# Core Programming",
                "stage_index": 1,
                "category": "essential",
                "description": "Master memory management, pointers, object-oriented design, and data structures essential for real-time game performance.",
                "key_skills": ["C++", "C#", "Data Structures", "Memory Management"],
                "project_challenge": "Build a text-based Roguelike game with inventory management and procedural dungeon rooms in pure C++ or C#.",
                "resources": ["LearnCpp.com", "C# Documentation - Microsoft Learn", "Game Programming Patterns by Robert Nystrom"],
                "prerequisites": [],
            },
            {
                "id": "game-math",
                "title": "Linear Algebra & Trigonometry for Games",
                "stage_index": 1,
                "category": "essential",
                "description": "Learn vectors, dot products, cross products, matrices, quaternions, and raycasting required for 2D/3D transformations.",
                "key_skills": ["Vectors & Matrices", "Quaternions", "Trigonometry", "Collision Math"],
                "project_challenge": "Implement a 2D vector physics sandbox demonstrating gravity, elastic bounces, and angle reflections.",
                "resources": ["3Blue1Brown - Essence of Linear Algebra", "Freya Holmér - Math for Game Devs"],
                "prerequisites": ["game-lang"],
            },
            {
                "id": "engine-choice",
                "title": "Game Engine Fundamentals (Unity or Unreal)",
                "stage_index": 2,
                "category": "essential",
                "description": "Learn component-based architecture, scene graphs, assets import, prefabs, and camera setups in Unity (C#) or Unreal Engine 5 (C++/Blueprints).",
                "key_skills": ["Unity", "Unreal Engine 5", "Blueprints", "Prefab Architecture"],
                "project_challenge": "Create a fully functional 2D top-down action game with health bars, enemies, and save/load state.",
                "resources": ["Unity Learn Pathways", "Epic Games Unreal Online Learning", "Brackeys Archive"],
                "prerequisites": ["game-math"],
            },
            {
                "id": "game-loop-2d",
                "title": "Game State, UI & Animation Controllers",
                "stage_index": 2,
                "category": "recommended",
                "description": "Structure finite state machines for player states (Idle, Run, Jump, Attack), integrate HUD menus, and handle sprite/skeletal animations.",
                "key_skills": ["Finite State Machines", "Canvas UI", "Animation Trees", "Audio Triggers"],
                "project_challenge": "Build a responsive combat system with combo strikes, hitboxes, hurtboxes, and particle impact effects.",
                "resources": ["Game Programming Patterns - State", "Unity Animation Controller Docs"],
                "prerequisites": ["engine-choice"],
            },
            {
                "id": "physics-3d",
                "title": "3D Character Controllers & Physics Simulation",
                "stage_index": 3,
                "category": "essential",
                "description": "Implement kinematic vs rigid-body 3D movement, custom gravity, slope sliding, raycast ground detection, and ragdoll physics.",
                "key_skills": ["PhysX / Chaos Engine", "Character Controllers", "Ragdoll Physics", "Raycasting"],
                "project_challenge": "Build a 3D parkour platformer with wall-running, double-jumping, and ledge-grabbing mechanics.",
                "resources": ["Catlike Coding - Movement Tutorials", "Unreal Character Movement Guide"],
                "prerequisites": ["engine-choice"],
            },
            {
                "id": "shaders-lighting",
                "title": "Shaders, Materials & Visual FX (HLSL/ShaderGraph)",
                "stage_index": 3,
                "category": "specialization",
                "description": "Understand vertex and fragment shaders, PBR lighting models, post-processing volumes, particle systems (Niagara / VFX Graph), and render pipelines.",
                "key_skills": ["Shader Graph", "HLSL", "Niagara VFX", "Post-Processing"],
                "project_challenge": "Write a custom water surface shader with foam ripples, depth refraction, and vertex wave displacement.",
                "resources": ["The Book of Shaders", "Ben Cloward Shader Series", "Freya Holmér - Shaders"],
                "prerequisites": ["physics-3d"],
            },
            {
                "id": "game-ai",
                "title": "Gameplay AI & Pathfinding (NavMesh & Behavior Trees)",
                "stage_index": 4,
                "category": "recommended",
                "description": "Design intelligent enemy encounters using NavMesh navigation, A* pathfinding, sensory perception (sight/sound), and Behavior Trees.",
                "key_skills": ["NavMesh", "Behavior Trees", "Sensory AI", "A* Algorithm"],
                "project_challenge": "Build a stealth infiltration mission where guards patrol, investigate strange noises, and coordinate pursuit when alerting.",
                "resources": ["Artificial Intelligence for Games by Ian Millington", "Unreal Behavior Tree Quick Start"],
                "prerequisites": ["physics-3d"],
            },
            {
                "id": "multiplayer-net",
                "title": "Multiplayer Game Networking",
                "stage_index": 4,
                "category": "specialization",
                "description": "Master client-server architecture, tick rates, UDP packets, server reconciliation, dead reckoning, and lag compensation.",
                "key_skills": ["Client-Side Prediction", "Lag Compensation", "Photon / FishNet", "UDP/WebSockets"],
                "project_challenge": "Build a 4-player online deathmatch arena with authorative server movement and smooth rollback prediction.",
                "resources": ["Gabriel Gambetta - Fast-Paced Multiplayer Guide", "Mirror / Netcode for GameObjects"],
                "prerequisites": ["physics-3d"],
            },
            {
                "id": "game-jam-portfolio",
                "title": "Game Jam, Polish & Steam / Itch.io Release",
                "stage_index": 5,
                "category": "essential",
                "description": "Participate in a 48-hour game jam, optimize framerates (profiler, draw calls, LODs), package builds, and publish on Itch.io or Steam.",
                "key_skills": ["Profiler & Draw Call Optimization", "Game Packaging", "Steamworks SDK", "Player Playtesting"],
                "project_challenge": "Package and ship a complete, polished 15-minute game with audio, options menu, and controller support on Itch.io.",
                "resources": ["Ludum Dare Community", "Game Maker's Toolkit (GMTK)", "Steamworks Documentation"],
                "prerequisites": ["game-ai"],
            },
        ],
    },
    "cybersecurity_analyst": {
        "title": "Cybersecurity & Ethical Hacking Specialist",
        "summary": "Protect organizations from malicious cyberattacks by discovering vulnerabilities, hardening network infrastructure, and executing penetration tests.",
        "salary_range": "$80,000 - $160,000 / year",
        "estimated_months": 8,
        "stages": [
            {
                "stage_index": 1,
                "title": "Stage 1: Networking & Operating System Internals",
                "estimated_weeks": 6,
                "node_ids": ["cyber-net", "cyber-linux"],
            },
            {
                "stage_index": 2,
                "title": "Stage 2: Security Foundations & Cryptography",
                "estimated_weeks": 6,
                "node_ids": ["cyber-crypto", "cyber-defense"],
            },
            {
                "stage_index": 3,
                "title": "Stage 3: Penetration Testing & Web Vulnerabilities",
                "estimated_weeks": 8,
                "node_ids": ["owasp-web", "pentest-tools"],
            },
            {
                "stage_index": 4,
                "title": "Stage 4: SIEM, Incident Response & Digital Forensics",
                "estimated_weeks": 6,
                "node_ids": ["siem-hunting", "malware-forensics"],
            },
            {
                "stage_index": 5,
                "title": "Stage 5: Industry Certifications & Bug Bounties",
                "estimated_weeks": 6,
                "node_ids": ["certs-bugbounty"],
            },
        ],
        "nodes": [
            {
                "id": "cyber-net",
                "title": "Computer Networking & Packet Inspection",
                "stage_index": 1,
                "category": "essential",
                "description": "Master TCP/IP, OSI model, DNS, DHCP, subnetting, ARP poisoning, and analyze network packets with Wireshark.",
                "key_skills": ["TCP/IP", "Wireshark", "Subnetting", "DNS / TLS Handshakes"],
                "project_challenge": "Capture and reconstruct an unencrypted credentials stream and investigate an active port scan using Wireshark.",
                "resources": ["Professor Messer CompTIA Network+", "Wireshark University"],
                "prerequisites": [],
            },
            {
                "id": "cyber-linux",
                "title": "Linux Administration & Bash Scripting",
                "stage_index": 1,
                "category": "essential",
                "description": "Become proficient in Kali Linux, user permissions, systemd services, SSH tunneling, file permissions, and Bash security automation.",
                "key_skills": ["Kali Linux", "Bash Scripting", "User Privileges (SUDO)", "System Logs"],
                "project_challenge": "Write a custom Bash script to audit a Linux server for insecure file permissions, SUID binaries, and unauthorized open ports.",
                "resources": ["OverTheWire Bandit Wargame", "Linux Journey"],
                "prerequisites": ["cyber-net"],
            },
            {
                "id": "cyber-crypto",
                "title": "Applied Cryptography & PKI Architecture",
                "stage_index": 2,
                "category": "essential",
                "description": "Understand symmetric/asymmetric encryption, SHA-256 hashing, salting, public key infrastructure (PKI), TLS certificates, and digital signatures.",
                "key_skills": ["AES", "RSA & Elliptic Curve", "HMAC", "Certificates & OpenSSL"],
                "project_challenge": "Generate and configure a self-signed Root CA and issue validated SSL certificates using OpenSSL CLI.",
                "resources": ["Stanford Cryptography I - Dan Boneh", "Practical Cryptography for Developers"],
                "prerequisites": ["cyber-linux"],
            },
            {
                "id": "cyber-defense",
                "title": "Network Defense & Firewall Hardening",
                "stage_index": 2,
                "category": "recommended",
                "description": "Configure stateful firewalls (iptables/ufw), intrusion detection systems (Snort/Suricata), and zero-trust perimeter policies.",
                "key_skills": ["Snort IDS/IPS", "Iptables", "Zero Trust Architecture", "VPNs"],
                "project_challenge": "Deploy and configure a Snort IDS sensor inside a virtual network that triggers automated alert rules upon SYN flood attacks.",
                "resources": ["Snort.org Official Rules Documentation", "SANS Blue Team Handbook"],
                "prerequisites": ["cyber-crypto"],
            },
            {
                "id": "owasp-web",
                "title": "Web Application Security (OWASP Top 10)",
                "stage_index": 3,
                "category": "essential",
                "description": "Identify and exploit critical web application flaws: SQL Injection, XSS, CSRF, SSRF, IDOR, and Broken Authentication using Burp Suite.",
                "key_skills": ["Burp Suite", "SQL Injection", "XSS & CSRF", "SSRF Exploits"],
                "project_challenge": "Complete all apprentice and practitioner labs on PortSwigger Web Security Academy for SQLi and Authentication bypass.",
                "resources": ["PortSwigger Web Security Academy", "OWASP Top 10 Guide"],
                "prerequisites": ["cyber-crypto"],
            },
            {
                "id": "pentest-tools",
                "title": "Offensive Penetration Testing & Metasploit",
                "stage_index": 3,
                "category": "essential",
                "description": "Conduct reconnaissance (Nmap, Shodan), exploit known CVEs via Metasploit Framework, and perform post-exploitation privilege escalation.",
                "key_skills": ["Nmap", "Metasploit Framework", "Privilege Escalation", "CVE Analysis"],
                "project_challenge": "Root 5 vulnerable Linux and Windows machines on HackTheBox or TryHackMe, documenting full exploitation writeups.",
                "resources": ["TryHackMe Jr Penetration Tester Path", "The Hacker Playbook 3"],
                "prerequisites": ["owasp-web"],
            },
            {
                "id": "siem-hunting",
                "title": "SIEM Log Analysis & Threat Hunting (Splunk / Elastic)",
                "stage_index": 4,
                "category": "recommended",
                "description": "Ingest Windows Event logs and Syslog into Splunk/Elasticsearch. Construct threat queries to detect lateral movement and credential dumping.",
                "key_skills": ["Splunk", "Elasticsearch / Kibana", "Threat Hunting", "MITRE ATT&CK Framework"],
                "project_challenge": "Build a Splunk security dashboard monitoring Mimikatz credential theft and abnormal PowerShell executions.",
                "resources": ["Splunk Free Training", "MITRE ATT&CK Enterprise Matrix"],
                "prerequisites": ["cyber-defense"],
            },
            {
                "id": "malware-forensics",
                "title": "Memory Forensics & Incident Response",
                "stage_index": 4,
                "category": "specialization",
                "description": "Perform memory dump analysis with Volatility, reverse engineer basic malicious binaries with Ghidra, and trace attack kill-chains.",
                "key_skills": ["Volatility", "Ghidra", "Memory Dumps", "Incident Response"],
                "project_challenge": "Analyze a memory capture of an infected Windows machine to recover injected malicious DLLs and C2 IP addresses.",
                "resources": ["Practical Malware Analysis Book", "Volatility Foundation"],
                "prerequisites": ["siem-hunting"],
            },
            {
                "id": "certs-bugbounty",
                "title": "Security Certifications (Security+ / OSCP) & Bug Bounty",
                "stage_index": 5,
                "category": "essential",
                "description": "Prepare for industry benchmark credentials (CompTIA Security+, CEH, or OSCP) and hunt on live Bug Bounty platforms (HackerOne/Bugcrowd).",
                "key_skills": ["CompTIA Security+", "OSCP Preparation", "HackerOne Platform", "Vulnerability Reporting"],
                "project_challenge": "Submit your first validated vulnerability report on a responsible disclosure or bug bounty program.",
                "resources": ["HackerOne Hacker101", "OffSec OSCP Syllabus", "Professor Messer Security+"],
                "prerequisites": ["pentest-tools"],
            },
        ],
    },
    "ai_engineer": {
        "title": "Artificial Intelligence & LLM Engineer",
        "summary": "Develop, fine-tune, and deploy modern machine learning models, retrieval-augmented generation (RAG) pipelines, and autonomous AI agents.",
        "salary_range": "$110,000 - $210,000 / year",
        "estimated_months": 7,
        "stages": [
            {
                "stage_index": 1,
                "title": "Stage 1: Python, Calculus & Machine Learning Core",
                "estimated_weeks": 6,
                "node_ids": ["ai-math-python", "ml-foundations"],
            },
            {
                "stage_index": 2,
                "title": "Stage 2: Deep Learning & PyTorch Architectures",
                "estimated_weeks": 7,
                "node_ids": ["pytorch-deep", "cnns-transformers"],
            },
            {
                "stage_index": 3,
                "title": "Stage 3: Large Language Models, Embeddings & RAG",
                "estimated_weeks": 6,
                "node_ids": ["rag-vector-db", "fine-tuning-lora"],
            },
            {
                "stage_index": 4,
                "title": "Stage 4: Autonomous Agents & Multimodal AI",
                "estimated_weeks": 5,
                "node_ids": ["ai-agents", "multimodal-vision"],
            },
            {
                "stage_index": 5,
                "title": "Stage 5: Production MLOps, Quantization & Serving",
                "estimated_weeks": 4,
                "node_ids": ["mlops-serving"],
            },
        ],
        "nodes": [
            {
                "id": "ai-math-python",
                "title": "Advanced Python, NumPy & Applied Linear Algebra",
                "stage_index": 1,
                "category": "essential",
                "description": "Master matrix multiplications, eigenvectors, gradients, partial derivatives, and vectorization using NumPy and SciPy.",
                "key_skills": ["Python 3.11+", "NumPy", "Linear Algebra", "Matrix Calculus"],
                "project_challenge": "Write a multi-layer perceptron neural network from scratch using only pure Python and NumPy with backpropagation.",
                "resources": ["Fast.ai - Practical Deep Learning for Coders", "3Blue1Brown - Neural Networks"],
                "prerequisites": [],
            },
            {
                "id": "ml-foundations",
                "title": "Statistical Learning & Scikit-Learn Algorithms",
                "stage_index": 1,
                "category": "essential",
                "description": "Implement linear/logistic regression, decision trees, random forests, gradient boosting (XGBoost), and cross-validation.",
                "key_skills": ["Scikit-Learn", "XGBoost", "Feature Engineering", "Bias-Variance Tradeoff"],
                "project_challenge": "Build an end-to-end churn prediction pipeline with feature normalization, cross-validation, and ROC-AUC curve analysis.",
                "resources": ["Andrew Ng - Machine Learning Specialization", "Scikit-Learn User Guide"],
                "prerequisites": ["ai-math-python"],
            },
            {
                "id": "pytorch-deep",
                "title": "PyTorch Framework & Deep Learning Dynamics",
                "stage_index": 2,
                "category": "essential",
                "description": "Learn autograd tensors, custom nn.Module classes, optimizers (AdamW), learning rate schedules, and GPU training with CUDA.",
                "key_skills": ["PyTorch", "CUDA Acceleration", "Custom Loss Functions", "DataLoader Optimization"],
                "project_challenge": "Train a custom deep neural network with dropout, batch normalization, and early stopping on a complex image classification dataset.",
                "resources": ["PyTorch 60-Minute Blitz", "Deep Learning with PyTorch by Eli Stevens"],
                "prerequisites": ["ml-foundations"],
            },
            {
                "id": "cnns-transformers",
                "title": "Attention Mechanisms & Transformer Architecture",
                "stage_index": 2,
                "category": "essential",
                "description": "Master self-attention, multi-head attention, positional encodings, and understand the encoder-decoder Transformer architecture.",
                "key_skills": ["Self-Attention", "Multi-Head Attention", "Hugging Face Transformers", "Tokenization (BPE)"],
                "project_challenge": "Build a nanoGPT character-level Transformer model from scratch following Andrej Karpathy's architecture.",
                "resources": ["Andrej Karpathy - Let's build GPT from scratch", "Attention Is All You Need Paper"],
                "prerequisites": ["pytorch-deep"],
            },
            {
                "id": "rag-vector-db",
                "title": "Retrieval-Augmented Generation (RAG) & Vector DBs",
                "stage_index": 3,
                "category": "essential",
                "description": "Implement vector embeddings, semantic chunking, approximate nearest neighbor search (HNSW), and reranking with Pinecone or Qdrant.",
                "key_skills": ["Vector Databases (Qdrant/Pinecone)", "Semantic Chunking", "Cross-Encoder Rerankers", "LangChain / LlamaIndex"],
                "project_challenge": "Build an enterprise document question-answering assistant with hybrid search (BM25 + Dense Vectors) and citation highlights.",
                "resources": ["Pinecone Vector Academy", "LangChain Conceptual Guide"],
                "prerequisites": ["cnns-transformers"],
            },
            {
                "id": "fine-tuning-lora",
                "title": "LLM Fine-Tuning with LoRA & PEFT",
                "stage_index": 3,
                "category": "specialization",
                "description": "Fine-tune open-weights models (Llama 3, Mistral) on custom datasets using Low-Rank Adaptation (LoRA, QLoRA) and Supervised Fine-Tuning.",
                "key_skills": ["QLoRA", "Unsloth", "HuggingFace PEFT", "Instruction Datasets"],
                "project_challenge": "Fine-tune a 8B parameter open-source model on a specialized medical or legal query dataset and evaluate perplexity gains.",
                "resources": ["Hugging Face Alignment Handbook", "Unsloth Documentation"],
                "prerequisites": ["rag-vector-db"],
            },
            {
                "id": "ai-agents",
                "title": "Autonomous AI Agents & Tool Calling",
                "stage_index": 4,
                "category": "recommended",
                "description": "Build multi-step reasoning agents (ReAct framework), structured output schemas, dynamic tool calling, and human-in-the-loop validation.",
                "key_skills": ["ReAct Pattern", "Function / Tool Calling", "State Machines (LangGraph)", "Structured Outputs"],
                "project_challenge": "Create a multi-agent coding researcher that browses GitHub API, clones repos, executes unit tests, and summarizes bug fixes.",
                "resources": ["LangGraph Tutorials", "Anthropic Tool Use Docs"],
                "prerequisites": ["rag-vector-db"],
            },
            {
                "id": "multimodal-vision",
                "title": "Vision-Language Models & Audio AI",
                "stage_index": 4,
                "category": "specialization",
                "description": "Integrate vision models (CLIP, Whisper, Gemini Flash) for image grounding, OCR document extraction, and speech-to-text workflows.",
                "key_skills": ["CLIP Embeddings", "Whisper STT", "Vision Grounding", "Multimodal Prompts"],
                "project_challenge": "Build an audio-visual meeting summarizer that transcribes audio with Whisper, segments speaker slides, and writes action items.",
                "resources": ["OpenAI Whisper Docs", "Hugging Face Vision Models"],
                "prerequisites": ["ai-agents"],
            },
            {
                "id": "mlops-serving",
                "title": "Production MLOps, vLLM Serving & Quantization",
                "stage_index": 5,
                "category": "essential",
                "description": "Deploy high-throughput inference engines with vLLM, TensorRT-LLM, model quantization (AWQ, GGUF), streaming APIs, and latency monitoring.",
                "key_skills": ["vLLM", "PagedAttention", "AWQ Quantization", "Docker & Kubernetes GPU Deploy"],
                "project_challenge": "Deploy an autoscaling LLM inference microservice with vLLM serving 50 tokens/sec p99 response times on cloud GPUs.",
                "resources": ["vLLM Official Docs", "Full Stack LLM BootCamp"],
                "prerequisites": ["fine-tuning-lora"],
            },
        ],
    },
    "commercial_pilot": {
        "title": "Commercial Airline Pilot",
        "summary": "Master flight principles, navigation, aircraft aerodynamics, and cockpit instrument flight to operate commercial multi-engine passenger aircraft.",
        "salary_range": "$90,000 - $220,000 / year",
        "estimated_months": 18,
        "stages": [
            {
                "stage_index": 1,
                "title": "Stage 1: Ground School & Private Pilot License (PPL)",
                "estimated_weeks": 16,
                "node_ids": ["pilot-ground", "pilot-ppl"],
            },
            {
                "stage_index": 2,
                "title": "Stage 2: Instrument Rating (IR) & Meteorology",
                "estimated_weeks": 14,
                "node_ids": ["pilot-weather", "pilot-instruments"],
            },
            {
                "stage_index": 3,
                "title": "Stage 3: Commercial Pilot License (CPL) & Cross-Country",
                "estimated_weeks": 20,
                "node_ids": ["pilot-cpl", "pilot-crosscountry"],
            },
            {
                "stage_index": 4,
                "title": "Stage 4: Multi-Engine Rating & Turbine Aircraft",
                "estimated_weeks": 12,
                "node_ids": ["pilot-multiengine"],
            },
            {
                "stage_index": 5,
                "title": "Stage 5: Airline Transport Pilot (ATP) & Type Ratings",
                "estimated_weeks": 16,
                "node_ids": ["pilot-atp-crew"],
            },
        ],
        "nodes": [
            {
                "id": "pilot-ground",
                "title": "Aerodynamics, Air Law & Flight Systems Ground School",
                "stage_index": 1,
                "category": "essential",
                "description": "Study lift/drag dynamics, weight & balance, FAA/EASA air regulations, engine mechanics, and basic aviation phraseology.",
                "key_skills": ["Aerodynamics", "Air Regulations", "Weight & Balance", "Altimetry"],
                "project_challenge": "Score 90%+ on the FAA Private Pilot Knowledge practice written examination.",
                "resources": ["FAA Pilot's Handbook of Aeronautical Knowledge (PHAK)", "King Schools Ground Course"],
                "prerequisites": [],
            },
            {
                "id": "pilot-ppl",
                "title": "Solo Flight & Private Pilot Checkride",
                "stage_index": 1,
                "category": "essential",
                "description": "Log minimum 40 hours of flight instruction: pre-flight checks, takeoffs, steep turns, stall recovery, emergency landings, and solo cross-country.",
                "key_skills": ["Single Engine Aircraft (C172 / PA-28)", "Stall Recovery", "Pattern Work", "Checkride Maneuvers"],
                "project_challenge": "Complete your first solo flight and pass the practical checkride with an FAA Designated Pilot Examiner.",
                "resources": ["Airplane Flying Handbook (AFH)", "AOPA Training Guides"],
                "prerequisites": ["pilot-ground"],
            },
            {
                "id": "pilot-weather",
                "title": "Aviation Meteorology & Weather Radar Analysis",
                "stage_index": 2,
                "category": "essential",
                "description": "Interpret METARs, TAFs, SIGMETs, convective storm models, icing risks, microbursts, and clear-air turbulence.",
                "key_skills": ["METAR & TAF Decoding", "Convective Weather", "Icing Hazards", "Radar Interpretation"],
                "project_challenge": "Analyze a complex multi-state cold front storm line and produce a go/no-go flight route dispatch decision.",
                "resources": ["Aviation Weather Handbook (FAA-H-8083-28)", "NOAA Aviation Weather Center"],
                "prerequisites": ["pilot-ppl"],
            },
            {
                "id": "pilot-instruments",
                "title": "Instrument Rating (IFR Flight Navigation)",
                "stage_index": 2,
                "category": "essential",
                "description": "Fly exclusively by reference to instruments inside clouds (IMC): VOR navigation, GPS RNAV approaches, ILS glideslopes, and holding patterns.",
                "key_skills": ["ILS Approaches", "RNAV / GPS", "Holding Procedures", "Instrument Scan"],
                "project_challenge": "Fly a simulated zero-visibility ILS approach down to decision altitude (200 ft AGL) in a certified flight simulator.",
                "resources": ["Instrument Flying Handbook", "ForeFlight Training"],
                "prerequisites": ["pilot-weather"],
            },
            {
                "id": "pilot-cpl",
                "title": "Commercial Pilot Maneuvers & High-Performance Aircraft",
                "stage_index": 3,
                "category": "essential",
                "description": "Master advanced precision flight maneuvers: Chandelles, Lazy Eights, Eights-on-Pylons, and complex retractable landing gear aircraft.",
                "key_skills": ["Chandelles", "Lazy Eights", "Retractable Gear Aircraft", "Constant-Speed Propellers"],
                "project_challenge": "Pass the Commercial Pilot Practical Checkride demonstrating commercial PTS tolerances (+/- 50 ft).",
                "resources": ["Commercial Pilot Airman Certification Standards (ACS)", "Sporty's Commercial Course"],
                "prerequisites": ["pilot-instruments"],
            },
            {
                "id": "pilot-crosscountry",
                "title": "Time Building & Night Cross-Country Operations",
                "stage_index": 3,
                "category": "recommended",
                "description": "Accumulate 250+ total flight hours including 100 hours Pilot-in-Command (PIC) and long-distance night cross-country flights.",
                "key_skills": ["Long-Distance Cross Country", "Night Navigation", "Flight Log Auditing", "Fuel Management"],
                "project_challenge": "Plan and execute a 300-nautical-mile cross-country flight across 3 distinct airports with controlled airspace.",
                "resources": ["SkyVector Aeronautical Charts", "FAA Aeronautical Information Manual (AIM)"],
                "prerequisites": ["pilot-cpl"],
            },
            {
                "id": "pilot-multiengine",
                "title": "Multi-Engine Rating (Twin Engine Aerodynamics)",
                "stage_index": 4,
                "category": "essential",
                "description": "Fly twin-engine aircraft: asymmetric thrust, Critical Engine failure recognition, Vmc minimum control speed, and single-engine landing drills.",
                "key_skills": ["Multi-Engine Aircraft (PA-44 Seminole)", "Vmc Recognition", "Single-Engine Emergency Drills", "Feathering Props"],
                "project_challenge": "Execute an engine failure after takeoff drill and safely fly a single-engine precision landing.",
                "resources": ["Multi-Engine Flying Guide", "FAA Multi-Engine ACS"],
                "prerequisites": ["pilot-cpl"],
            },
            {
                "id": "pilot-atp-crew",
                "title": "Airline Transport Pilot (ATP) & Multi-Crew Cooperation (MCC)",
                "stage_index": 5,
                "category": "essential",
                "description": "Attain 1,500 flight hours, pass ATP-CTP written exam, train in full-motion Level D jet flight simulators, and master crew resource management (CRM).",
                "key_skills": ["Crew Resource Management (CRM)", "Jet Aircraft Systems (B737 / A320)", "High-Altitude Aerodynamics", "FMC Navigation"],
                "project_challenge": "Pass a regional or commercial airline pilot interview and simulator evaluation assessment.",
                "resources": ["ATP-CTP Course Materials", "Turbine Pilot's Flight Manual"],
                "prerequisites": ["pilot-multiengine"],
            },
        ],
    },
}

POPULAR_PROFESSIONS = [
    "Game Developer",
    "Cybersecurity Analyst",
    "Artificial Intelligence Engineer",
    "Full-Stack Web Developer",
    "DevOps & Cloud Engineer",
    "Data Scientist",
    "Mobile App Developer (iOS & Android)",
    "Commercial Airline Pilot",
    "Robotics Engineer",
    "UI/UX Product Designer",
    "Blockchain & Smart Contract Developer",
    "Sound Designer & Music Producer",
    "Neurosurgeon / Medical Doctor",
    "Product Manager",
    "Autonomous Vehicle Engineer",
]


class UniversalRoadmapGenerator:
    """Generates structured, visual roadmap trees for any user-entered profession."""

    def normalize_key(self, profession: str) -> str:
        clean = profession.lower().strip()
        clean = re.sub(r"[^a-z0-9]+", "_", clean).strip("_")
        return clean

    def find_curated_match(self, profession: str) -> Optional[Dict[str, Any]]:
        query = profession.lower().strip()
        words = set(re.findall(r"\b[a-z0-9]+\b", query))
        
        # Word-boundary matched keywords
        if any(w in words for w in ["pilot", "aviation", "airline", "airlines", "aircraft", "airplane", "flight"]):
            return CURATED_ROADMAPS["commercial_pilot"]
        if any(w in words for w in ["game", "games", "unity", "unreal", "gamedev"]):
            return CURATED_ROADMAPS["game_developer"]
        if any(w in words for w in ["cyber", "cybersecurity", "hack", "hacker", "hacking", "security", "pentest", "infosec"]):
            return CURATED_ROADMAPS["cybersecurity_analyst"]
        if "ai" in words or any(w in words for w in ["artificial", "ml", "llm", "transformers", "pytorch"]) or "machine learning" in query or "deep learning" in query:
            return CURATED_ROADMAPS["ai_engineer"]

        key = self.normalize_key(profession)
        return CURATED_ROADMAPS.get(key)

    def generate_dynamic_roadmap(
        self, profession: str, experience_level: str = "beginner"
    ) -> RoadmapResponse:
        """Synthesizes an intelligent, structured roadmap for any career path."""
        norm_title = profession.strip().title()
        
        # Check curated library first for highest fidelity
        curated = self.find_curated_match(profession)
        if curated:
            return RoadmapResponse(
                profession=curated["title"],
                experience_level=experience_level,
                summary=curated["summary"],
                salary_range=curated["salary_range"],
                estimated_months=curated["estimated_months"],
                stages=[RoadmapStage(**s) for s in curated["stages"]],
                nodes=[RoadmapNode(**n) for n in curated["nodes"]],
            )

        # Dynamic Synthesis Engine for arbitrary professions
        # Creates 5 logically structured stages with concrete proof-of-work challenges
        clean_slug = self.normalize_key(profession)
        
        stages = [
            RoadmapStage(
                stage_index=1,
                title="Stage 1: Core Principles & Theoretical Foundations",
                estimated_weeks=6,
                node_ids=[f"{clean_slug}-basics", f"{clean_slug}-tools"],
            ),
            RoadmapStage(
                stage_index=2,
                title="Stage 2: Applied Toolkits & Standard Industry Practices",
                estimated_weeks=8,
                node_ids=[f"{clean_slug}-applied", f"{clean_slug}-workflows"],
            ),
            RoadmapStage(
                stage_index=3,
                title="Stage 3: Advanced Architectures & Systems Design",
                estimated_weeks=8,
                node_ids=[f"{clean_slug}-advanced", f"{clean_slug}-optimization"],
            ),
            RoadmapStage(
                stage_index=4,
                title="Stage 4: Real-World Portfolio & Capstone Projects",
                estimated_weeks=6,
                node_ids=[f"{clean_slug}-capstone"],
            ),
            RoadmapStage(
                stage_index=5,
                title="Stage 5: Professional Accreditation & Career Launch",
                estimated_weeks=4,
                node_ids=[f"{clean_slug}-interview-ready"],
            ),
        ]

        nodes = [
            RoadmapNode(
                id=f"{clean_slug}-basics",
                title=f"{norm_title} Core Principles & Terminology",
                stage_index=1,
                category="essential",
                description=f"Master fundamental domain vocabulary, foundational standards, and core theoretical models governing {norm_title}.",
                key_skills=["Domain Fundamentals", "Industry Nomenclature", "Standard Frameworks", "Theoretical Principles"],
                project_challenge=f"Write a comprehensive technical breakdown outlining the 5 core tenets every modern {norm_title} must master.",
                resources=[f"Standard {norm_title} Reference Guide", "Foundations of Modern Professional Practice"],
                prerequisites=[],
            ),
            RoadmapNode(
                id=f"{clean_slug}-tools",
                title="Essential Tooling & Environment Setup",
                stage_index=1,
                category="essential",
                description=f"Configure industry-standard software, toolchains, hardware, and operational environments used by professional {norm_title}s.",
                key_skills=["Environment Setup", "Primary Software Suite", "Version Control & Assets", "Diagnostic Utilities"],
                project_challenge=f"Configure and benchmark a production-ready workspace tailored specifically for {norm_title} workflows.",
                resources=[f"{norm_title} Tooling Best Practices", "Official Setup & Configuration Docs"],
                prerequisites=[f"{clean_slug}-basics"],
            ),
            RoadmapNode(
                id=f"{clean_slug}-applied",
                title="Practical Techniques & Day-to-Day Execution",
                stage_index=2,
                category="essential",
                description=f"Execute standard operational procedures and hands-on deliverables expected in day-to-day {norm_title} assignments.",
                key_skills=["Hands-on Execution", "Quality Control", "Standard Operating Procedures", "Error Handling"],
                project_challenge=f"Build and ship a complete, self-contained mini-deliverable demonstrating proficiency in {norm_title}.",
                resources=[f"Practical {norm_title} Field Handbook", "Interactive Guided Tutorials"],
                prerequisites=[f"{clean_slug}-tools"],
            ),
            RoadmapNode(
                id=f"{clean_slug}-workflows",
                title="Cross-Functional Collaboration & Modern Workflows",
                stage_index=2,
                category="recommended",
                description=f"Learn modern team workflows, stakeholder communications, safety protocols, and documentation standards for {norm_title}.",
                key_skills=["Team Collaboration", "Agile / Operational Workflows", "Documentation", "Stakeholder Alignment"],
                project_challenge="Create a standardized operational checklist and technical spec for a multi-disciplinary team project.",
                resources=["Team Collaboration & Agile Playbook", "Technical Specification Guide"],
                prerequisites=[f"{clean_slug}-applied"],
            ),
            RoadmapNode(
                id=f"{clean_slug}-advanced",
                title="Advanced Systems, Specializations & Edge Cases",
                stage_index=3,
                category="essential",
                description=f"Tackle complex scenarios, high-stress trade-offs, scalability bottlenecks, and specialized methodologies in {norm_title}.",
                key_skills=["High-Level Problem Solving", "Edge-Case Mitigation", "Specialized Techniques", "System Resilience"],
                project_challenge=f"Diagnose and resolve a complex, multi-factor failure scenario simulating real-world {norm_title} pressure.",
                resources=[f"Advanced Case Studies in {norm_title}", "Industry Research Papers"],
                prerequisites=[f"{clean_slug}-applied"],
            ),
            RoadmapNode(
                id=f"{clean_slug}-optimization",
                title="Performance Optimization & Auditing",
                stage_index=3,
                category="specialization",
                description=f"Optimize throughput, cost efficiency, safety compliance, and latency for high-stakes {norm_title} deliverables.",
                key_skills=["Auditing & Compliance", "Efficiency Optimization", "Metrics & Telemetry", "Risk Management"],
                project_challenge="Conduct a comprehensive performance audit and implement refactors producing measurable 30%+ improvements.",
                resources=["Optimization Principles & Auditing Guide", "Security & Reliability Best Practices"],
                prerequisites=[f"{clean_slug}-advanced"],
            ),
            RoadmapNode(
                id=f"{clean_slug}-capstone",
                title="End-to-End Capstone Proof-of-Work Project",
                stage_index=4,
                category="essential",
                description=f"Architect, execute, and document a flagship portfolio artifact demonstrating full competency as a {norm_title}.",
                key_skills=["Flagship Portfolio Piece", "Full Lifecycle Execution", "Technical Documentation", "Public Showcase"],
                project_challenge=f"Deliver a production-ready, peer-reviewable flagship project solving an urgent industry problem for a {norm_title}.",
                resources=["Portfolio Design Guide for Specialists", "Open Source & Showcase Strategies"],
                prerequisites=[f"{clean_slug}-advanced"],
            ),
            RoadmapNode(
                id=f"{clean_slug}-interview-ready",
                title="Professional Certification & Career Placement",
                stage_index=5,
                category="essential",
                description=f"Prepare for technical interviews, license accreditations, portfolio presentations, and salary negotiations for {norm_title}.",
                key_skills=["Technical Interview Prep", "Industry Certifications", "Portfolio Defense", "Salary Negotiation"],
                project_challenge=f"Pass a mock technical screening and present your capstone artifact with confidence to senior practitioners.",
                resources=[f"{norm_title} Interview Questions Handbook", "Professional Licensure Board Standards"],
                prerequisites=[f"{clean_slug}-capstone"],
            ),
        ]

        return RoadmapResponse(
            profession=norm_title,
            experience_level=experience_level,
            summary=f"Comprehensive, step-by-step master plan to break into and excel as a professional {norm_title}, covering foundational principles, core toolkits, real-world portfolio capstones, and career launch.",
            salary_range="$70,000 - $140,000 / year",
            estimated_months=8 if experience_level == "beginner" else 5,
            stages=stages,
            nodes=nodes,
        )

    def get_suggestions(self) -> List[str]:
        return POPULAR_PROFESSIONS


# Singleton instance
roadmap_generator = UniversalRoadmapGenerator()
