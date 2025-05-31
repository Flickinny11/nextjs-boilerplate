"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Bot, 
  Wand2, 
  Send, 
  Loader2,
  Sparkles,
  Settings,
  X,
  Check,
  ArrowRight
} from 'lucide-react';
import { openRouterService } from '@/lib/openRouterService';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'email' | 'sms' | 'wait' | 'condition' | 'social';
  title: string;
  description: string;
  config: any;
  position: { x: number; y: number };
  connections: string[];
}

interface AIWorkflowBuilderProps {
  onWorkflowGenerated: (nodes: WorkflowNode[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

const WORKFLOW_TEMPLATES = [
  {
    name: "Welcome Series",
    description: "Onboard new leads with a series of welcome emails",
    prompt: "Create a welcome email series for new leads with 3 emails over 5 days"
  },
  {
    name: "Re-engagement Campaign", 
    description: "Win back inactive leads with targeted messaging",
    prompt: "Build a re-engagement workflow for leads who haven't opened emails in 30 days"
  },
  {
    name: "Product Launch",
    description: "Announce new products across multiple channels", 
    prompt: "Create a product launch campaign with emails, SMS, and social media posts"
  },
  {
    name: "Nurture Sequence",
    description: "Educate leads with valuable content over time",
    prompt: "Build a lead nurturing workflow with educational content over 2 weeks"
  }
];

export function AIWorkflowBuilder({ onWorkflowGenerated, isOpen, onClose }: AIWorkflowBuilderProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI workflow assistant. I can help you build automated marketing workflows by understanding your goals and creating the perfect sequence of actions. What kind of workflow would you like to create?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentWorkflowNodes, setCurrentWorkflowNodes] = useState<WorkflowNode[]>([]);
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
      const conversation = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const systemPrompt = `You are an expert marketing automation consultant helping users build workflow sequences. 

Your responses should be helpful, conversational, and actionable. When a user describes their workflow needs, provide specific suggestions for:
1. Workflow structure and sequence
2. Timing and delays
3. Content suggestions
4. Targeting criteria

If the user's request is clear enough to build a workflow, end your response with "GENERATE_WORKFLOW:" followed by a JSON object describing the workflow nodes.

The JSON should follow this structure:
{
  "nodes": [
    {
      "id": "unique_id",
      "type": "trigger|email|sms|wait|condition|social",
      "title": "Node Title",
      "description": "Node description",
      "config": {
        "delay": "24h" (for wait nodes),
        "subject": "Email subject" (for email nodes),
        "content": "Message content",
        "conditions": [] (for condition nodes)
      },
      "position": {"x": number, "y": number},
      "connections": ["connected_node_id"]
    }
  ]
}

Available node types:
- trigger: Start point (new lead, form submission, etc.)
- email: Send email
- sms: Send SMS
- wait: Delay/wait period
- condition: Branching logic
- social: Social media post`;

      const response = await openRouterService.createChatCompletion([
        { role: 'system', content: systemPrompt },
        ...conversation
      ], 'anthropic/claude-3-haiku');

      const assistantResponse = response.choices[0].message.content;

      // Check if response contains workflow generation
      if (assistantResponse.includes('GENERATE_WORKFLOW:')) {
        const [mainResponse, workflowData] = assistantResponse.split('GENERATE_WORKFLOW:');
        
        try {
          const workflowJson = JSON.parse(workflowData.trim());
          setCurrentWorkflowNodes(workflowJson.nodes || []);
          setShowPreview(true);
        } catch (parseError) {
          console.error('Failed to parse workflow JSON:', parseError);
        }

        // Remove loading message and add the main response
        setMessages(prev => prev.slice(0, -1).concat([{
          id: Date.now().toString(),
          role: 'assistant',
          content: mainResponse.trim(),
          timestamp: new Date()
        }]));
      } else {
        // Remove loading message and add response
        setMessages(prev => prev.slice(0, -1).concat([{
          id: Date.now().toString(),
          role: 'assistant',
          content: assistantResponse,
          timestamp: new Date()
        }]));
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setMessages(prev => prev.slice(0, -1).concat([{
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      }]));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (template: typeof WORKFLOW_TEMPLATES[0]) => {
    setInputMessage(template.prompt);
  };

  const handleApproveWorkflow = () => {
    if (currentWorkflowNodes.length > 0) {
      onWorkflowGenerated(currentWorkflowNodes);
      onClose();
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'trigger': return '🎯';
      case 'email': return '📧';
      case 'sms': return '💬';
      case 'wait': return '⏱️';
      case 'condition': return '🔀';
      case 'social': return '📱';
      default: return '⚡';
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'border-green-500 bg-green-500/10';
      case 'email': return 'border-blue-500 bg-blue-500/10';
      case 'sms': return 'border-purple-500 bg-purple-500/10';
      case 'wait': return 'border-yellow-500 bg-yellow-500/10';
      case 'condition': return 'border-orange-500 bg-orange-500/10';
      case 'social': return 'border-pink-500 bg-pink-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-lg w-full max-w-6xl h-[90vh] overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">AI Workflow Builder</h2>
                  <p className="text-gray-400">Describe your workflow and I'll build it for you</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Templates */}
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Quick Templates</h3>
            <div className="flex flex-wrap gap-2">
              {WORKFLOW_TEMPLATES.map((template) => (
                <Button
                  key={template.name}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateSelect(template)}
                  className="text-xs bg-gray-800 border-gray-700 hover:border-gray-600"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {template.name}
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
                  <div className={`max-w-[80%] p-4 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-100'
                  }`}>
                    {message.isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div className="p-6 border-t border-gray-800">
            <div className="flex space-x-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="Describe the workflow you want to create..."
                className="bg-gray-800 border-gray-700 resize-none"
                rows={2}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isGenerating}
                className="bg-purple-600 hover:bg-purple-700 self-end"
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

        {/* Preview Panel */}
        {showPreview && currentWorkflowNodes.length > 0 && (
          <div className="w-96 border-l border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <h3 className="font-semibold text-white flex items-center">
                <Wand2 className="w-4 h-4 mr-2 text-purple-400" />
                Generated Workflow
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {currentWorkflowNodes.length} steps created
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {currentWorkflowNodes.map((node, index) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border ${getNodeColor(node.type)}`}
                >
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">{getNodeIcon(node.type)}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm">{node.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">{node.description}</p>
                      
                      {/* Show config details */}
                      {node.config && Object.keys(node.config).length > 0 && (
                        <div className="mt-2 space-y-1">
                          {Object.entries(node.config).map(([key, value]) => (
                            <div key={key} className="text-xs">
                              <span className="text-gray-500 capitalize">{key}:</span>
                              <span className="text-gray-300 ml-1">
                                {typeof value === 'string' ? value.substring(0, 50) + (value.length > 50 ? '...' : '') : JSON.stringify(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {index < currentWorkflowNodes.length - 1 && (
                    <div className="flex justify-center mt-2">
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-800 space-y-2">
              <Button
                onClick={handleApproveWorkflow}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Apply Workflow
              </Button>
              <Button
                onClick={() => setShowPreview(false)}
                variant="outline"
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