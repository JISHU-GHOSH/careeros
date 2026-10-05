"""Universal Profession Roadmap Generator Engine.

Generates structured, visual roadmap data for any profession—from software
engineering and cybersecurity to medicine, aviation, creative arts, engineering, and trades.
"""

import re
from typing import List, Dict, Any, Optional
from app.models import (
    RoadmapNode,
    RoadmapStage,
    RoadmapResponse,
)

# Comprehensive Curated Knowledge Base for Top Global Professions
CURATED_ROADMAPS: Dict[str, Dict[str, Any]] = {
    # -------------------------------------------------------------
    # 1. Full-Stack Web Developer
    # -------------------------------------------------------------
    "full_stack_developer": {
        "title": "Full-Stack Web Developer",
        "summary": "Build modern, end-to-end web applications—from responsive frontend user interfaces to scalable backend APIs, databases, and cloud deployments.",
        "salary_range": "$75,000 - $145,000 / year",
        "estimated_months": 7,
        "stages": [
            {
                "stage_index": 1,
                "title": "Stage 1: HTML, Modern CSS & JavaScript Core",
                "estimated_weeks": 6,
                "node_ids": ["fs-html-css", "fs-js-ts"],
            },
            {
                "stage_index": 2,
                "title": "Stage 2: Frontend Frameworks & React/Next.js",
                "estimated_weeks": 6,
                "node_ids": ["fs-react-next", "fs-state-ui"],
            },
            {
                "stage_index": 3,
                "title": "Stage 3: Backend APIs & Server Runtimes (Node/Python)",
                "estimated_weeks": 6,
                "node_ids": ["fs-backend-api", "fs-db-sql"],
            },
            {
                "stage_index": 4,
                "title": "Stage 4: Authentication, Caching & Cloud Deploy",
                "estimated_weeks": 6,
                "node_ids": ["fs-auth-security", "fs-docker-cloud"],
            },
            {
                "stage_index": 5,
                "title": "Stage 5: Full-Stack Capstone & Job Readiness",
                "estimated_weeks": 4,
                "node_ids": ["fs-capstone"],
            },
        ],
        "nodes": [
            {
                "id": "fs-html-css",
                "title": "Semantic HTML5, CSS Grid, Flexbox & Tailwind CSS",
                "stage_index": 1,
                "category": "essential",
                "description": "Master responsive layouts, accessibility (WCAG a11y), CSS variables, mobile-first design, and utility-first styling with Tailwind CSS.",
                "key_skills": ["HTML5", "CSS Flexbox & Grid", "Tailwind CSS", "Web Accessibility (ARIA)"],
                "project_challenge": "Build a responsive SaaS marketing landing page with dark mode and 100% Google Lighthouse accessibility scores.",
                "resources": ["MDN Web Docs - HTML & CSS", "Tailwind CSS Official Docs", "Kevin Powell CSS Tutorials"],
                "prerequisites": [],
            },
            {
                "id": "fs-js-ts",
                "title": "JavaScript (ES6+) & TypeScript Fundamentals",
                "stage_index": 1,
                "category": "essential",
                "description": "Understand async/await, closures, promises, the DOM event loop, fetch API, and strict TypeScript types and generics.",
                "key_skills": ["JavaScript (ES6+)", "TypeScript", "Async/Await", "DOM Manipulation"],
                "project_challenge": "Build an interactive personal dashboard with live weather API fetching and typed local storage persistence.",
                "resources": ["JavaScript.info", "TypeScript Handbook", "Frontend Masters - Deep JavaScript Foundations"],
                "prerequisites": ["fs-html-css"],
            },
            {
                "id": "fs-react-next",
                "title": "React 18+ & Next.js 14 App Router",
                "stage_index": 2,
                "category": "essential",
                "description": "Learn React component lifecycles, hooks (useState, useEffect, useMemo), Server Components (RSC), and Next.js App Router routing.",
                "key_skills": ["React", "Next.js App Router", "Server Components", "Custom Hooks"],
                "project_challenge": "Build an interactive e-commerce product catalog with server-side filtering, search, and dynamic routing.",
                "resources": ["React.dev Official Documentation", "Next.js Learn Course", "Kent C. Dodds React Guides"],
                "prerequisites": ["fs-js-ts"],
            },
            {
                "id": "fs-state-ui",
                "title": "State Architecture & Component Libraries",
                "stage_index": 2,
                "category": "recommended",
                "description": "Manage complex client state with Zustand or TanStack Query, and integrate accessible headless UI (shadcn/ui, Radix).",
                "key_skills": ["TanStack Query", "Zustand", "shadcn/ui", "Optimistic State Updates"],
                "project_challenge": "Create a real-time Kanban board with drag-and-drop, optimistic UI updates, and caching.",
                "resources": ["TanStack Query Documentation", "shadcn/ui Component Guide"],
                "prerequisites": ["fs-react-next"],
            },
            {
                "id": "fs-backend-api",
                "title": "RESTful & GraphQL API Architecture (Node.js / Express / FastAPI)",
                "stage_index": 3,
                "category": "essential",
                "description": "Design modular backend routes, middleware, request validation, error handling, and API documentation with Swagger/OpenAPI.",
                "key_skills": ["Node.js / Express", "FastAPI / Python", "RESTful Design", "Input Validation (Zod/Pydantic)"],
                "project_challenge": "Build a secure REST API with CRUD operations, pagination, rate limiting, and automated validation tests.",
                "resources": ["Node.js Best Practices GitHub", "FastAPI Official Documentation"],
                "prerequisites": ["fs-js-ts"],
            },
            {
                "id": "fs-db-sql",
                "title": "Databases & ORMs (PostgreSQL, Prisma, Redis)",
                "stage_index": 3,
                "category": "essential",
                "description": "Master relational schema design, SQL joins, foreign keys, database indexing, and ORMs like Prisma or Drizzle.",
                "key_skills": ["PostgreSQL", "Prisma ORM", "SQL Indexing", "Database Migrations"],
                "project_challenge": "Architect a normalized multi-tenant relational database schema with migrations and automated seed scripts.",
                "resources": ["PostgreSQL Tutorial", "Prisma Official Docs", "Use The Index, Luke!"],
                "prerequisites": ["fs-backend-api"],
            },
            {
                "id": "fs-auth-security",
                "title": "User Authentication & Web Security (JWT, OAuth, Cookies)",
                "stage_index": 4,
                "category": "essential",
                "description": "Implement secure authentication: HTTP-only cookies, JWT refresh tokens, OAuth2 (Google/GitHub login), and CORS protection.",
                "key_skills": ["JWT & Sessions", "OAuth2", "Password Hashing (bcrypt)", "CORS & CSRF Defense"],
                "project_challenge": "Implement an end-to-end authentication system with email verification, password reset, and role-based access control.",
                "resources": ["OWASP Web Security Cheat Sheets", "Auth0 Architecture Guides"],
                "prerequisites": ["fs-db-sql"],
            },
            {
                "id": "fs-docker-cloud",
                "title": "Docker Containers & Cloud Deployment (AWS / Vercel)",
                "stage_index": 4,
                "category": "recommended",
                "description": "Containerize full-stack services using Docker Compose, set up CI/CD with GitHub Actions, and deploy to Vercel and AWS/Render.",
                "key_skills": ["Docker & Docker Compose", "GitHub Actions CI/CD", "AWS (S3, ECS, RDS)", "Vercel / Render"],
                "project_challenge": "Deploy a multi-container full-stack app (Next.js + Express + Postgres) via an automated GitHub Actions pipeline.",
                "resources": ["Docker Get Started Guide", "GitHub Actions Documentation"],
                "prerequisites": ["fs-auth-security"],
            },
            {
                "id": "fs-capstone",
                "title": "Production Full-Stack Capstone & Portfolio",
                "stage_index": 5,
                "category": "essential",
                "description": "Ship a complete production SaaS product with Stripe payments, real-time notifications, clean documentation, and test coverage.",
                "key_skills": ["Stripe Billing Integration", "End-to-End Testing (Playwright)", "System Monitoring", "Portfolio Showcase"],
                "project_challenge": "Build and launch a functional micro-SaaS application with live payments, user accounts, and public URL.",
                "resources": ["Full Stack Open by University of Helsinki", "Indie Hackers Case Studies"],
                "prerequisites": ["fs-docker-cloud"],
            },
        ],
    },

    # -------------------------------------------------------------
    # 2. DevOps & Cloud Engineer
    # -------------------------------------------------------------
    "devops_engineer": {
        "title": "DevOps & Cloud Infrastructure Engineer",
        "summary": "Automate cloud infrastructure, build robust CI/CD deployment pipelines, manage Kubernetes clusters, and guarantee high availability.",
        "salary_range": "$90,000 - $165,000 / year",
        "estimated_months": 8,
        "stages": [
            {
                "stage_index": 1,
                "title": "Stage 1: Linux Systems, Bash & Networking",
                "estimated_weeks": 6,
                "node_ids": ["devops-linux", "devops-net"],
            },
            {
                "stage_index": 2,
                "title": "Stage 2: Containerization & Docker Mastery",
                "estimated_weeks": 6,
                "node_ids": ["devops-docker", "devops-compose"],
            },
            {
                "stage_index": 3,
                "title": "Stage 3: CI/CD Automation & GitOps",
                "estimated_weeks": 6,
                "node_ids": ["devops-cicd", "devops-gitops"],
            },
            {
                "stage_index": 4,
                "title": "Stage 4: Infrastructure as Code & Cloud (Terraform & AWS)",
                "estimated_weeks": 8,
                "node_ids": ["devops-terraform", "devops-k8s"],
            },
            {
                "stage_index": 5,
                "title": "Stage 5: Observability, SRE & Production Hardening",
                "estimated_weeks": 6,
                "node_ids": ["devops-monitoring"],
            },
        ],
        "nodes": [
            {
                "id": "devops-linux",
                "title": "Linux Server Administration & Bash Automation",
                "stage_index": 1,
                "category": "essential",
                "description": "Master systemd services, SSH key pairs, file permissions, cron jobs, user privilege management, and robust Bash shell scripting.",
                "key_skills": ["Linux (Ubuntu/Debian)", "Bash Scripting", "Systemd Services", "SSH & Firewall Configuration"],
                "project_challenge": "Write an automated Bash provisioning script that hardens an Ubuntu server, creates isolated users, and configures UFW firewalls.",
                "resources": ["Linux Journey", "OverTheWire Wargames", "Red Hat System Administration Guide"],
                "prerequisites": [],
            },
            {
                "id": "devops-net",
                "title": "Cloud Networking, DNS, Load Balancers & TLS",
                "stage_index": 1,
                "category": "essential",
                "description": "Understand CIDR subnets, VPCs, DNS records (A, CNAME), reverse proxies (Nginx/Traefik), and Let's Encrypt automated TLS certificates.",
                "key_skills": ["TCP/IP & CIDR Subnetting", "Nginx Reverse Proxy", "DNS Architecture", "TLS / SSL Certificates"],
                "project_challenge": "Configure an Nginx reverse proxy load-balancing traffic between two upstream backend servers with SSL auto-renewal.",
                "resources": ["Cloudflare Learning Center - Networking", "Nginx Beginner's Guide"],
                "prerequisites": ["devops-linux"],
            },
            {
                "id": "devops-docker",
                "title": "Docker Containerization & Image Optimization",
                "stage_index": 2,
                "category": "essential",
                "description": "Build multi-stage production Dockerfiles, optimize image layers, configure non-root security containers, and manage volumes.",
                "key_skills": ["Docker", "Multi-Stage Builds", "Container Security", "Image Size Optimization"],
                "project_challenge": "Refactor a bloated 1.2GB application image down to under 80MB using Alpine multi-stage builds and non-root execution.",
                "resources": ["Docker Official Documentation", "Dive - Docker Image Exploration Tool"],
                "prerequisites": ["devops-linux"],
            },
            {
                "id": "devops-compose",
                "title": "Docker Compose & Multi-Container Networking",
                "stage_index": 2,
                "category": "recommended",
                "description": "Orchestrate multi-service microservice stacks (Frontend + Backend + PostgreSQL + Redis) with isolated internal networks and health checks.",
                "key_skills": ["Docker Compose", "Service Health Checks", "Volume Persistence", "Bridge Networks"],
                "project_challenge": "Create a 1-command Docker Compose local development stack with hot-reloading backend, database, and Redis cache.",
                "resources": ["Docker Compose Specification", "Docker Deep Dive by Nigel Poulton"],
                "prerequisites": ["devops-docker"],
            },
            {
                "id": "devops-cicd",
                "title": "CI/CD Pipeline Automation (GitHub Actions / GitLab CI)",
                "stage_index": 3,
                "category": "essential",
                "description": "Write automated CI pipelines for linting, unit testing, Docker image building, scanning vulnerabilities (Trivy), and automated deployment.",
                "key_skills": ["GitHub Actions", "Matrix Builds", "Automated Testing", "Secret Management"],
                "project_challenge": "Build an automated GitHub Actions workflow that runs test suites on PRs, builds Docker images on merge, and publishes to GitHub Container Registry.",
                "resources": ["GitHub Actions Documentation", "GitLab CI Best Practices"],
                "prerequisites": ["devops-compose"],
            },
            {
                "id": "devops-gitops",
                "title": "GitOps & Deployment Strategies (ArgoCD)",
                "stage_index": 3,
                "category": "specialization",
                "description": "Master GitOps principles: declarative infrastructure state, blue-green deployments, canary releases, and automatic cluster synchronization.",
                "key_skills": ["ArgoCD", "Blue-Green Deployments", "Canary Releases", "Declarative GitOps"],
                "project_challenge": "Set up an ArgoCD instance synchronizing application deployments from a dedicated Git configuration repository.",
                "resources": ["ArgoCD Official Guides", "GitOps Principles by Weaveworks"],
                "prerequisites": ["devops-cicd"],
            },
            {
                "id": "devops-terraform",
                "title": "Infrastructure as Code (Terraform & AWS Cloud)",
                "stage_index": 4,
                "category": "essential",
                "description": "Provision reproducible cloud infrastructure using HashiCorp Terraform: VPCs, subnets, EC2 instances, S3 buckets, and RDS databases.",
                "key_skills": ["Terraform", "AWS (VPC, EC2, RDS, IAM)", "Remote State & Locking", "Module Architecture"],
                "project_challenge": "Write reusable Terraform modules provisioning a multi-AZ VPC, public/private subnets, and an auto-scaling group on AWS.",
                "resources": ["Terraform Up & Running by Yevgeniy Brikman", "AWS Certified Solutions Architect Course"],
                "prerequisites": ["devops-net"],
            },
            {
                "id": "devops-k8s",
                "title": "Kubernetes Cluster Management & Helm Charts",
                "stage_index": 4,
                "category": "essential",
                "description": "Deploy and scale containerized applications on Kubernetes: Pods, Deployments, Services, Ingress, ConfigMaps, Secrets, and Helm packaging.",
                "key_skills": ["Kubernetes (k8s)", "Helm Charts", "Ingress Controllers", "Horizontal Pod Autoscaling"],
                "project_challenge": "Deploy a microservice application on a local k3s/Minikube cluster with Helm, Ingress, and Horizontal Pod Autoscaling under simulated load.",
                "resources": ["Kubernetes The Hard Way by Kelsey Hightower", "Certified Kubernetes Administrator (CKA) Guide"],
                "prerequisites": ["devops-terraform"],
            },
            {
                "id": "devops-monitoring",
                "title": "Observability, SRE & Incident Response (Prometheus & Grafana)",
                "stage_index": 5,
                "category": "essential",
                "description": "Implement metric collection with Prometheus, distributed tracing, alerting rules (Alertmanager), and operational dashboards in Grafana.",
                "key_skills": ["Prometheus", "Grafana", "Alertmanager", "SRE Principles (SLOs, SLIs)"],
                "project_challenge": "Deploy Prometheus and Grafana monitoring cluster metrics, with automated Discord/Slack alerts triggering on high CPU or memory thresholds.",
                "resources": ["Google Site Reliability Engineering (SRE) Book", "Prometheus Documentation"],
                "prerequisites": ["devops-k8s"],
            },
        ],
    },

    # -------------------------------------------------------------
    # 3. Data Scientist & Machine Learning Specialist
    # -------------------------------------------------------------
    "data_scientist": {
        "title": "Data Scientist & Machine Learning Specialist",
        "summary": "Extract insights from massive datasets, build predictive statistical models, design machine learning algorithms, and communicate business impact.",
        "salary_range": "$85,000 - $160,000 / year",
        "estimated_months": 7,
        "stages": [
            {
                "stage_index": 1,
                "title": "Stage 1: Python, SQL & Exploratory Data Analysis",
                "estimated_weeks": 6,
                "node_ids": ["ds-python-pandas", "ds-sql-analysis"],
            },
            {
                "stage_index": 2,
                "title": "Stage 2: Statistics, Probability & A/B Testing",
                "estimated_weeks": 6,
                "node_ids": ["ds-stats-prob", "ds-data-viz"],
            },
            {
                "stage_index": 3,
                "title": "Stage 3: Supervised & Unsupervised Machine Learning",
                "estimated_weeks": 8,
                "node_ids": ["ds-ml-scikit", "ds-feature-eng"],
            },
            {
                "stage_index": 4,
                "title": "Stage 4: Deep Learning & NLP Fundamentals",
                "estimated_weeks": 6,
                "node_ids": ["ds-deep-learning"],
            },
            {
                "stage_index": 5,
                "title": "Stage 5: Model Deployment, MLOps & Business Impact",
                "estimated_weeks": 4,
                "node_ids": ["ds-model-deploy"],
            },
        ],
        "nodes": [
            {
                "id": "ds-python-pandas",
                "title": "Data Wrangling with Python, Pandas & NumPy",
                "stage_index": 1,
                "category": "essential",
                "description": "Clean messy real-world datasets, handle missing values, reshape dataframes, perform grouping and aggregations, and compute matrix operations.",
                "key_skills": ["Python for Data Analysis", "Pandas DataFrames", "NumPy", "Data Cleaning"],
                "project_challenge": "Clean and normalize a raw 500,000-row real estate transaction dataset, handling missing outliers and imputations.",
                "resources": ["Python for Data Analysis by Wes McKinney", "Kaggle Python & Pandas Tutorials"],
                "prerequisites": [],
            },
            {
                "id": "ds-sql-analysis",
                "title": "Advanced SQL & Database Analytics",
                "stage_index": 1,
                "category": "essential",
                "description": "Master window functions (ROW_NUMBER, LAG, LEAD), common table expressions (CTEs), cohort analysis, and retention metrics.",
                "key_skills": ["SQL Window Functions", "CTEs", "Cohort Analysis", "Data Aggregations"],
                "project_challenge": "Write complex SQL queries calculating monthly customer churn, retention cohorts, and lifetime value across 1M transactions.",
                "resources": ["Mode Analytics SQL Tutorial", "Stratascratch SQL Interview Problems"],
                "prerequisites": ["ds-python-pandas"],
            },
            {
                "id": "ds-stats-prob",
                "title": "Inferential Statistics, Hypothesis Testing & A/B Tests",
                "stage_index": 2,
                "category": "essential",
                "description": "Learn probability distributions, central limit theorem, p-values, t-tests, ANOVA, statistical significance, and designing rigorous A/B experiments.",
                "key_skills": ["Hypothesis Testing", "A/B Test Design", "Confidence Intervals", "Statistical Significance"],
                "project_challenge": "Design an A/B test simulation calculating required sample size, statistical power, and evaluating conversion rate lift.",
                "resources": ["StatQuest with Josh Starmer", "Practical Statistics for Data Scientists"],
                "prerequisites": ["ds-python-pandas"],
            },
            {
                "id": "ds-data-viz",
                "title": "Data Visualization & Storytelling (Seaborn / Tableau)",
                "stage_index": 2,
                "category": "recommended",
                "description": "Communicate complex trends visually using Seaborn, Matplotlib, Plotly interactive charts, and business intelligence dashboards.",
                "key_skills": ["Seaborn & Matplotlib", "Plotly Interactive Charts", "Tableau / PowerBI", "Executive Storytelling"],
                "project_challenge": "Create an interactive Plotly dashboard demonstrating market trends and correlation heatmaps for executive presentations.",
                "resources": ["Storytelling with Data by Cole Nussbaumer Knaflic", "Tableau Free Training"],
                "prerequisites": ["ds-stats-prob"],
            },
            {
                "id": "ds-ml-scikit",
                "title": "Machine Learning Algorithms & Model Validation",
                "stage_index": 3,
                "category": "essential",
                "description": "Train linear/logistic regression, decision trees, random forests, gradient boosting (XGBoost, LightGBM), and evaluate with ROC-AUC and F1-score.",
                "key_skills": ["Scikit-Learn", "XGBoost", "Cross-Validation", "Precision/Recall Optimization"],
                "project_challenge": "Build a predictive credit default risk classification model with hyperparameter tuning (GridSearchCV) and threshold optimization.",
                "resources": ["Hands-On Machine Learning by Aurélien Géron", "Andrew Ng Machine Learning Specialization"],
                "prerequisites": ["ds-stats-prob"],
            },
            {
                "id": "ds-feature-eng",
                "title": "Feature Engineering & Dimensionality Reduction",
                "stage_index": 3,
                "category": "recommended",
                "description": "Transform raw signals into predictive features: one-hot encoding, target encoding, PCA (Principal Component Analysis), and t-SNE.",
                "key_skills": ["Feature Engineering", "PCA", "t-SNE Clustering", "Correlation Pruning"],
                "project_challenge": "Engineer 15+ novel behavioral features from raw timestamp clickstream logs that improve baseline model accuracy by 10%+.",
                "resources": ["Feature Engineering for Machine Learning by Alice Zheng", "Kaggle Feature Engineering Course"],
                "prerequisites": ["ds-ml-scikit"],
            },
            {
                "id": "ds-deep-learning",
                "title": "Deep Neural Networks & Natural Language Processing",
                "stage_index": 4,
                "category": "specialization",
                "description": "Understand multi-layer neural networks, embeddings, sentiment classification with Hugging Face transformers, and text preprocessing.",
                "key_skills": ["PyTorch Basics", "Hugging Face Transformers", "Text Embeddings", "Sentiment Classification"],
                "project_challenge": "Fine-tune a DistilBERT text classification model to categorize customer support tickets into priority queues.",
                "resources": ["Fast.ai Practical Deep Learning", "Hugging Face NLP Course"],
                "prerequisites": ["ds-ml-scikit"],
            },
            {
                "id": "ds-model-deploy",
                "title": "ML Model Deployment & Streamlit / FastAPI Serving",
                "stage_index": 5,
                "category": "essential",
                "description": "Package trained models into serializable formats (ONNX, joblib), expose inference via FastAPI REST endpoints, and deploy web demos.",
                "key_skills": ["FastAPI Model Serving", "Streamlit Web App", "Docker Containerization", "Model Monitoring"],
                "project_challenge": "Deploy an interactive Streamlit web app on the cloud allowing users to upload CSVs and generate instant ML predictions.",
                "resources": ["Full Stack Deep Learning", "Made With ML by Goku Mohandas"],
                "prerequisites": ["ds-deep-learning"],
            },
        ],
    },

    # -------------------------------------------------------------
    # 4. Product Manager (Tech / Software)
    # -------------------------------------------------------------
    "product_manager": {
        "title": "Software Product Manager (PM)",
        "summary": "Lead cross-functional engineering, design, and business teams to discover customer problems, define product strategy, and launch high-impact features.",
        "salary_range": "$95,000 - $175,000 / year",
        "estimated_months": 6,
        "stages": [
            {
                "stage_index": 1,
                "title": "Stage 1: User Research, Problem Discovery & Market Analysis",
                "estimated_weeks": 5,
                "node_ids": ["pm-discovery", "pm-market"],
            },
            {
                "stage_index": 2,
                "title": "Stage 2: Product Requirements Documents (PRDs) & Roadmaps",
                "estimated_weeks": 5,
                "node_ids": ["pm-prd", "pm-wireframing"],
            },
            {
                "stage_index": 3,
                "title": "Stage 3: Agile Execution & Engineering Collaboration",
                "estimated_weeks": 5,
                "node_ids": ["pm-agile", "pm-technical"],
            },
            {
                "stage_index": 4,
                "title": "Stage 4: Product Analytics & Metric Optimization (A/B Tests)",
                "estimated_weeks": 5,
                "node_ids": ["pm-analytics", "pm-experimentation"],
            },
            {
                "stage_index": 5,
                "title": "Stage 5: Go-to-Market Strategy & Executive Case Defense",
                "estimated_weeks": 4,
                "node_ids": ["pm-gtm"],
            },
        ],
        "nodes": [
            {
                "id": "pm-discovery",
                "title": "Customer Interviews & Problem Discovery",
                "stage_index": 1,
                "category": "essential",
                "description": "Conduct unbiased user interviews (The Mom Test), map user pain points, build customer journey maps, and identify unmet needs.",
                "key_skills": ["The Mom Test Methodology", "Customer Journey Mapping", "Jobs to be Done (JTBD)", "Pain Point Synthesis"],
                "project_challenge": "Conduct 5 structured customer discovery interviews on a broken workflow and write an Opportunity Solution Tree.",
                "resources": ["The Mom Test by Rob Fitzpatrick", "Continuous Discovery Habits by Teresa Torres"],
                "prerequisites": [],
            },
            {
                "id": "pm-market",
                "title": "Market Sizing, Competitive Analysis & Value Propositions",
                "stage_index": 1,
                "category": "recommended",
                "description": "Calculate Total Addressable Market (TAM), analyze direct and indirect competitors, and identify differentiation moats.",
                "key_skills": ["TAM / SAM / SOM Calculation", "Competitive Landscape Mapping", "Value Proposition Design", "Unit Economics"],
                "project_challenge": "Produce an executive competitive teardown of two competing SaaS products identifying a high-leverage product gap.",
                "resources": ["Inspired by Marty Cagan", "Reforge Product Strategy"],
                "prerequisites": ["pm-discovery"],
            },
            {
                "id": "pm-prd",
                "title": "Writing World-Class Product Requirements Documents (PRDs)",
                "stage_index": 2,
                "category": "essential",
                "description": "Author structured PRDs with clear problem statements, success metrics, user stories, acceptance criteria, and edge-case handling.",
                "key_skills": ["PRD Authoring", "User Stories & Acceptance Criteria", "Feature Prioritization (RICE Framework)", "Scope Scoping"],
                "project_challenge": "Write a complete, ready-for-engineering PRD for a new collaborative feature in an existing popular product.",
                "resources": ["Lenny's Newsletter PRD Templates", "Figma PRD Framework"],
                "prerequisites": ["pm-discovery"],
            },
            {
                "id": "pm-wireframing",
                "title": "Rapid Wireframing & UX Prototyping (Figma / Balsamiq)",
                "stage_index": 2,
                "category": "recommended",
                "description": "Create low-fidelity wireframes and user flow diagrams in Figma to align designers and engineers on UX requirements.",
                "key_skills": ["Figma Wireframing", "User Flows", "Information Architecture", "Prototyping"],
                "project_challenge": "Design an interactive low-fidelity clickable wireframe in Figma covering an onboarding user flow.",
                "resources": ["Figma for Product Managers", "Don't Make Me Think by Steve Krug"],
                "prerequisites": ["pm-prd"],
            },
            {
                "id": "pm-agile",
                "title": "Scrum, Sprint Planning & Backlog Grooming",
                "stage_index": 3,
                "category": "essential",
                "description": "Run sprint planning, manage Jira/Linear backlogs, unblock developers, resolve scope creep, and conduct sprint retrospectives.",
                "key_skills": ["Jira / Linear", "Sprint Planning", "Story Point Estimation", "Retrospectives"],
                "project_challenge": "Set up a clean Linear/Jira board with epics, estimated user stories, and acceptance criteria for a 2-week sprint.",
                "resources": ["Scrum Guide Official", "Linear Method Playbook"],
                "prerequisites": ["pm-prd"],
            },
            {
                "id": "pm-technical",
                "title": "Technical Fluency for PMs (APIs, Databases, Cloud)",
                "stage_index": 3,
                "category": "recommended",
                "description": "Understand REST APIs, database schemas, latency trade-offs, tech debt, and how to earn respect communicating with engineers.",
                "key_skills": ["System Architecture Basics", "API Payloads", "SQL for PMs", "Tech Debt Management"],
                "project_challenge": "Inspect network API requests in DevTools for a web app and write a technical bug report with payload reproductions.",
                "resources": ["Swipe to Unlock Book", "SQL for Product Managers Tutorial"],
                "prerequisites": ["pm-agile"],
            },
            {
                "id": "pm-analytics",
                "title": "Product Analytics & North Star Metric Architecture",
                "stage_index": 4,
                "category": "essential",
                "description": "Define North Star metrics, input metrics, conversion funnels, retention curves, and instrument events using Mixpanel or PostHog.",
                "key_skills": ["Mixpanel / PostHog", "North Star Metric Framework", "Retention Curves", "Funnel Drop-Off Analysis"],
                "project_challenge": "Design an event tracking specification (telemetry taxonomy) for a subscription checkout funnel.",
                "resources": ["Mixpanel Product Analytics Academy", "Amplitude Guide to Product Retention"],
                "prerequisites": ["pm-technical"],
            },
            {
                "id": "pm-experimentation",
                "title": "A/B Testing, Feature Flags & Experimentation",
                "stage_index": 4,
                "category": "essential",
                "description": "Formulate hypotheses, calculate statistical significance, design variant test cells, and roll out features safely with feature flags.",
                "key_skills": ["A/B Testing Frameworks", "Feature Flags (LaunchDarkly)", "Hypothesis Formulation", "Post-Launch Review"],
                "project_challenge": "Design a complete A/B experiment spec to improve sign-up conversions with primary, secondary, and guardrail metrics.",
                "resources": ["Trustworthy Online Controlled Experiments by Ron Kohavi", "Optimizely Academy"],
                "prerequisites": ["pm-analytics"],
            },
            {
                "id": "pm-gtm",
                "title": "Go-to-Market (GTM) Strategy & Product Case Defense",
                "stage_index": 5,
                "category": "essential",
                "description": "Coordinate launch with sales, marketing, and support. Master Product Sense and Execution interview case studies.",
                "key_skills": ["Go-To-Market Planning", "Product Sense Frameworks", "Stakeholder Alignment", "PM Interview Cases"],
                "project_challenge": "Complete a comprehensive PM portfolio case study answering: 'How would you redesign Uber Eats for elderly users?'",
                "resources": ["Cracking the PM Interview by Gayle Laakmann McDowell", "Exponent PM Interview Prep"],
                "prerequisites": ["pm-experimentation"],
            },
        ],
    },

    # -------------------------------------------------------------
    # 5. Doctor / Medical Practitioner
    # -------------------------------------------------------------
    "medical_doctor": {
        "title": "Medical Doctor (Physician / Surgeon)",
        "summary": "Master human anatomy, pathophysiology, pharmacology, diagnostic reasoning, and clinical rotations to care for patients and treat complex diseases.",
        "salary_range": "$180,000 - $380,000 / year",
        "estimated_months": 36,
        "stages": [
            {
                "stage_index": 1,
                "title": "Stage 1: Pre-Med Sciences & MCAT Examination",
                "estimated_weeks": 24,
                "node_ids": ["med-premed", "med-mcat"],
            },
            {
                "stage_index": 2,
                "title": "Stage 2: Pre-Clinical Sciences (Anatomy, Pathology, Pharma)",
                "estimated_weeks": 36,
                "node_ids": ["med-anatomy", "med-pathology"],
            },
            {
                "stage_index": 3,
                "title": "Stage 3: Clinical Clerkships & Hospital Rotations",
                "estimated_weeks": 40,
                "node_ids": ["med-clerkships", "med-diagnostics"],
            },
            {
                "stage_index": 4,
                "title": "Stage 4: USMLE / Medical Board Examinations",
                "estimated_weeks": 20,
                "node_ids": ["med-board-exams"],
            },
            {
                "stage_index": 5,
                "title": "Stage 5: Residency Training & Specialized Fellowship",
                "estimated_weeks": 52,
                "node_ids": ["med-residency"],
            },
        ],
        "nodes": [
            {
                "id": "med-premed",
                "title": "Biological Sciences, Chemistry & Physics Prerequisites",
                "stage_index": 1,
                "category": "essential",
                "description": "Complete university foundational coursework in Organic Chemistry, Biochemistry, Cellular Biology, Physics, and Genetics.",
                "key_skills": ["Organic Chemistry", "Biochemistry", "Cellular Biology", "Genetics"],
                "project_challenge": "Complete 100+ hours of clinical volunteering or physician shadowing in an emergency department or primary clinic.",
                "resources": ["AAMC Pre-Med Guidelines", "Khan Academy MCAT Prep"],
                "prerequisites": [],
            },
            {
                "id": "med-mcat",
                "title": "MCAT Exam Mastery & Medical School Admission",
                "stage_index": 1,
                "category": "essential",
                "description": "Prepare for and achieve top percentile score on the Medical College Admission Test (Chemical, Biological, Psychological, and CARS).",
                "key_skills": ["MCAT Strategy", "Critical Analysis (CARS)", "Psychology / Sociology", "Biochemical Foundations"],
                "project_challenge": "Score 515+ on full-length official AAMC practice exams under timed conditions.",
                "resources": ["Official AAMC MCAT Practice Exams", "UWorld MCAT Question Bank"],
                "prerequisites": ["med-premed"],
            },
            {
                "id": "med-anatomy",
                "title": "Gross Anatomy, Histology & Organ Systems Physiology",
                "stage_index": 2,
                "category": "essential",
                "description": "Study human cadaver dissection, cardiovascular/respiratory/renal physiology, neuroanatomy, and endocrine feedback loops.",
                "key_skills": ["Cadaver Anatomy", "Cardiovascular Physiology", "Neuroanatomy", "Renal System"],
                "project_challenge": "Pass medical school anatomical identification practicals and explain complex physiological regulation loops.",
                "resources": ["Netter's Atlas of Human Anatomy", "Costanzo Physiology", "Anki Medical Decks (AnKing)"],
                "prerequisites": ["med-mcat"],
            },
            {
                "id": "med-pathology",
                "title": "Pathology, Microbiology & Clinical Pharmacology",
                "stage_index": 2,
                "category": "essential",
                "description": "Understand mechanisms of disease, infectious microbes (bacteria, viruses, fungi), immune disorders, and pharmacokinetics/pharmacodynamics.",
                "key_skills": ["Pathology (Robbins)", "Microbiology (Bugs)", "Pharmacology (Drugs)", "Immunology"],
                "project_challenge": "Diagnose 50 complex clinical clinical vignettes correctly correlating symptoms, lab results, and first-line drug treatments.",
                "resources": ["Pathoma - Fundamentals of Pathology", "Sketchy Medical Microbiology & Pharm"],
                "prerequisites": ["med-anatomy"],
            },
            {
                "id": "med-clerkships",
                "title": "Core Hospital Clerkships (Internal Med, Surgery, Peds, OB/GYN)",
                "stage_index": 3,
                "category": "essential",
                "description": "Complete hands-on inpatient hospital clinical rotations: taking patient histories, physical exams, formulating differentials, and scrubbing into surgeries.",
                "key_skills": ["Patient Physical Exams", "Differential Diagnosis", "Surgical Scrub Techniques", "Inpatient Rounds"],
                "project_challenge": "Present formal inpatient patient case histories on morning rounds and write accurate SOAP clinical notes.",
                "resources": ["UpToDate Clinical Decision Support", "First Aid for the Wards"],
                "prerequisites": ["med-pathology"],
            },
            {
                "id": "med-diagnostics",
                "title": "Clinical Diagnostics, ECG & Radiology Interpretation",
                "stage_index": 3,
                "category": "essential",
                "description": "Interpret 12-lead Electrocardiograms (ECGs), chest X-rays, CT scans, blood lab panels (CBC, BMP, LFTs), and emergency triage.",
                "key_skills": ["12-Lead ECG Interpretation", "Chest X-Ray Reading", "Lab Panel Analysis", "Emergency Resuscitation (ACLS)"],
                "project_challenge": "Accurately identify STEMI heart attacks, pneumothorax, and electrolyte disturbances from clinical imaging and ECG traces.",
                "resources": ["Life in the Fast Lane (LITFL) ECG", "Radiopaedia Clinical Cases"],
                "prerequisites": ["med-clerkships"],
            },
            {
                "id": "med-board-exams",
                "title": "USMLE Step 1 & Step 2 CK Licensing Exams",
                "stage_index": 4,
                "category": "essential",
                "description": "Pass rigorous United States Medical Licensing Examination (USMLE) evaluating clinical knowledge, diagnostic accuracy, and patient management.",
                "key_skills": ["USMLE Step 1 (Pass)", "USMLE Step 2 CK (250+ Target)", "Evidence-Based Medicine", "Medical Ethics"],
                "project_challenge": "Complete all 3,800+ questions in UWorld Question Bank maintaining an 80%+ average.",
                "resources": ["First Aid for the USMLE Step 1", "UWorld USMLE Step 2 CK Bank"],
                "prerequisites": ["med-diagnostics"],
            },
            {
                "id": "med-residency",
                "title": "Residency Training & Board Specialty Certification",
                "stage_index": 5,
                "category": "essential",
                "description": "Match into residency (Internal Medicine, General Surgery, Pediatrics, etc.), manage intensive clinical caseloads, and attain board certification.",
                "key_skills": ["Clinical Autonomy", "Procedural Competence", "Patient Management", "Board Certification"],
                "project_challenge": "Complete 3-7 years of accredited residency training and successfully pass specialty Board Certification examinations.",
                "resources": ["ACGME Residency Milestones", "NEJM Knowledge+ Clinical Reviews"],
                "prerequisites": ["med-board-exams"],
            },
        ],
    },

    # -------------------------------------------------------------
    # 6. Commercial Airline Pilot (Retained & Polished)
    # -------------------------------------------------------------
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

    # -------------------------------------------------------------
    # 7. Game Developer (Retained & Polished)
    # -------------------------------------------------------------
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

    # -------------------------------------------------------------
    # 8. Cybersecurity Analyst (Retained)
    # -------------------------------------------------------------
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

    # -------------------------------------------------------------
    # 9. Artificial Intelligence & Machine Learning (Retained)
    # -------------------------------------------------------------
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
}

