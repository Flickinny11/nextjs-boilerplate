"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  User,
  Target,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react'
import { crmService, formatCurrency, formatDate, getDealDisplayName } from '@/lib/crmService'
import type { CRMDeal, CRMListResponse } from '@/lib/crmTypes'

interface DealsPageState {
  deals: CRMDeal[]
  loading: boolean
  searchTerm: string
  selectedDeals: string[]
  showCreateModal: boolean
}

// Mock pipeline stages for demonstration
const PIPELINE_STAGES = [
  { id: 'stage_1', name: 'Prospecting', color: 'bg-gray-500', probability: 10 },
  { id: 'stage_2', name: 'Qualification', color: 'bg-blue-500', probability: 25 },
  { id: 'stage_3', name: 'Proposal', color: 'bg-yellow-500', probability: 50 },
  { id: 'stage_4', name: 'Negotiation', color: 'bg-orange-500', probability: 75 },
  { id: 'stage_5', name: 'Closed Won', color: 'bg-green-500', probability: 100 },
  { id: 'stage_6', name: 'Closed Lost', color: 'bg-red-500', probability: 0 }
]

export default function DealsPage() {
  const [state, setState] = useState<DealsPageState>({
    deals: [],
    loading: true,
    searchTerm: '',
    selectedDeals: [],
    showCreateModal: false
  })

  useEffect(() => {
    loadDeals()
  }, [])

  const loadDeals = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      const response = await crmService.getDeals()
      if (response.success && response.data) {
        setState(prev => ({ ...prev, deals: response.data || [] }))
      }
    } catch (error) {
      console.error('Failed to load deals:', error)
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const handleSearch = (term: string) => {
    setState(prev => ({ ...prev, searchTerm: term }))
  }

  const filteredDeals = state.deals.filter(deal =>
    getDealDisplayName(deal).toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    deal.dealSource?.toLowerCase().includes(state.searchTerm.toLowerCase())
  )

  const handleCreateDeal = async (dealData: any) => {
    try {
      const response = await crmService.createDeal(dealData)
      if (response.success) {
        await loadDeals()
        setState(prev => ({ ...prev, showCreateModal: false }))
      }
    } catch (error) {
      console.error('Failed to create deal:', error)
    }
  }

  const getStageInfo = (stageId: string) => {
    return PIPELINE_STAGES.find(stage => stage.id === stageId) || PIPELINE_STAGES[0]
  }

  const getTotalPipelineValue = () => {
    return filteredDeals.reduce((total, deal) => total + deal.value, 0)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
            Deals
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your sales opportunities and pipeline
          </p>
        </div>
        <Button 
          onClick={() => setState(prev => ({ ...prev, showCreateModal: true }))}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Deal
        </Button>
      </motion.div>

      {/* Pipeline Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <Card className="p-4 bg-gray-900/50 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Deals</p>
              <p className="text-xl font-bold text-white">{filteredDeals.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gray-900/50 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Pipeline Value</p>
              <p className="text-xl font-bold text-white">
                {formatCurrency(getTotalPipelineValue())}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-900/50 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <DollarSign className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Avg Deal Size</p>
              <p className="text-xl font-bold text-white">
                {filteredDeals.length > 0 ? formatCurrency(getTotalPipelineValue() / filteredDeals.length) : '$0'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-900/50 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">This Month</p>
              <p className="text-xl font-bold text-white">
                {filteredDeals.filter(deal => {
                  const closeDate = new Date(deal.expectedCloseDate)
                  const now = new Date()
                  return closeDate.getMonth() === now.getMonth() && closeDate.getFullYear() === now.getFullYear()
                }).length}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search deals..."
            value={state.searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-gray-900/50 border-gray-700"
          />
        </div>
        <Button variant="outline" className="border-gray-600">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </motion.div>

      {/* Deals Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-gray-900/50 border-gray-700">
          <div className="p-6">
            {state.loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading deals...</p>
              </div>
            ) : filteredDeals.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No deals found</h3>
                <p className="text-gray-400 mb-4">
                  {state.searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first deal'}
                </p>
                <Button 
                  onClick={() => setState(prev => ({ ...prev, showCreateModal: true }))}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Deal
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-400">Deal Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-400">Value</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-400">Stage</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-400">Close Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-400">Assigned To</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeals.map((deal, index) => {
                      const stage = getStageInfo(deal.stageId)
                      return (
                        <motion.tr
                          key={deal.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                                {deal.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-white font-medium">{getDealDisplayName(deal)}</p>
                                <p className="text-gray-400 text-sm">{deal.dealSource}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span className="text-white font-medium">
                                {formatCurrency(deal.value, deal.currency)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${stage.color} text-white`}>
                              {stage.name}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-300">{formatDate(deal.expectedCloseDate)}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-300">{deal.assignedTo}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="hover:bg-gray-700">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="hover:bg-gray-700 text-red-400">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="hover:bg-gray-700">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Create Deal Modal */}
      {state.showCreateModal && (
        <CreateDealModal
          onClose={() => setState(prev => ({ ...prev, showCreateModal: false }))}
          onSubmit={handleCreateDeal}
        />
      )}
    </div>
  )
}

// Create Deal Modal Component
function CreateDealModal({ onClose, onSubmit }: {
  onClose: () => void
  onSubmit: (data: any) => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    contactId: 'contact_1', // This would be selected from a dropdown
    value: '',
    currency: 'USD',
    stageId: 'stage_1',
    expectedCloseDate: '',
    assignedTo: 'current-user',
    dealSource: 'CRM'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      value: parseFloat(formData.value),
      expectedCloseDate: formData.expectedCloseDate
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4 border border-gray-700"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Create New Deal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Deal Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-gray-800 border-gray-600"
              placeholder="e.g., Software License Deal"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Value *
              </label>
              <Input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                className="bg-gray-800 border-gray-600"
                placeholder="10000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Stage
            </label>
            <select
              value={formData.stageId}
              onChange={(e) => setFormData(prev => ({ ...prev, stageId: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
            >
              {PIPELINE_STAGES.slice(0, -2).map(stage => (
                <option key={stage.id} value={stage.id}>{stage.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Expected Close Date *
            </label>
            <Input
              type="date"
              value={formData.expectedCloseDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
              className="bg-gray-800 border-gray-600"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
              Create Deal
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-600">
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}