import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xyovnfhqnrgekowqplsh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5b3ZuZmhxbnJnZWtvd3FwbHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NTU4NTQsImV4cCI6MjEwMDMzMTg1NH0.ARUGKzvU9zq80hwq9AIjQ6CClMTZWEptKpgIo5O2Y2k';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  const { data, error } = await supabase
    .from('history')
    .insert([{ description: 'Test insert dari terminal' }]);
    
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Success:', data);
  }
}

testInsert();
