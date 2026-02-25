import React from 'react';
import { Icon } from '@chakra-ui/react';
import {
  MdHome,
  MdLock,
  MdPeople,
  MdDescription,
  MdSubscriptions,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/dashboard';

import Users from 'views/admin/User';

import AddAboutus from 'views/admin/addAboutUs';
import AddTermsConditions from 'views/admin/addTermsCondition';
import AddPrivacyPolicy from 'views/admin/addPrivacyPolicy';

import Course from 'views/admin/AddCourse';

import Chapter from 'views/admin/AddChapter';
import Payment from 'views/admin/Payment';

import Subscription from 'views/admin/Subscription';
import ProfilePage from 'views/admin/profile/ProfileSetting';

import Topic from 'views/admin/topic.jsx';

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import { FaUsersCog, FaWallet } from 'react-icons/fa';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Profile Setting',
    layout: '/admin',
    path: '/profile-setting',
    component: <ProfilePage />,
    showInSidebar: false, // Yeh line sabse zaroori hai
  },
  {
    name: 'User List',
    layout: '/admin',
    icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      {
        name: 'Users',
        layout: '/admin',
        path: '/users',
        component: <Users />,
      },
    ],
  },

  {
    name: 'Creative Hub',
    layout: '/admin',
    icon: <Icon as={FaUsersCog} width="20px" height="20px" color="inherit" />,
    collapse: true,
    path: '/hiring', // parent (not a real page)
    items: [
      {
        name: 'Add Story Category',
        layout: '/admin',
        path: '/story-category',
        component: <Course />,
      },

      {
        name: 'Add Story Chapter',
        layout: '/admin',
        path: '/story-chapter',
        component: <Chapter />,
      },
      {
        name: 'Add Story Topic',
        layout: '/admin',
        path: '/story-topic',
        component: <Topic />,
      },
    ],
  },

  {
    name: 'Subscriptions',
    layout: '/admin',
    icon: (
      <Icon as={MdSubscriptions} width="20px" height="20px" color="inherit" />
    ),
    path: '/subscription',
    component: <Subscription />,
  },
  {
    name: 'Payment List',
    layout: '/admin',
    icon: <Icon as={FaWallet} width="20px" height="20px" color="inherit" />,
    path: '/payment',
    component: <Payment />,
  },

  {
    name: 'CMS Pages',
    layout: '/admin',
    icon: (
      <Icon as={MdDescription} width="20px" height="20px" color="inherit" />
    ),
    collapse: true,
    items: [
      {
        name: 'About Us',
        layout: '/admin',
        path: '/add-aboutus',
        component: <AddAboutus />,
      },
      {
        name: 'Terms & Conditions',
        layout: '/admin',
        path: '/add-terms-conditions',
        component: <AddTermsConditions />,
      },
      {
        name: 'Privacy Policy',
        layout: '/admin',
        path: '/add-privacypolicy',
        component: <AddPrivacyPolicy />,
      },
    ],
  },
  {
    name: 'Sign In',
    layout: '/', // Updated for navigation purposes
    path: '/', // Updated for navigation purposes
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
];

export default routes;
