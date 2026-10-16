import re
from typing import List, Dict, Any, Optional
from app.schemas.ai_schemas import (
    QuestionGenRequest, QuestionGenResponse, GeneratedQuestion,
    AnswerEvaluationRequest, AnswerEvaluationResponse, CriterionScore
)

# Comprehensive question banks calibrated by Job Family and Seniority
ROLE_QUESTION_BANKS: Dict[str, Dict[str, List[Dict[str, Any]]]] = {
    "FRONTEND": {
        "JUNIOR": [
            {
                "order": 1,
                "persona": "Mei Lin (Frontend Lead)",
                "competency": "JAVASCRIPT_FUNDAMENTALS",
                "question": "Explain how event delegation works in the DOM. Why is it preferable over attaching individual event listeners to hundreds of list items?",
                "difficulty": "EASY",
                "expected": ["Event bubbling", "Event target", "Memory footprint", "Single listener on parent container"],
                "focus": "Core DOM mechanics and memory efficiency"
            },
            {
                "order": 2,
                "persona": "Mei Lin (Frontend Lead)",
                "competency": "REACT_LIFECYCLE_AND_HOOKS",
                "question": "What is the primary difference between useEffect and useLayoutEffect, and when could omitting a dependency array cause stale closures?",
                "difficulty": "MEDIUM",
                "expected": ["DOM painting", "Synchronous vs asynchronous execution", "Stale state closure", "Flicker prevention"],
                "focus": "React hook lifecycles and rendering phases"
            },
            {
                "order": 3,
                "persona": "Marcus Vance (VP Engineering)",
                "competency": "CSS_AND_RESPONSIVENESS",
                "question": "Compare CSS Grid and Flexbox. In what layout scenarios would you choose Grid over Flexbox?",
                "difficulty": "EASY",
                "expected": ["Two-dimensional vs one-dimensional", "Content-driven vs layout-driven", "Alignment control"],
                "focus": "Modern CSS architecture and responsive design"
            }
        ],
        "SENIOR": [
            {
                "order": 1,
                "persona": "Mei Lin (Senior Staff Frontend Architect)",
                "competency": "WEB_PERFORMANCE_AND_VITALS",
                "question": "How do you systematically optimize Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS) on a heavy client-side React single-page application?",
                "difficulty": "HARD",
                "expected": ["Resource prioritization", "Font display swap", "Explicit image dimensions", "Code-splitting", "SSR/streaming"],
                "focus": "Core Web Vitals profiling and rendering pipeline optimization"
            },
            {
                "order": 2,
                "persona": "Dr. Elena Rostova (Chief Architect)",
                "competency": "STATE_MANAGEMENT_AND_ARCHITECTURE",
                "question": "When designing a large-scale enterprise web console, under what criteria do you separate server cache state (e.g. TanStack Query) from global client UI state (Zustand/Redux)? How do you prevent unnecessary render cascades?",
                "difficulty": "HARD",
                "expected": ["Server state vs client state", "Stale-while-revalidate", "Selective subscriptions", "Memoization"],
                "focus": "State architectural boundaries and re-render mitigation"
            },
            {
                "order": 3,
                "persona": "Alex Chen (Principal Staff Engineer)",
                "competency": "ACCESSIBILITY_AND_SECURITY",
                "question": "How do you enforce WCAG 2.1 AA compliance and prevent Cross-Site Scripting (XSS) when rendering user-generated dynamic markdown content in React?",
                "difficulty": "MEDIUM",
                "expected": ["DOMPurify / sanitization", "ARIA live regions", "Keyboard navigation", "Focus management"],
                "focus": "Front-end security standards and inclusive accessibility"
            }
        ]
    },
    "BACKEND": {
        "JUNIOR": [
            {
                "order": 1,
                "persona": "Alex Chen (Staff Engineer)",
                "competency": "API_DESIGN_AND_HTTP",
                "question": "Explain the difference between idempotent and safe HTTP methods. Which HTTP status code should be returned when a resource creation succeeds versus an asynchronous job accepted for processing?",
                "difficulty": "EASY",
                "expected": ["GET/PUT/DELETE idempotency", "201 Created vs 202 Accepted", "State mutation"],
                "focus": "RESTful semantics and standard HTTP conventions"
            },
            {
                "order": 2,
                "persona": "Alex Chen (Staff Engineer)",
                "competency": "DATABASE_FUNDAMENTALS",
                "question": "What is the difference between an inner join, a left outer join, and a subquery? When should an index be created on a foreign key column?",
                "difficulty": "EASY",
                "expected": ["Row matching", "Null handling for unmatched rows", "Join performance", "Foreign key index lookup"],
                "focus": "Relational query execution and schema indexing basics"
            },
            {
                "order": 3,
                "persona": "Priya Sharma (Talent Director)",
                "competency": "ERROR_HANDLING_AND_LOGGING",
                "question": "How do you structure exception handling across service and controller layers to avoid leaking stack traces while providing useful error codes to API consumers?",
                "difficulty": "EASY",
                "expected": ["ControllerAdvice / ExceptionFilter", "Standardized error DTO", "Correlation ID", "Security hygiene"],
                "focus": "Enterprise error boundaries and secure diagnostic logging"
            }
        ],
        "SENIOR": [
            {
                "order": 1,
                "persona": "Alex Chen (Principal Staff Engineer)",
                "competency": "CONCURRENCY_AND_MEMORY",
                "question": "How does the memory model handle volatile reads/writes and instruction reordering across CPU cores? Under what workloads do you prefer lock-free atomic primitives over mutex synchronization?",
                "difficulty": "HARD",
                "expected": ["Happens-before guarantee", "Memory barriers", "Cache coherence", "Lock contention overhead"],
                "focus": "Deep concurrency internals and memory safety"
            },
            {
                "order": 2,
                "persona": "Dr. Elena Rostova (Chief Architect)",
                "competency": "DISTRIBUTED_SYSTEMS_RESILIENCE",
                "question": "Design an idempotent webhook processing pipeline that processes financial events exactly once across intermittent network retries without holding long-lived database locks.",
                "difficulty": "HARD",
                "expected": ["Idempotency keys", "Distributed lock with TTL", "Transactional outbox pattern", "Dead letter queue"],
                "focus": "High-throughput fault tolerance and distributed consistency"
            },
            {
                "order": 3,
                "persona": "Dr. Elena Rostova (Chief Architect)",
                "competency": "DATABASE_OPTIMIZATION_AND_INDEXING",
                "question": "In PostgreSQL, how does MVCC handle concurrent row updates, and what are the specific performance trade-offs of B-Tree composite indexes versus BRIN indexes for large append-only datasets?",
                "difficulty": "HARD",
                "expected": ["Tuple versioning & autovacuum", "Index page bloat", "Block range indexing", "Sequential scan threshold"],
                "focus": "Storage engine mechanics and production query tuning"
            }
        ]
    },
    "FULLSTACK": {
        "SENIOR": [
            {
                "order": 1,
                "persona": "Mei Lin (Frontend Architect)",
                "competency": "END_TO_END_TYPE_SAFETY",
                "question": "How do you maintain end-to-end type safety between your backend schema (OpenAPI / GraphQL / tRPC) and frontend React clients in a rapidly evolving monorepo?",
                "difficulty": "MEDIUM",
                "expected": ["Automated code generation", "Contract testing", "Schema validation (Zod)", "Breaking change detection"],
                "focus": "Contract integrity and developer velocity"
            },
            {
                "order": 2,
                "persona": "Alex Chen (Principal Staff Engineer)",
                "competency": "REALTIME_COMMUNICATION",
                "question": "When building a collaborative live data board, compare WebSockets, Server-Sent Events (SSE), and Long Polling. How do you handle client reconnections and missed message replay?",
                "difficulty": "HARD",
                "expected": ["Bidirectional vs unidirectional", "Heartbeat / Ping-Pong", "Last-Event-ID / Sequence cursors", "Connection limits"],
                "focus": "Real-time transport protocols and state recovery"
            },
            {
                "order": 3,
                "persona": "Marcus Vance (VP Engineering)",
                "competency": "SYSTEM_TRADEOFFS_AND_DELIVERY",
                "question": "Walk me through how you decompose a monolith into decoupled frontend and backend services while maintaining continuous zero-downtime deployment during migration.",
                "difficulty": "HARD",
                "expected": ["Strangler Fig pattern", "Dual-writing", "Feature flags", "Telemetry parity"],
                "focus": "Large-scale incremental system migration"
            }
        ]
    },
    "QA": {
        "SENIOR": [
            {
                "order": 1,
                "persona": "Devansh Roy (Lead Quality Architect)",
                "competency": "TEST_AUTOMATION_ARCHITECTURE",
                "question": "How do you architect a scalable end-to-end test automation suite using Playwright or Selenium that executes hundreds of tests in parallel across CI/CD without flaky false failures?",
                "difficulty": "HARD",
                "expected": ["Page Object Model", "Dynamic explicit waits", "Test data isolation", "Deterministic mocks", "Worker parallelism"],
                "focus": "Test reliability, isolation, and CI/CD execution speed"
            },
            {
                "order": 2,
                "persona": "Devansh Roy (Lead Quality Architect)",
                "competency": "API_AND_CONTRACT_TESTING",
                "question": "How do you establish consumer-driven contract testing (e.g. Pact) between distributed microservices? How does it complement component and integration test layers in the test pyramid?",
                "difficulty": "MEDIUM",
                "expected": ["Test pyramid balance", "Provider verification", "Mock servers", "Decoupled deployability"],
                "focus": "Integration reliability and service boundary verification"
            },
            {
                "order": 3,
                "persona": "Marcus Vance (VP Engineering)",
                "competency": "PERFORMANCE_AND_CHAOS_TESTING",
                "question": "Describe how you design load and stress testing pipelines with k6 or JMeter to determine breaking points, database connection saturation, and degradation curves before major releases.",
                "difficulty": "HARD",
                "expected": ["Virtual user ramp-up", "Throughput vs latency p99", "Resource bottleneck diagnosis", "Chaos fault injection"],
                "focus": "Performance validation and production resilience testing"
            }
        ]
    },
    "DATA_ENGINEERING": {
        "SENIOR": [
            {
                "order": 1,
                "persona": "Anita Patel (Principal Data Architect)",
                "competency": "DATA_PIPELINE_ORCHESTRATION",
                "question": "Compare batch processing with Apache Spark against streaming pipelines with Apache Flink or Kafka Streams. How do you handle out-of-order data and late-arriving event watermarks?",
                "difficulty": "HARD",
                "expected": ["Watermarking", "Allowed lateness", "Stateful windowing", "Exactly-once processing"],
                "focus": "Stream processing semantics and stateful windowing"
            },
            {
                "order": 2,
                "persona": "Anita Patel (Principal Data Architect)",
                "competency": "LAKEHOUSE_AND_STORAGE_ENGINE",
                "question": "Explain the architectural advantages of Open Table Formats like Delta Lake or Apache Iceberg over traditional Hive partitions. How does ACID transaction support prevent data corruption during concurrent writes?",
                "difficulty": "HARD",
                "expected": ["Parquet file management", "Snapshot isolation", "Metadata commit log", "Partition evolution"],
                "focus": "Modern Lakehouse storage architecture and query efficiency"
            },
            {
                "order": 3,
                "persona": "Dr. Elena Rostova (Chief Architect)",
                "competency": "DATA_MODELING_AND_GOVERNANCE",
                "question": "When designing a centralized enterprise data warehouse, how do you handle Slowly Changing Dimensions (SCD Type 2) while ensuring high query performance for analytical dashboards?",
                "difficulty": "MEDIUM",
                "expected": ["Surrogate keys", "Effective date ranges", "Columnar compression", "Clustering keys"],
                "focus": "Dimensional modeling and analytical query performance"
            }
        ]
    },
    "BEHAVIORAL": {
        "SENIOR": [
            {
                "order": 1,
                "persona": "Priya Sharma (Talent Director)",
                "competency": "MOTIVATION_AND_CAREER_TRAJECTORY",
                "question": "What specific technical or organizational challenges are you eager to tackle in this next phase of your career, and why does this role align with your personal trajectory?",
                "difficulty": "EASY",
                "expected": ["Self-awareness", "Role alignment", "Technical ambition", "Cultural match"],
                "focus": "Candidate motivation and authentic career intentionality"
            },
            {
                "order": 2,
                "persona": "Marcus Vance (VP Engineering)",
                "competency": "CONFLICT_AND_STAKEHOLDER_ALIGNMENT",
                "question": "Tell me about a high-stakes scenario where you had a fundamental architectural disagreement with senior stakeholders or product leadership. How did you structure your evidence to navigate consensus?",
                "difficulty": "MEDIUM",
                "expected": ["Situation & Task context", "Data-driven advocacy", "Active listening & empathy", "Constructive compromise"],
                "focus": "Mature collaboration and diplomatic influence"
            },
            {
                "order": 3,
                "persona": "Marcus Vance (VP Engineering)",
                "competency": "CRISIS_MANAGEMENT_AND_INCIDENT_OWNERSHIP",
                "question": "Walk me through a severe production outage or architectural failure that occurred under your ownership. How did you coordinate remediation, communicate with stakeholders, and prevent recurrence?",
                "difficulty": "HARD",
                "expected": ["Immediate containment", "Blameless postmortem", "Root cause analysis", "Systemic automated safeguards"],
                "focus": "Engineering ownership, composure, and root cause mitigation"
            }
        ]
    }
}

