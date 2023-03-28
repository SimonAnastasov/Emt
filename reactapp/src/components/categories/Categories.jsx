import React, {useEffect, useState} from 'react';
import BookService from "../../repository/repository";

const Categories = () => {
    const [bookCategories, setBookCategories] = useState([]);
    useEffect(() => {
        BookService.fetchAllBookCategories()
            .then(data => {
                if (data.status === 200) {
                    setBookCategories(data.data);
                }
                else {
                    console.log(data);
                }
            });
    }, [])

    return (
        <div>
            <div className={"flex flex-col gap-4"}>
                <h2 className={"py-2 px-6 bg-white/20 border-b border-b-white text-white text-2xl"}>Book Categories:</h2>
                {bookCategories.map((e, idx) => (
                    <div key={e+idx} className={"py-2 px-6 text-xl text-white"}>
                        {e}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;