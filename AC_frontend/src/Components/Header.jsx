import { Menu, Bell, User } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ onMenuClick, onProfileClick, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleProfileClick = () => {
    setDropdownOpen(false);
    if (onProfileClick) onProfileClick();
  };

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    if (onLogout) onLogout();
  };

  return (
    <header className="bg-[#174E63] text-white flex justify-between items-center px-6 py-4 shadow-md relative">
      {/* Left: Hamburger & Logo */}
      <div className="flex items-center space-x-4">
        <button onClick={onMenuClick} className="p-2 rounded hover:bg-[#145263]">
          <Menu className="w-6 h-6" />
        </button>
        <img src="/logo.png" alt="Logo" className="h-10 w-25" />
      </div>

      {/* Right: Company, Bell, Profile */}
      <div className="flex items-center space-x-6 relative">
        <span className="text-lg font-semibold">Goanny Technology</span>
        <Bell className="w-6 h-6 cursor-pointer" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button onClick={toggleDropdown} className="flex items-center space-x-2">
            <User className="w-6 h-6" />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50"
              >
                <button
                  onClick={handleProfileClick}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Logout
                </button>
                
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
