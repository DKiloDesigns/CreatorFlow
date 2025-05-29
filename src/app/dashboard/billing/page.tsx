import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSubscriptionPlan } from "@/lib/subscription";
import { formatDate } from "@/lib/utils";
import type { Subscription } from "@prisma/client";

// Remove unused imports
// import { ArrowRight, BarChart3, Zap } from "lucide-react";

// Add proper types for subscription data
type SubscriptionWithDetails = Subscription & {
  items: Array<{
    id: string;
    price: {
      product: {
        name: string;
        description: string;
      };
    };
  }>;
};

type BillingPageProps = {
  subscription: SubscriptionWithDetails | null;
  isCanceled: boolean;
};

export default async function BillingPage({ subscription, isCanceled }: BillingPageProps) {
  // ... existing code ...
} 