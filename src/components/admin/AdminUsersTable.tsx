import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UserSummary {
  user_id: string;
  email: string;
  user_name: string;
  joined_at: string;
  subscription_tier: string;
  total_conversations: number;
  total_cost: number;
  cost_last_30_days: number;
  messages_this_month: number;
  last_activity: string | null;
}

interface AdminUsersTableProps {
  users: UserSummary[];
  onUserClick: (userId: string) => void;
}

const AdminUsersTable = ({ users, onUserClick }: AdminUsersTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof UserSummary>("joined_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof UserSummary) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredUsers = users
    .filter(user => 
      (user.email?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (user.user_name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === "asc" ? 1 : -1;
      
      if (typeof aVal === "string" && typeof bVal === "string") {
        return aVal.localeCompare(bVal) * modifier;
      }
      return (Number(aVal) - Number(bVal)) * modifier;
    });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
        <Input
          placeholder="Search by email or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-burgundy-800/40 border-pink-400/20 text-white placeholder:text-white/60"
        />
      </div>

      <div className="rounded-lg border border-pink-400/20 bg-burgundy-800/20 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-pink-400/20 hover:bg-burgundy-800/30">
              <TableHead className="text-white">
                <Button variant="ghost" onClick={() => handleSort("email")} className="text-white hover:text-white">
                  Email <ArrowUpDown className="ml-2 w-3 h-3" />
                </Button>
              </TableHead>
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">
                <Button variant="ghost" onClick={() => handleSort("subscription_tier")} className="text-white hover:text-white">
                  Tier <ArrowUpDown className="ml-2 w-3 h-3" />
                </Button>
              </TableHead>
              <TableHead className="text-white text-right">
                <Button variant="ghost" onClick={() => handleSort("messages_this_month")} className="text-white hover:text-white">
                  Messages <ArrowUpDown className="ml-2 w-3 h-3" />
                </Button>
              </TableHead>
              <TableHead className="text-white text-right">
                <Button variant="ghost" onClick={() => handleSort("cost_last_30_days")} className="text-white hover:text-white">
                  Cost (30d) <ArrowUpDown className="ml-2 w-3 h-3" />
                </Button>
              </TableHead>
              <TableHead className="text-white">Last Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="space-y-2">
                    <p className="text-white/60 text-sm">
                      {users.length === 0 ? 'No users yet' : 'No users match your search'}
                    </p>
                    {users.length === 0 && (
                      <p className="text-white/40 text-xs">User data will appear after signups</p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow 
                  key={user.user_id}
                  onClick={() => onUserClick(user.user_id)}
                  className="border-pink-400/10 hover:bg-burgundy-800/40 cursor-pointer transition-colors"
                >
                  <TableCell className="text-white">{user.email || "—"}</TableCell>
                  <TableCell className="text-white/90">{user.user_name || "—"}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-gradient-to-r from-pink-500/20 to-coral-500/20 text-pink-200 border border-pink-400/20">
                      {user.subscription_tier || "free"}
                    </span>
                  </TableCell>
                  <TableCell className="text-white text-right">{user.messages_this_month}</TableCell>
                  <TableCell className="text-white text-right">${user.cost_last_30_days.toFixed(4)}</TableCell>
                  <TableCell className="text-white/80 text-sm">
                    {user.last_activity 
                      ? formatDistanceToNow(new Date(user.last_activity), { addSuffix: true })
                      : "Never"
                    }
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsersTable;
