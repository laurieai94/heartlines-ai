
import { Button } from "@/components/ui/button";

interface UnderageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UnderageModal = ({ isOpen, onClose }: UnderageModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
        <div className="text-center">
          <div className="text-3xl mb-4">🤗</div>
          <h3 className="text-xl font-bold text-white mb-4">Age-Appropriate Resources</h3>
          <p className="text-white/80 mb-4 text-sm leading-relaxed">
            We want to make sure you get the right support. For users under 18, we recommend visiting Love is Respect, 
            which offers specialized resources for young people navigating relationships.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={() => window.open('https://www.loveisrespect.org/', '_blank')}
              className="bg-gradient-to-r from-rose-500/90 to-pink-500/90 backdrop-blur-sm hover:from-rose-600/90 hover:to-pink-600/90 text-white border border-white/20 shadow-lg transition-all duration-200 hover:scale-105"
            >
              Visit Love is Respect
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-200 hover:scale-105"
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
