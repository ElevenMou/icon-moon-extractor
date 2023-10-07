import React from "react";
import Header from "../Header";

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <div className="app-main">{children}</div>
        </>
    );
};

export default Layout;
