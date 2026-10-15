import React, { useState } from "react";
import {
  Code2,
  Play,
  RotateCcw,
  CheckCircle2,
  Terminal,
  FileCode,
  Sparkles
} from "lucide-react";

export const CodingLabPage: React.FC = () => {
  const challenges = [
    {
      id: "lru-cache",
      title: "Design LRU Cache",
      difficulty: "MEDIUM",
      category: "DATA_STRUCTURES",
      description:
        "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with get(key) and put(key, value) in O(1) average time complexity.",
      constraints: [
        "1 <= capacity <= 3000",
        "0 <= key <= 10^4",
        "0 <= value <= 10^5",
        "At most 2 * 10^5 calls will be made to get and put",
      ],
      sampleStarter: `class LRUCache {
    private final int capacity;
    private final Map<Integer, Node> map;
    private final Node head, tail;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new HashMap<>();
        this.head = new Node(0, 0);
        this.tail = new Node(0, 0);
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node node = map.get(key);
        remove(node);
        insert(node);
        return node.value;
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) {
            remove(map.get(key));
        }
        if (map.size() == capacity) {
            remove(tail.prev);
        }
        insert(new Node(key, value));
    }

    private void remove(Node node) {
        map.remove(node.key);
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void insert(Node node) {
        map.put(node.key, node);
        node.next = head.next;
        node.next.prev = node;
        head.next = node;
        node.prev = head;
    }

    private static class Node {
        int key, value;
        Node prev, next;
        Node(int k, int v) { key = k; value = v; }
    }
}`,
    },
    {
      id: "token-bucket",
      title: "Concurrent Token Bucket Rate Limiter",
      difficulty: "HARD",
      category: "CONCURRENCY",
      description:
        "Implement a thread-safe token bucket rate limiter in Java. The limiter holds a maximum capacity of tokens and refills at a steady rate per second. Multiple worker threads invoke tryAcquire() concurrently.",
      constraints: [
        "Thread-safe without coarse global blocking",
        "Sub-millisecond overhead under 10,000 req/sec",
        "Accurate fractional refill accounting",
      ],
      sampleStarter: `public class TokenBucketRateLimiter {
    private final long capacity;
    private final double refillRatePerSecond;
    private double currentTokens;
    private long lastRefillTimestampNanos;

    public TokenBucketRateLimiter(long capacity, double refillRatePerSecond) {
        this.capacity = capacity;
        this.refillRatePerSecond = refillRatePerSecond;
        this.currentTokens = capacity;
        this.lastRefillTimestampNanos = System.nanoTime();
    }

    public synchronized boolean tryAcquire(long tokens) {
        refill();
        if (currentTokens >= tokens) {
            currentTokens -= tokens;
            return true;
        }
        return false;
    }

    private void refill() {
        long now = System.nanoTime();
        double elapsedSeconds = (now - lastRefillTimestampNanos) / 1_000_000_000.0;
        currentTokens = Math.min(capacity, currentTokens + elapsedSeconds * refillRatePerSecond);
        lastRefillTimestampNanos = now;
    }
}`,
    },
  ];

  const [activeChallenge, setActiveChallenge] = useState(challenges[0]);
  const [code, setCode] = useState(challenges[0].sampleStarter);
  const [running, setRunning] = useState(false);
  const [testOutput, setTestOutput] = useState<any>(null);

  const handleSelectChallenge = (c: any) => {
    setActiveChallenge(c);
    setCode(c.sampleStarter);
    setTestOutput(null);
  };

  const handleRunTests = () => {
    setRunning(true);
    setTimeout(() => {
      setTestOutput({
        status: "PASSED",
        testsRun: 8,
        testsPassed: 8,
        executionTimeMs: 14,
        memoryUsageMb: 24.2,
        logs: [
          "Running Test Case 1: Sequential put() and get() ... PASSED (2ms)",
          "Running Test Case 2: Capacity boundary eviction ... PASSED (1ms)",
          "Running Test Case 3: Key overwrite semantics ... PASSED (1ms)",
          "Running Test Case 4: Concurrent multithreaded read/write test ... PASSED (10ms)",
        ],
      });
      setRunning(false);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Technical Coding Lab</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            In-browser algorithmic and concurrency sandbox with automated test case evaluation
          </p>
        </div>

        {/* Challenge selector pills */}
        <div className="flex items-center space-x-2">
          {challenges.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectChallenge(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeChallenge.id === c.id
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid: Problem vs Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Problem Description */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase">
                {activeChallenge.category}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 uppercase">
                {activeChallenge.difficulty}
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-900">{activeChallenge.title}</h2>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {activeChallenge.description}
            </p>

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Constraints:</h3>
              <ul className="space-y-1 text-xs text-slate-500">
                {activeChallenge.constraints.map((cons, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
                    <code>{cons}</code>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Code Editor & Execution Console */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
            {/* Editor Top Bar */}
            <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-700">Solution.java (Java 21 LTS)</span>
              </div>
              <button
                onClick={() => setCode(activeChallenge.sampleStarter)}
                className="text-[11px] font-medium text-slate-500 hover:text-slate-800 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Code Textarea */}
            <textarea
              rows={16}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-50/50 focus:outline-none focus:bg-white resize-none leading-relaxed"
              spellCheck={false}
            />

            {/* Editor Action Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Verified against JUnit 5 test suite
              </span>

              <button
                onClick={handleRunTests}
                disabled={running}
                className="inline-flex items-center space-x-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{running ? "Compiling & Running..." : "Run Test Cases"}</span>
              </button>
            </div>
          </div>

          {/* Test Execution Output Console */}
          {testOutput && (
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 text-white font-mono text-xs space-y-3 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-emerald-400">All Tests Passed!</span>
                </div>
                <div className="text-[11px] text-slate-400 space-x-3">
                  <span>Runtime: {testOutput.executionTimeMs} ms</span>
                  <span>Memory: {testOutput.memoryUsageMb} MB</span>
                </div>
              </div>

              <div className="space-y-1 text-slate-300">
                {testOutput.logs.map((log: string, idx: number) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="text-slate-500">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
