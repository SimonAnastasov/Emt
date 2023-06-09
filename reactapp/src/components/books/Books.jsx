import React, {useEffect, useState} from 'react';
import BookService from "../../repository/repository";

const Books = ({ toastNotification, setToastNotification }) => {
    const [paginationOptions, setPaginationOptions] = useState({
        page: 0,
        size: 5,
        maxNumPages: 0,
        paginationNumbers: [],
    });

    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);

    const [updateSwitch, setUpdateSwitch] = useState(false);
    const [markForDeleteId, setMarkForDeleteId] = useState(-1);
    const [editRowIdx, setEditRowIdx] = useState(-1);

    const [bookEditingDto, setBookEditingDto] = useState({});

    const booksHeaderRow = [{name: "Name", category: "Category", author: "Author", availableCopies: "Available Copies", currentlyTaken: "Currently Taken Copies"}]
    const booksFooterRow = [{name: "", category: "", author: "", availableCopies: "", currentlyTaken: ""}]

    function getPaginationNumbers(options) {
        let paginationNumbers = [];
        let paginationNumbersMobile = [];
        let increments = [1, 2];

        paginationNumbers.push(options.page);
        paginationNumbersMobile = paginationNumbers.slice();

        for (let i = 0; i < increments.length; i++) {
            let increment = increments[i];
            if (options.page - increment >= 0) paginationNumbers.unshift(options.page - increment);
            if (options.page + increment <= parseInt(options.maxNumPages)-1) paginationNumbers.push(options.page + increment);

            if (paginationNumbersMobile.length < 3) {
                paginationNumbersMobile = paginationNumbers.slice();
            }
        }

        let lastIncrement = increments[increments.length - 1];
        if (options.page - lastIncrement - 2 >= 0) paginationNumbers.unshift("...");
        if (options.page - lastIncrement - 1 >= 0) paginationNumbers.unshift(0);

        if (options.page + lastIncrement + 2 <= parseInt(options.maxNumPages)-1) paginationNumbers.push("...");
        if (options.page + lastIncrement + 1 <= parseInt(options.maxNumPages)-1) paginationNumbers.push(options.maxNumPages-1);

        return paginationNumbers;
    }

    useEffect(() => {
        let paginationNumbers = getPaginationNumbers(paginationOptions);

        setPaginationOptions({
            ...paginationOptions,
            maxNumPages: Math.ceil((books.length-2) / paginationOptions.size),
            paginationNumbers: paginationNumbers,
        })
    }, [paginationOptions.page, paginationOptions.size, books.length])

    useEffect(() => {
        BookService.fetchAllBookCategories()
            .then(data => {
                setCategories(data.data);
            });

        BookService.fetchAllAuthors()
            .then(data => {
                setAuthors(data.data);
            });
    }, []);

    useEffect(() => {
        BookService.fetchAllBooks()
            .then(data => {
                let sortedData = data.data.sort((a, b) => a.name.localeCompare(b.name));
                setPaginationOptions({
                    ...paginationOptions,
                    maxNumPages: Math.ceil(sortedData.length / paginationOptions.size),
                    paginationNumbers: getPaginationNumbers({...paginationOptions, maxNumPages: Math.ceil(sortedData.length / paginationOptions.size)}),
                })
                setBooks(booksHeaderRow.concat(sortedData).concat(booksFooterRow));
            });
    }, [updateSwitch]);

    useEffect(() => {
        let timeout = false;
        if (markForDeleteId !== -1) {
            timeout = setTimeout(() => {
                setMarkForDeleteId(-1)
            }, 10000);
        }

        return () => {
            if (timeout) clearTimeout(timeout);
        }
    }, [markForDeleteId]);

    function editBook(id) {
        let idx = books.map(e => e.id).indexOf(id);
        if (idx !== -1) {
            setEditRowIdx(idx);
            setBookEditingDto(books[idx]);
            setToastNotification({
                show: true,
                status: 'info',
                text: "When done editing, press 'Enter' to save."
            });
        }
    }

    function prepareBookForCreating() {
        setPaginationOptions({
            ...paginationOptions,
            maxNumPages: (books.length-2)/paginationOptions.size == Math.ceil((books.length-2)/paginationOptions.size) ? paginationOptions.maxNumPages+1 : paginationOptions.maxNumPages,
            page: (books.length-2)/paginationOptions.size == Math.ceil((books.length-2)/paginationOptions.size) ? paginationOptions.maxNumPages : paginationOptions.maxNumPages-1,
        })
        setEditRowIdx(books.length-1);
        setBookEditingDto({author: authors[0], category: categories[0]});
        setToastNotification({
            show: true,
            status: 'info',
            text: "When done, press 'Enter' to save."
        });
    }

    function handleInputChange(e, property) {
        let newDto = {...bookEditingDto};

        if (property === "author") {
            let author = authors.filter(author => author.id == e.target.value)[0];
            if (author) {
                newDto[property] = author;
            }
        }
        else {
            newDto[property] = e.target.value;
        }

        setBookEditingDto(newDto);
    }

    function handleKeyPressBookEdit(e) {
        if (e.key === 'Enter') {
            saveOrEditBook();
        }
    }

    function saveOrEditBook() {
        BookService.saveOrEditBook(bookEditingDto.id, bookEditingDto.name, bookEditingDto.author?.id, bookEditingDto.category, bookEditingDto.availableCopies, bookEditingDto.currentlyTaken)
            .then(data => {
                setUpdateSwitch(!updateSwitch);
                setToastNotification({
                    show: true,
                    status: "success",
                    text: bookEditingDto.id !== undefined && typeof bookEditingDto.id === "number" ? `Successfully edited book` : `Successfully created book`
                })
                setEditRowIdx(-1);
            })
            .catch(error => {
                let data = error.response.data;
                if (data.errorMessage) {
                    setToastNotification({
                        show: true,
                        status: "error",
                        text: data.errorMessage
                    })
                }
            });
    }

    function changeCurrentlyTaken(id, changeType) {
        BookService.changeCurrentlyTaken(id, changeType)
            .then(data => {
                setUpdateSwitch(!updateSwitch);
                setToastNotification({
                    show: true,
                    status: "success",
                    text: `Currently taken copies of book '${data.data.name}' ${changeType}d to ${data.data.currentlyTaken}`
                })
            })
            .catch(error => {
                let data = error.response.data;
                if (data.errorMessage) {
                    setToastNotification({
                        show: true,
                        status: "error",
                        text: data.errorMessage
                    })
                }
            });
    }

    function deleteBook(id) {
        if (id !== markForDeleteId) {
            setMarkForDeleteId(id);
            setToastNotification({
                show: true,
                status: "info",
                text: "Click 'Delete' one more time to confirm permanent delete of this book."
            })
            return ;
        }
        else {
            BookService.deleteBook(id)
                .then(data => {
                    setUpdateSwitch(!updateSwitch);
                    setToastNotification({
                        show: true,
                        status: "success",
                        text: data.data.successMessage,
                    })
                })
                .catch(error => {
                    let data = error.response.data;
                    if (data.errorMessage) {
                        setToastNotification({
                            show: true,
                            status: "error",
                            text: data.errorMessage
                        })
                    }
                });
        }
    }

    return (
        <div>
            <div className={"flex flex-col gap-4"}>
                {books.map((e, idx) => (
                    <div key={e.name + idx} className={(idx === 0 ? "hidden lg:block bg-white/20 border-b border-b-white" : "") + " text-white text-xl mb-2 lg:mb-0 " + (idx >= paginationOptions.page*paginationOptions.size+1 && idx < (paginationOptions.page+1)*paginationOptions.size+1 ? "block" : "hidden")}>
                        {editRowIdx !== idx || editRowIdx === 0 ? (
                            <>
                                {e.name ? (
                                    <div className={"relative group grid grid-cols-1 lg:grid-cols-5 gap-4 items-center border-b border-b-white lg:border-b-0 py-4 px-6"}>
                                        {idx > 0 && idx < books.length-1 && (
                                            <div className={"absolute inset-0 bg-transparent z-[-1] opacity-0 group-hover:bg-black/80 group-hover:z-10 group-hover:opacity-100 transition-all duration-300 flex justify-between items-center py-2 px-6"}>
                                                <div className={"flex gap-12 items-center"}>
                                                    <div>
                                                        <div className={"relative flex justify-between gap-6"}><span className={"inline lg:hidden"}>{books[0].name ? books[0].name + ": " : ""}</span>{e.name}</div>
                                                    </div>
                                                    <div className={"flex items-center gap-2 py-2 px-4 transition-all duration-300 hover:bg-white hover:text-black cursor-pointer"}
                                                         onClick={() => editBook(e.id)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 24 24" strokeWidth="1.5"
                                                             stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
                                                        </svg>
                                                        Edit
                                                    </div>
                                                    <div className={"flex items-center gap-2 py-2 px-4 transition-all duration-300 hover:bg-white hover:text-black cursor-pointer"}
                                                         onClick={() => changeCurrentlyTaken(e.id, 'increase')}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 24 24" strokeWidth="1.5"
                                                             stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                        </svg>
                                                        Taken Copies
                                                    </div>
                                                    <div className={"flex items-center gap-2 py-2 px-4 transition-all duration-300 hover:bg-white hover:text-black cursor-pointer"}
                                                         onClick={() => changeCurrentlyTaken(e.id, 'decrease')}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 24 24" strokeWidth="1.5"
                                                             stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                        </svg>
                                                        Taken Copies
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className={"flex items-center gap-2 py-2 px-4 transition-all duration-300 hover:bg-red-500 hover:text-white cursor-pointer"}
                                                         onClick={() => deleteBook(e.id)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 24 24" strokeWidth="1.5"
                                                             stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                        </svg>
                                                        Delete
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className={"relative flex justify-between gap-6"}><span className={"inline lg:hidden"}>{books[0].name ? books[0].name + ": " : ""}</span>{e.name}</div>
                                        <div className={"relative flex justify-between gap-6"}><span className={"inline lg:hidden"}>{books[0].category ? books[0].category + ": " : ""}</span>{e.category}</div>
                                        <div className={"relative flex justify-between gap-6"}><span className={"inline lg:hidden"}>{books[0].author ? books[0].author + ": " : ""}</span>{(e.author.name ?? e.author) + " " + (e.author.surname ?? "")}</div>
                                        <div className={"relative flex justify-between gap-6"}><span className={"inline lg:hidden"}>{books[0].availableCopies ? books[0].availableCopies + ": " : ""}</span>{e.availableCopies}</div>
                                        <div className={"relative flex justify-between gap-6"}><span className={"inline lg:hidden"}>{books[0].currentlyTaken ? books[0].currentlyTaken + ": " : ""}</span>{e.currentlyTaken}</div>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </>
                        ) : (
                            <div className={"grid grid-cols-1 lg:grid-cols-5 gap-4 items-center border-b border-b-white lg:border-b-0 py-4"}>
                                <div className={"flex justify-between gap-6"}><span className={"inline lg:hidden"}>{books[0].name ? books[0].name + ": " : ""}</span><input className={"w-full rounded-none bg-black border border-white py-2 px-6 focus:border-transparent focus:outline-white/20"} value={bookEditingDto?.name ? bookEditingDto.name : ""} onChange={(e) => handleInputChange(e, "name")} onKeyDown={handleKeyPressBookEdit}/></div>
                                <div className={"flex justify-between gap-6 w-full h-full"}><span className={"inline lg:hidden"}>{books[0].category ? books[0].category + ": " : ""}</span>
                                    <select
                                        className={"w-full rounded-none bg-black border border-white py-2 px-6 focus:border-transparent focus:outline-white/20"}
                                        value={bookEditingDto?.category ? bookEditingDto.category : categories[0]}
                                        onChange={(e) => handleInputChange(e, "category")}
                                        onKeyDown={handleKeyPressBookEdit}
                                    >
                                        {categories.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={"flex justify-between gap-6 w-full h-full"}><span className={"inline lg:hidden"}>{books[0].author ? books[0].author + ": " : ""}</span>
                                    <select
                                        className={"w-full rounded-none bg-black border border-white py-2 px-6 focus:border-transparent focus:outline-white/20"}
                                        value={`${bookEditingDto.author?.id ? bookEditingDto.author.id : authors[0].id}`}
                                        onChange={(e) => handleInputChange(e, "author")}
                                        onKeyDown={handleKeyPressBookEdit}
                                    >
                                        {authors.map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.name + " " + option.surname}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={"flex justify-between gap-6"}><span className={"inline lg:hidden"}>{books[0].availableCopies ? books[0].availableCopies + ": " : ""}</span><input className={"w-full rounded-none bg-black border border-white py-2 px-6 focus:border-transparent focus:outline-white/20"} value={bookEditingDto?.availableCopies ? bookEditingDto.availableCopies : 0} onChange={(e) => handleInputChange(e, "availableCopies")} type={"number"} onKeyDown={handleKeyPressBookEdit} min={0}/></div>
                                <div className={"flex justify-between gap-6"}><span className={"inline lg:hidden"}>{books[0].currentlyTaken ? books[0].currentlyTaken + ": " : ""}</span><input className={"w-full rounded-none bg-black border border-white py-2 px-6 focus:border-transparent focus:outline-white/20"} value={bookEditingDto?.currentlyTaken ? bookEditingDto.currentlyTaken : 0} onChange={(e) => handleInputChange(e, "currentlyTaken")} type={"number"} onKeyDown={handleKeyPressBookEdit} min={0}/></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className={"flex gap-4"}>
                <div className={(editRowIdx === -1 ? "flex" : "hidden") + " " + "items-center gap-2 mt-2 py-2 px-4 transition-all duration-300 w-fit bg-white/20 text-white hover:bg-white hover:text-black cursor-pointer"}
                     onClick={() => prepareBookForCreating()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"/>
                    </svg>
                    Add a book
                </div>
                <div className={(editRowIdx === -1 ? "hidden" : "flex") + " " + "items-center gap-2 mt-2 py-2 px-4 transition-all duration-300 w-fit bg-white/20 text-white hover:bg-white hover:text-black cursor-pointer"}
                     onClick={() => setEditRowIdx(-1)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
                    </svg>
                    Cancel
                </div>
                <div className={(editRowIdx === -1 ? "hidden" : "flex") + " " + "items-center gap-2 mt-2 py-2 px-4 transition-all duration-300 w-fit bg-white/20 text-white hover:bg-white hover:text-black cursor-pointer"}
                     onClick={() => saveOrEditBook()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3"/>
                    </svg>
                    Save
                </div>
            </div>

            {/* Pagination */}
            <div className={"mt-12"}>
                {paginationOptions.maxNumPages > 0 && (
                    <div className={`w-full flex justify-between items-center border-t-[1px] pt-2`}>
                        {/* Previous Button */}
                        <div className={"text-white py-4 px-4 transition-all duration-300 " + (paginationOptions.page !== 0 ? " cursor-pointer hover:bg-green-100/80 hover:text-black" : "")}
                             onClick={() => setPaginationOptions({...paginationOptions, page: Math.max(paginationOptions.page-1, 0)})}
                        >
                            {paginationOptions.page !== 0 ? (
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 rotate-180">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                    </svg>
                                    <span className="hidden lg:inline">Previous</span>
                                    <span className="inline lg:hidden"></span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 opacity-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 rotate-180">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                    </svg>
                                    <span className="hidden lg:inline">Previous</span>
                                    <span className="inline lg:hidden"></span>
                                </div>
                            )}
                        </div>

                        {/* Numbers */}
                        <div>
                            <div className="text-white flex items-center py-4">
                                {paginationOptions.paginationNumbers.map((number) => (
                                    <div className={paginationOptions.paginationNumbers.includes(number) ? '' : 'hidden' + " lg:block"} key={number}>
                                        {typeof number === 'number' ? (
                                            number === paginationOptions.page ? (
                                                <div className="text-white p-4 border-t-2 border-t-green-100/80">{number+1}</div>
                                            ) : (
                                                <div onClick={() => setPaginationOptions({...paginationOptions, page: number})}  className="cursor-pointer block p-4 transition-all duration-300 hover:bg-green-100/80 hover:text-black">{number+1}</div>
                                            )
                                        ) : (
                                            <div className="p-4">{number+1}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Next Button */}
                        <div className={"text-white py-4 px-4 transition-all duration-300 " + (parseInt(paginationOptions.maxNumPages) !== paginationOptions.page+1 ? " cursor-pointer hover:bg-green-100/80 hover:text-black" : "")}
                             onClick={() => setPaginationOptions({...paginationOptions, page: Math.min(paginationOptions.page+1, paginationOptions.maxNumPages-1)})}
                        >
                            {parseInt(paginationOptions.maxNumPages) !== paginationOptions.page+1 ? (
                                <div className="flex items-center gap-2">
                                    <span className="hidden lg:inline">Next</span>
                                    <span className="inline lg:hidden"></span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                    </svg>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 opacity-50">
                                    <span className="hidden lg:inline">Next</span>
                                    <span className="inline lg:hidden"></span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Books;