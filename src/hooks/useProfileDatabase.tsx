
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PersonalProfileData {
  [key: string]: any;
}

export const useProfileDatabase = () => {
  const { user } = useAuth();

  // Load data from database
  const loadFromDatabase = async () => {
    if (!user) return {};

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('profile_data, demographics_data')
        .eq('user_id', user.id)
        .eq('profile_type', 'your')
        .single();

      if (data && !error) {
        const dbData = {
          ...(typeof data.profile_data === 'object' && data.profile_data !== null ? data.profile_data : {}),
          ...(typeof data.demographics_data === 'object' && data.demographics_data !== null ? data.demographics_data : {})
        };
        
        console.log('Loaded personal profile from database:', dbData);
        return dbData;
      }
    } catch (error) {
      console.error('Error loading from database:', error);
    }
    return {};
  };

  // Save data to database
  const saveToDatabase = async (data: PersonalProfileData) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('user_profiles').upsert({
        user_id: user.id,
        profile_type: 'your',
        profile_data: data,
        demographics_data: data,
        updated_at: new Date().toISOString()
      });
      
      if (error) {
        console.error('Database save error:', error);
      } else {
        console.log('Saved to database successfully');
      }
    } catch (error) {
      console.error('Error saving to database:', error);
    }
  };

  return {
    loadFromDatabase,
    saveToDatabase
  };
};
