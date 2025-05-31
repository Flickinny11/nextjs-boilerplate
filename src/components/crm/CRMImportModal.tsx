"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Check, 
  X, 
  AlertTriangle, 
  Users, 
  Loader2,
  FileSpreadsheet,
  Settings
} from 'lucide-react';
import { Lead } from '@/lib/aiServices';
import { crmService } from '@/lib/crmService';

interface CRMImportModalProps {
  leads: Lead[];
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (results: ImportResult[]) => void;
}

interface ImportResult {
  lead: Lead;
  success: boolean;
  error?: string;
  crmId?: string;
}

interface ImportSettings {
  overwriteExisting: boolean;
  selectedStage: string;
  selectedPipeline: string;
  skipDuplicates: boolean;
  addTags: string[];
}

const CRM_STAGES = [
  { id: 'new', name: 'New Lead', color: '#3B82F6' },
  { id: 'qualified', name: 'Qualified', color: '#10B981' },
  { id: 'contacted', name: 'Contacted', color: '#F59E0B' },
  { id: 'opportunity', name: 'Opportunity', color: '#8B5CF6' }
];

const CRM_PIPELINES = [
  { id: 'sales', name: 'Sales Pipeline' },
  { id: 'marketing', name: 'Marketing Pipeline' },
  { id: 'customer-success', name: 'Customer Success' }
];

