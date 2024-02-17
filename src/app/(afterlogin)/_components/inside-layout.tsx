"use client";

import * as React from "react";
import {
  User,
  BarChart3,
  ReceiptText,
  Contact,
  type LucideIcon,
} from "lucide-react";
import { Nav } from "../../_components/nav";
import { cn } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";
import { TooltipProvider } from "~/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { usePathname } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface MailProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  children?: React.ReactNode;
}

const Links: {
  title: string;
  label?: string;
  icon: LucideIcon;
  variant: "default" | "ghost";
  href: string;
}[] = [
  {
    title: "Dashboard",
    icon: BarChart3,
    variant: "default",
    href: "/dashboard",
  },
  {
    title: "Feedback",
    icon: ReceiptText,
    variant: "ghost",
    href: "/feedback",
  },
  {
    title: "Celebrate",
    icon: Contact,
    variant: "ghost",
    href: "/celebrate",
  },
  {
    title: "Customer",
    icon: User,
    variant: "ghost",
    href: "/customer",
  },
];

export function InsideLayout({
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
  children,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes,
          )}`;
        }}
        className="flex-1 items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true,
            )}`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false,
            )}`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out",
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2",
            )}
          >
            <div>
              <Image src="/logo.png" width={100} height={100} alt="logo" />
            </div>
          </div>
          <Nav isCollapsed={isCollapsed} links={Links} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={defaultLayout[1]}
          minSize={30}
          className="flex flex-col"
        >
          <div className="flex h-[52px] items-center px-4 py-2">
            <h1 className="text-xl font-bold">
              {Links.find((link) => pathname.includes(link.href))?.title}
            </h1>

            <DisplayBalance />
          </div>
          <Separator />
          <div className="flex-1 overflow-auto">{children}</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}

async function fetchBalance() {
  return (await axios.get<{ balance: number }>("/api/customers/balance")).data
    .balance;
}

function DisplayBalance() {
  const { data } = useQuery(["balance"], fetchBalance);

  return (
    <div className="ml-auto">
      <h1>Balance: {data}</h1>
    </div>
  );
}
