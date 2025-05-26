"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Plus, 
  Mail, 
  MessageSquare, 
  Clock, 
  Trash2,
  Share2,
  Send,
  ArrowRight,
  MoreHorizontal,
  Play,
  PauseCircle,
  UserCheck,
  Save,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

// Types for workflow automation
type WorkflowStep = {
  id: string;
  type: "email" | "sms" | "social" | "wait" | "condition";
  name: string;
  details: any;
  position: number;
};

type Workflow = {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  steps: WorkflowStep[];
  triggers: string[];
  createdAt: Date;
  updatedAt: Date;
};

// Sample workflows for demo
const sampleWorkflows: Workflow[] = [
  {
    id: "1",
    name: "New Lead Welcome Sequence",
    description: "Automated workflow to welcome and nurture new leads",
    status: "active",
    steps: [
      {
        id: "step1",
        type: "email",
        name: "Welcome Email",
        details: {
          subject: "Welcome to our community!",
          template: "welcome_email"
        },
        position: 0
      },
      {
        id: "step2",
        type: "wait",
        name: "Wait 2 Days",
        details: {
          duration: "2d"
        },
        position: 1
      },
      {
        id: "step3",
        type: "email",
        name: "Follow-up Email",
        details: {
          subject: "Here's what you might have missed",
          template: "followup_email"
        },
        position: 2
      }
    ],
    triggers: ["new_lead"],
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-06-10")
  },
  {
    id: "2",
    name: "Re-engagement Campaign",
    description: "Bring cold leads back into the sales funnel",
    status: "draft",
    steps: [
      {
        id: "step1",
        type: "email",
        name: "Re-engagement Email",
        details: {
          subject: "We miss you!",
          template: "reengagement_email"
        },
        position: 0
      },
      {
        id: "step2",
        type: "condition",
        name: "Check Email Open",
        details: {
          condition: "email_opened"
        },
        position: 1
      },
      {
        id: "step3",
        type: "sms",
        name: "SMS Follow-up",
        details: {
          message: "Special offer just for you: {{offer}}"
        },
        position: 2
      }
    ],
    triggers: ["inactive_30d"],
    createdAt: new Date("2023-07-05"),
    updatedAt: new Date("2023-07-05")
  }
];