POPULAR_PROFESSIONS = [
    "Full-Stack Web Developer",
    "Game Developer",
    "DevOps & Cloud Engineer",
    "Data Scientist",
    "Cybersecurity Analyst",
    "Artificial Intelligence Engineer",
    "Software Product Manager",
    "Medical Doctor (Physician)",
    "Commercial Airline Pilot",
    "Robotics Engineer",
    "UI/UX Product Designer",
    "Blockchain Developer",
]

# Domain-specific archetype library for dynamic generation of unlisted careers
DOMAIN_ARCHETYPES: Dict[str, Dict[str, Any]] = {
    "healthcare": {
        "keywords": ["nurse", "dentist", "pharmacist", "therapist", "optometrist", "veterinarian", "paramedic", "radiologist", "physiotherapist", "surgeon", "clinic"],
        "stages": [
            ("Pre-Clinical Sciences & Patient Ethics", 8, "Master patient confidentiality (HIPAA), medical terminology, biology, and ethical communication.", ["Medical Terminology", "Patient Ethics", "Human Physiology", "Infection Control"], "Complete a clinical case study on patient privacy and safety compliance protocols.", ["WHO Healthcare Standards", "Clinical Ethics Primer"]),
            ("Diagnostic Tools & Clinical Procedures", 10, "Perform standard patient assessment, diagnostic instrument operation, and health history documentation.", ["Diagnostic Equipment", "Vital Signs Assessment", "Clinical Documentation", "Lab Testing"], "Demonstrate and document 10 comprehensive patient assessments adhering to clinical standards.", ["Clinical Procedures Handbook", "Patient Assessment Protocols"]),
            ("Pharmacology, Pathology & Treatment Plans", 12, "Analyze disease mechanisms, contraindications, drug interactions, and evidence-based treatment plans.", ["Pharmacology Basics", "Pathology Correlates", "Treatment Planning", "Dosage Calculations"], "Synthesize a multi-disciplinary treatment plan for a patient with dual chronic conditions.", ["Clinical Pharmacology Compendium", "Evidence-Based Clinical Guidelines"]),
            ("Supervised Clinical Practicum & Patient Care", 16, "Execute supervised clinical shifts under licensed preceptors across acute and outpatient settings.", ["Inpatient Care", "Interprofessional Teamwork", "Emergency Triage", "Patient Education"], "Log 300+ verified clinical hours demonstrating procedural autonomy and bed-side care.", ["Hospital Internship Logbook", "Clinical Preceptor Evaluation Rubric"]),
            ("State Board Licensing, Credentialing & Practice", 6, "Pass national board licensing exams, secure state licensure, and join professional medical associations.", ["Board Certification Exam", "State Licensure", "Continuous Medical Education (CME)", "Professional Liability"], "Pass the comprehensive state board practice simulation examination.", ["National Board Licensure Guide", "State Department of Health Regulations"]),
        ],
        "salary_range": "$65,000 - $145,000 / year",
    },
    "engineering_hardware": {
        "keywords": ["mechanical", "electrical", "civil", "robotics", "hardware", "chemical", "aerospace", "automotive", "structural", "cad", "semiconductor"],
        "stages": [
            ("Core Engineering Mathematics & Physics", 8, "Master calculus, differential equations, statics, dynamics, and materials science.", ["Differential Equations", "Statics & Dynamics", "Materials Science", "Thermodynamics"], "Solve and document stress-strain and heat transfer calculations for a structural beam assembly.", ["MIT OpenCourseWare Engineering Physics", "Fundamentals of Engineering (FE) Review"]),
            ("Computer-Aided Design (CAD) & Modeling", 8, "Design 3D mechanical assemblies and schematics using industry-standard CAD/EDA software.", ["SolidWorks / AutoCAD", "3D Parametric Modeling", "Geometric Tolerancing (GD&T)", "Schematic Capture"], "Design a multi-part mechanical gearbox assembly with tolerance analysis and manufacturing drawings.", ["SolidWorks Official Tutorials", "ASME Y14.5 GD&T Standards"]),
            ("Simulation, Prototyping & Finite Element Analysis (FEA)", 10, "Run stress, thermal, and fluid simulations (FEA/CFD) and build physical prototypes via CNC/3D printing.", ["FEA Simulation (ANSYS)", "Rapid Prototyping (CNC/3D Print)", "Thermal Analysis", "Sensor Integration"], "Conduct a stress simulation on a custom bracket identifying failure points, then prototype and physically test it.", ["ANSYS Learning Hub", "Practical Finite Element Analysis Guide"]),
            ("System Integration, Testing & Quality Standards", 10, "Integrate microcontrollers, actuators, and power circuits, verifying safety and ISO standards.", ["Microcontroller Interfacing", "Power Distribution", "ISO / ASTM Standards", "Reliability Testing"], "Build a benchtop mechatronic automated testing rig with closed-loop sensor feedback.", ["ISO 9001 Engineering Best Practices", "Control Systems Engineering by Norman Nise"]),
            ("Professional Engineering (PE) Licensure & Industry Project", 6, "Prepare for the Fundamentals of Engineering (FE/PE) exam and assemble a technical portfolio.", ["FE/PE Exam Preparation", "Engineering Ethics", "Patent & IP Basics", "Design Review Defense"], "Deliver a complete multidisciplinary engineering design package ready for production manufacturing.", ["NCEES FE Exam Specification", "National Society of Professional Engineers (NSPE)"]),
        ],
        "salary_range": "$75,000 - $135,000 / year",
    },
    "creative_arts": {
        "keywords": ["animator", "3d", "artist", "illustrator", "sound", "music", "musician", "video", "editor", "photographer", "cinematographer", "designer", "vfx", "motion"],
        "stages": [
            ("Visual & Auditory Foundations", 6, "Master composition, color theory, lighting, sound design fundamentals, and storytelling rhythm.", ["Color Theory & Composition", "Lighting Principles", "Focal Hierarchy", "Storyboarding"], "Create a visual moodboard and comprehensive style-guide for a fictional short film or game.", ["Color and Light by James Gurney", "Framed Ink by Marcos Mateu-Mestre"]),
            ("Industry Software Mastery (Blender, Premiere, DAW, Maya)", 8, "Become proficient in primary creative suites: Blender, Maya, After Effects, Ableton, or Premiere Pro.", ["Blender / Maya", "Adobe Creative Suite", "Non-Linear Editing", "Asset Organization"], "Produce a 30-second fully modeled, textured, and animated 3D product showcase video.", ["Blender Guru Donut Series", "Adobe Official Classroom in a Book"]),
            ("Advanced Production Techniques & Shading/Mixing", 10, "Execute high-end texturing (Substance Painter), sound mixing, motion tracking, and procedural visual FX.", ["Procedural Shading", "Substance Painter Texturing", "Audio Mixing & Mastering", "Motion Tracking"], "Build a photorealistic environment scene with custom materials, lighting, and soundscape.", ["FlippedNormals Masterclasses", "Sound on Sound Mixing Guides"]),
            ("Flagship Portfolio Reel & Showreel Assembly", 8, "Curate and polish an industry-standard 60-second showreel highlighting your strongest commercial work.", ["Demo Reel Editing", "Breakdown Overlays", "Vimeo / ArtStation Showcase", "Client Communication"], "Publish a polished 60-second showreel with before/after process breakdown layers.", ["ArtStation Showcase Guidelines", "The Animation Producer's Handbook"]),
            ("Freelance Business, Studio Pitching & Agency Placement", 4, "Pitch to creative directors, negotiate rates, write usage licenses, and land agency contracts.", ["Contract Negotiation", "Usage Rights & IP", "Creative Pitch Decks", "Studio Interview Prep"], "Pitch your creative package to 3 prospective commercial clients or creative directors.", ["The Freelance Manifesto by Joey Korenman", "AIGA Professional Practice Guide"]),
        ],
        "salary_range": "$55,000 - $115,000 / year",
    },
    "finance_business": {
        "keywords": ["accountant", "cpa", "banker", "analyst", "trader", "consultant", "auditor", "economist", "financial", "actuary", "underwriter", "tax"],
        "stages": [
            ("Financial Accounting & GAAP Standards", 6, "Master double-entry bookkeeping, the three financial statements, journal entries, and GAAP/IFRS rules.", ["GAAP & IFRS Accounting", "Balance Sheet & Income Statement", "Cash Flow Analysis", "General Ledger"], "Build a fully integrated three-statement financial model in Excel linking Cash Flow, Balance Sheet, and P&L.", ["AccountingCoach Free Platform", "Investopedia Financial Accounting Guide"]),
            ("Financial Modeling & Valuation (DCF, Multiples, LBO)", 8, "Build discounted cash flow (DCF) valuation models, comparable company analysis, and sensitivity tables.", ["Discounted Cash Flow (DCF)", "Comparable Company Multiples", "WACC Calculation", "Sensitivity Tables"], "Conduct an end-to-end valuation of a publicly traded enterprise using DCF and trading multiples.", ["Corporate Finance Institute (CFI)", "Wall Street Prep Financial Modeling"]),
            ("Corporate Finance, M&A & Capital Markets", 8, "Analyze mergers and acquisitions, debt vs equity capital raising, credit risk, and portfolio optimization.", ["Mergers & Acquisitions (M&A)", "Capital Structure Optimization", "Credit Risk Analysis", "Portfolio Theory"], "Draft an executive investment memorandum evaluating an acquisition target with accretion/dilution analysis.", ["Damodaran on Valuation (NYU Stern)", "Principles of Corporate Finance by Brealey"]),
            ("Financial Regulation, Auditing & Internal Controls", 8, "Understand SEC filings (10-K, 10-Q), Sarbanes-Oxley (SOX) compliance, audit procedures, and tax law.", ["SEC 10-K Analysis", "SOX Internal Controls", "Audit Sampling & Risk", "Corporate Taxation"], "Perform a comprehensive forensic financial audit on a 10-K report identifying revenue recognition risks.", ["AICPA Audit Guidelines", "SEC EDGAR Database Guide"]),
            ("Professional Certification (CFA, CPA) & Career Placement", 6, "Prepare for prestigious industry licenses (CFA Level 1, CPA exam, or Series 7) and technical interviews.", ["CFA / CPA Exam Strategy", "Financial Modeling Speed Tests", "Technical Case Interviews", "Pitch Presentation"], "Score 75%+ on a full-length mock CFA or CPA section exam under strict timed conditions.", ["CFA Institute Candidate Resources", "Becker CPA Review"]),
        ],
        "salary_range": "$75,000 - $160,000 / year",
    },
    "trades_culinary": {
        "keywords": ["chef", "cook", "electrician", "plumber", "carpenter", "welder", "mechanic", "hvac", "baker", "barista", "machinist", "culinary"],
        "stages": [
            ("Safety Standards, Tool Operation & Fundamentals", 6, "Master job-site safety (OSHA / ServSafe), proper hand/power tool operation, and core measurements.", ["OSHA / ServSafe Compliance", "Tool Care & Calibration", "Material Identification", "Precision Measurement"], "Pass the official safety and hazardous materials certification assessment with 100% compliance.", ["OSHA 10-Hour Training", "ServSafe Manager Guidelines"]),
            ("Core Technical Techniques & Blueprint Reading", 8, "Read blueprints, schematics, and recipes; master standard joinery, wiring, piping, or culinary knife cuts.", ["Schematics & Blueprint Reading", "Technical Joinery / Piping / Cuts", "Code Compliance", "Station Setup"], "Fabricate or execute a complex standard assembly exactly according to architectural blueprints.", ["National Electrical Code (NEC) / Uniform Plumbing Code", "The Professional Chef (Culinary Institute of America)"]),
            ("Advanced Systems, Diagnostics & Troubleshooting", 10, "Diagnose system failures, circuit faults, pressure drops, or culinary flavor imbalances under pressure.", ["Diagnostic Troubleshooting", "Specialized Machinery Operation", "Quality Inspection", "Repair Procedures"], "Diagnose and repair 5 complex deliberate fault simulations in a controlled test workshop.", ["Modern Refrigeration & Air Conditioning", "Chilton Automotive Repair Manuals"]),
            ("Project Estimation, Job-Site Management & Speed", 8, "Estimate labor/materials, manage job timelines, order supplies, and ensure cost efficiency.", ["Material Takeoffs & Bidding", "Crew Coordination", "Client Communication", "Inventory Control"], "Prepare an accurate material and labor cost estimate bid for a $25,000 commercial job.", ["RSMeans Construction Cost Data", "Restaurant Operations Management"]),
            ("Journeyman Licensure, Master Craftsman & Business Launch", 4, "Pass state trade licensing examinations, earn Journeyman/Master certification, and start independent contracts.", ["Trade Licensing Exam", "Business Permitting & Insurance", "Apprenticeship Completion", "Client Contracts"], "Pass the state Journeyman or Master licensing board practical and written examination.", ["State Licensing Board Exam Specifications", "SCORE Small Business Mentorship"]),
        ],
        "salary_range": "$50,000 - $110,000 / year",
    },
}


