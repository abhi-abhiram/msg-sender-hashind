import { InsideLayout } from "./components/inside-layout";
import { cookies } from "next/headers";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const layout = cookies().get("react-resizable-panels:layout");
  const collapsed = cookies().get("react-resizable-panels:collapsed");

  const defaultLayout = layout
    ? (JSON.parse(layout.value) as number[])
    : undefined;
  const defaultCollapsed = collapsed
    ? (JSON.parse(collapsed.value) as boolean)
    : true;

  return (
    <div className="flex h-screen flex-col">
      <InsideLayout
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
        navCollapsedSize={4}
      >
        {children}
      </InsideLayout>
    </div>
  );
}
