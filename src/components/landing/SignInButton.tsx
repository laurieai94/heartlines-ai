import { useState, useEffect } from "react";
import { User, LogOut, UserCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

import { useAuth } from "@/contexts/AuthContext";
import { usePersonalProfileData } from "@/hooks/usePersonalProfileData";
import { useOptimizedMobile } from "@/hooks/useOptimizedMobile";
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface SignInButtonProps {
  onSignInClick: () => void;
  user: SupabaseUser | null;
  onOpenProfile?: () => void;
  disableMenuOnMobile?: boolean;
}

const SignInButton = ({ onSignInClick, user, onOpenProfile, disableMenuOnMobile }: SignInButtonProps) => {
  return null;
};

export default SignInButton;