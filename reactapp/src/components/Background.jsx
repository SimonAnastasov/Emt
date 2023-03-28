import React from 'react';

const Background = () => {
    return (
        <div>
            <div className={"z-[-2] fixed inset-0"}>
                <img src={"/images/bg.webp"} alt={"A library"} className={"w-full h-full object-cover"}/>
            </div>
            <div className={"z-[-1] fixed inset-0 bg-black/70"}></div>
        </div>
    );
};

export default Background;