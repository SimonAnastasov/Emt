import React from 'react';

import { Link } from "react-router-dom";

const Home = () => {
    const links = [
        {to: "/books", text: "List Books"},
        {to: "/books/categories", text: "List Categories"}
    ]

    return (
        <div>
            <div className={"max-w-3xl flex flex-col gap-4"}>
                {links.map(e => (
                    <Link to={e.to} key={e.to}>
                        <div className={"bg-transparent transition-all duration-300 rounded-lg hover:bg-green-100/80 group py-2 px-6 cursor-pointer flex gap-2 items-center"}>
                            <p className={"text-3xl text-white transition-all duration-300 group-hover:text-black"}>{e.text}</p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                 stroke="currentColor" className="w-6 h-6 transition-all duration-300 text-white group-hover:text-black">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;