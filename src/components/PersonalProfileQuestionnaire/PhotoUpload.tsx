
import { Camera, User, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PhotoUploadProps {
  profilePhoto: string;
  name: string;
  onPhotoUpdate: (photo: string) => void;
}

const PhotoUpload = ({ profilePhoto, name, onPhotoUpdate }: PhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Please upload a JPG or PNG image');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onPhotoUpdate(result);
        setIsUploading(false);
        toast.success('Photo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      toast.error('Failed to upload image');
    }
  };

  const generateAvatar = (name: string) => {
    return (
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white">
        <User className="w-6 h-6" />
      </div>
    );
  };

  return (
    <div className="flex items-center gap-4">
      {profilePhoto ? (
        <img 
          src={profilePhoto} 
          alt="Profile" 
          className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
        />
      ) : (
        generateAvatar(name)
      )}
      
      <div className="flex-1">
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleImageUpload}
          className="hidden"
          id="photo-upload"
          disabled={isUploading}
        />
        <label
          htmlFor="photo-upload"
          className="questionnaire-button-secondary inline-flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors text-white"
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload Photo
            </>
          )}
        </label>
        <p className="text-xs text-white/70 mt-1">JPG, PNG • Max 5MB</p>
      </div>
    </div>
  );
};

export default PhotoUpload;
