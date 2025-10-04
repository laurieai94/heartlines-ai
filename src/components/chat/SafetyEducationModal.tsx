import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, XCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const SafetyEducationModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the safety education
    const hasSeenEducation = localStorage.getItem('safety_education_shown');
    if (!hasSeenEducation) {
      // Show modal after a brief delay on first chat interaction
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('safety_education_shown', 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-burgundy-900 to-burgundy-950 border-white/20">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-blue-300" />
            <DialogTitle className="text-2xl text-white">Welcome to Kai</DialogTitle>
          </div>
          <DialogDescription className="text-pink-200/80 text-base">
            Before we start, here's what you should know about safety and support
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-4">
          {/* What Kai Can Help With */}
          <div>
            <div className="flex items-start gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">What Kai Can Help With</h3>
                <ul className="text-pink-200/80 text-sm space-y-1 list-disc list-inside">
                  <li>Improving communication with your partner</li>
                  <li>Understanding relationship patterns</li>
                  <li>Navigating everyday relationship challenges</li>
                  <li>Personal growth and self-awareness</li>
                  <li>Building healthier relationship habits</li>
                </ul>
              </div>
            </div>
          </div>

          {/* When to Seek Professional Help */}
          <div>
            <div className="flex items-start gap-3 mb-3">
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">When to Seek Professional Help</h3>
                <p className="text-pink-200/80 text-sm mb-2">
                  Kai is NOT equipped to help with:
                </p>
                <ul className="text-pink-200/80 text-sm space-y-1 list-disc list-inside">
                  <li>Crisis situations or thoughts of self-harm</li>
                  <li>Severe mental health concerns</li>
                  <li>Physical, emotional, or sexual abuse</li>
                  <li>Situations requiring immediate intervention</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Crisis Resources */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-blue-300 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-base font-semibold text-blue-200 mb-2">Available Crisis Resources</h3>
                <div className="text-blue-100/90 text-sm space-y-1">
                  <p>• <strong>988:</strong> Suicide & Crisis Lifeline (call/text)</p>
                  <p>• <strong>1-800-799-7233:</strong> National DV Hotline</p>
                  <p>• <strong>911:</strong> For immediate danger</p>
                </div>
                <Link 
                  to="/safety" 
                  className="text-blue-300 hover:text-blue-200 text-sm underline mt-2 inline-block"
                  onClick={handleClose}
                >
                  View all crisis resources
                </Link>
              </div>
            </div>
          </div>

          <p className="text-pink-200/60 text-sm">
            Kai is an AI-powered relationship coach designed to support your growth. For serious concerns, 
            always consult with licensed professionals.
          </p>
        </div>

        <DialogFooter>
          <Button onClick={handleClose} className="w-full">
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SafetyEducationModal;
