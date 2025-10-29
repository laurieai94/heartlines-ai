import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdminUserDetails } from "@/hooks/useAdminUserDetails";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface AdminUserDetailsModalProps {
  userId: string | null;
  onClose: () => void;
}

const AdminUserDetailsModal = ({ userId, onClose }: AdminUserDetailsModalProps) => {
  const { data, isLoading } = useAdminUserDetails(userId);

  if (!userId) return null;

  return (
    <Dialog open={!!userId} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-gradient-to-br from-burgundy-800/95 to-burgundy-900/90 backdrop-blur-xl border-pink-400/30 text-white max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-pink-200 to-coral-200 bg-clip-text text-transparent">
            User Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-coral-400" />
          </div>
        ) : data?.summary ? (
          <div className="space-y-6">
            {/* User Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-white/60">Email</p>
                <p className="text-white">{data.summary.email}</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Name</p>
                <p className="text-white">{data.summary.user_name || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Subscription</p>
                <p className="text-white capitalize">{data.summary.subscription_tier}</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Joined</p>
                <p className="text-white">{format(new Date(data.summary.joined_at), 'MMM dd, yyyy')}</p>
              </div>
            </div>

            <Separator className="bg-pink-400/20" />

            {/* Usage Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-burgundy-900/40 p-4 rounded-lg border border-pink-400/20">
                <p className="text-sm text-white/60">Total Conversations</p>
                <p className="text-2xl font-bold text-white">{data.summary.total_conversations}</p>
              </div>
              <div className="bg-burgundy-900/40 p-4 rounded-lg border border-pink-400/20">
                <p className="text-sm text-white/60">Messages This Month</p>
                <p className="text-2xl font-bold text-white">{data.summary.messages_this_month}</p>
              </div>
              <div className="bg-burgundy-900/40 p-4 rounded-lg border border-pink-400/20">
                <p className="text-sm text-white/60">Total Cost</p>
                <p className="text-2xl font-bold text-white">${data.summary.total_cost.toFixed(4)}</p>
              </div>
              <div className="bg-burgundy-900/40 p-4 rounded-lg border border-pink-400/20">
                <p className="text-sm text-white/60">Cost (30d)</p>
                <p className="text-2xl font-bold text-white">${data.summary.cost_last_30_days.toFixed(4)}</p>
              </div>
            </div>

            <Separator className="bg-pink-400/20" />

            {/* Recent Conversations */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-white">Recent Conversations</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {data.conversations.map((conv) => (
                  <div 
                    key={conv.id}
                    className="p-3 bg-burgundy-900/40 rounded-lg border border-pink-400/10 hover:border-pink-400/30 transition-colors"
                  >
                    <p className="text-white font-medium">{conv.title}</p>
                    <p className="text-xs text-white/60 mt-1">
                      Updated {format(new Date(conv.updated_at), 'MMM dd, yyyy h:mm a')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Token Usage */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-white">Recent API Calls</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {data.tokenUsage.slice(0, 10).map((usage) => (
                  <div 
                    key={usage.id}
                    className="p-3 bg-burgundy-900/40 rounded-lg border border-pink-400/10 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-white text-sm">{usage.model}</p>
                      <p className="text-xs text-white/60">
                        {format(new Date(usage.created_at), 'MMM dd, h:mm a')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm">{usage.input_tokens + usage.output_tokens} tokens</p>
                      <p className="text-xs text-coral-300">${usage.estimated_cost.toFixed(5)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-white/60 text-center py-8">No data found for this user.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminUserDetailsModal;
