import React from "react";
import QueryProvider from "./QueryProvider";

const Providers = (props: React.PropsWithChildren) => (
  <QueryProvider>{props.children}</QueryProvider>
);

export default Providers;
