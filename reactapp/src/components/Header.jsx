import React from 'react';

import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div>
            <div className={"absolute z-20 inset-0 bottom-auto bg-white/20 border-b border-b-white"}>
                <div className={"flex justify-between items-center container mx-auto px-2 lg:px-0 py-4"}>
                    <Link to={"/"}>
                        <div className={"flex gap-4 items-center bg-transparent transition-all duration-300 rounded-lg hover:bg-green-100/80 group py-2 px-6 cursor-pointer"}>
                            <img src={"/images/doggo.webp"} alt={"Face of the doggo."} className={"w-12 h-12 rounded-full border-2 border-white transition-all duration-300 group-hover:border-black"}/>
                            <h1 className={"text-3xl text-white transition-all duration-300 group-hover:text-black"}>Doggo Library</h1>
                        </div>
                    </Link>
                    <div className={"flex items-center gap-4"}>
                        <Link to={"/books"}>
                            <div className={"flex gap-1 items-center bg-transparent transition-all duration-300 rounded-lg hover:bg-green-100/80 group py-2 px-6 cursor-pointer"}>
                                <p className={"text-xl text-white transition-all duration-300 group-hover:text-black"}>Books</p>
                            </div>
                        </Link>
                        <Link to={"/books/categories"}>
                            <div className={"flex gap-1 items-center bg-transparent transition-all duration-300 rounded-lg hover:bg-green-100/80 group py-2 px-6 cursor-pointer"}>
                                <p className={"text-xl text-white transition-all duration-300 group-hover:text-black"}>Categories</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;