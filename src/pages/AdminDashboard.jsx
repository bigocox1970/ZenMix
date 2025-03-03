import React, { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../hooks/useAdmin';
import AppLayout from '../components/AppLayout';
import { Shield, User, UserCheck, UserX, Trash2, Search, RefreshCw, X, Calendar, Mail, Clock, Settings, CreditCard } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { supabase, isConnected, connectionError } = useSupabase();
  const { isAdmin, loading: adminLoading, error: adminError } = useAdmin();
  
  // User management state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  
  // User profile modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    if (!isAdmin) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Add subscription_type if it doesn't exist
      const usersWithSubscription = data.map(user => ({
        ...user,
        subscription_type: user.subscription_type || 'free'
      }));
      
      setUsers(usersWithSubscription || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle admin status
  const toggleAdmin = async (userId, makeAdmin) => {
    if (!isAdmin) return;
    
    try {
      setActionLoading(true);
      
      const { error } = await supabase.rpc('toggle_user_admin', {
        user_id: userId,
        make_admin: makeAdmin
      });
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, is_admin: makeAdmin } : u
      ));
      
      // Update selected user if modal is open
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({...selectedUser, is_admin: makeAdmin});
      }
      
      setActionMessage({
        type: 'success',
        text: `User ${makeAdmin ? 'promoted to admin' : 'demoted from admin'} successfully`
      });
      
      // Clear message after 3 seconds
      setTimeout(() => setActionMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Error toggling admin status:', err);
      setActionMessage({
        type: 'error',
        text: `Error: ${err.message}`
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Suspend/unsuspend user (we'll implement this by setting a suspended flag)
  const toggleSuspended = async (userId, suspend) => {
    if (!isAdmin) return;
    
    try {
      setActionLoading(true);
      
      // First check if the suspended column exists, if not add it
      const { error: columnCheckError } = await supabase.rpc('add_suspended_column_if_not_exists');
      
      if (columnCheckError) {
        // If the RPC doesn't exist, try to add the column directly
        await supabase.query(`
          ALTER TABLE profiles 
          ADD COLUMN IF NOT EXISTS suspended BOOLEAN DEFAULT false
        `);
      }
      
      // Now update the user's suspended status
      const { error } = await supabase
        .from('profiles')
        .update({ suspended: suspend })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, suspended: suspend } : u
      ));
      
      // Update selected user if modal is open
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({...selectedUser, suspended: suspend});
      }
      
      setActionMessage({
        type: 'success',
        text: `User ${suspend ? 'suspended' : 'unsuspended'} successfully`
      });
      
      // Clear message after 3 seconds
      setTimeout(() => setActionMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Error toggling suspended status:', err);
      setActionMessage({
        type: 'error',
        text: `Error: ${err.message}`
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Delete user (this is a dangerous operation!)
  const deleteUser = async (userId) => {
    if (!isAdmin) return;
    
    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      setActionLoading(true);
      
      // Delete user from auth.users (this will cascade to profiles due to our triggers)
      // Note: This requires admin privileges in Supabase
      const { error } = await supabase.rpc('delete_user', {
        user_id: userId
      });
      
      if (error) {
        // If the RPC fails, try to delete just from profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);
          
        if (profileError) throw profileError;
      }
      
      // Update local state
      setUsers(users.filter(u => u.id !== userId));
      
      // Close modal if the deleted user was selected
      if (selectedUser && selectedUser.id === userId) {
        setShowUserModal(false);
        setSelectedUser(null);
      }
      
      setActionMessage({
        type: 'success',
        text: 'User deleted successfully'
      });
      
      // Clear message after 3 seconds
      setTimeout(() => setActionMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Error deleting user:', err);
      setActionMessage({
        type: 'error',
        text: `Error: ${err.message}`
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Open user profile modal
  const openUserProfile = (profile) => {
    setSelectedUser(profile);
    setShowUserModal(true);
  };

  // Filter users based on search term
  const filteredUsers = searchTerm
    ? users.filter(u => 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.nickname?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  // Load users on component mount
  useEffect(() => {
    if (user && isAdmin && !adminLoading) {
      fetchUsers();
    }
  }, [user, isAdmin, adminLoading]);

  // Update user subscription
  const updateSubscription = async (userId, subscriptionType) => {
    if (!isAdmin) return;
    
    try {
      setActionLoading(true);
      
      // First check if the subscription_type column exists, if not add it
      const { error: columnCheckError } = await supabase.rpc('add_subscription_column_if_not_exists');
      
      if (columnCheckError) {
        // If the RPC doesn't exist, try to add the column directly
        await supabase.query(`
          ALTER TABLE profiles 
          ADD COLUMN IF NOT EXISTS subscription_type TEXT DEFAULT 'free'
        `);
      }
      
      // Now update the user's subscription status
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_type: subscriptionType })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, subscription_type: subscriptionType } : u
      ));
      
      // Update selected user if modal is open
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({...selectedUser, subscription_type: subscriptionType});
      }
      
      setActionMessage({
        type: 'success',
        text: `User subscription updated to ${subscriptionType}`
      });
      
      // Clear message after 3 seconds
      setTimeout(() => setActionMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Error updating subscription:', err);
      setActionMessage({
        type: 'error',
        text: `Error: ${err.message}`
      });
    } finally {
      setActionLoading(false);
    }
  };

  // If not admin, show access denied
  if (!adminLoading && !isAdmin) {
    return (
      <AppLayout user={user}>
        <div className="p-6 pt-20">
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p>You do not have permission to access the admin dashboard.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user}>
      <div className="p-6 pt-20 pb-32">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Shield className="mr-2 h-6 w-6" />
            Admin Dashboard
          </h1>
          
          <button 
            onClick={fetchUsers} 
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading || actionLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        
        {connectionError && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
            <p className="font-medium">Connection Error: {connectionError}</p>
            <p className="text-sm mt-1">Please check your internet connection and try again.</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}
        
        {actionMessage.text && (
          <div className={`${
            actionMessage.type === 'success' 
              ? 'bg-green-500/10 border-green-500 text-green-500' 
              : 'bg-red-500/10 border-red-500 text-red-500'
          } border p-4 rounded-lg mb-6`}>
            <p className="font-medium">{actionMessage.text}</p>
          </div>
        )}
        
        {/* User search */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by email or nickname..."
            className="pl-10 pr-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Users table */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Plan
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                      {searchTerm ? 'No users match your search' : 'No users found'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(profile => (
                    <tr key={profile.id} className={profile.suspended ? 'bg-red-900/20' : ''}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div 
                          className="flex items-start cursor-pointer hover:bg-gray-700/30 p-2 rounded-lg transition-colors"
                          onClick={() => openUserProfile(profile)}
                        >
                          <div className="flex-shrink-0 h-10 w-10">
                            {profile.avatar_url ? (
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={profile.avatar_url} 
                                alt={profile.nickname || profile.email} 
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                                <User className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">
                              {profile.nickname || 'No nickname'}
                            </div>
                            <div className="text-sm text-gray-400">
                              {profile.email}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {profile.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            profile.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {profile.is_admin ? 'Admin' : 'User'}
                          </span>
                          
                          {profile.suspended && (
                            <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Suspended
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          profile.subscription_type === 'pro' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : profile.subscription_type === 'standard'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          <CreditCard className="h-3 w-3 mr-1" />
                          {profile.subscription_type === 'pro' 
                            ? 'Pro' 
                            : profile.subscription_type === 'standard'
                              ? 'Standard'
                              : 'Free'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {/* Toggle admin status */}
                          <button
                            onClick={() => toggleAdmin(profile.id, !profile.is_admin)}
                            disabled={actionLoading || profile.id === user.id}
                            className={`p-1 rounded-full ${
                              profile.is_admin 
                                ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' 
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            } ${(actionLoading || profile.id === user.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={profile.is_admin ? 'Remove admin status' : 'Make admin'}
                          >
                            <Shield className="h-5 w-5" />
                          </button>
                          
                          {/* Toggle suspended status */}
                          <button
                            onClick={() => toggleSuspended(profile.id, !profile.suspended)}
                            disabled={actionLoading || profile.id === user.id}
                            className={`p-1 rounded-full ${
                              profile.suspended
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            } ${(actionLoading || profile.id === user.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={profile.suspended ? 'Unsuspend user' : 'Suspend user'}
                          >
                            {profile.suspended ? (
                              <UserCheck className="h-5 w-5" />
                            ) : (
                              <UserX className="h-5 w-5" />
                            )}
                          </button>
                          
                          {/* Delete user */}
                          <button
                            onClick={() => deleteUser(profile.id)}
                            disabled={actionLoading || profile.id === user.id}
                            className={`p-1 rounded-full bg-red-100 text-red-800 hover:bg-red-200 ${
                              (actionLoading || profile.id === user.id) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            title="Delete user"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold">Admin Actions</h2>
          </div>
          <div className="p-4">
            <p className="text-gray-400 mb-4">
              As an admin, you can manage users, toggle admin status, suspend users, and delete accounts.
              Use these powers responsibly.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Admin Status
                </h3>
                <p className="text-sm text-gray-400">
                  Admins can access this dashboard and manage other users.
                  Be careful when granting admin privileges.
                </p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                  <UserX className="h-5 w-5 mr-2" />
                  Suspension
                </h3>
                <p className="text-sm text-gray-400">
                  Suspended users cannot access the application.
                  This is useful for temporary bans.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* User Profile Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
            <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
                <h2 className="text-xl font-bold">User Profile</h2>
                <button 
                  onClick={() => setShowUserModal(false)}
                  className="p-1 rounded-full hover:bg-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-4">
                {/* User header */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                    {selectedUser.avatar_url ? (
                      <img 
                        src={selectedUser.avatar_url} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold mb-1">
                      {selectedUser.nickname || 'No nickname'}
                    </h3>
                    <p className="text-gray-400 mb-2">{selectedUser.email}</p>
                    
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedUser.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedUser.is_admin ? 'Admin' : 'User'}
                      </span>
                      
                      {selectedUser.suspended && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          Suspended
                        </span>
                      )}
                      
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedUser.subscription_type === 'pro' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : selectedUser.subscription_type === 'standard'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        <CreditCard className="h-4 w-4 mr-1" />
                        {selectedUser.subscription_type === 'pro' 
                          ? 'Pro' 
                          : selectedUser.subscription_type === 'standard'
                            ? 'Standard'
                            : 'Free'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* User details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Personal Information
                    </h4>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-400">User ID</p>
                        <p className="font-mono text-xs break-all">{selectedUser.id}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p>{selectedUser.email || 'Not set'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400">Nickname</p>
                        <p>{selectedUser.nickname || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Account Activity
                    </h4>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-400">Created At</p>
                        <p>{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400">Last Updated</p>
                        <p>{selectedUser.updated_at ? new Date(selectedUser.updated_at).toLocaleDateString() : 'Never'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Preferences
                    </h4>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-400">Default Duration</p>
                        <p>{selectedUser.default_duration || 10} minutes</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400">Preferred Voice</p>
                        <p className="capitalize">{selectedUser.preferred_voice || 'female'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400">Preferred Background</p>
                        <p className="capitalize">{selectedUser.preferred_background || 'nature'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Subscription
                    </h4>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-400">Current Plan</p>
                        <p className="capitalize">{selectedUser.subscription_type || 'free'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400">Change Plan</p>
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => updateSubscription(selectedUser.id, 'free')}
                            disabled={actionLoading}
                            className={`px-2 py-1 text-xs rounded ${
                              selectedUser.subscription_type === 'free' 
                                ? 'bg-gray-600 text-white' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            Free
                          </button>
                          <button
                            onClick={() => updateSubscription(selectedUser.id, 'standard')}
                            disabled={actionLoading}
                            className={`px-2 py-1 text-xs rounded ${
                              selectedUser.subscription_type === 'standard' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50'
                            }`}
                          >
                            Standard
                          </button>
                          <button
                            onClick={() => updateSubscription(selectedUser.id, 'pro')}
                            disabled={actionLoading}
                            className={`px-2 py-1 text-xs rounded ${
                              selectedUser.subscription_type === 'pro' 
                                ? 'bg-yellow-600 text-white' 
                                : 'bg-yellow-900/30 text-yellow-300 hover:bg-yellow-900/50'
                            }`}
                          >
                            Pro
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Admin actions */}
                <div className="mt-4 bg-gray-700/50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Admin Actions
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => toggleAdmin(selectedUser.id, !selectedUser.is_admin)}
                      disabled={actionLoading || selectedUser.id === user.id}
                      className={`py-2 px-3 rounded-lg text-sm ${
                        selectedUser.is_admin 
                          ? 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50' 
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      } ${(actionLoading || selectedUser.id === user.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {selectedUser.is_admin ? 'Remove Admin' : 'Make Admin'}
                    </button>
                    
                    <button
                      onClick={() => toggleSuspended(selectedUser.id, !selectedUser.suspended)}
                      disabled={actionLoading || selectedUser.id === user.id}
                      className={`py-2 px-3 rounded-lg text-sm ${
                        selectedUser.suspended
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-red-600 text-white hover:bg-red-700'
                      } ${(actionLoading || selectedUser.id === user.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {selectedUser.suspended ? 'Unsuspend' : 'Suspend'}
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowUserModal(false);
                        setTimeout(() => deleteUser(selectedUser.id), 300);
                      }}
                      disabled={actionLoading || selectedUser.id === user.id}
                      className={`py-2 px-3 rounded-lg text-sm bg-red-900/30 text-red-300 hover:bg-red-900/50 ${
                        (actionLoading || selectedUser.id === user.id) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Delete User
                    </button>
                  </div>
                </div>
                
                {/* Raw JSON data for debugging */}
                <div className="mt-4">
                  <details className="text-gray-400 text-xs">
                    <summary className="cursor-pointer hover:text-white transition-colors">
                      Raw Profile Data
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-900 rounded-lg overflow-x-auto text-xs">
                      {JSON.stringify(selectedUser, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;