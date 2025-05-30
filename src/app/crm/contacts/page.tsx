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
  Mail,
  Phone,
  Building,
  Tag,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react'
import { crmService, getContactDisplayName, getLeadStatusColor } from '@/lib/crmService'
import type { CRMContact, CRMListResponse } from '@/lib/crmTypes'

interface ContactsPageState {
  contacts: CRMContact[]
  loading: boolean
  searchTerm: string
  selectedContacts: string[]
  showCreateModal: boolean
}

export default function ContactsPage() {
  const [state, setState] = useState<ContactsPageState>({
    contacts: [],
    loading: true,
    searchTerm: '',
    selectedContacts: [],
    showCreateModal: false
  })

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      const response = await crmService.getContacts()
      if (response.success && response.data) {
        setState(prev => ({ ...prev, contacts: response.data || [] }))
      }
    } catch (error) {
      console.error('Failed to load contacts:', error)
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const handleSearch = (term: string) => {
    setState(prev => ({ ...prev, searchTerm: term }))
  }

  const filteredContacts = state.contacts.filter(contact =>
    getContactDisplayName(contact).toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    contact.company?.toLowerCase().includes(state.searchTerm.toLowerCase())
  )

  const handleCreateContact = async (contactData: any) => {
    try {
      const response = await crmService.createContact(contactData)
      if (response.success) {
        await loadContacts()
        setState(prev => ({ ...prev, showCreateModal: false }))
      }
    } catch (error) {
      console.error('Failed to create contact:', error)
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
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Contacts
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your leads, contacts, and customers
          </p>
        </div>
        <Button 
          onClick={() => setState(prev => ({ ...prev, showCreateModal: true }))}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search contacts..."
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

      {/* Contacts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-gray-900/50 border-gray-700">
          <div className="p-6">
            {state.loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading contacts...</p>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No contacts found</h3>
                <p className="text-gray-400 mb-4">
                  {state.searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first contact'}
                </p>
                <Button 
                  onClick={() => setState(prev => ({ ...prev, showCreateModal: true }))}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Contact
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-400">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-400">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-400">Company</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-400">Source</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((contact, index) => (
                      <motion.tr
                        key={contact.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {getContactDisplayName(contact)}
                              </p>
                              <p className="text-gray-400 text-sm">{contact.position}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{contact.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{contact.company || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLeadStatusColor(contact.leadStatus)} text-white`}>
                            {contact.leadStatus}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-300">{contact.leadSource}</span>
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
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Create Contact Modal */}
      {state.showCreateModal && (
        <CreateContactModal
          onClose={() => setState(prev => ({ ...prev, showCreateModal: false }))}
          onSubmit={handleCreateContact}
        />
      )}
    </div>
  )
}

// Create Contact Modal Component
function CreateContactModal({ onClose, onSubmit }: {
  onClose: () => void
  onSubmit: (data: any) => void
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    leadSource: 'Website'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4 border border-gray-700"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Add New Contact</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                First Name *
              </label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="bg-gray-800 border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Last Name *
              </label>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="bg-gray-800 border-gray-600"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="bg-gray-800 border-gray-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Phone
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="bg-gray-800 border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Company
            </label>
            <Input
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="bg-gray-800 border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Position
            </label>
            <Input
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
              className="bg-gray-800 border-gray-600"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Add Contact
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