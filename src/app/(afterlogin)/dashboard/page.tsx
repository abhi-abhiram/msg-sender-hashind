import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Overview } from "../_components/charts";
import Example from "../_components/overall-review";
import { api } from "~/trpc/server";
import { type Visitings } from "../feedback/page";

function getKeyFromScore(number: number) {
  switch (number) {
    case 1:
      return "not_average";
    case 2:
      return "average";
    case 3:
      return "good";
    default:
      return "very_good";
  }
}

export default async function Dashboard() {
  const feedbacks = await api.customer.dashboard.query();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const lastSixMonths = new Date();
  lastSixMonths.setMonth(lastSixMonths.getMonth() - 6);

  const dashboardData = feedbacks.reduce(
    (acc, feedback) => {
      const values = Object.values(feedback.feedback);

      // last 30 days feedback
      if (new Date(feedback.created_at!) > thirtyDaysAgo) {
        values.forEach((value) => {
          const key = getKeyFromScore(value);
          acc.pieData.currentMonth[key] =
            (acc.pieData.currentMonth[key] ?? 0) + 1;

          acc.graphData.currentMonth[feedback.visitingTime][key] =
            (acc.graphData.currentMonth[feedback.visitingTime][key] ?? 0) + 1;
        });
      }

      if (new Date(feedback.created_at!) > lastSixMonths) {
        values.forEach((value) => {
          const key = getKeyFromScore(value);
          acc.pieData.last6Months[key] =
            (acc.pieData.last6Months[key] ?? 0) + 1;

          acc.graphData.last6Months[feedback.visitingTime][key] =
            (acc.graphData.last6Months[feedback.visitingTime][key] ?? 0) + 1;
        });
      }

      values.forEach((value) => {
        const key = getKeyFromScore(value);
        acc.pieData.overall[key] = (acc.pieData.overall[key] ?? 0) + 1;
      });

      return acc;
    },
    {
      pieData: {
        currentMonth: {},
        last6Months: {},
        overall: {},
      },
      graphData: {
        currentMonth: {
          morning: {},
          afternoon: {},
          evening_snacks: {},
          dinner: {},
        },
        last6Months: {
          morning: {},
          afternoon: {},
          evening_snacks: {},
          dinner: {},
        },
      },
    } as {
      pieData: {
        currentMonth: Record<
          "good" | "very_good" | "not_average" | "average",
          number
        >;
        last6Months: Record<
          "good" | "very_good" | "not_average" | "average",
          number
        >;
        overall: Record<
          "good" | "very_good" | "not_average" | "average",
          number
        >;
      };
      graphData: {
        currentMonth: Record<
          (typeof Visitings)[number],
          Record<"good" | "very_good" | "not_average" | "average", number>
        >;
        last6Months: Record<
          (typeof Visitings)[number],
          Record<"good" | "very_good" | "not_average" | "average", number>
        >;
      };
    },
  );

  return (
    <div className="p-4">
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Overall Review</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Example values={dashboardData.pieData.overall} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Current Month</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Example values={dashboardData.pieData.currentMonth} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Last 6 Months</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Example values={dashboardData.pieData.last6Months} />
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview data={dashboardData.graphData.currentMonth} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview data={dashboardData.graphData.last6Months} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