export default function WorkflowBuilder() {
  const [workflows, setWorkflows] = useState<Workflow[]>(sampleWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const selectWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setIsEditing(false);
  };

  const createNewWorkflow = () => {
    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: "New Workflow",
      description: "Description of your workflow",
      status: "draft",
      steps: [],
      triggers: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setWorkflows([...workflows, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
    setIsEditing(true);
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="w-4 h-4" />;
      case "sms":
        return <MessageSquare className="w-4 h-4" />;
      case "social":
        return <Share2 className="w-4 h-4" />;
      case "wait":
        return <Clock className="w-4 h-4" />;
      case "condition":
        return <UserCheck className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <span className="w-1.5 h-1.5 mr-1 rounded-full bg-green-400"></span>
            Active
          </span>
        );
      case "paused":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <span className="w-1.5 h-1.5 mr-1 rounded-full bg-yellow-400"></span>
            Paused
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
            <span className="w-1.5 h-1.5 mr-1 rounded-full bg-gray-400"></span>
            Draft
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-4">
      <div className="mb-8">
        <Link href="/marketing" className="inline-flex items-center text-blue-500 hover:text-blue-400 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketing Suite
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-2">
          Workflow Builder
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Create automated workflows to engage your leads across multiple channels
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Workflows List */}
        <div className="lg:col-span-1">
          <Card className="p-4 bg-black/50 backdrop-blur-lg border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Your Workflows</h2>
              <Button 
                size="sm" 
                onClick={createNewWorkflow} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            </div>
            
            <div className="space-y-2">
              {workflows.map(workflow => (
                <div 
                  key={workflow.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedWorkflow?.id === workflow.id 
                      ? "bg-blue-900/30 border border-blue-700" 
                      : "hover:bg-gray-800/50 border border-transparent"
                  }`}
                  onClick={() => selectWorkflow(workflow)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{workflow.name}</h3>
                    {getStatusBadge(workflow.status)}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 truncate">{workflow.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Workflow Editor */}
        <div className="lg:col-span-3">
          {selectedWorkflow ? (
            <Card className="bg-black/50 backdrop-blur-lg border-gray-800">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                {isEditing ? (
                  <div className="flex-1">
                    <Input
                      value={selectedWorkflow.name}
                      onChange={(e) => setSelectedWorkflow({...selectedWorkflow, name: e.target.value})}
                      className="font-bold text-lg bg-gray-900/50 border-gray-700"
                    />
                    <Input
                      value={selectedWorkflow.description}
                      onChange={(e) => setSelectedWorkflow({...selectedWorkflow, description: e.target.value})}
                      className="mt-2 text-sm bg-gray-900/50 border-gray-700"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-lg font-bold flex items-center">
                      {selectedWorkflow.name}
                      <span className="ml-2">{getStatusBadge(selectedWorkflow.status)}</span>
                    </h2>
                    <p className="text-sm text-gray-400">{selectedWorkflow.description}</p>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                      className="border-gray-700"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="border-gray-700"
                      >
                        Edit
                      </Button>
                      
                      {selectedWorkflow.status === "active" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-700"
                        >
                          <PauseCircle className="w-4 h-4 mr-1" />
                          Pause
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-700"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Activate
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                          <DropdownMenuItem className="cursor-pointer">Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Export</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-500">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold uppercase text-gray-400 mb-2">Triggers</h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedWorkflow.triggers.map(trigger => (
                      <div key={trigger} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                        {trigger === "new_lead" ? "New Lead Captured" : 
                         trigger === "inactive_30d" ? "30 Days Inactive" : trigger}
                      </div>
                    ))}
                    
                    {isEditing && (
                      <Button variant="outline" size="sm" className="rounded-full border-dashed border-gray-700">
                        <Plus className="w-3 h-3 mr-1" />
                        Add Trigger
                      </Button>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold uppercase text-gray-400 mb-4">Workflow Steps</h3>
                  
                  <div className="space-y-4">
                    {selectedWorkflow.steps.length === 0 ? (
                      <div className="text-center p-8 border border-dashed border-gray-700 rounded-md">
                        <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400">No steps in this workflow yet.</p>
                        {isEditing && (
                          <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-1" />
                            Add First Step
                          </Button>
                        )}
                      </div>
                    ) : (
                      selectedWorkflow.steps.map((step, index) => (
                        <div key={step.id} className="relative">
                          {index > 0 && (
                            <div className="absolute top-0 left-7 -mt-4 h-4 w-0.5 bg-gray-700"></div>
                          )}
                          <div className="flex items-start">
                            <div className="relative">
                              <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center">
                                {getStepIcon(step.type)}
                              </div>
                              {index < selectedWorkflow.steps.length - 1 && (
                                <div className="absolute top-14 left-7 h-8 w-0.5 bg-gray-700"></div>
                              )}
                            </div>
                            
                            <div className="ml-4 flex-1">
                              <Card className="p-4 bg-gray-800/50 border-gray-700">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">{step.name}</h4>
                                  {isEditing && (
                                    <div className="flex space-x-1">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                              <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Remove step</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="text-sm text-gray-400">
                                  {step.type === "email" && (
                                    <div>
                                      <p>Subject: {step.details.subject}</p>
                                      <p>Template: {step.details.template}</p>
                                    </div>
                                  )}
                                  
                                  {step.type === "wait" && (
                                    <p>Wait for {step.details.duration}</p>
                                  )}
                                  
                                  {step.type === "sms" && (
                                    <p>Message: {step.details.message}</p>
                                  )}
                                  
                                  {step.type === "condition" && (
                                    <p>If {step.details.condition}</p>
                                  )}
                                </div>
                              </Card>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    
                    {isEditing && selectedWorkflow.steps.length > 0 && (
                      <div className="relative pl-7">
                        <div className="absolute top-0 left-7 -mt-2 h-8 w-0.5 bg-gray-700"></div>
                        <Button 
                          variant="outline" 
                          className="w-full border-dashed border-gray-700 py-6"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Next Step
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full bg-black/50 backdrop-blur-lg border-gray-800 flex flex-col items-center justify-center p-12">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Select or Create a Workflow</h3>
                <p className="text-gray-400 mb-6 max-w-md">
                  Create automated sequences to engage your leads across email, SMS, and social media.
                </p>
                <Button onClick={createNewWorkflow} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Workflow
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}