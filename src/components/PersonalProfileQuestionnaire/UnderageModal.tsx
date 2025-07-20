
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface UnderageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UnderageModal = ({ isOpen, onClose }: UnderageModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
            Let's get you the right resources
            <Heart className="w-6 h-6 text-coral-500" />
            !
          </h3>
          <p className="text-gray-700 mb-8 text-sm leading-relaxed">
            Looks like you might be under 18! No worries - we just want to make sure you get resources that are actually built for where you're at. Love is Respect has amazing support specifically for teens and young adults navigating relationships.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={() => window.open('https://www.loveisrespect.org/', '_blank')}
              className="bg-gradient-to-r from-coral-400 to-coral-500 hover:from-coral-500 hover:to-coral-600 text-white border-0 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Visit Love is Respect
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105"
            >
              I'm 18+
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderageModal;
