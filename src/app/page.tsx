"use client";

import { useState } from "react";
import { LoginButton } from "components/auth/LoginButton";
import { ProtectedRoute } from "components/auth/ProtectedRoute";
import { useAuth } from "context/AuthContext";
import { Card } from "components/ui/card";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "components/ui/table";
import { motion } from "framer-motion";
import { PricingTiers } from "components/marketing/PricingTiers";
import { Features } from "components/marketing/Features";
import { MobileAppDownload } from "components/marketing/MobileAppDownload";
import { AnimatedBackground } from "components/ui/AnimatedBackground";

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"capture" | "results">("capture");
  const [loading, setLoading] = useState(false);
  const [criteria, setCriteria] = useState({
    industry: "",
    experience: "",
    location: "",
    position: "",
    leadCount: 10,
  });
  const [leads, setLeads] = useState([]);

  const handleCapture = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/lead/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ criteria }),
      });

      if (!response.ok) {
        throw new Error("Failed to capture leads");
      }

      const data = await response.json();
      setLeads(data.leads);
    } catch (error) {
      console.error("Error capturing leads:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          CaptureIt LS
        </h1>
      </motion.div>

      <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <LoginButton />
      </div>

      {user ? (
        <ProtectedRoute>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as "capture" | "results")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="capture">Capture Leads</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
              </TabsList>

              <TabsContent value="capture">
                <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Industry</label>
                      <Input
                        placeholder="Enter target industry"
                        value={criteria.industry}
                        onChange={(e) => setCriteria({ ...criteria, industry: e.target.value })}
                        className="mt-1 bg-gray-900/50 border-gray-700"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300">Experience Level</label>
                      <Input
                        placeholder="Required experience"
                        value={criteria.experience}
                        onChange={(e) => setCriteria({ ...criteria, experience: e.target.value })}
                        className="mt-1 bg-gray-900/50 border-gray-700"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300">Location</label>
                      <Input
                        placeholder="Target location"
                        value={criteria.location}
                        onChange={(e) => setCriteria({ ...criteria, location: e.target.value })}
                        className="mt-1 bg-gray-900/50 border-gray-700"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300">Position</label>
                      <Input
                        placeholder="Target position"
                        value={criteria.position}
                        onChange={(e) => setCriteria({ ...criteria, position: e.target.value })}
                        className="mt-1 bg-gray-900/50 border-gray-700"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300">Number of Leads</label>
                      <Input
                        type="number"
                        placeholder="How many leads to capture"
                        value={criteria.leadCount}
                        onChange={(e) => setCriteria({ ...criteria, leadCount: parseInt(e.target.value) })}
                        min={1}
                        className="mt-1 bg-gray-900/50 border-gray-700"
                      />
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      onClick={handleCapture}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                          Capturing...
                        </div>
                      ) : (
                        "Capture Leads"
                      )}
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="results">
                <Card className="p-6 bg-black/50 backdrop-blur-lg border-gray-800">
                  {leads.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {leads.map((lead: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{lead.name}</TableCell>
                              <TableCell>{lead.position}</TableCell>
                              <TableCell>{lead.company}</TableCell>
                              <TableCell>{lead.location}</TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      No leads captured yet. Use the Capture tab to find leads.
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </ProtectedRoute>
      ) : (
        <>
          <AnimatedBackground />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 text-center relative z-10"
          >
            <p className="text-xs text-white/70 absolute -top-12 left-1/2 transform -translate-x-1/2">
              If you experience popup-blocked errors, please allow popups for this site.
            </p>
            <h2 className="mb-4 text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 font-display">
              Sign in to start capturing leads
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Access powerful AI-driven lead generation tools and manage your sales pipeline effectively.
            </p>
            <div className="flex justify-center">
              <LoginButton />
            </div>
          </motion.div>
          <MobileAppDownload />
          <Features />
          <PricingTiers />
        </>
      )}
    </motion.div>
  );
}
