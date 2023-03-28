import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Background from "./components/Background";

import Home from "./components/home/Home";
import Books from "./components/books/Books";
import Categories from "./components/categories/Categories";
import Layout from "./components/Layout";
import ToastNotification from "./components/notifications/Toast";

import {useState} from "react";

function App() {
    const [toastNotification, setToastNotification] = useState({});

    return (
        <div className={"relative"}>

          <BrowserRouter>
              <ToastNotification toastNotification={toastNotification} setToastNotification={setToastNotification}/>

              <Header/>
              <Background/>

              <Routes>
                  <Route path={"/"} element={<Layout/>}>
                      <Route index element={<Home/>} />
                      <Route path={"books"} element={<Books toastNotification={toastNotification} setToastNotification={setToastNotification}/>} />
                      <Route path={"books/categories"} element={<Categories/>} />
                  </Route>
              </Routes>
          </BrowserRouter>

        </div>
    );
}

export default App;
