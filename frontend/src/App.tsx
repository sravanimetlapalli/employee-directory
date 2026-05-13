import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar          from './components/Navbar';
import EmployeesPage   from './pages/EmployeesPage';
import EmployeeDetail  from './pages/EmployeeDetail';
import GroupsPage      from './pages/GroupsPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">

        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '10px',
              fontSize: '14px',
            },
          }}
        />

        {/* Top Navigation */}
        <Navbar />

        {/* Page Content */}
        <main>
          <Routes>
            <Route path="/"                    element={<EmployeesPage />} />
            <Route path="/employees/:id"       element={<EmployeeDetail />} />
            <Route path="/groups"              element={<GroupsPage />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
};

export default App;