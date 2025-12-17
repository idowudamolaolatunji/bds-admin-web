import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import Login from "./auth";
import MainPage from "./pages/products";
import AddProducts from "./pages/add-products";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* UNPROTECTED ROUTES */}
				<Route path="/login" element={<Login />}></Route>

				{/* PROTECTED ROUTES */}
				<Route element={<ProtectedRoute />}>
					<Route path="/dashboard" element={<MainPage />}></Route>
					<Route path="/" element={<Navigate to="/dashboard" />}></Route>
					<Route path="/dashboard/add-product" element={<AddProducts />}></Route>
					<Route path="/dashboard/edit-product/:id" element={<AddProducts />}></Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
