import React, { Fragment, ReactElement } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useEth } from "eth.context";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: RootLayoutProps): JSX.Element {
  const eth = useEth()
  return (
    <Fragment>
        <Navbar />
        <main>
          {React.cloneElement(children as ReactElement, { eth })}
        </main>
        <Footer />
    </Fragment>
  );
}
