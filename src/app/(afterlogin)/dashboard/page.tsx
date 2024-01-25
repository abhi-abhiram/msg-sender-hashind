import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Overview } from "../components/charts";
import Example from "../components/overall-review";

export default function Dashboard() {
  return (
    <div className="p-4">
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Overall Review</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Example />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Current Month</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Example />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Last 6 Months</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Example />
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
