import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useAuth } from './useAuth';

export const useEventCheck = () => {
  const { user, isAuthenticated } = useAuth();
  const [userEvent, setUserEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user has an event when authenticated
  useEffect(() => {
    const checkUserEvent = async () => {
      if (!isAuthenticated || !user) {
        setUserEvent(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Query for events where the user is the owner
        const eventsRef = collection(db, 'events');
        const q = query(eventsRef, where('ownerId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // User has an event - get the first one
          const eventDoc = querySnapshot.docs[0];
          const eventData = {
            id: eventDoc.id,
            ...eventDoc.data()
          };
          setUserEvent(eventData);
        } else {
          // No event found
          setUserEvent(null);
        }
      } catch (err) {
        console.error('Error checking user event:', err);
        setError('שגיאה בבדיקת האירוע');
      } finally {
        setLoading(false);
      }
    };

    checkUserEvent();
  }, [user, isAuthenticated]);

  // Create a new event
  const createEvent = async (eventData) => {
    if (!user) {
      throw new Error('User must be authenticated to create an event');
    }

    try {
      setLoading(true);
      setError(null);

      // Create event document
      const eventRef = doc(collection(db, 'events'));
      const newEvent = {
        ...eventData,
        ownerId: user.uid,
        ownerName: user.displayName || `${eventData.ownerFirstName || ''} ${eventData.ownerLastName || ''}`,
        ownerEmail: user.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'בתכנון'
      };

      await setDoc(eventRef, newEvent);

      // Update local state
      const createdEvent = {
        id: eventRef.id,
        ...newEvent
      };
      setUserEvent(createdEvent);

      return createdEvent;
    } catch (err) {
      console.error('Error creating event:', err);
      setError('שגיאה ביצירת האירוע');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    userEvent,
    hasEvent: !!userEvent,
    loading,
    error,
    createEvent
  };
};
