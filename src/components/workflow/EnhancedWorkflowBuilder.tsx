"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Bot, 
  Wand2, 
  Send, 
  Loader2,
  Sparkles,
  X,
  Check,
  ArrowRight,
  Zap,
  Plus,
  Eye
} from 'lucide-react';
import { openRouterService } from '@/lib/openRouterService';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'email' | 'sms' | 'wait' | 'condition' | 'social' | 'lead_capture' | 'crm_action';
  title: string;
  description: string;
  config: any;
  position: { x: number; y: number };
  connections: string[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface EnhancedWorkflowBuilderProps {
  onWorkflowGenerated: (nodes: WorkflowNode[]) => void;
  existingNodes?: WorkflowNode[];
  isVisible: boolean;
  onClose: () => void;
}

const QUICK_WORKFLOW_PROMPTS = [
  "Create a lead nurturing sequence for new subscribers",
  "Build an abandoned cart recovery workflow", 
  "Set up a welcome series for new customers",
  "Create a re-engagement campaign for inactive leads",
  "Build a product launch announcement workflow",
  "Set up birthday/anniversary email automation"
];

export function EnhancedWorkflowBuilder({ 
  onWorkflowGenerated, 
  existingNodes = [],
  isVisible, 
  onClose 
}: EnhancedWorkflowBuilderProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI workflow assistant. I can help you create powerful automation workflows by understanding your goals. What kind of workflow would you like to build?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<WorkflowNode[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsGenerating(true);

    // Add loading message
    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Create workflow generation prompt
      const workflowPrompt = `
        User Request: "${userMessage.content}"
        
        Existing Workflow Context: ${existingNodes.length > 0 ? JSON.stringify(existingNodes) : 'No existing workflow'}
        
        Create a detailed marketing automation workflow that addresses the user's request. 
        
        Generate a JSON response with the following structure:
        {
          "workflow": [
            {
              "id": "unique_id",
              "type": "trigger|email|sms|wait|condition|social|lead_capture|crm_action",
              "title": "Node Title",
              "description": "Detailed description of what this node does",
              "config": {
                "subject": "Email subject if applicable",
                "content": "Email/SMS content if applicable",
                "delay": "Wait time if applicable",
                "condition": "Condition logic if applicable"
              },
              "position": {"x": 0, "y": 0},
              "connections": ["id_of_connected_nodes"]
            }
          ],
          "explanation": "Brief explanation of how this workflow achieves the user's goal",
          "suggestions": ["Additional suggestions for improving the workflow"]
        }
        
        Make the workflow practical and actionable for a CaptureIT LS user.
      `;

      const response = await openRouterService.createChatCompletion([
        { role: "system", content: "You are an expert marketing automation consultant. Create detailed, practical workflows." },
        { role: "user", content: workflowPrompt }
      ], 'anthropic/claude-3.5-sonnet');

      // Remove loading message
      setMessages(prev => prev.filter(msg => !msg.isLoading));

      if (response.choices && response.choices[0]) {
        const aiResponse = response.choices[0].message.content;
        
        try {
          // Try to parse the JSON response
          const workflowData = JSON.parse(aiResponse);
          
          if (workflowData.workflow && Array.isArray(workflowData.workflow)) {
            // Position nodes automatically
            const positionedNodes = workflowData.workflow.map((node: any, index: number) => ({
              ...node,
              position: {
                x: 200 + (index % 3) * 300,
                y: 100 + Math.floor(index / 3) * 200
              }
            }));

            setGeneratedWorkflow(positionedNodes);
            setShowPreview(true);

            const assistantMessage: ChatMessage = {
              id: (Date.now() + 2).toString(),
              role: 'assistant',
              content: `I've created a workflow for you! ${workflowData.explanation || ''}\n\nThe workflow includes ${positionedNodes.length} steps. You can preview it below and make adjustments if needed.`,
              timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);

            if (workflowData.suggestions && workflowData.suggestions.length > 0) {
              const suggestionsMessage: ChatMessage = {
                id: (Date.now() + 3).toString(),
                role: 'assistant',
                content: `Additional suggestions:\n${workflowData.suggestions.map((s: string) => `• ${s}`).join('\n')}`,
                timestamp: new Date()
              };

              setMessages(prev => [...prev, suggestionsMessage]);
            }
          } else {
            throw new Error('Invalid workflow structure');
          }
        } catch (parseError) {
          // If JSON parsing fails, provide a helpful response
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date()
          };

          setMessages(prev => [...prev, assistantMessage]);
        }
      }
    } catch (error) {
      console.error('Error generating workflow:', error);
      
      // Remove loading message
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: "I apologize, but I encountered an error while generating your workflow. Please try again with a more specific description of what you'd like to automate.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  const handleApplyWorkflow = () => {
    onWorkflowGenerated(generatedWorkflow);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-6xl h-[90vh] bg-black/90 border border-gray-800 rounded-lg overflow-hidden flex"
      >
        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">AI Workflow Builder</h2>
                  <p className="text-gray-400">Describe your automation goals and I&apos;ll build it for you</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Quick Start Ideas</h3>
            <div className="flex flex-wrap gap-2">
              {QUICK_WORKFLOW_PROMPTS.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPrompt(prompt)}
                  className="text-xs bg-gray-800 border-gray-700 hover:border-purple-500"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {prompt}
                </Button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${
                    message.role === 'user' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-800 text-gray-100'
                  } rounded-lg p-4`}>
                    {message.isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Generating workflow...</span>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div className="p-6 border-t border-gray-800">
            <div className="flex space-x-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe the workflow you want to create..."
                disabled={isGenerating}
                className="flex-1 bg-gray-900 border-gray-700 focus:border-purple-500"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isGenerating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Workflow Preview */}
        {showPreview && (
          <div className="w-96 border-l border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Workflow Preview</h3>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPreview(false)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {generatedWorkflow.map((node, index) => (
                <Card key={node.id} className="p-3 bg-gray-900 border-gray-700">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-purple-300">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white mb-1">{node.title}</h4>
                      <p className="text-xs text-gray-400 mb-2">{node.description}</p>
                      <div className="text-xs text-gray-500 capitalize">
                        {node.type.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  {index < generatedWorkflow.length - 1 && (
                    <div className="flex justify-center mt-2">
                      <ArrowRight className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </Card>
              ))}
            </div>

            <div className="p-4 border-t border-gray-800 space-y-2">
              <Button
                onClick={handleApplyWorkflow}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Apply This Workflow
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="w-full border-gray-700"
              >
                Continue Editing
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}