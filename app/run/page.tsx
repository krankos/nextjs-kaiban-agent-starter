"use client";

import React, { useState, useEffect } from "react";
import { FaRegPaperPlane, FaSpinner } from "react-icons/fa";
import MDEditor from '@uiw/react-md-editor'

interface Run {
  id: number;
  topic: string;
  status: string;
  output: string;
  createdAt: string;
}

export default function AgentPage() {
  const [topic, setTopic] = useState("");
  const [blogPost, setBlogPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [runId, setRunId] = useState<number | null>(null);

  useEffect(() => {
    // Load recent runs
    fetch('/api/runs')
      .then(res => res.json())
      .then(data => setRuns(data.runs));
  }, []);

  const generateBlogPost = async () => {
    if (!topic) {
      alert("Please enter a topic");
      return;
    }

    setIsLoading(true);
    setError(null);
    setBlogPost("");

    try {
      const response = await fetch(
        `/api/agents?topic=${encodeURIComponent(topic)}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        console.log(data);
        setBlogPost(data.output.result);
        setRunId(data.runId);
      }
    } catch (error) {
      console.error("Error generating blog post:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const RunHistory = () => (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-[#2c2c2c]">Previous Runs</h3>
      <div className="space-y-4">
        {runs && runs.map(run => (
          <div key={run.id} className="p-6 bg-white rounded-lg border-2 border-[#2c2c2c]">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-[#2c2c2c]">{run.topic}</h4>
              <span className={`px-3 py-1 text-sm rounded-full border ${
                run.status === 'FINISHED' ? 'bg-green-100 text-green-800 border-green-800' : 
                run.status === 'RUNNING' ? 'bg-blue-100 text-blue-800 border-blue-800' : 'bg-red-100 text-red-800 border-red-800'
              }`}>
                {run.status}
              </span>
            </div>
            <p className="text-sm text-[#2c2c2c] mt-2">
              {new Date(run.createdAt).toLocaleString()}
            </p>
            <button
              onClick={() => {
                setBlogPost(typeof run.output === 'string' ? run.output : JSON.stringify(run.output));
                fetch(`/api/runs/${run.id}`)
                  .then(res => res.json())
              }}
              className="mt-2 text-sm text-[#2c2c2c] hover:text-[#404040] font-medium"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-16 bg-[#faf7f2] text-[#2c2c2c]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#2c2c2c]">
          Call Agent via API & History
        </h1>

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 border-2 border-[#2c2c2c]">
            <div className="flex gap-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter a topic... E.g. 'AI News Sep, 2024'"
                  className="w-full px-4 py-2 border-2 border-[#2c2c2c] rounded-md focus:ring-0 focus:border-[#2c2c2c] outline-none bg-[#faf7f2]"
                  onKeyPress={(e) => e.key === "Enter" && generateBlogPost()}
                />
              </div>
              <button
                onClick={generateBlogPost}
                disabled={isLoading}
                className={`px-6 py-2 rounded-md flex items-center gap-2 transition-colors border-2 ${
                  isLoading
                    ? "bg-[#faf7f2] text-[#2c2c2c] cursor-not-allowed border-[#2c2c2c]"
                    : "bg-[#2c2c2c] hover:bg-[#404040] text-white border-[#2c2c2c]"
                }`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <FaRegPaperPlane /> Generate
                  </>
                )}
              </button>
            </div>

            {isLoading && (
              <div className="text-center py-4">
                <FaSpinner className="animate-spin mx-auto text-[#2c2c2c]" />
                <p className="mt-2 text-[#2c2c2c]">Generating blog post...</p>
              </div>
            )}

            {error && (
              <div className="text-red-800 mb-4 p-4 bg-red-100 rounded-md border border-red-800">
                {error}
              </div>
            )}
          </div>

          {blogPost && (
            <div className="mt-8 bg-white rounded-lg p-6 border-2 border-[#2c2c2c]">
              <h2 className="text-2xl font-bold mb-4 text-[#2c2c2c]">Generated Blog Post</h2>
              <div data-color-mode="light">
                <MDEditor.Markdown 
                  source={blogPost} 
                />
              </div>
            </div>
          )}

          <RunHistory />
        </div>
      </div>
    </div>
  );
} 