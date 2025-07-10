
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";
import PhoneNumberInput from "./SMSReminder/PhoneNumberInput";
import ConversationReminders from "./SMSReminder/ConversationReminders";
import PresetReminders from "./SMSReminder/PresetReminders";
import MessagePreview from "./SMSReminder/MessagePreview";
import ActiveRemindersView from "./SMSReminder/ActiveRemindersView";
import SubscriptionPaywall from "./SubscriptionPaywall";
import { usePhoneValidation } from "./SMSReminder/hooks/usePhoneValidation";
import { useReminderTypes } from "./SMSReminder/hooks/useReminderTypes";
import { useConversationReminders } from "./SMSReminder/hooks/useConversationReminders";

const SMSReminder = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const { isPremium, subscribed, subscription_tier, openCustomerPortal } = useSubscription();

  const { phoneNumber, isPhoneValid, handlePhoneChange } = usePhoneValidation();
  const { reminderTypes, updateReminderType, enabledReminders } = useReminderTypes();
  const {
    conversationReminders,
    toggleConversationReminder,
    activeConversationReminders
  } = useConversationReminders();

  // Show paywall if user is not premium
  if (!isPremium) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">SMS Reminders</h2>
          <p className="text-gray-600">Get gentle text reminders to strengthen your relationship</p>
        </div>
        
        <SubscriptionPaywall 
          feature="SMS reminders"
          description="Get personalized text reminders based on your conversations and relationship goals"
        />
      </div>
    );
  }

  const handleSaveSettings = () => {
    if (!isPhoneValid) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    if (enabledReminders.length === 0 && activeConversationReminders.length === 0) {
      toast.error("Please select at least one reminder type or create reminders from conversations");
      return;
    }

    setIsEnabled(true);
    toast.success("SMS reminders have been set up successfully!");
  };

  const handleDisable = () => {
    setIsEnabled(false);
    toast.success("SMS reminders have been disabled");
  };

  if (isEnabled) {
    return (
      <ActiveRemindersView
        phoneNumber={phoneNumber}
        enabledReminders={enabledReminders}
        activeConversationReminders={activeConversationReminders}
        onEditSettings={() => setIsEnabled(false)}
        onDisable={handleDisable}
        onUpdateReminderType={updateReminderType}
        onToggleConversationReminder={toggleConversationReminder}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Set Up SMS Reminders</h2>
          <p className="text-gray-600">Get gentle text reminders to strengthen your relationship</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-sm font-medium">
            Premium Active
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={openCustomerPortal}
            className="text-xs"
          >
            Manage Subscription
          </Button>
        </div>
      </div>

      <PhoneNumberInput
        phoneNumber={phoneNumber}
        isPhoneValid={isPhoneValid}
        onPhoneChange={handlePhoneChange}
      />

      <ConversationReminders
        conversationReminders={conversationReminders}
        onToggleReminder={toggleConversationReminder}
      />

      <PresetReminders
        reminderTypes={reminderTypes}
        onUpdateReminderType={updateReminderType}
      />

      <MessagePreview
        enabledReminders={enabledReminders}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
      />

      <div className="flex justify-center">
        <Button
          onClick={handleSaveSettings}
          disabled={!isPhoneValid || (enabledReminders.length === 0 && activeConversationReminders.length === 0)}
          className="bg-coral-500 hover:bg-coral-600 text-white px-8"
        >
          <Save className="w-4 h-4 mr-2" />
          Enable SMS Reminders
        </Button>
      </div>
    </div>
  );
};

export default SMSReminder;
