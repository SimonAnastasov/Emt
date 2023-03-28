import React from 'react';

import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <div>
            <div className={"z-10 py-[30vh] container mx-auto px-2 lg:px-0"}>
                <Outlet/>
            </div>
        </div>
    );
};

export default Layout;