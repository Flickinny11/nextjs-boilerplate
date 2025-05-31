"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProjectPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/create">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Create New Project</h1>
            <p className="text-gray-400">Start with a blank canvas</p>
          </div>
        </div>

        <Card className="p-8 bg-black/50 backdrop-blur-lg border-gray-800 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">New Project Creator</h2>
          <p className="text-gray-400 mb-6">
            Create new projects from scratch with AI guidance.
            This feature will be available once you connect your creative accounts.
          </p>
          <Link href="/create/setup">
            <Button className="bg-green-600 hover:bg-green-700">
              Setup Integration
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}