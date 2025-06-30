
import { Button } from "@/components/ui/button";

interface UnderageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UnderageModal = ({ isOpen, onClose }: UnderageModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="text-3xl mb-3">👋</div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Hey there!</h3>
          <p className="text-gray-600 mb-4">
            We love that you're thinking about healthy relationships. RealTalk is designed for adults 18+, 
            but there are amazing age-appropriate resources waiting for you.
          </p>
          <p className="text-gray-600 mb-6">
            Check out Love is Respect for support that's perfect for where you are right now.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => window.open('https://www.loveisrespect.org/', '_blank')}
              className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white"
            >
              Visit Love is Respect
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
            >
              I'm actually 18+
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderageModal;
