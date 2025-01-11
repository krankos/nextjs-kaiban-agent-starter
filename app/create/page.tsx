'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Users, Sparkles, CopyPlusIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CreatePage() {
  const router = useRouter()
  const [topic, setTopic] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [teamConfig, setTeamConfig] = useState(null)
  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      })

      if (!response.ok) {
        throw new Error('Failed to create team')
      }
      const data = await response.json()
      setTeamConfig(data)
    } catch (error) {
      console.error('Error creating team:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen p-16 bg-[#faf7f2] text-black">
      <Card className="max-w-7xl mx-auto border-4 bg-[#faf7f2] border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6" />
            <CardTitle className="text-2xl font-bold">Create AI Team</CardTitle>
          </div>
          <CardDescription className="text-base">
            Enter a topic to generate an AI team configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-lg font-bold">
                Topic
              </Label>
              <div className="relative">
                <Input
                  id="topic"
                  placeholder="e.g. Latest AI trends, Climate change research..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="pl-4 pr-10 py-6 text-lg border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255)]"
                />
                <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <Button 
              onClick={handleSubmit} 
              disabled={!topic || isLoading}
              className="w-full h-12 text-lg font-bold border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating...</span>
                </span>
              ) : (
                'Create Team'
              )}
            </Button>
            {teamConfig && (
              <div className="mt-4">
                <h3 className="text-lg font-bold">KaibanJS Team Configuration</h3>
                <pre className="border p-4 rounded-lg max-w-full text-wrap whitespace-pre-wrap">{JSON.stringify(teamConfig, null, 2)}</pre>
                <Button onClick={()=> navigator.clipboard.writeText(JSON.stringify(teamConfig, null, 2))} className='mt-2 w-full flex items-center justify-center bg-black text-white'><CopyPlusIcon className='w-4 h-w mr-2'/>Copy to clipboard</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
