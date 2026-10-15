import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export const QuestionBankPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [expandedId, setExpandedId] = useState<string | null>("q-1");

  const questions = [
    {
      id: "q-1",
      category: "CONCURRENCY",
      difficulty: "HARD",
      title: "Java Memory Model & Volatile Semantics",
      questionText:
        "How does Spring's @Transactional annotation work internally via AOP proxies, and why does calling a transactional method from within the same class bypass transaction boundaries?",
      referenceAnswer:
        "Spring @Transactional creates a dynamic JDK or CGLIB proxy around the target bean. When a client calls a method through the proxy, the TransactionInterceptor opens or joins a database transaction. Intra-class calls (calling this.methodB() from methodA()) execute directly on the raw instance rather than the proxy wrapper, entirely bypassing the transaction advice. To resolve this, extract the logic into a separate service, inject self, or use AspectJ compile-time weaving.",
      keyPoints: [
        "Dynamic CGLIB vs JDK Interface proxies",
        "TransactionInterceptor around invocation",
        "Self-invocation bypass pitfall and workarounds",
      ],
    },
    {
      id: "q-2",
      category: "DISTRIBUTED_SYSTEMS",
      difficulty: "EXPERT",
      title: "Idempotent Payment Webhook Processing",
      questionText:
        "How do you design a high-throughput webhook receiver that guarantees exactly-once processing semantics without holding open database transactions during external calls?",
      referenceAnswer:
        "Use the Transactional Outbox pattern paired with an Idempotency Key cache. When a webhook arrives, compute a deterministic hash or extract the provider's idempotency key. In a lightweight Redis atomic check (SET key value NX EX 86400), verify if already handled. Persist the event into an incoming_events table in PostgreSQL with state PENDING. An asynchronous worker dequeues the record, invokes downstream systems, and marks it COMPLETED. If timeouts occur, subsequent webhook retries detect the completed status immediately without re-executing credit transfers.",
      keyPoints: [
        "Redis SETNX distributed lock with TTL",
        "Transactional Outbox pattern in PostgreSQL",
        "Decoupled asynchronous worker queue",
      ],
    },
    {
      id: "q-3",
      category: "DATABASE",
      difficulty: "MEDIUM",
      title: "PostgreSQL B+Tree Composite Index Column Ordering",
      questionText:
        "In PostgreSQL, if you have a composite index on (tenant_id, created_at, status), will a query filtering only on (status) use this index? What is an Index Skip Scan?",
      referenceAnswer:
        "Standard B+Trees navigate from the leftmost prefix. A query filtering only on the third column (status) cannot directly perform a B+Tree range lookup. PostgreSQL may fall back to a full table sequential scan or a Bitmap Index Scan across all leaf pages. An Index Skip Scan (loose index scan) can jump through distinct values of tenant_id and created_at to locate matching status values, but in vanilla PostgreSQL without loose index scan extensions, you should either place the high-cardinality leading column first or create a dedicated partial/composite index.",
      keyPoints: [
        "Leftmost prefix rule in B+Tree indexing",
        "Bitmap Index Scan vs Sequential Scan cost model",
        "Multi-column index selectivity optimization",
      ],
    },
    {
      id: "q-4",
      category: "BEHAVIORAL",
      difficulty: "MEDIUM",
      title: "Navigating Architectural Disagreements",
      questionText:
        "Describe a situation where you strongly disagreed with a peer's proposed technical architecture. How did you handle the debate and what was the outcome?",
      referenceAnswer:
        "Focus on objective data rather than opinion. I prepared a rapid proof-of-concept benchmarking both the peer's proposed distributed microservices solution and a modular monolith approach under expected 50,000 req/sec loads. The benchmarks demonstrated that network serialization latency in the microservices setup exceeded our 15ms p99 SLA. We aligned on the modular monolith with domain event publishing, delivering on schedule while preserving our performance targets.",
      keyPoints: [
        "Disagree and commit framework",
        "Objective benchmark data over subjective bias",
        "Collaborative alignment on business SLAs",
      ],
    },
  ];

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === "ALL" || q.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Curated Question Bank</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          50+ high-frequency technical and behavioral questions calibrated to Tier-1 engineering interview rubrics
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions by keyword (e.g. transactional, postgresql, cache)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Categories</option>
            <option value="CONCURRENCY">Concurrency & Memory</option>
            <option value="DISTRIBUTED_SYSTEMS">Distributed Systems</option>
            <option value="DATABASE">Database & Storage</option>
            <option value="BEHAVIORAL">Behavioral STAR</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const isExpanded = expandedId === q.id;
          return (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="w-full p-6 text-left flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase">
                      {q.category.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 uppercase">
                      {q.difficulty}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{q.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    "{q.questionText}"
                  </p>
                </div>

                <div className="pt-2 text-slate-400">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Collapsible Answer & Key Points */}
              {isExpanded && (
                <div className="p-6 border-t border-slate-100 bg-slate-50/40 space-y-4">
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Authoritative Reference Answer:
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200 font-sans">
                      {q.referenceAnswer}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h5 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Core Evaluation Points:
                    </h5>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {q.keyPoints.map((pt, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Link
                      to={`/app/interviews/new?prompt=${encodeURIComponent(q.title)}`}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
                    >
                      <span>Practice in AI Simulation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