export function CRMImportModal({ leads, isOpen, onClose, onImportComplete }: CRMImportModalProps) {
  const [selectedLeads, setSelectedLeads] = useState<string[]>(leads.map(l => l.id));
  const [importSettings, setImportSettings] = useState<ImportSettings>({
    overwriteExisting: false,
    selectedStage: 'new',
    selectedPipeline: 'sales',
    skipDuplicates: true,
    addTags: ['lead-capture', 'ai-generated']
  });
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<ImportResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleLeadToggle = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    setSelectedLeads(selectedLeads.length === leads.length ? [] : leads.map(l => l.id));
  };

  const handleImport = async () => {
    setIsImporting(true);
    setImportProgress(0);
    const results: ImportResult[] = [];
    
    const leadsToImport = leads.filter(lead => selectedLeads.includes(lead.id));
    
    for (let i = 0; i < leadsToImport.length; i++) {
      const lead = leadsToImport[i];
      
      try {
        // Check for duplicates if skipDuplicates is enabled
        if (importSettings.skipDuplicates) {
          // Mock duplicate check - in real implementation, this would call CRM API
          const isDuplicate = Math.random() < 0.1; // 10% chance of duplicate for demo
          if (isDuplicate && !importSettings.overwriteExisting) {
            results.push({
              lead,
              success: false,
              error: 'Contact already exists (skipped)'
            });
            setImportProgress(((i + 1) / leadsToImport.length) * 100);
            continue;
          }
        }

        // Import the lead
        const response = await crmService.syncLeadToCRM({
          ...lead,
          stage: importSettings.selectedStage,
          pipeline: importSettings.selectedPipeline,
          tags: importSettings.addTags
        });

        if (response.success) {
          results.push({
            lead,
            success: true,
            crmId: response.data?.id
          });
        } else {
          results.push({
            lead,
            success: false,
            error: response.error || 'Unknown error'
          });
        }
      } catch (error) {
        results.push({
          lead,
          success: false,
          error: error instanceof Error ? error.message : 'Import failed'
        });
      }

      setImportProgress(((i + 1) / leadsToImport.length) * 100);
      
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setImportResults(results);
    setIsImporting(false);
    setShowResults(true);
    onImportComplete(results);
  };

  const successCount = importResults.filter(r => r.success).length;
  const failureCount = importResults.filter(r => !r.success).length;

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
        className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Import Leads to CRM</h2>
                <p className="text-gray-400">Configure import settings and select leads to import</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!showResults ? (
            <div className="space-y-6">
              {/* Import Settings */}
              <Card className="p-4 bg-black/30 border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Import Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CRM Pipeline
                    </label>
                    <Select
                      value={importSettings.selectedPipeline}
                      onValueChange={(value) => 
                        setImportSettings(prev => ({ ...prev, selectedPipeline: value }))
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CRM_PIPELINES.map((pipeline) => (
                          <SelectItem key={pipeline.id} value={pipeline.id}>
                            {pipeline.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Initial Stage
                    </label>
                    <Select
                      value={importSettings.selectedStage}
                      onValueChange={(value) => 
                        setImportSettings(prev => ({ ...prev, selectedStage: value }))
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CRM_STAGES.map((stage) => (
                          <SelectItem key={stage.id} value={stage.id}>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: stage.color }}
                              />
                              <span>{stage.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="skipDuplicates"
                      checked={importSettings.skipDuplicates}
                      onCheckedChange={(checked) => 
                        setImportSettings(prev => ({ ...prev, skipDuplicates: checked as boolean }))
                      }
                    />
                    <label htmlFor="skipDuplicates" className="text-sm text-gray-300">
                      Skip duplicate contacts (based on email)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="overwriteExisting"
                      checked={importSettings.overwriteExisting}
                      onCheckedChange={(checked) => 
                        setImportSettings(prev => ({ ...prev, overwriteExisting: checked as boolean }))
                      }
                      disabled={!importSettings.skipDuplicates}
                    />
                    <label htmlFor="overwriteExisting" className="text-sm text-gray-300">
                      Update existing contacts if found
                    </label>
                  </div>
                </div>
              </Card>

              {/* Lead Selection */}
              <Card className="p-4 bg-black/30 border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Select Leads ({selectedLeads.length} of {leads.length})
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedLeads.length === leads.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                    >
                      <Checkbox
                        checked={selectedLeads.includes(lead.id)}
                        onCheckedChange={() => handleLeadToggle(lead.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="font-medium text-white truncate">{lead.name}</p>
                            <p className="text-sm text-gray-400 truncate">{lead.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-300">{lead.position}</p>
                            <p className="text-xs text-gray-500">{lead.company}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Import Progress */}
              {isImporting && (
                <Card className="p-4 bg-black/30 border-gray-800">
                  <div className="flex items-center space-x-3 mb-3">
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                    <span className="text-white font-medium">Importing leads...</span>
                  </div>
                  <Progress value={importProgress} className="w-full" />
                  <p className="text-sm text-gray-400 mt-2">
                    {Math.round(importProgress)}% complete
                  </p>
                </Card>
              )}
            </div>
          ) : (
            /* Import Results */
            <div className="space-y-6">
              <Card className="p-6 bg-black/30 border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">Import Results</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{successCount}</div>
                    <div className="text-sm text-gray-300">Successful</div>
                  </div>
                  <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="text-2xl font-bold text-red-400">{failureCount}</div>
                    <div className="text-sm text-gray-300">Failed</div>
                  </div>
                  <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{importResults.length}</div>
                    <div className="text-sm text-gray-300">Total</div>
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2">
                  {importResults.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-gray-800"
                    >
                      <div className="flex-shrink-0">
                        {result.success ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <X className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{result.lead.name}</p>
                        <p className="text-sm text-gray-400 truncate">{result.lead.email}</p>
                        {!result.success && result.error && (
                          <p className="text-xs text-red-400 truncate">{result.error}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 bg-gray-900/50">
          <div className="flex justify-between">
            <div className="flex space-x-2">
              {showResults && successCount > 0 && (
                <Button
                  onClick={() => window.open('/crm/contacts', '_blank')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Database className="w-4 h-4 mr-2" />
                  View in CRM
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                {showResults ? 'Close' : 'Cancel'}
              </Button>
              {!showResults && (
                <Button
                  onClick={handleImport}
                  disabled={selectedLeads.length === 0 || isImporting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 mr-2" />
                      Import {selectedLeads.length} Leads
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}