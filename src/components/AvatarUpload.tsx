
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onAvatarUpdate: (url: string) => void;
  userName?: string;
}

const AvatarUpload = ({ currentAvatarUrl, onAvatarUpdate, userName }: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      onAvatarUpdate(data.publicUrl);
      toast.success('Avatar updated successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || 'Error uploading avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
          <AvatarImage src={currentAvatarUrl} alt={userName || 'User'} />
          <AvatarFallback className="bg-gradient-to-br from-pink-400 to-coral-500 text-white text-2xl">
            {userName ? userName.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
          </AvatarFallback>
        </Avatar>
        
        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="relative">
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <Button 
          variant="outline" 
          size="sm" 
          disabled={uploading}
          className="relative pointer-events-none"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </Button>
      </div>
    </div>
  );
};

export default AvatarUpload;
