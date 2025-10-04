import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useState } from "react";
import CrisisResourcesModal from "./CrisisResourcesModal";

const CrisisResourcesButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-4 md:left-8 rounded-full w-12 h-12 shadow-lg z-10 bg-blue-600 hover:bg-blue-700"
        size="icon"
        variant="default"
        aria-label="Crisis resources"
      >
        <Shield className="w-5 h-5" />
      </Button>

      <CrisisResourcesModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default CrisisResourcesButton;
