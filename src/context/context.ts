import React, { createContext } from "react";

{/** a React context is a global value via through thwe the entire
    React app.*/}

export const IsLoggedInContext = React.createContext<boolean>(false);