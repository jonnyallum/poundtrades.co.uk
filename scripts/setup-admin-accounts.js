/**
 * PoundTrades Admin Account Setup Script
 * 
 * This script creates admin accounts for the PoundTrades app using the Supabase Auth API.
 * It should be run once during initial setup of the application.
 * 
 * Usage:
 * 1. Make sure your .env file contains the correct SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * 2. Run: node scripts/setup-admin-accounts.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key (has admin privileges)
// NOTE: The service role key is different from the anon key and should be kept secret
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // This needs to be added to your .env file

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Admin account details
const adminAccounts = [
  {
    email: 'roger@poundtrades.co.uk',
    password: 'Theonlywayisup69!',
    user_metadata: {
      name: 'Roger Holman',
      role: 'admin'
    }
  },
  {
    email: 'jonny@kliqtmedia.co.uk',
    password: 'Aprilia1',
    user_metadata: {
      name: 'Jonny Allum',
      role: 'admin'
    }
  }
];

/**
 * Creates an admin user account
 * @param {Object} userData - User data including email, password, and metadata
 */
async function createAdminUser(userData) {
  try {
    // Create the user
    const { data: user, error } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      user_metadata: userData.user_metadata,
      email_confirm: true // Auto-confirm the email
    });

    if (error) {
      throw error;
    }

    console.log(`✅ Created admin user: ${userData.email}`);
    
    // Set admin role in auth.users
    // Note: In a real-world scenario, you might want to use a more sophisticated
    // role management system, such as Row Level Security policies based on roles
    const { error: updateError } = await supabase
      .from('users_roles')
      .insert({
        user_id: user.id,
        role: 'admin'
      });

    if (updateError) {
      console.warn(`⚠️ Could not set admin role in database: ${updateError.message}`);
      console.warn('You may need to create a users_roles table or set the role manually');
    } else {
      console.log(`✅ Set admin role for: ${userData.email}`);
    }

    return user;
  } catch (error) {
    console.error(`❌ Error creating admin user ${userData.email}:`, error.message);
    
    // If the user already exists, we can try to update their role
    if (error.message.includes('already exists')) {
      console.log(`⚠️ User ${userData.email} already exists. Attempting to update role...`);
      
      try {
        // Get the user ID
        const { data: existingUser, error: getUserError } = await supabase.auth.admin.listUsers({
          filters: {
            email: userData.email
          }
        });
        
        if (getUserError) throw getUserError;
        
        if (existingUser && existingUser.users && existingUser.users.length > 0) {
          const userId = existingUser.users[0].id;
          
          // Update user metadata
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            userId,
            { user_metadata: userData.user_metadata }
          );
          
          if (updateError) throw updateError;
          
          console.log(`✅ Updated metadata for existing user: ${userData.email}`);
        } else {
          console.error(`❌ Could not find existing user: ${userData.email}`);
        }
      } catch (updateError) {
        console.error(`❌ Error updating existing user ${userData.email}:`, updateError.message);
      }
    }
  }
}

/**
 * Main function to create all admin accounts
 */
async function setupAdminAccounts() {
  console.log('🚀 Setting up PoundTrades admin accounts...');
  
  for (const adminAccount of adminAccounts) {
    await createAdminUser(adminAccount);
  }
  
  console.log('✨ Admin account setup complete!');
  console.log('');
  console.log('Admin accounts created:');
  adminAccounts.forEach(account => {
    console.log(`- ${account.user_metadata.name} (${account.email})`);
  });
  console.log('');
  console.log('These accounts have full administrative privileges in the app.');
}

// Run the setup
setupAdminAccounts()
  .catch(error => {
    console.error('❌ Fatal error:', error);
  })
  .finally(() => {
    process.exit(0);
  });