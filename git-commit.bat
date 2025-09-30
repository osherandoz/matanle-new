@echo off
cd /d "C:\Users\osher\OneDrive\Desktop\ניהול עסק\פרויקטים חדשים\matanle-new"
git add .
git commit -m "Fix: Update event storage to use user documents instead of separate events collection

- Modified useEventCheck hook to store events under /users/{userId}/currentEvent
- Updated event creation to save events in user document
- Updated event fetching to read from user document
- Added updateEvent and deleteEvent functions
- Improved data structure for better user-event association"
git push origin main
