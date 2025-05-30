import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { CRMContact, CRMDeal, CRMActivity, CRMDashboardMetrics } from './crmTypes';

// Collections
const CONTACTS_COLLECTION = 'contacts';
const DEALS_COLLECTION = 'deals';
const ACTIVITIES_COLLECTION = 'activities';

// Contact Services
export class ContactService {
  static async createContact(contact: Omit<CRMContact, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date();
      const docRef = await addDoc(collection(db, CONTACTS_COLLECTION), {
        ...contact,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now)
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  static async getContacts(userId: string): Promise<CRMContact[]> {
    try {
      const q = query(
        collection(db, CONTACTS_COLLECTION),
        where('createdBy', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        lastActivity: doc.data().lastActivity?.toDate(),
        nextFollowUp: doc.data().nextFollowUp?.toDate()
      })) as CRMContact[];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  static async getContact(id: string): Promise<CRMContact | null> {
    try {
      const docRef = doc(db, CONTACTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
          lastActivity: docSnap.data().lastActivity?.toDate(),
          nextFollowUp: docSnap.data().nextFollowUp?.toDate()
        } as CRMContact;
      }
      return null;
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw error;
    }
  }

  static async updateContact(id: string, updates: Partial<CRMContact>): Promise<void> {
    try {
      const docRef = doc(db, CONTACTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
        lastActivity: updates.lastActivity ? Timestamp.fromDate(updates.lastActivity) : undefined,
        nextFollowUp: updates.nextFollowUp ? Timestamp.fromDate(updates.nextFollowUp) : undefined
      });
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  static async deleteContact(id: string): Promise<void> {
    try {
      const docRef = doc(db, CONTACTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }
}

// Deal Services
export class DealService {
  static async createDeal(deal: Omit<CRMDeal, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date();
      const docRef = await addDoc(collection(db, DEALS_COLLECTION), {
        ...deal,
        expectedCloseDate: Timestamp.fromDate(deal.expectedCloseDate),
        actualCloseDate: deal.actualCloseDate ? Timestamp.fromDate(deal.actualCloseDate) : null,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now)
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating deal:', error);
      throw error;
    }
  }

  static async getDeals(userId: string): Promise<CRMDeal[]> {
    try {
      const q = query(
        collection(db, DEALS_COLLECTION),
        where('createdBy', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        expectedCloseDate: doc.data().expectedCloseDate?.toDate() || new Date(),
        actualCloseDate: doc.data().actualCloseDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as CRMDeal[];
    } catch (error) {
      console.error('Error fetching deals:', error);
      throw error;
    }
  }

  static async updateDeal(id: string, updates: Partial<CRMDeal>): Promise<void> {
    try {
      const docRef = doc(db, DEALS_COLLECTION, id);
      await updateDoc(docRef, {
        ...updates,
        expectedCloseDate: updates.expectedCloseDate ? Timestamp.fromDate(updates.expectedCloseDate) : undefined,
        actualCloseDate: updates.actualCloseDate ? Timestamp.fromDate(updates.actualCloseDate) : undefined,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error updating deal:', error);
      throw error;
    }
  }

  static async deleteDeal(id: string): Promise<void> {
    try {
      const docRef = doc(db, DEALS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting deal:', error);
      throw error;
    }
  }
}

// Activity Services
export class ActivityService {
  static async createActivity(activity: Omit<CRMActivity, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date();
      const docRef = await addDoc(collection(db, ACTIVITIES_COLLECTION), {
        ...activity,
        scheduledAt: activity.scheduledAt ? Timestamp.fromDate(activity.scheduledAt) : null,
        completedAt: activity.completedAt ? Timestamp.fromDate(activity.completedAt) : null,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now)
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }

  static async getActivities(userId: string): Promise<CRMActivity[]> {
    try {
      const q = query(
        collection(db, ACTIVITIES_COLLECTION),
        where('createdBy', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        scheduledAt: doc.data().scheduledAt?.toDate(),
        completedAt: doc.data().completedAt?.toDate(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as CRMActivity[];
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  }

  static async updateActivity(id: string, updates: Partial<CRMActivity>): Promise<void> {
    try {
      const docRef = doc(db, ACTIVITIES_COLLECTION, id);
      await updateDoc(docRef, {
        ...updates,
        scheduledAt: updates.scheduledAt ? Timestamp.fromDate(updates.scheduledAt) : undefined,
        completedAt: updates.completedAt ? Timestamp.fromDate(updates.completedAt) : undefined,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  }

  static async deleteActivity(id: string): Promise<void> {
    try {
      const docRef = doc(db, ACTIVITIES_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  }
}

// Analytics Services
export class AnalyticsService {
  static async getDashboardMetrics(userId: string): Promise<CRMDashboardMetrics> {
    try {
      const [contacts, deals, activities] = await Promise.all([
        ContactService.getContacts(userId),
        DealService.getDeals(userId),
        ActivityService.getActivities(userId)
      ]);

      // Calculate contact metrics
      const totalContacts = contacts.length;
      const newContacts = contacts.filter(c => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return c.createdAt > thirtyDaysAgo;
      }).length;
      const qualifiedContacts = contacts.filter(c => c.leadStatus === 'qualified').length;
      const convertedContacts = contacts.filter(c => c.leadStatus === 'converted').length;

      // Calculate deal metrics
      const totalDeals = deals.length;
      const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
      const averageValue = totalDeals > 0 ? totalValue / totalDeals : 0;
      const closedWonDeals = deals.filter(d => d.actualCloseDate && d.probability === 100).length;
      const closedLostDeals = deals.filter(d => d.actualCloseDate && d.probability === 0).length;
      const inProgressDeals = deals.filter(d => !d.actualCloseDate).length;

      // Calculate activity metrics
      const totalActivities = activities.length;
      const completedActivities = activities.filter(a => a.status === 'completed').length;
      const overdueActivities = activities.filter(a => 
        a.status === 'scheduled' && 
        a.scheduledAt && 
        a.scheduledAt < new Date()
      ).length;
      const upcomingActivities = activities.filter(a => 
        a.status === 'scheduled' && 
        a.scheduledAt && 
        a.scheduledAt > new Date()
      ).length;

      // Calculate performance metrics
      const conversionRate = totalContacts > 0 ? (convertedContacts / totalContacts) * 100 : 0;
      const winRate = (closedWonDeals + closedLostDeals) > 0 ? 
        (closedWonDeals / (closedWonDeals + closedLostDeals)) * 100 : 0;

      // Calculate average sales cycle (rough estimate)
      const closedDeals = deals.filter(d => d.actualCloseDate);
      const avgSalesCycle = closedDeals.length > 0 ? 
        closedDeals.reduce((sum, deal) => {
          const cycleDays = Math.floor((deal.actualCloseDate!.getTime() - deal.createdAt.getTime()) / (1000 * 60 * 60 * 24));
          return sum + cycleDays;
        }, 0) / closedDeals.length : 0;

      return {
        contacts: {
          total: totalContacts,
          new: newContacts,
          qualified: qualifiedContacts,
          converted: convertedContacts
        },
        deals: {
          total: totalDeals,
          totalValue,
          averageValue,
          closedWon: closedWonDeals,
          closedLost: closedLostDeals,
          inProgress: inProgressDeals
        },
        activities: {
          total: totalActivities,
          completed: completedActivities,
          overdue: overdueActivities,
          upcoming: upcomingActivities
        },
        performance: {
          conversionRate,
          avgSalesCycle: Math.round(avgSalesCycle),
          winRate,
          avgDealSize: averageValue
        }
      };
    } catch (error) {
      console.error('Error calculating dashboard metrics:', error);
      throw error;
    }
  }
}

// Initialize demo data for new users
export async function initializeDemoData(userId: string): Promise<void> {
  try {
    // Check if user already has data
    const existingContacts = await ContactService.getContacts(userId);
    if (existingContacts.length > 0) {
      return; // User already has data
    }

    // Create demo contacts
    const demoContacts = [
      {
        type: 'lead' as const,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@techcorp.com',
        phone: '+1 (555) 123-4567',
        company: 'Tech Corp Solutions',
        position: 'CTO',
        industry: 'Technology',
        leadSource: 'Website',
        leadStatus: 'qualified' as const,
        leadScore: 85,
        assignedTo: userId,
        tags: ['enterprise', 'hot-lead'],
        externalIds: {},
        createdBy: userId
      },
      {
        type: 'contact' as const,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@innovativedesign.com',
        phone: '+1 (555) 987-6543',
        company: 'Innovative Design Co',
        position: 'Marketing Director',
        industry: 'Design',
        leadSource: 'Referral',
        leadStatus: 'contacted' as const,
        leadScore: 72,
        assignedTo: userId,
        tags: ['design', 'medium-priority'],
        externalIds: {},
        createdBy: userId
      }
    ];

    // Create contacts and get their IDs
    const contactIds = await Promise.all(
      demoContacts.map(contact => ContactService.createContact(contact))
    );

    // Create demo deals
    const demoDeals = [
      {
        name: 'Tech Corp Enterprise License',
        contactId: contactIds[0],
        value: 25000,
        currency: 'USD',
        stageId: 'stage_3',
        probability: 75,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        assignedTo: userId,
        dealSource: 'Website',
        createdBy: userId
      }
    ];

    await Promise.all(
      demoDeals.map(deal => DealService.createDeal(deal))
    );

    // Create demo activities
    const demoActivities = [
      {
        type: 'call' as const,
        subject: 'Follow-up call with John Smith',
        description: 'Discuss enterprise licensing requirements',
        contactId: contactIds[0],
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        status: 'scheduled' as const,
        priority: 'high' as const,
        assignedTo: userId,
        participants: [],
        createdBy: userId
      }
    ];

    await Promise.all(
      demoActivities.map(activity => ActivityService.createActivity(activity))
    );

    console.log('Demo data initialized for user:', userId);
  } catch (error) {
    console.error('Error initializing demo data:', error);
    throw error;
  }
}