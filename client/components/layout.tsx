import React, { Fragment, ReactElement } from "react";
import { useEth } from "eth.context";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: RootLayoutProps): JSX.Element {
  const eth = useEth()
  return (
    <Fragment>
        <main>
          {React.cloneElement(children as ReactElement, { eth })}
        </main>
    </Fragment>
  );
}