class UniversalRoadmapGenerator:
    """Generates structured, visual roadmap trees for any user-entered profession."""

    def normalize_key(self, profession: str) -> str:
        clean = profession.lower().strip()
        clean = re.sub(r"[^a-z0-9]+", "_", clean).strip("_")
        return clean

    def find_curated_match(self, profession: str) -> Optional[Dict[str, Any]]:
        query = profession.lower().strip()
        words = set(re.findall(r"\b[a-z0-9]+\b", query))

        # Aviation
        if any(w in words for w in ["pilot", "aviation", "airline", "airlines", "aircraft", "airplane", "flight"]):
            return CURATED_ROADMAPS["commercial_pilot"]

        # Game Development
        if any(w in words for w in ["game", "games", "unity", "unreal", "gamedev"]):
            return CURATED_ROADMAPS["game_developer"]

        # Cybersecurity
        if any(w in words for w in ["cyber", "cybersecurity", "hack", "hacker", "hacking", "security", "pentest", "infosec"]):
            return CURATED_ROADMAPS["cybersecurity_analyst"]

        # AI & ML
        if "ai" in words or any(w in words for w in ["artificial", "ml", "llm", "transformers", "pytorch"]) or "machine learning" in query or "deep learning" in query:
            return CURATED_ROADMAPS["ai_engineer"]

        # Full-Stack Web Development
        if "fullstack" in query or "full stack" in query or ("web" in words and "developer" in words):
            return CURATED_ROADMAPS["full_stack_developer"]

        # DevOps & Cloud
        if any(w in words for w in ["devops", "cloud", "sre", "kubernetes", "infrastructure", "platform"]):
            return CURATED_ROADMAPS["devops_engineer"]

        # Data Science
        if any(w in words for w in ["data", "scientist", "analytics", "statistician"]) and "analyst" in words:
            return CURATED_ROADMAPS["data_scientist"]
        if "data scientist" in query:
            return CURATED_ROADMAPS["data_scientist"]

        # Product Management
        if ("product" in words and any(w in words for w in ["manager", "management", "pm"])) or "product manager" in query:
            return CURATED_ROADMAPS["product_manager"]

        # Medicine / Doctor
        if any(w in words for w in ["doctor", "physician", "surgeon", "medicine", "medical", "pediatrician", "cardiologist", "oncologist", "neurosurgeon"]):
            return CURATED_ROADMAPS["medical_doctor"]

        key = self.normalize_key(profession)
        return CURATED_ROADMAPS.get(key)

    def find_domain_archetype(self, profession: str) -> Optional[Dict[str, Any]]:
        """Identifies domain archetype for unlisted professions (e.g. nurse, mechanical engineer, chef, accountant)."""
        words = set(re.findall(r"\b[a-z0-9]+\b", profession.lower()))
        for domain_name, archetype in DOMAIN_ARCHETYPES.items():
            if any(kw in words for kw in archetype["keywords"]):
                return archetype
        return None

    def generate_dynamic_roadmap(
        self, profession: str, experience_level: str = "beginner"
    ) -> RoadmapResponse:
        """Synthesizes an intelligent, structured roadmap for any career path."""
        norm_title = profession.strip().title()

        # 1. Curated specific roadmap match
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

        clean_slug = self.normalize_key(profession)

        # 2. Domain Archetype Match (Healthcare, Engineering, Creative Arts, Finance, Trades)
        # 2. Domain Archetype Match (Healthcare, Engineering, Creative Arts, Finance, Trades)
        archetype = self.find_domain_archetype(profession)
        if archetype:
            stages: List[RoadmapStage] = []
            nodes: List[RoadmapNode] = []
            prev_node_id: Optional[str] = None

            for idx, (stage_title, weeks, desc, skills, project, resources) in enumerate(archetype["stages"], start=1):
                node_id_1 = f"{clean_slug}-stage-{idx}-core"
                category_1 = "essential" if idx in [1, 2, 5] else ("recommended" if idx == 3 else "specialization")

                node_1 = RoadmapNode(
                    id=node_id_1,
                    title=f"{stage_title}: Core Methods",
                    stage_index=idx,
                    category=category_1,
                    description=f"{desc} Tailored specifically to the daily professional demands of a modern {norm_title}.",
                    key_skills=skills[:2] if len(skills) >= 2 else skills,
                    project_challenge=f"[{norm_title} Core Milestone] {project}",
                    resources=resources,
                    prerequisites=[prev_node_id] if prev_node_id else [],
                )
                nodes.append(node_1)
                node_ids = [node_id_1]

                # Add a companion node for stages 1, 2, 3 to provide deep coverage (8 nodes total)
                if idx in [1, 2, 3]:
                    node_id_2 = f"{clean_slug}-stage-{idx}-applied"
                    category_2 = "recommended" if idx == 1 else ("essential" if idx == 2 else "specialization")
                    node_2 = RoadmapNode(
                        id=node_id_2,
                        title=f"{stage_title}: Hands-on Practice",
                        stage_index=idx,
                        category=category_2,
                        description=f"Applied operational execution and field mastery of {stage_title} for professional {norm_title}s.",
                        key_skills=skills[2:] if len(skills) > 2 else [f"{norm_title} Applied Practice"],
                        project_challenge=f"Hands-on execution challenge: Implement professional standard operating procedures for {stage_title}.",
                        resources=resources,
                        prerequisites=[node_id_1],
                    )
                    nodes.append(node_2)
                    node_ids.append(node_id_2)
                    prev_node_id = node_id_2
                else:
                    prev_node_id = node_id_1

                stages.append(
                    RoadmapStage(
                        stage_index=idx,
                        title=f"Stage {idx}: {stage_title}",
                        estimated_weeks=weeks,
                        node_ids=node_ids,
                    )
                )

            return RoadmapResponse(
                profession=norm_title,
                experience_level=experience_level,
                summary=f"Authentic, career-specific roadmap tailored for aspiring and practicing {norm_title}s, covering essential certifications, hands-on field projects, standard toolchains, and industry benchmarks.",
                salary_range=archetype.get("salary_range", "$70,000 - $140,000 / year"),
                estimated_months=8 if experience_level == "beginner" else 5,
                stages=stages,
                nodes=nodes,
            )

        # 3. Intelligent Generalized Synthesizer for arbitrary unlisted professions
        stages = [
            RoadmapStage(
                stage_index=1,
                title=f"Stage 1: Core Fundamentals & Prerequisite Knowledge",
                estimated_weeks=6,
                node_ids=[f"{clean_slug}-foundations", f"{clean_slug}-toolchain"],
            ),
            RoadmapStage(
                stage_index=2,
                title=f"Stage 2: Primary Toolkits, Software & Operational Standards",
                estimated_weeks=8,
                node_ids=[f"{clean_slug}-applied-skills", f"{clean_slug}-workflows"],
            ),
            RoadmapStage(
                stage_index=3,
                title=f"Stage 3: Advanced Methodologies & Real-World Execution",
                estimated_weeks=10,
                node_ids=[f"{clean_slug}-advanced-mastery", f"{clean_slug}-optimization"],
            ),
            RoadmapStage(
                stage_index=4,
                title=f"Stage 4: Flagship Proof-of-Work Portfolio Challenge",
                estimated_weeks=8,
                node_ids=[f"{clean_slug}-portfolio-capstone"],
            ),
            RoadmapStage(
                stage_index=5,
                title=f"Stage 5: Industry Licensure, Networking & Career Placement",
                estimated_weeks=4,
                node_ids=[f"{clean_slug}-career-launch"],
            ),
        ]

        nodes = [
            RoadmapNode(
                id=f"{clean_slug}-foundations",
                title=f"{norm_title} Foundational Principles & Core Science",
                stage_index=1,
                category="essential",
                description=f"Study the theoretical frameworks, safety regulations, and foundational domain knowledge governing professional {norm_title} practice.",
                key_skills=[f"{norm_title} Core Theory", "Industry Safety Protocols", "Domain Terminology", "Analytical Problem-Solving"],
                project_challenge=f"Draft a technical research breakdown analyzing the 3 most critical challenges confronting a modern {norm_title}.",
                resources=[f"{norm_title} Professional Association Handbook", f"Foundations of {norm_title} Practice"],
                prerequisites=[],
            ),
            RoadmapNode(
                id=f"{clean_slug}-toolchain",
                title=f"{norm_title} Standard Industry Toolchains & Setup",
                stage_index=1,
                category="essential",
                description=f"Configure and master the specialized hardware, software, and operational suites used by senior {norm_title}s.",
                key_skills=[f"Primary {norm_title} Tooling", "Diagnostic Software", "Workflow Optimization", "Quality Assurance"],
                project_challenge=f"Configure and benchmark an industry-standard workspace tailored specifically for {norm_title} deliverables.",
                resources=[f"Standard {norm_title} Equipment Operation Manual", "Professional Workflow Best Practices"],
                prerequisites=[f"{clean_slug}-foundations"],
            ),
            RoadmapNode(
                id=f"{clean_slug}-applied-skills",
                title=f"Hands-On Operational Execution for {norm_title}s",
                stage_index=2,
                category="essential",
                description=f"Execute standard operating procedures and day-to-day deliverables expected of a practicing {norm_title}.",
                key_skills=["Hands-on Execution", "Standard Operating Procedures", "Quality Control", "Error Remediation"],
                project_challenge=f"Build and ship a self-contained deliverable demonstrating practical proficiency in {norm_title}.",
                resources=[f"Practical {norm_title} Field Handbook", "Interactive Guided Tutorials"],
                prerequisites=[f"{clean_slug}-toolchain"],
            ),
            RoadmapNode(
                id=f"{clean_slug}-workflows",
                title=f"Team Workflows & Industry Compliance",
                stage_index=2,
                category="recommended",
                description=f"Master cross-functional coordination, safety standards, documentation, and stakeholder communications in {norm_title}.",
                key_skills=["Team Collaboration", "Documentation Protocols", "Safety Compliance", "Stakeholder Alignment"],
                project_challenge="Create a standardized operational checklist and technical spec for a multi-disciplinary team project.",
                resources=["Operational Team Playbook", "Technical Documentation Standards"],
                prerequisites=[f"{clean_slug}-applied-skills"],
            ),
            RoadmapNode(
                id=f"{clean_slug}-advanced-mastery",
                title=f"Advanced Problem Solving & Specializations in {norm_title}",
                stage_index=3,
                category="specialization",
                description=f"Handle high-complexity scenarios, edge-case troubleshooting, and risk management in {norm_title}.",
                key_skills=["Advanced Diagnostic Analysis", "Risk Assessment", "Edge-Case Remediation", "System Resilience"],
                project_challenge=f"Resolve a simulated critical failure scenario representing high-stakes pressure in a {norm_title} role.",
                resources=[f"Case Studies in Advanced {norm_title}", "Industry Incident Post-Mortem Reviews"],
                prerequisites=[f"{clean_slug}-applied-skills"],
            ),
            RoadmapNode(
                id=f"{clean_slug}-optimization",
                title=f"Performance Optimization & Cost Efficiency",
                stage_index=3,
                category="recommended",
                description=f"Optimize throughput, cost efficiency, safety compliance, and latency for high-stakes {norm_title} deliverables.",
                key_skills=["Efficiency Optimization", "Auditing & Compliance", "Metrics & Telemetry", "Risk Mitigation"],
                project_challenge="Conduct a comprehensive performance audit and implement refactors producing measurable 30%+ improvements.",
                resources=["Optimization Principles & Auditing Guide", "Security & Reliability Best Practices"],
                prerequisites=[f"{clean_slug}-advanced-mastery"],
            ),
            RoadmapNode(
                id=f"{clean_slug}-portfolio-capstone",
                title=f"Flagship Capstone Proof-of-Work Project",
                stage_index=4,
                category="essential",
                description=f"Design, execute, and document an end-to-end flagship project showcasing your practical mastery as a {norm_title} to hiring managers.",
                key_skills=["End-to-End Execution", "Flagship Artifact Creation", "Technical Documentation", "Client / Peer Review"],
                project_challenge=f"Deliver a peer-reviewable, publicly demonstrable flagship portfolio project that demonstrates your capability as a {norm_title}.",
                resources=[f"Portfolio Design Guide for {norm_title}s", "Showcase & Presentation Strategies"],
                prerequisites=[f"{clean_slug}-advanced-mastery"],
            ),
            RoadmapNode(
                id=f"{clean_slug}-career-launch",
                title=f"Licensing, Professional Accreditation & Interview Mastery",
                stage_index=5,
                category="essential",
                description=f"Pass relevant board examinations or professional certifications, master technical case interviews, and launch your career as a {norm_title}.",
                key_skills=["Technical Interview Defense", "Board / Industry Accreditations", "Salary Negotiation", "Professional Ethics"],
                project_challenge=f"Pass a comprehensive technical mock interview and defend your capstone artifact in front of senior practitioners.",
                resources=[f"{norm_title} Licensing & Certification Standards", f"{norm_title} Interview Masterclass"],
                prerequisites=[f"{clean_slug}-portfolio-capstone"],
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
