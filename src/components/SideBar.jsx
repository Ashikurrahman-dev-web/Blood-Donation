"use client"
import React, { useState } from 'react';
import { 
  Home, 
  Settings,  
  Menu, 
  X, 
  GitPullRequestCreate,
  UserRoundPlus,
  Columns4,
  UsersRound
} from 'lucide-react'; 
import Logo from './Logo';
import { useSession } from '@/lib/auth-client';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
const { data: session } = useSession();
const user = session?.user
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
const dashboaedItems = {
    "donor": [
        { name: 'Home', icon: <Home className="w-5 h-5" />, href: '/dashboard/donor' }, 
        { name: 'ProfileSettings', icon: <Settings className="w-5 h-5" />, href: '' }, 
{ name: 'My Donation Request', icon: <GitPullRequestCreate className="w-5 h-5" />, href: '/dashboard/mydonationrequest' },
{ name: 'Create Donation Request', icon: <UserRoundPlus className="w-5 h-5" />, href: '/dashboard/createdonationrequest' },
    ],
    "volunteer":[
        { name: 'Home', icon: <Home className="w-5 h-5" />, href: '/dashboard/volunteer' }, 
        { name: 'ProfileSettings', icon: <Settings className="w-5 h-5" />, href: '' }, 
{ name: 'All Blood Donation', icon: <Columns4 className="w-5 h-5" />, href: '/dashboard/allblooddonationvolunteer' }, 

    ],
    "admin":[
  { name: 'Home', icon: <Home className="w-5 h-5" />, href: '/dashboard/admin' }, 
        { name: 'ProfileSettings', icon: <Settings className="w-5 h-5" />, href: '' },
      { name: 'All Users', icon: <UsersRound className="w-5 h-5" />, href: '/dashboard/allusers' }, 
{ name: 'All Blood Donation', icon: <Columns4 className="w-5 h-5" />, href: '/dashboard/allblooddonationadmin'},               
    ]
}
const menuItems = dashboaedItems[user?.role] || [];

  return (
    <div className="flex bg-gray-100 min-h-screen mr-8">
      
      {/* 1. Mobile Hamburger Button (শুধু মোবাইল স্ক্রিনের জন্য) */}
      <div className="lg:hidden p-4 absolute top-0 left-0 z-50">
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-md bg-white shadow-md text-gray-700 hover:bg-gray-50 focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 2. Backdrop Blur for Mobile (মোবাইলে সাইডবার খুললে পেছনের অংশ অন্ধকার করার জন্য) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* 3. Sidebar Component */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white p-5 flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-screen
      `}>
        
        <div>
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-slate-800">
            <Logo />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
  {menuItems.map((item, index) => (
    <a
      key={index}
      href={item.href}
      className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-indigo-600 hover:text-white transition-all group"
    >
      <div className="text-slate-400 group-hover:text-white transition-colors">
        {item.icon}
      </div>
      <span className="font-medium">{item.name}</span>
    </a>
  ))}
</nav>
        </div>
 </aside>
 </div>
  );
};

export default SideBar;