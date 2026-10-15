import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  ArrowRight,
  ExternalLink,
  Shield,
  Layers,
  Code2,
  Users
} from "lucide-react";

export const CompanyPrepPage: React.FC = () => {
  const companies = [
    {
      slug: "stripe",
      name: "Stripe",
      logo: "S",
      industry: "Fintech & Payments Infrastructure",
      headquarters: "San Francisco & Dublin",
      rating: "Tier 1 Infrastructure",
      summary: "Global financial infrastructure platform known for exceptional engineering discipline, clean API design, and rigorous system design interviews.",
      rounds: [
        { name: "Recruiter Screen", time: "30 min", focus: "Background, motivation, and career trajectory" },
        { name: "Technical Integration & Debugging", time: "60 min", focus: "Live coding on realistic API integrations, reading unfamiliar codebases" },
        { name: "Distributed Systems Architecture", time: "60 min", focus: "Idempotency, payment ledgers, double-entry consistency, zero-downtime migrations" },
        { name: "System Design & Scale", time: "60 min", focus: "High-throughput messaging queues, Redis caching, partitioned PostgreSQL" },
        { name: "Hiring Manager / Values", time: "45 min", focus: "Operating principles, extreme ownership, communication clarity" },
      ],
      mustKnowConcepts: [
        "Idempotency keys and transactional outbox patterns",
        "Two-phase commit vs. Saga distributed transactions",
        "Zero-downtime database schema migration strategies",
        "HikariCP connection pool tuning under extreme write traffic",
      ],
    },
    {
      slug: "google",
      name: "Google",
      logo: "G",
      industry: "Cloud & Distributed Computing",
      headquarters: "Mountain View, CA",
      rating: "Tier 1 Hyperscale",
      summary: "Massive scale systems requiring deep understanding of algorithmic efficiency, Big-O trade-offs, Paxos consensus, and fault-tolerant distributed storage.",
      rounds: [
        { name: "Technical Phone Screen", time: "45 min", focus: "Data structures & algorithms (Google Docs or internal editor)" },
        { name: "Coding Round 1 (Algorithms)", time: "45 min", focus: "Graph traversals, dynamic programming, tree balancing" },
        { name: "Coding Round 2 (Concurrency)", time: "45 min", focus: "Multithreading, lock-free data structures, producer-consumer queues" },
        { name: "Large-Scale System Design", time: "45 min", focus: "Global scale (1B+ users), Spanner consensus, rate limiting, CDNs" },
        { name: "Googliness & Leadership", time: "45 min", focus: "Navigating ambiguity, collaborative disagreement, user empathy" },
      ],
      mustKnowConcepts: [
        "Paxos and Raft consensus protocols",
        "LSM-Trees vs. B+Trees for storage engines",
        "Consistent hashing and virtual nodes in distributed caching",
        "Java 21 Virtual Threads vs. Platform Thread memory footprints",
      ],
    },
    {
      slug: "netflix",
      name: "Netflix",
      logo: "N",
      industry: "Streaming & Cloud Native Microservices",
      headquarters: "Los Gatos, CA",
      rating: "Tier 1 Culture",
      summary: "Pioneers of chaos engineering, microservices orchestration, and 'Freedom & Responsibility' high-performance engineering culture.",
      rounds: [
        { name: "Screening Call", time: "30 min", focus: "Culture alignment and technical breadth" },
        { name: "Technical Deep-Dive", time: "60 min", focus: "Spring Cloud, event loops, resilience patterns (Circuit Breakers)" },
        { name: "Microservices Architecture", time: "60 min", focus: "Kafka event streaming, gRPC contract design, distributed tracing" },
        { name: "Culture & Philosophy Interview", time: "60 min", focus: "Stunning colleagues, candor, context not control" },
      ],
      mustKnowConcepts: [
        "Chaos Engineering and fault-injection testing",
        "Circuit breaker patterns and bulkhead isolation",
        "Event-driven CQRS with Apache Kafka",
        "Client-side load balancing and Envoy proxy mesh",
      ],
    },
  ];

  const [selectedCompany, setSelectedCompany] = useState(companies[0]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Company-Specific Interview Dossiers</h1>
        <p className="text-sm text-slate-500 mt-1">
          Deconstructed interview loops, verified technical focus areas, and targeted simulation engines
        </p>
      </div>

      {/* Company Selector Pills */}
      <div className="flex flex-wrap gap-3">
        {companies.map((c) => (
          <button
            key={c.slug}
            onClick={() => setSelectedCompany(c)}
            className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
              selectedCompany.slug === c.slug
                ? "bg-white border-blue-600 text-blue-700 shadow-xs ring-2 ring-blue-500/10"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${
              c.slug === "stripe" ? "bg-indigo-600 text-white" :
              c.slug === "google" ? "bg-red-500 text-white" : "bg-red-700 text-white"
            }`}>
              {c.logo}
            </div>
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {/* Company Overview & Blueprint */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Company Details & Launch CTA */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {selectedCompany.rating}
              </span>
              <span className="text-xs text-slate-400">{selectedCompany.headquarters}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900">{selectedCompany.name}</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedCompany.summary}
            </p>

            <div className="pt-2">
              <Link
                to={`/app/interviews/new?company=${selectedCompany.slug}`}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <span>Launch {selectedCompany.name} Mock Interview</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Must-Know Concepts */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Non-Negotiable Concepts
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              {selectedCompany.mustKnowConcepts.map((concept, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right 2 Columns: Interview Rounds Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Official Interview Loop Stages</h3>
            <span className="text-xs text-slate-500 font-medium">{selectedCompany.rounds.length} sequential rounds</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
            {selectedCompany.rounds.map((round, idx) => (
              <div key={idx} className="p-5 flex items-start space-x-4 hover:bg-slate-50/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-100">
                  {idx + 1}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900 text-sm">{round.name}</h4>
                    <span className="text-xs text-slate-400 flex items-center font-medium">
                      <Clock className="w-3 h-3 mr-1" />
                      {round.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-700">Evaluation focus:</strong> {round.focus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
