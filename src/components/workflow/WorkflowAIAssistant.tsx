"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, MessageSquare, Wand2, Sparkles } from 'lucide-react';
import { EnhancedWorkflowBuilder } from './EnhancedWorkflowBuilder';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'email' | 'sms' | 'wait' | 'condition' | 'social' | 'lead_capture' | 'crm_action';
  title: string;
  description: string;
  config: any;
  position: { x: number; y: number };
  connections: string[];
}

interface WorkflowAIAssistantProps {
  onWorkflowGenerated: (nodes: WorkflowNode[]) => void;
  existingNodes?: WorkflowNode[];
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  showIcon?: boolean;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function WorkflowAIAssistant({
  onWorkflowGenerated,
  existingNodes = [],
  buttonText = "Ask AI to Setup Workflow",
  buttonVariant = "default",
  showIcon = true,
  size = "default",
  className = ""
}: WorkflowAIAssistantProps) {
  const [isAIBuilderOpen, setIsAIBuilderOpen] = useState(false);

  const handleOpenAI = () => {
    setIsAIBuilderOpen(true);
  };

  const handleCloseAI = () => {
    setIsAIBuilderOpen(false);
  };

  const handleWorkflowGenerated = (nodes: WorkflowNode[]) => {
    onWorkflowGenerated(nodes);
    setIsAIBuilderOpen(false);
  };

  return (
    <>
      <Button
        variant={buttonVariant}
        size={size}
        onClick={handleOpenAI}
        className={`${
          buttonVariant === 'default' 
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
            : ''
        } ${className}`}
      >
        {showIcon && (
          <div className="flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            <Bot className="w-4 h-4 mr-2" />
          </div>
        )}
        {buttonText}
      </Button>

      <EnhancedWorkflowBuilder
        isVisible={isAIBuilderOpen}
        onClose={handleCloseAI}
        onWorkflowGenerated={handleWorkflowGenerated}
        existingNodes={existingNodes}
      />
    </>
  );
}

// Alternative compact button for tight spaces
export function WorkflowAIButton({
  onWorkflowGenerated,
  existingNodes = [],
}: {
  onWorkflowGenerated: (nodes: WorkflowNode[]) => void;
  existingNodes?: WorkflowNode[];
}) {
  return (
    <WorkflowAIAssistant
      onWorkflowGenerated={onWorkflowGenerated}
      existingNodes={existingNodes}
      buttonText="AI Setup"
      buttonVariant="outline"
      size="sm"
      className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
    />
  );
}

// Large prominent button for main workflow pages
export function WorkflowAIHero({
  onWorkflowGenerated,
  existingNodes = [],
}: {
  onWorkflowGenerated: (nodes: WorkflowNode[]) => void;
  existingNodes?: WorkflowNode[];
}) {
  return (
    <WorkflowAIAssistant
      onWorkflowGenerated={onWorkflowGenerated}
      existingNodes={existingNodes}
      buttonText="Want to Ask AI to Setup Your Workflow?"
      size="lg"
      className="text-lg px-8 py-4"
    />
  );
}

// Chat-style button for existing chat interfaces
export function WorkflowAIChat({
  onWorkflowGenerated,
  existingNodes = [],
}: {
  onWorkflowGenerated: (nodes: WorkflowNode[]) => void;
  existingNodes?: WorkflowNode[];
}) {
  return (
    <WorkflowAIAssistant
      onWorkflowGenerated={onWorkflowGenerated}
      existingNodes={existingNodes}
      buttonText="Setup Workflow with AI"
      buttonVariant="ghost"
      showIcon={true}
      className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
    />
  );
}