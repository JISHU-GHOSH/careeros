"""Unit tests for Groq service integration and fallback logic."""

import pytest
from unittest.mock import MagicMock, patch
from app.groq_service import (
    generate_roadmap_with_groq,
    is_groq_configured,
    get_effective_groq_key,
)
from app.models import RoadmapResponse
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_groq_status_endpoint():
    """Verify /api/roadmap/status endpoint returns configuration state."""
    response = client.get("/api/roadmap/status")
    assert response.status_code == 200
    data = response.json()
    assert "groq_configured" in data
    assert "model" in data
    assert data["model"] == "llama-3.3-70b-versatile"
    assert "llama-3.3-70b-versatile" in data["supported_models"]


def test_effective_groq_key_precedence():
    """Verify request-level key overrides environment variable."""
    with patch.dict("os.environ", {"GROQ_API_KEY": "env_key_123"}):
        assert get_effective_groq_key("custom_key_456") == "custom_key_456"
        assert get_effective_groq_key(None) == "env_key_123"
        assert get_effective_groq_key("") == "env_key_123"


def test_groq_fallback_when_no_key():
    """Verify generate_roadmap_with_groq returns None safely when no key is set."""
    with patch.dict("os.environ", {}, clear=True):
        res = generate_roadmap_with_groq("Quantum Physicist", api_key=None)
        assert res is None


def test_groq_successful_synthesis_mock():
    """Verify valid Groq JSON response is parsed into RoadmapResponse correctly."""
    mock_groq_json = """{
      "profession": "Quantum Physicist",
      "experience_level": "beginner",
      "summary": "Master fundamental quantum mechanics, Hamiltonian systems, and quantum circuit computation.",
      "salary_range": "$95,000 - $185,000 / year",
      "estimated_months": 12,
      "stages": [
        {"stage_index": 1, "title": "Stage 1: Linear Algebra & Hilbert Spaces", "estimated_weeks": 8, "node_ids": ["qp-math-1", "qp-math-2"]},
        {"stage_index": 2, "title": "Stage 2: Schrodinger Dynamics & Wave Mechanics", "estimated_weeks": 10, "node_ids": ["qp-wave-1"]},
        {"stage_index": 3, "title": "Stage 3: Quantum Computing & Qiskit", "estimated_weeks": 8, "node_ids": ["qp-qiskit-1"]},
        {"stage_index": 4, "title": "Stage 4: Experimental Simulation Capstone", "estimated_weeks": 6, "node_ids": ["qp-capstone"]},
        {"stage_index": 5, "title": "Stage 5: Research Publication & Lab Defense", "estimated_weeks": 4, "node_ids": ["qp-defense"]}
      ],
      "nodes": [
        {
          "id": "qp-math-1",
          "title": "Complex Vector Spaces & Dirac Bra-Ket Notation",
          "stage_index": 1,
          "category": "essential",
          "description": "Learn state vectors, Hermitian operators, spectral decomposition, and unitary transformations.",
          "key_skills": ["Dirac Notation", "Hermitian Matrices", "Eigenvalues", "Hilbert Spaces"],
          "project_challenge": "Build a state-vector simulator in Python that calculates probability amplitudes.",
          "resources": ["Nielsen & Chuang - Quantum Computation", "MIT OpenCourseWare 8.04"],
          "prerequisites": []
        },
        {
          "id": "qp-math-2",
          "title": "Quantum Entanglement & Bell Inequalities",
          "stage_index": 1,
          "category": "essential",
          "description": "Understand EPR paradox, density matrices, and experimental violations of Bell inequalities.",
          "key_skills": ["Bell States", "Entanglement Entropy", "Density Matrices"],
          "project_challenge": "Simulate Clauser-Horne-Shimony-Holt (CHSH) inequality violation test.",
          "resources": ["Preskill Quantum Information Notes"],
          "prerequisites": ["qp-math-1"]
        },
        {
          "id": "qp-wave-1",
          "title": "Time-Dependent Schrodinger Equation Solvers",
          "stage_index": 2,
          "category": "essential",
          "description": "Numerical simulation of particle in a box and finite square potential barriers.",
          "key_skills": ["Schrodinger Equation", "Finite Difference Time Domain", "Quantum Tunneling"],
          "project_challenge": "Implement Crank-Nicolson numerical solver for 1D wave packet tunneling.",
          "resources": ["Griffiths Introduction to Quantum Mechanics"],
          "prerequisites": ["qp-math-1"]
        },
        {
          "id": "qp-qiskit-1",
          "title": "Quantum Algorithms with IBM Qiskit",
          "stage_index": 3,
          "category": "essential",
          "description": "Write quantum circuits for Deutsch-Jozsa, Grover search, and Shor's period finding.",
          "key_skills": ["Qiskit", "Quantum Gates", "Grover Algorithm", "Quantum Fourier Transform"],
          "project_challenge": "Execute a 3-qubit Grover search circuit on a real IBM Quantum cloud backend.",
          "resources": ["IBM Quantum Learning", "Qiskit Textbook"],
          "prerequisites": ["qp-wave-1"]
        },
        {
          "id": "qp-capstone",
          "title": "Variational Quantum Eigensolver (VQE) Project",
          "stage_index": 4,
          "category": "essential",
          "description": "Simulate ground state energy of molecular hydrogen (H2) using hybrid quantum-classical VQE.",
          "key_skills": ["VQE", "Ansatz Design", "Molecular Simulation", "COBYLA Optimizer"],
          "project_challenge": "Reproduce molecular dissociation energy curve for H2 within chemical accuracy.",
          "resources": ["VQE Paper (Peruzzo et al.)", "Qiskit Nature Tutorials"],
          "prerequisites": ["qp-qiskit-1"]
        },
        {
          "id": "qp-defense",
          "title": "Peer Review & Lab Defense",
          "stage_index": 5,
          "category": "essential",
          "description": "Defend quantum simulation results and prepare reproducible open-source Jupyter notebooks.",
          "key_skills": ["Technical Defense", "Reproducibility", "ArXiv Formatting"],
          "project_challenge": "Publish a reproducible GitHub repository with benchmarking and error mitigation docs.",
          "resources": ["APS Physical Review Guidelines"],
          "prerequisites": ["qp-capstone"]
        }
      ]
    }"""

    mock_completion = MagicMock()
    mock_completion.choices = [
        MagicMock(message=MagicMock(content=mock_groq_json))
    ]

    with patch("groq.Groq") as MockGroq:
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = mock_completion
        MockGroq.return_value = mock_client

        res = generate_roadmap_with_groq("Quantum Physicist", api_key="test_gsk_key")
        assert res is not None
        assert isinstance(res, RoadmapResponse)
        assert res.profession == "Quantum Physicist"
        assert len(res.nodes) == 6
        assert res.nodes[0].id == "qp-math-1"
        assert "Qiskit" in res.nodes[3].key_skills
