
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, User } from "lucide-react";
import { toast } from "sonner";
import { logError } from '@/utils/productionLogger';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onAvatarUpdate: (url: string) => void;
  userName?: string;
  size?: 'compact' | 'full';
}

const AvatarUpload = ({ currentAvatarUrl, onAvatarUpdate, userName, size = 'full' }: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      
      // Simple file validation
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file.');
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('Image size should be less than 5MB.');
      }

      // Create a local URL for immediate preview
      const localUrl = URL.createObjectURL(file);
      onAvatarUpdate(localUrl);
    } catch (error) {
      logError('Error uploading avatar', error);
      toast.error(error.message || 'Error uploading avatar');
    } finally {
      setUploading(false);
    }
  };

  const isCompact = size === 'compact';
  const avatarSize = isCompact ? 'w-14 h-14' : 'w-24 h-24';
  const buttonSize = isCompact ? 'sm' : 'sm';
  const layout = isCompact ? 'flex-row items-center gap-2' : 'flex-col items-center gap-4';

  return (
    <div className={`flex ${layout}`}>
      <div className="relative group">
        <Avatar className={`${avatarSize} border-4 border-white shadow-2xl ring-4 ring-purple-200/50 bg-gradient-to-br from-yellow-300 via-pink-400 to-coral-500`}>
          <AvatarImage src={currentAvatarUrl} alt={userName || 'User'} loading="eager" fetchPriority="high" />
          <AvatarFallback className="bg-gradient-to-br from-yellow-300 via-pink-400 to-coral-500 text-white text-4xl font-bold shadow-inner">
            <User className={isCompact ? "w-6 h-6" : "w-8 h-8"} />
          </AvatarFallback>
        </Avatar>
        
        {/* Bright center indicator */}
        <div className={`absolute top-1 right-1 ${isCompact ? 'w-4 h-4' : 'w-6 h-6'} bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full animate-pulse shadow-lg border-2 border-white`}></div>
        
        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className={`${isCompact ? 'w-4 h-4' : 'w-6 h-6'} text-white`} />
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
          size={buttonSize} 
          disabled={uploading}
          className="relative pointer-events-none bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600 shadow-lg"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Uploading...' : isCompact ? '' : 'Upload Photo'}
        </Button>
      </div>
    </div>
  );
};

export default AvatarUpload;
