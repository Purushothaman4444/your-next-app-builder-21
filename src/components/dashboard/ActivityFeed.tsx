import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Edit, Trash2, Copy } from "lucide-react";
import { useActivities } from "@/hooks/useActivities";
import { formatDistanceToNow } from "date-fns";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const getActivityIcon = (type: string) => {
  switch (type) {
    case "created":
      return FileText;
    case "downloaded":
      return Download;
    case "updated":
      return Edit;
    case "deleted":
      return Trash2;
    case "duplicated":
      return Copy;
    default:
      return FileText;
  }
};

const getActivityText = (type: string, title: string) => {
  switch (type) {
    case "created":
      return `Created ${title}`;
    case "downloaded":
      return `Downloaded ${title}`;
    case "updated":
      return `Updated ${title}`;
    case "deleted":
      return `Deleted ${title}`;
    case "duplicated":
      return `Duplicated ${title}`;
    default:
      return title;
  }
};

export const ActivityFeed = () => {
  const { activities, isLoading } = useActivities();

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : !activities || activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity yet</p>
            <p className="text-sm mt-2">Your resume actions will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.activity_type);
              return (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      {getActivityText(activity.activity_type, activity.resume_title)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
