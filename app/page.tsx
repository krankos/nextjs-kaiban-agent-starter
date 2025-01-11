"use client"

import { Key } from 'react';
import { blogTeam } from '@/lib/blogTeam';
import { useState } from "react";
import { TeamOutput } from '@/lib/types';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { WandIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import MDEditor from '@uiw/react-md-editor'


interface Stats {
  duration: number;
  totalTokenCount: number;
  totalCost: number;
}

interface FormData {
  topic: string;
}

export default function Home() {
  // Setting up State
  const [topic, setTopic] = useState('');
  const [blogPost, setBlogPost] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Connecting to the KaibanJS Store
  const useTeamStore = blogTeam.useStore();

  const {
    agents,
    tasks,
    teamWorkflowStatus
  } = useTeamStore((state: { agents: any; tasks: any; teamWorkflowStatus: any; }) => ({
    agents: state.agents,
    tasks: state.tasks,
    teamWorkflowStatus: state.teamWorkflowStatus
  }));

  const form = useForm<FormData>({
    defaultValues: {
      topic: ''
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    await generateBlogPost(data.topic);
    setIsLoading(false);
  };

  const generateBlogPost = async (topic: string) => {
    setBlogPost('');
    setStats(null);

    try {
      const output: TeamOutput = await blogTeam.start({ topic });
      if (output?.status === 'FINISHED' && output?.stats) {
        setBlogPost(output.result || '');

        const { costDetails, llmUsageStats, duration } = output.stats;
        setStats({
          duration: duration,
          totalTokenCount: llmUsageStats.inputTokens + llmUsageStats.outputTokens,
          totalCost: costDetails.totalCost
        });
      } else if (output?.status === 'BLOCKED') {
        console.log(`Workflow is blocked, unable to complete`);
      }
      console.log(output);
      console.log(output?.status);
    } catch (error) {
      console.error('Error generating blog post:', error);
    }
  };

  return (
    <div className="w-full min-h-screen p-16 bg-[#faf7f2] text-black">
      <h1 className="text-4xl font-bold text-center mb-8 text-[#2c2c2c]">AI Blogging Agent</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 border-2 border-[#2c2c2c]">
            <h2 className="text-xl font-semibold mb-4 text-[#2c2c2c]">Generate Blog Post</h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Label htmlFor="topic">Enter a topic...</Label>
              <Input
                {...form.register("topic")}
                placeholder="E.g. 'AI News Sep, 2024'"
                className="w-full bg-[#faf7f2]"
              />
              <Button 
                type="submit"
                className="w-full bg-[#2c2c2c] hover:bg-[#404040] text-white flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <WandIcon className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Generating...' : 'Generate'}
              </Button>
            </form>
          </div>
          
          {blogPost && (
              <div className="bg-white rounded-lg p-6 border-2 border-[#2c2c2c]">
              <div className="status mb-4">
                Status: <span className="font-semibold text-[#2c2c2c]">{teamWorkflowStatus}</span>
              </div>
              <div className="prose prose-slate max-w-none">
                {blogPost ? (
                  <MDEditor.Markdown 
                    source={blogPost} 
                  />
              ) : (
                <p className="text-gray-500 text-center text-sm">
                  <span className="block font-medium">No blog post available yet</span>
                  <span className="block text-sm">Enter a topic and click &apos;Generate&apos; to see results here.</span>
                </p>
              )}
            </div>
          </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 border-2 border-[#2c2c2c]">
            <h2 className="text-xl font-semibold mb-4 text-[#2c2c2c]">Micro Agents</h2>
            <ul className="space-y-3">
              {agents && agents.map((agent: { name: string; status: string; }, index: Key) => (
                <li 
                  key={index} 
                  className={`flex items-center justify-between p-3 bg-[#faf7f2] rounded-md border border-[#2c2c2c] transition-all duration-300 ${
                    agent.status === 'COMPLETED' ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Image 
                      src={`https://ui-avatars.com/api/name=${index}?background=2c2c2c&color=fff`}
                      alt={`${agent.name}'s avatar`}
                      className="w-10 h-10 rounded-full border border-[#2c2c2c]"
                      width={40}
                      height={40}
                    />
                    <span className={`font-medium ${agent.status === 'TASK_COMPLETED' ? 'line-through' : ''}`}>
                      {agent.name}
                    </span>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full border transition-colors duration-300 ${
                    agent.status === 'THINKING' ? 'bg-green-100 text-green-800 border-green-800' :
                    agent.status === 'TASK_COMPLETED' ? 'bg-gray-100 text-gray-800 border-gray-800' :
                    agent.status === 'INITIAL' ? 'bg-red-100 text-red-800 border-red-800' :
                    'bg-white text-[#2c2c2c] border-[#2c2c2c]'
                  }`}>
                    {agent.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 border-2 border-[#2c2c2c]">
            <h2 className="text-xl font-semibold mb-4 text-[#2c2c2c]">Tasks</h2>
            <ul className="space-y-3">
              {tasks && tasks.map((task: { description: string; status: string; }, index: Key) => (
                <li 
                  key={index} 
                  className={`flex items-center justify-between p-3 bg-[#faf7f2] rounded-md border border-[#2c2c2c] transition-all duration-300 ${
                    task.status === 'COMPLETED' ? 'opacity-50' : ''
                  }`}
                >
                  <span className={`font-medium ${task.status === 'COMPLETED' ? 'line-through' : ''}`}>
                    {task.description}
                  </span>
                  <span className={`px-3 py-1 text-sm rounded-full border transition-colors duration-300 ${
                    task.status === 'DOING' ? 'bg-green-100 text-green-800 border-green-800' :
                    task.status === 'DONE' ? 'bg-gray-100 text-gray-800 border-gray-800' :
                    task.status === 'TODO' ? 'bg-red-100 text-red-800 border-red-800' :
                    'bg-white text-[#2c2c2c] border-[#2c2c2c]'
                  }`}>
                    {task.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          { stats && (
            <div className="bg-white rounded-lg p-6 border-2 border-[#2c2c2c]">
              <h2 className="text-xl font-semibold mb-4 text-[#2c2c2c]">Stats</h2>
              {stats ? (
                <div className="space-y-3">
                <p className="flex justify-between items-center p-3 bg-[#faf7f2] rounded-md border border-[#2c2c2c]">
                  <span className="font-medium">Total Tokens:</span>
                  <span className="text-[#2c2c2c]">{stats.totalTokenCount}</span>
                </p>
                <p className="flex justify-between items-center p-3 bg-[#faf7f2] rounded-md border border-[#2c2c2c]">
                  <span className="font-medium">Total Cost:</span>
                  <span className="text-[#2c2c2c]">${stats.totalCost.toFixed(4)}</span>
                </p>
                <p className="flex justify-between items-center p-3 bg-[#faf7f2] rounded-md border border-[#2c2c2c]">
                  <span className="font-medium">Duration:</span>
                  <span className="text-[#2c2c2c]">{stats.duration} ms</span>
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">ℹ️ No stats generated yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