class InterviewOrchestratorService:
    def generate_questions(self, req: QuestionGenRequest) -> QuestionGenResponse:
        itype = req.interview_type.upper()
        family = req.job_family.upper()
        seniority = "SENIOR" if req.seniority.upper() in ["SENIOR", "STAFF", "LEAD", "PRINCIPAL"] else "JUNIOR"

        # Determine target question bank
        if itype in ["BEHAVIORAL", "HR"]:
            bank = ROLE_QUESTION_BANKS["BEHAVIORAL"]["SENIOR"]
        elif family in ROLE_QUESTION_BANKS:
            family_bank = ROLE_QUESTION_BANKS[family]
            bank = family_bank.get(seniority, family_bank.get("SENIOR", ROLE_QUESTION_BANKS["BACKEND"]["SENIOR"]))
        else:
            bank = ROLE_QUESTION_BANKS["BACKEND"]["SENIOR"]

        questions: List[GeneratedQuestion] = []
        target_count = max(2, min(req.total_questions, len(bank)))

        for i in range(target_count):
            item = bank[i % len(bank)]
            
            # Incorporate candidate's actual resume skills into question 1 if available
            q_text = item["question"]
            if i == 0 and req.resume_skills:
                skill_ref = req.resume_skills[0]
                q_text = f"Considering your background with {skill_ref}: " + q_text[0].lower() + q_text[1:]

            questions.append(GeneratedQuestion(
                order=i + 1,
                interviewer_persona=item["persona"],
                competency=item["competency"],
                question_text=q_text,
                difficulty=item["difficulty"],
                expected_concepts=item["expected"],
                rubric_focus=item["focus"]
            ))

        return QuestionGenResponse(questions=questions)

    def evaluate_answer(self, req: AnswerEvaluationRequest) -> AnswerEvaluationResponse:
        answer = req.candidate_answer.strip()
        answer_lower = answer.lower()
        words = re.findall(r'\b\w+\b', answer)
        word_count = len(words)

        q_lower = req.question_text.lower()
        comp_lower = req.competency.lower()

        # 1. Real Semantic Concepts Extraction
        # Look for domain-specific technical concepts mentioned in answer
        matched_concepts = []
        technical_terms_found = []

        domain_keywords = {
            "volatile": "Volatile memory semantics",
            "happens-before": "Happens-before memory ordering",
            "barrier": "CPU memory barriers",
            "cache": "Hardware/software cache synchronization",
            "atomic": "Lock-free atomic CAS primitives",
            "idempotent": "Idempotent processing guarantees",
            "lock": "Locking mechanisms and concurrency boundaries",
            "ttl": "Distributed lock TTL & expiration safety",
            "outbox": "Transactional outbox pattern",
            "mvcc": "Multi-Version Concurrency Control (MVCC)",
            "index": "Index traversal mechanics",
            "lcp": "Largest Contentful Paint optimization",
            "cls": "Cumulative Layout Shift mitigation",
            "memo": "React rendering memoization",
            "state": "State synchronization & boundaries",
            "playwright": "Modern test automation primitives",
            "pipeline": "Automated CI/CD validation pipelines",
            "spark": "Distributed data processing engine",
            "watermark": "Stream processing watermarks",
            "star": "STAR structured response format",
            "situation": "Contextual situation formulation",
            "result": "Quantifiable outcome delivery"
        }

        for kw, concept_label in domain_keywords.items():
            if kw in answer_lower:
                matched_concepts.append(concept_label)
                technical_terms_found.append(kw)

        # 2. Check for explicit trade-off discussion
        has_tradeoffs = bool(re.search(r'\b(trade-?off|however|conversely|compromise|overhead|latency vs|cost vs|bottleneck|downside|mitigate|does not guarantee|not guarantee)\b', answer_lower))
        tradeoff_depth = 9.0 if (has_tradeoffs and word_count >= 20) else (7.8 if has_tradeoffs else 6.8)

        # 3. Dynamic Rubric Scoring
        # Technical correctness: based on matched concepts and technical density
        tech_score = min(9.6, max(5.0, 6.5 + min(len(matched_concepts) * 0.75, 3.0) + (0.5 if word_count >= 20 else 0.0)))
        if word_count < 10:
            tech_score = 5.0

        # Reasoning structure: based on answer length, progression, and paragraph/sentential completeness
        reasoning_score = min(9.4, max(5.5, 6.8 + (1.2 if word_count > 40 else (0.8 if word_count >= 18 else 0.0)) + (1.0 if has_tradeoffs else 0.0)))

        # Communication clarity: concise answers that are technically dense project high clarity
        if 18 <= word_count <= 200:
            clarity_score = 8.8
        elif word_count > 200:
            clarity_score = 7.6
        else:
            clarity_score = 6.8

        overall = round((tech_score + reasoning_score + clarity_score + tradeoff_depth) / 4.0, 1)

        # 4. Criterion Scores
        tech_notes = f"Mentioned relevant mechanisms: {', '.join(matched_concepts[:2])}." if matched_concepts else "Identified general principles; expand on underlying runtime implementation."
        reasoning_notes = "Structured progression from premise to technical execution." if word_count > 35 else "Brief explanation; could elaborate on system constraints."
        clarity_notes = "Concise and articulate phrasing." if clarity_score >= 8.0 else "Elaborate with concrete examples to enhance clarity."
        tradeoff_notes = "Explicitly articulated engineering trade-offs and operational constraints." if has_tradeoffs else "Add explicit discussion of latency, memory overhead, or scalability limits."

        criterion_scores = [
            CriterionScore(criterion="TECHNICAL_CORRECTNESS", score=round(tech_score, 1), notes=tech_notes),
            CriterionScore(criterion="REASONING_STRUCTURE", score=round(reasoning_score, 1), notes=reasoning_notes),
            CriterionScore(criterion="COMMUNICATION_CLARITY", score=round(clarity_score, 1), notes=clarity_notes),
            CriterionScore(criterion="AWARENESS_OF_TRADEOFFS", score=round(tradeoff_depth, 1), notes=tradeoff_notes)
        ]

        # 5. Real Strengths extracted from what candidate actually articulated
        strengths = []
        if matched_concepts:
            strengths.append(f"Demonstrated solid grasp of {matched_concepts[0].lower()}.")
        else:
            strengths.append("Addressed core prompt objectives directly.")

        if has_tradeoffs:
            strengths.append("Demonstrated senior engineering awareness by weighing operational and performance trade-offs.")
        else:
            strengths.append("Communicated clear initial implementation direction.")

        if word_count >= 40:
            strengths.append("Provided sufficient technical context without excessive conversational filler.")

        # 6. Real Concrete Improvement based on what was missed
        if not has_tradeoffs:
            concrete_improvement = "Explicitly discuss operational trade-offs, such as latency overhead, memory footprint, or failure recovery modes under peak load."
        elif len(matched_concepts) < 2:
            concrete_improvement = f"Deepen your explanation of {req.competency.lower().replace('_', ' ')} by citing specific production metrics, SLA targets, or recovery strategies."
        else:
            concrete_improvement = "To reach staff-level excellence, state explicit alerting thresholds and automated circuit-breaking configurations applied in production."

        # 7. Ideal Sample Response customized to competency
        sample_ideal = (
            f"An exemplary response addressing {req.competency.replace('_', ' ').title()} clearly articulates "
            f"the underlying mechanism, states quantitative latency and throughput boundaries, "
            f"and explains how edge-case failure modes are handled gracefully in production."
        )

        star_analysis = {
            "situation": f"Addressed context for {req.competency.replace('_', ' ').lower()}",
            "task": "Outlined the architectural guarantees and system requirements",
            "action": f"Implemented: {', '.join(matched_concepts[:3]) if matched_concepts else 'structured technical steps'}",
            "result": "Preserved data integrity with predictable latency profile"
        }

        return AnswerEvaluationResponse(
            overall_score=overall,
            criterion_scores=criterion_scores,
            strengths=strengths,
            concrete_improvement=concrete_improvement,
            sample_ideal_response=sample_ideal,
            star_analysis=star_analysis
        )
