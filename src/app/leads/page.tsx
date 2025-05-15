"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Search, Download, Database } from "lucide-react";
import type { Lead, LeadCriteria } from "@/lib/aiServices";

"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function LeadsPage() {
  return (
    <ProtectedRoute>
      <LeadCaptureContent />
    </ProtectedRoute>
  );
}

function LeadCaptureContent() {
  const [criteria, setCriteria] = useState<LeadCriteria>({
    industry: "",
    experience: "",
    location: "",
    position: "",
    leadCount: 10,
    enrichData: true,
    importToCRM: false,
    additionalInfo: {
      includeFamily: false,
      includeSocial: true,
      includeInterests: true
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  const handleCapture = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/lead/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` // Add user's auth token
        },
        body: JSON.stringify({ criteria })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to capture leads");
      }

      const data = await response.json();
      setLeads(data.leads);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const csv = [
      ["Name", "Position", "Company", "Location", "Email", "Phone", "LinkedIn", "Industry", "Experience"],
      ...leads.map(lead => [
        lead.name,
        lead.position,
        lead.company,
        lead.location,
        lead.email,
        lead.phone,
        lead.linkedin,
        lead.industry,
        lead.experience
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-16 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
          Lead Capture
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Specify your target audience criteria and let our AI find the perfect leads for your business.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Criteria Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
            <h2 className="text-2xl font-bold mb-8">Lead Criteria</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Industry</label>
                <Input
                  type="text"
                  value={criteria.industry}
                  onChange={(e) => setCriteria({ ...criteria, industry: e.target.value })}
                  className="bg-gray-900/50 border-gray-700"
                  placeholder="e.g., Technology, Healthcare"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Position</label>
                <Input
                  type="text"
                  value={criteria.position}
                  onChange={(e) => setCriteria({ ...criteria, position: e.target.value })}
                  className="bg-gray-900/50 border-gray-700"
                  placeholder="e.g., CEO, Sales Manager"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input
                  type="text"
                  value={criteria.location}
                  onChange={(e) => setCriteria({ ...criteria, location: e.target.value })}
                  className="bg-gray-900/50 border-gray-700"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Experience (years)</label>
                <Input
                  type="text"
                  value={criteria.experience}
                  onChange={(e) => setCriteria({ ...criteria, experience: e.target.value })}
                  className="bg-gray-900/50 border-gray-700"
                  placeholder="e.g., 5+"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Number of Leads</label>
                <Select
                  value={criteria.leadCount.toString()}
                  onValueChange={(value) => setCriteria({ ...criteria, leadCount: parseInt(value) })}
                >
                  <SelectTrigger className="bg-gray-900/50 border-gray-700">
                    <SelectValue placeholder="Select amount" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 Leads</SelectItem>
                    <SelectItem value="25">25 Leads</SelectItem>
                    <SelectItem value="50">50 Leads</SelectItem>
                    <SelectItem value="100">100 Leads</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={criteria.enrichData}
                    onChange={(e) => setCriteria({ ...criteria, enrichData: e.target.checked })}
                    className="rounded border-gray-700 bg-gray-900/50"
                  />
                  <span className="text-sm">Enrich data with social media profiles</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={criteria.importToCRM}
                    onChange={(e) => setCriteria({ ...criteria, importToCRM: e.target.checked })}
                    className="rounded border-gray-700 bg-gray-900/50"
                  />
                  <span className="text-sm">Import to connected CRM</span>
                </label>
              </div>

              <Button
                onClick={handleCapture}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Capturing Leads...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Capture Leads
                  </>
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Results Display */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Captured Leads</h2>
              {leads.length > 0 && (
                <div className="space-x-2">
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="bg-gray-900/50 border-gray-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  {criteria.importToCRM && (
                    <Button
                      variant="outline"
                      className="bg-gray-900/50 border-gray-700"
                    >
                      <Database className="w-4 h-4 mr-2" />
                      View in CRM
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              {leads.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Position</th>
                      <th className="text-left p-2">Company</th>
                      <th className="text-left p-2">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-b border-gray-800 hover:bg-gray-900/30"
                      >
                        <td className="p-2">{lead.name}</td>
                        <td className="p-2">{lead.position}</td>
                        <td className="p-2">{lead.company}</td>
                        <td className="p-2">{lead.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No leads captured yet. Set your criteria and click "Capture Leads" to start.
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
