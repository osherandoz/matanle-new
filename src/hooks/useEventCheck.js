import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useAuth } from './useAuth';

export const useEventCheck = () => {
  const { user, isAuthenticated } = useAuth();
  const [userEvents, setUserEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user has events when authenticated
  useEffect(() => {
    const checkUserEvents = async () => {
      if (!isAuthenticated || !user) {
        setUserEvents([]);
        setCurrentEvent(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get all events from user's events subcollection
        const eventsRef = collection(db, 'users', user.uid, 'events');
        const querySnapshot = await getDocs(eventsRef);

        const events = [];
        querySnapshot.forEach((doc) => {
          events.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // Sort events by creation date (newest first)
        events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setUserEvents(events);
        
        // Set the most recent event as current event (for backward compatibility)
        if (events.length > 0) {
          setCurrentEvent(events[0]);
        } else {
          setCurrentEvent(null);
        }
      } catch (err) {
        console.error('Error checking user events:', err);
        setError('שגיאה בבדיקת האירועים');
      } finally {
        setLoading(false);
      }
    };

    checkUserEvents();
  }, [user, isAuthenticated]);

  // Create a new event
  const createEvent = async (eventData) => {
    if (!user) {
      throw new Error('User must be authenticated to create an event');
    }

    try {
      setLoading(true);
      setError(null);

      // Generate a unique event ID
      const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newEvent = {
        ...eventData,
        ownerId: user.uid,
        ownerName: user.displayName || `${eventData.ownerFirstName || ''} ${eventData.ownerLastName || ''}`,
        ownerEmail: user.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'בתכנון'
      };

      // Create the event document in the user's events subcollection
      const eventRef = doc(db, 'users', user.uid, 'events', eventId);
      await setDoc(eventRef, newEvent);

      // Update local state
      const createdEvent = {
        id: eventId,
        ...newEvent
      };
      
      setUserEvents(prev => [createdEvent, ...prev]);
      setCurrentEvent(createdEvent);

      return createdEvent;
    } catch (err) {
      console.error('Error creating event:', err);
      setError('שגיאה ביצירת האירוע');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing event
  const updateEvent = async (eventId, updatedEventData) => {
    if (!user || !eventId) {
      throw new Error('User must be authenticated and provide event ID to update');
    }

    try {
      setLoading(true);
      setError(null);

      // Update the event document
      const eventRef = doc(db, 'users', user.uid, 'events', eventId);
      await updateDoc(eventRef, {
        ...updatedEventData,
        updatedAt: new Date()
      });

      // Update local state
      const updatedEvents = userEvents.map(event => 
        event.id === eventId 
          ? { ...event, ...updatedEventData, updatedAt: new Date() }
          : event
      );
      
      setUserEvents(updatedEvents);
      
      // Update current event if it's the one being updated
      if (currentEvent && currentEvent.id === eventId) {
        setCurrentEvent({ ...currentEvent, ...updatedEventData, updatedAt: new Date() });
      }

      return { id: eventId, ...updatedEventData, updatedAt: new Date() };
    } catch (err) {
      console.error('Error updating event:', err);
      setError('שגיאה בעדכון האירוע');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete an event
  const deleteEvent = async (eventId) => {
    if (!user || !eventId) {
      throw new Error('User must be authenticated and provide event ID to delete');
    }

    try {
      setLoading(true);
      setError(null);

      // Delete the event document and all its subcollections
      const eventRef = doc(db, 'users', user.uid, 'events', eventId);
      await deleteDoc(eventRef);

      // Update local state
      const updatedEvents = userEvents.filter(event => event.id !== eventId);
      setUserEvents(updatedEvents);
      
      // Update current event if it was deleted
      if (currentEvent && currentEvent.id === eventId) {
        setCurrentEvent(updatedEvents.length > 0 ? updatedEvents[0] : null);
      }

      return true;
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('שגיאה במחיקת האירוע');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Set current event (for switching between events)
  const setCurrentEventById = (eventId) => {
    const event = userEvents.find(e => e.id === eventId);
    if (event) {
      setCurrentEvent(event);
    }
  };

  // Get event subcollection data
  const getEventSubcollection = async (eventId, subcollectionName) => {
    if (!user || !eventId || !subcollectionName) {
      throw new Error('User must be authenticated and provide event ID and subcollection name');
    }

    try {
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
      throw err;
    }
  };

  // Add item to event subcollection
  const addToEventSubcollection = async (eventId, subcollectionName, itemData) => {
    if (!user || !eventId || !subcollectionName || !itemData) {
      throw new Error('User must be authenticated and provide event ID, subcollection name, and item data');
    }

    try {
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
      throw err;
    }
  };

  return {
    // Backward compatibility
    userEvent: currentEvent,
    hasEvent: !!currentEvent,
    
    // New structure
    userEvents,
    currentEvent,
    loading,
    error,
    
    // Event management
    createEvent,
    updateEvent,
    deleteEvent,
    setCurrentEventById,
    
    // Subcollection management
    getEventSubcollection,
    addToEventSubcollection
  };
};
