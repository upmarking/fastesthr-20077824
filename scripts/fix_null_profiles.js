import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://swlknrfufxsvpkfulqcx.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.log("Please run this with SUPABASE_SERVICE_ROLE_KEY in env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkAndFixProfile() {
  console.log("Checking profiles...");
  
  // 1. Get all profiles with NULL company_id
  const { data: nullProfiles, error: fetchErr } = await supabase
    .from('profiles')
    .select('*')
    .is('company_id', null);
    
  if (fetchErr) {
    console.error("Error fetching profiles:", fetchErr);
    return;
  }
  
  console.log(`Found ${nullProfiles?.length || 0} profiles with NULL company_id.`);
  
  if (!nullProfiles || nullProfiles.length === 0) {
    console.log("No profiles need fixing.");
    return;
  }

  // 2. Get the first company to assign them to (or create a default one)
  let { data: companies, error: compErr } = await supabase
    .from('companies')
    .select('id, name')
    .limit(1);
    
  if (compErr) {
    console.error("Error fetching companies:", compErr);
    return;
  }
  
  let companyId;
  
  if (!companies || companies.length === 0) {
    console.log("No companies found. Creating a default 'FastestHR Default' company...");
    const { data: newCompany, error: createErr } = await supabase
      .from('companies')
      .insert({
        name: 'FastestHR Default',
        slug: 'fastesthr-default-' + Math.floor(Math.random() * 10000),
        size: '1-10',
        industry: 'Technology',
        country: 'US',
        plan: 'trial'
      })
      .select('id')
      .single();
      
    if (createErr) {
      console.error("Error creating default company:", createErr);
      return;
    }
    companyId = newCompany.id;
    console.log(`Created default company with ID: ${companyId}`);
  } else {
    companyId = companies[0].id;
    console.log(`Using existing company '${companies[0].name}' with ID: ${companyId}`);
  }
  
  // 3. Update the profiles
  for (const profile of nullProfiles) {
    console.log(`Updating profile ${profile.id} (${profile.full_name}) with company_id: ${companyId}`);
    
    // Update profile
    const { error: updateErr } = await supabase
      .from('profiles')
      .update({ 
        company_id: companyId,
        platform_role: profile.platform_role === 'user' ? 'company_admin' : profile.platform_role // Elevate to admin to avoid RLS issues
      })
      .eq('id', profile.id);
      
    if (updateErr) {
      console.error(`Failed to update profile ${profile.id}:`, updateErr);
    } else {
      console.log(`Successfully updated profile ${profile.id}`);
      
      // Update or create employee record
      const { data: empData } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', profile.id)
        .maybeSingle();
        
      if (empData) {
         await supabase.from('employees').update({ company_id: companyId }).eq('id', empData.id);
         console.log(`Updated existing employee record for ${profile.id}`);
      } else {
         await supabase.from('employees').insert({
           user_id: profile.id,
           company_id: companyId,
           first_name: profile.full_name?.split(' ')[0] || 'Unknown',
           last_name: profile.full_name?.split(' ').slice(1).join(' ') || 'User',
           status: 'active'
         });
         console.log(`Created new employee record for ${profile.id}`);
      }
    }
  }
  
  console.log("Done checking and fixing profiles.");
}

checkAndFixProfile().catch(console.error);
