
import { Button } from "@/components/ui/button";

interface UnderageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UnderageModal = ({ isOpen, onClose }: UnderageModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-coral-100/80 to-peach-100/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-xl border border-coral-200/30 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
        <div className="text-center">
          <div className="text-4xl mb-6">💙</div>
          <h3 className="text-2xl font-bold text-coral-600 mb-6">Hey, we got you 💙</h3>
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
              className="border-coral-300 text-coral-600 hover:bg-coral-50 hover:border-coral-400 transition-all duration-300 hover:scale-105"
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
