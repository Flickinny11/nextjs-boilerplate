"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Lightbulb,
  CheckCircle,
  X,
  Clock,
  Mail,
  User,
  Calendar,
  MessageSquare,
  Send
} from "lucide-react";

interface FeatureRequest {
  id: string;
  userId: string;
  userEmail: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  createdAt: Date;
  managerId?: string;
  managerNotes?: string;
  approvedAt?: Date;
}

interface FeatureRequestsManagerProps {
  managerId: string;
}

export function FeatureRequestsManager({ managerId }: FeatureRequestsManagerProps) {
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<FeatureRequest | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [managerNotes, setManagerNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadFeatureRequests();
  }, [managerId]);

  const loadFeatureRequests = async () => {
    try {
      const response = await fetch(`/api/feature-requests?managerId=${managerId}`);
      if (response.ok) {
        const data = await response.json();
        setFeatureRequests(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load feature requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewRequest = (request: FeatureRequest) => {
    setSelectedRequest(request);
    setManagerNotes("");
    setIsReviewModalOpen(true);
  };

  const handleApproveReject = async (action: 'approve' | 'reject') => {
    if (!selectedRequest) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/feature-requests/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: selectedRequest.id,
          action,
          managerNotes
        }),
      });

      if (response.ok) {
        // Update the request in the local state
        setFeatureRequests(prev => prev.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: action === 'approve' ? 'approved' : 'rejected', managerNotes }
            : req
        ));
        
        setIsReviewModalOpen(false);
        setSelectedRequest(null);
        setManagerNotes("");
      }
    } catch (error) {
      console.error('Failed to update feature request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'implemented':
        return <Badge variant="default" className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Implemented</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          Feature Requests
        </h2>
        <Badge variant="secondary" className="text-sm">
          {featureRequests.filter(req => req.status === 'pending').length} pending
        </Badge>
      </div>

      {featureRequests.length === 0 ? (
        <Card className="p-8 text-center bg-black/50 backdrop-blur-lg border-gray-800">
          <Lightbulb className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No feature requests yet</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {featureRequests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800 hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusBadge(request.status)}
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {request.userEmail}
                        </span>
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 leading-relaxed">
                      {request.description}
                    </p>

                    {request.managerNotes && (
                      <div className="bg-gray-900/50 p-3 rounded border-l-4 border-blue-500">
                        <p className="text-sm text-gray-400 flex items-center gap-1 mb-1">
                          <MessageSquare className="w-3 h-3" />
                          Manager Notes:
                        </p>
                        <p className="text-gray-300">{request.managerNotes}</p>
                      </div>
                    )}
                  </div>

                  {request.status === 'pending' && (
                    <Button
                      onClick={() => handleReviewRequest(request)}
                      className="ml-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Review
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="bg-black/90 backdrop-blur-lg border-gray-800 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Review Feature Request
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Review and approve or reject this feature request. If approved, it will be sent to the business owner.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-gray-900/50 p-4 rounded border">
                <p className="text-sm text-gray-400 mb-2">Request from: {selectedRequest.userEmail}</p>
                <p className="text-gray-300">{selectedRequest.description}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Manager Notes (optional)
                </label>
                <Textarea
                  value={managerNotes}
                  onChange={(e) => setManagerNotes(e.target.value)}
                  placeholder="Add notes about your decision or additional context..."
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsReviewModalOpen(false)}
              disabled={submitting}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleApproveReject('reject')}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting ? 'Processing...' : 'Reject'}
            </Button>
            <Button
              onClick={() => handleApproveReject('approve')}
              disabled={submitting}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Sending...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Approve & Send to Owner
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}