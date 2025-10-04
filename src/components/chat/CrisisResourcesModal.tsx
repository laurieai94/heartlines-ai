import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Shield, Phone, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CrisisResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CrisisResourcesModal = ({ isOpen, onClose }: CrisisResourcesModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-burgundy-900 to-burgundy-950 border-white/20">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-blue-300" />
            <DialogTitle className="text-2xl text-white">Crisis Resources</DialogTitle>
          </div>
          <DialogDescription className="text-pink-200/80 text-base">
            If you're experiencing a crisis, please reach out to these professional resources
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Immediate Danger */}
          <Card className="p-4 bg-red-900/30 border-red-500/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-300 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-100 mb-2">Immediate Danger</h3>
                <p className="text-red-200/90 text-sm mb-3">
                  If you're in immediate danger, please call 911 or go to your nearest emergency room
                </p>
                <Button
                  onClick={() => window.location.href = 'tel:911'}
                  className="bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call 911
                </Button>
              </div>
            </div>
          </Card>

          {/* Suicide & Crisis Lifeline */}
          <Card className="p-4 bg-white/5 border-white/10">
            <div className="flex items-start gap-3">
              <Phone className="w-6 h-6 text-blue-300 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">988 Suicide & Crisis Lifeline</h3>
                <p className="text-pink-200/80 text-sm mb-3">
                  24/7 free and confidential support for people in distress, prevention and crisis resources
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => window.location.href = 'tel:988'}
                    variant="secondary"
                    size="sm"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call 988
                  </Button>
                  <Button
                    onClick={() => window.location.href = 'sms:988'}
                    variant="secondary"
                    size="sm"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Text 988
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Crisis Text Line */}
          <Card className="p-4 bg-white/5 border-white/10">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-6 h-6 text-purple-300 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Crisis Text Line</h3>
                <p className="text-pink-200/80 text-sm mb-3">
                  Free, 24/7 support for those in crisis via text message
                </p>
                <Button
                  onClick={() => window.location.href = 'sms:741741&body=HOME'}
                  variant="secondary"
                  size="sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Text HOME to 741741
                </Button>
              </div>
            </div>
          </Card>

          {/* Domestic Violence Hotline */}
          <Card className="p-4 bg-white/5 border-white/10">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-pink-300 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">National Domestic Violence Hotline</h3>
                <p className="text-pink-200/80 text-sm mb-3">
                  24/7 confidential support for victims of domestic violence and abuse
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => window.location.href = 'tel:18007997233'}
                    variant="secondary"
                    size="sm"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call 1-800-799-7233
                  </Button>
                  <Button
                    onClick={() => window.location.href = 'sms:88788&body=START'}
                    variant="secondary"
                    size="sm"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Text START to 88788
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* RAINN */}
          <Card className="p-4 bg-white/5 border-white/10">
            <div className="flex items-start gap-3">
              <Phone className="w-6 h-6 text-teal-300 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">RAINN Sexual Assault Hotline</h3>
                <p className="text-pink-200/80 text-sm mb-3">
                  24/7 support for survivors of sexual assault and their loved ones
                </p>
                <Button
                  onClick={() => window.location.href = 'tel:18006564673'}
                  variant="secondary"
                  size="sm"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call 1-800-656-4673
                </Button>
              </div>
            </div>
          </Card>

          <p className="text-pink-200/60 text-xs text-center pt-4">
            All services are free, confidential, and available 24/7
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CrisisResourcesModal;
