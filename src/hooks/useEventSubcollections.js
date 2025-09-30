import { useState } from 'react';
import { doc, setDoc, updateDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useAuth } from './useAuth';

export const useEventSubcollections = (eventId) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generic function to get items from any subcollection
  const getItems = async (subcollectionName) => {
    if (!user || !eventId) {
      throw new Error('User must be authenticated and event ID must be provided');
    }

    try {
      setLoading(true);
      setError(null);

      const subcollectionRef = collection(db, 'users', user.uid, 'events', eventId, subcollectionName);
      const querySnapshot = await getDocs(subcollectionRef);
      
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return items;
    } catch (err) {
      console.error(`Error getting ${subcollectionName}:`, err);
      setError(`שגיאה בטעינת ${subcollectionName}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Generic function to add item to any subcollection
  const addItem = async (subcollectionName, itemData) => {
    if (!user || !eventId || !itemData) {
      throw new Error('User must be authenticated, event ID must be provided, and item data is required');
    }

    try {
      setLoading(true);
      setError(null);

      const subcollectionRef = collection(db, 'users', user.uid, 'events', eventId, subcollectionName);
      const docRef = doc(subcollectionRef);
      
      const itemWithMetadata = {
        ...itemData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(docRef, itemWithMetadata);

      return {
        id: docRef.id,
        ...itemWithMetadata
      };
    } catch (err) {
      console.error(`Error adding to ${subcollectionName}:`, err);
      setError(`שגיאה בהוספת ${subcollectionName}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Generic function to update item in any subcollection
  const updateItem = async (subcollectionName, itemId, updatedData) => {
    if (!user || !eventId || !itemId || !updatedData) {
      throw new Error('User must be authenticated, event ID, item ID, and updated data must be provided');
    }

    try {
      setLoading(true);
      setError(null);

      const itemRef = doc(db, 'users', user.uid, 'events', eventId, subcollectionName, itemId);
      await updateDoc(itemRef, {
        ...updatedData,
        updatedAt: new Date()
      });

      return {
        id: itemId,
        ...updatedData,
        updatedAt: new Date()
      };
    } catch (err) {
      console.error(`Error updating ${subcollectionName} item:`, err);
      setError(`שגיאה בעדכון ${subcollectionName}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Generic function to delete item from any subcollection
  const deleteItem = async (subcollectionName, itemId) => {
    if (!user || !eventId || !itemId) {
      throw new Error('User must be authenticated, event ID, and item ID must be provided');
    }

    try {
      setLoading(true);
      setError(null);

      const itemRef = doc(db, 'users', user.uid, 'events', eventId, subcollectionName, itemId);
      await deleteDoc(itemRef);

      return true;
    } catch (err) {
      console.error(`Error deleting ${subcollectionName} item:`, err);
      setError(`שגיאה במחיקת ${subcollectionName}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Specific functions for each subcollection
  const getGifts = () => getItems('gifts');
  const addGift = (giftData) => addItem('gifts', giftData);
  const updateGift = (giftId, updatedData) => updateItem('gifts', giftId, updatedData);
  const deleteGift = (giftId) => deleteItem('gifts', giftId);

  const getVendors = () => getItems('vendors');
  const addVendor = (vendorData) => addItem('vendors', vendorData);
  const updateVendor = (vendorId, updatedData) => updateItem('vendors', vendorId, updatedData);
  const deleteVendor = (vendorId) => deleteItem('vendors', vendorId);

  const getExpenses = () => getItems('expenses');
  const addExpense = (expenseData) => addItem('expenses', expenseData);
  const updateExpense = (expenseId, updatedData) => updateItem('expenses', expenseId, updatedData);
  const deleteExpense = (expenseId) => deleteItem('expenses', expenseId);

  const getGuests = () => getItems('guests');
  const addGuest = (guestData) => addItem('guests', guestData);
  const updateGuest = (guestId, updatedData) => updateItem('guests', guestId, updatedData);
  const deleteGuest = (guestId) => deleteItem('guests', guestId);

  return {
    loading,
    error,
    
    // Generic functions
    getItems,
    addItem,
    updateItem,
    deleteItem,
    
    // Specific functions for each subcollection
    // Gifts
    getGifts,
    addGift,
    updateGift,
    deleteGift,
    
    // Vendors
    getVendors,
    addVendor,
    updateVendor,
    deleteVendor,
    
    // Expenses
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    
    // Guests
    getGuests,
    addGuest,
    updateGuest,
    deleteGuest
  };
};
