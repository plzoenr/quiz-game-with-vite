import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Summary from "./Summary.tsx";
import './index.css'
import { createBrowserRouter, RouterProvider} from "react-router-dom"

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
    },
    {
        path: "/summary",
        element: <Summary />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router}>
        </RouterProvider>
    </React.StrictMode>
)
