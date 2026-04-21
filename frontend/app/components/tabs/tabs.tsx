import * as React from "react";
import { Tabs } from "@base-ui/react/tabs";
import styles from "./index.module.css";
import { cn } from "@sglara/cn";

interface Props {
  tabs: string[];
  contents: React.ReactElement[];
  RootClassName?: string;
}

export default function TabsContainer({
  tabs,
  contents,
  RootClassName,
}: Props) {
  return (
    <Tabs.Root
      className={cn(styles.Tabs, RootClassName)}
      defaultValue={tabs[0]}
    >
      <Tabs.List className={styles.List}>
        {tabs.map((tab) => (
          <Tabs.Tab className={styles.Tab} value={tab} key={tab}>
            {tab}
          </Tabs.Tab>
        ))}
        <Tabs.Indicator className={styles.Indicator} />
      </Tabs.List>
      {contents.map((content, index) => (
        <Tabs.Panel
          className={cn(styles.Panel, "h-full!")}
          value={tabs[index]}
          key={`content-for-${tabs[index]}`}
        >
          {content}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}
