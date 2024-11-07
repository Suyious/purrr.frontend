import { useRef, useState } from "react";
import SettingsIcon from '@/assets/icons/settings';

type SettingsDropdownProps = {
  setUserName: (name: string) => void
}

const SettingsDropdown = ({ setUserName }: SettingsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);

  const [newUsername, setNewUsername] = useState('');

  const handleUsernameChange = () => {
    setUserName(newUsername);
    setNewUsername('');
  }

  const handleLogout = () => {
    alert('Logout not implemented yet')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <SettingsIcon />
        <span>Settings</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-lg shadow-xl z-50 transition-all duration-300 transform origin-top-right">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="space-y-2">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter new username"
                  className="w-full px-3 py-2 bg-inherit border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="New username input"
                />
                <button
                  onClick={handleUsernameChange}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <span>Save Username</span>
                </button>
              </div>
            </div>

            <div className="border-t pt-2">
              {!showLogoutConfirm ? (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-500 hover:bg-red-200 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <span>Logout</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-center text-gray-600">Are you sure you want to logout?</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleLogout}
                      className="flex-1 px-4 py-2 bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsDropdown;
