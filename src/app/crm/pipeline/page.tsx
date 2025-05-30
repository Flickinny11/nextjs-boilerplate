"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Plus,
  DollarSign,
  Calendar,
  User,
  Target,
  TrendingUp,
  MoreVertical
} from 'lucide-react'
import { crmService, formatCurrency, formatDate } from '@/lib/crmService'
import type { CRMDeal } from '@/lib/crmTypes'

// Mock pipeline stages for demonstration
const PIPELINE_STAGES = [
  { id: 'stage_1', name: 'Prospecting', color: 'bg-gray-500', probability: 10 },
  { id: 'stage_2', name: 'Qualification', color: 'bg-blue-500', probability: 25 },
  { id: 'stage_3', name: 'Proposal', color: 'bg-yellow-500', probability: 50 },
  { id: 'stage_4', name: 'Negotiation', color: 'bg-orange-500', probability: 75 },
  { id: 'stage_5', name: 'Closed Won', color: 'bg-green-500', probability: 100 }
]

interface PipelineState {
  deals: CRMDeal[]
  loading: boolean
  draggedDeal: CRMDeal | null
}

export default function PipelinePage() {
  const [state, setState] = useState<PipelineState>({
    deals: [],
    loading: true,
    draggedDeal: null
  })

  useEffect(() => {
    loadDeals()
  }, [])

  const loadDeals = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      
      // Generate some mock deals for demonstration
      const mockDeals: CRMDeal[] = [
        {
          id: 'deal_1',
          name: 'Enterprise Software License',
          contactId: 'contact_1',
          value: 50000,
          currency: 'USD',
          stageId: 'stage_2',
          probability: 25,
          expectedCloseDate: new Date('2024-02-15'),
          assignedTo: 'John Smith',
          dealSource: 'Inbound Lead',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'user_1'
        },
        {
          id: 'deal_2',
          name: 'Marketing Automation Platform',
          contactId: 'contact_2',
          value: 25000,
          currency: 'USD',
          stageId: 'stage_3',
          probability: 50,
          expectedCloseDate: new Date('2024-01-30'),
          assignedTo: 'Jane Doe',
          dealSource: 'Referral',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'user_2'
        },
        {
          id: 'deal_3',
          name: 'Cloud Infrastructure Setup',
          contactId: 'contact_3',
          value: 75000,
          currency: 'USD',
          stageId: 'stage_4',
          probability: 75,
          expectedCloseDate: new Date('2024-01-20'),
          assignedTo: 'Mike Johnson',
          dealSource: 'Cold Outreach',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'user_3'
        },
        {
          id: 'deal_4',
          name: 'Custom Development Project',
          contactId: 'contact_4',
          value: 100000,
          currency: 'USD',
          stageId: 'stage_1',
          probability: 10,
          expectedCloseDate: new Date('2024-03-01'),
          assignedTo: 'Sarah Wilson',
          dealSource: 'Website',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'user_4'
        }
      ]
      
      setState(prev => ({ ...prev, deals: mockDeals }))
    } catch (error) {
      console.error('Failed to load deals:', error)
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const getDealsForStage = (stageId: string) => {
    return state.deals.filter(deal => deal.stageId === stageId)
  }

  const getStageValue = (stageId: string) => {
    return getDealsForStage(stageId).reduce((total, deal) => total + deal.value, 0)
  }

  const getTotalPipelineValue = () => {
    return state.deals.reduce((total, deal) => total + deal.value, 0)
  }

  const handleDragStart = (deal: CRMDeal) => {
    setState(prev => ({ ...prev, draggedDeal: deal }))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    if (state.draggedDeal && state.draggedDeal.stageId !== stageId) {
      // Update deal stage
      setState(prev => ({
        ...prev,
        deals: prev.deals.map(deal =>
          deal.id === state.draggedDeal?.id
            ? { ...deal, stageId, updatedAt: new Date() }
            : deal
        ),
        draggedDeal: null
      }))
    }
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
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            Sales Pipeline
          </h1>
          <p className="text-gray-400 mt-2">
            Visual overview of your sales opportunities
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            New Deal
          </Button>
        </div>
      </motion.div>

      {/* Pipeline Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <Card className="p-6 bg-gray-900/50 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Pipeline Value</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(getTotalPipelineValue())}
              </p>
              <p className="text-green-500 text-sm">+15% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gray-900/50 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Average Deal Size</p>
              <p className="text-2xl font-bold text-white">
                {state.deals.length > 0 ? formatCurrency(getTotalPipelineValue() / state.deals.length) : '$0'}
              </p>
              <p className="text-green-500 text-sm">+8% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gray-900/50 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-500/20">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Weighted Pipeline</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(
                  state.deals.reduce((total, deal) => {
                    const stage = PIPELINE_STAGES.find(s => s.id === deal.stageId)
                    return total + (deal.value * (stage?.probability || 0) / 100)
                  }, 0)
                )}
              </p>
              <p className="text-green-500 text-sm">+12% from last month</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Pipeline Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="overflow-x-auto pb-4"
      >
        <div className="flex gap-6 min-w-max">
          {PIPELINE_STAGES.map((stage, index) => {
            const deals = getDealsForStage(stage.id)
            const stageValue = getStageValue(stage.id)
            
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-80"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <Card className="bg-gray-900/50 border-gray-700 h-full">
                  {/* Stage Header */}
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                        <h3 className="font-semibold text-white">{stage.name}</h3>
                        <span className="text-sm text-gray-400">({deals.length})</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-400">
                      {formatCurrency(stageValue)} • {stage.probability}% close rate
                    </p>
                  </div>

                  {/* Deals List */}
                  <div className="p-4 space-y-3 min-h-[200px]">
                    {deals.map((deal) => (
                      <motion.div
                        key={deal.id}
                        draggable
                        onDragStart={() => handleDragStart(deal)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 cursor-grab active:cursor-grabbing hover:border-gray-600 transition-colors"
                      >
                        <h4 className="font-medium text-white mb-2">{deal.name}</h4>
                        
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            <span>{formatCurrency(deal.value, deal.currency)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(deal.expectedCloseDate)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <User className="w-3 h-3" />
                            <span>{deal.assignedTo}</span>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                            {deal.dealSource}
                          </span>
                        </div>
                      </motion.div>
                    ))}

                    {/* Add Deal Button */}
                    <Button
                      variant="outline"
                      className="w-full border-dashed border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Deal
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}