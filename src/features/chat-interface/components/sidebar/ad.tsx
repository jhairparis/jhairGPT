import { Button } from "@/features/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";

const Ad = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upgrade to Pro</CardTitle>
        <CardDescription>
          Unlock all features and get unlimited access to our support team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button size="sm" className="w-full">
          Upgrade
        </Button>
      </CardContent>
    </Card>
  );
};

export default Ad;
