import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Edit } from "lucide-react";

const activities = [
  {
    type: "created",
    title: "Created Software Engineer Resume",
    time: "2 hours ago",
    icon: FileText,
  },
  {
    type: "downloaded",
    title: "Downloaded Marketing Manager Resume",
    time: "1 day ago",
    icon: Download,
  },
  {
    type: "edited",
    title: "Updated Project Manager Resume",
    time: "3 days ago",
    icon: Edit,
  },
];

export const ActivityFeed = () => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
