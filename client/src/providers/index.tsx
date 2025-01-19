import React from "react";
import QueryProvider from "./QueryProvider";
import { AuthProvider } from "./AuthProvider";

const Providers = (props: React.PropsWithChildren) => (
  <AuthProvider>
    <QueryProvider>{props.children}</QueryProvider>
  </AuthProvider>
);

export default Providers;
