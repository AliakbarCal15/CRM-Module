import { useEffect, useState } from 'react';
import axios from 'axios';

const Settings = () => {
  const [preferences, setPreferences] = useState({
    email: false,
    sms: false,
    push: false,
  });

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/preferences');
        setPreferences(response.data);
      } catch (error) {
        console.error('Failed to load notification preferences', error);
      }
    };

    fetchPreferences();
  }, []);

  const handleToggle = (type) => {
    setPreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put('http://localhost:5000/api/users/preferences', preferences);
      alert('Preferences updated successfully!');
    } catch (error) {
      console.error('Failed to update preferences', error);
      alert('Error updating preferences.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Notification Preferences</h1>

      <div className="space-y-4 max-w-md">
        {['email', 'sms', 'push'].map((type) => (
          <div key={type} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded">
            <span className="capitalize">{type} Notifications</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences[type]}
                onChange={() => handleToggle(type)}
                className="sr-only"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full relative peer">
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${preferences[type] ? 'translate-x-full' : ''}`}></div>
              </div>
            </label>
          </div>
        ))}

        <button
          onClick={handleSave}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default Settings;
