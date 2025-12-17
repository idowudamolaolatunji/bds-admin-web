import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import "./styles/globals.css";
import "./styles/auth.css";
import "./styles/main.css";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<App />
			<Toaster />
		</AuthProvider>
	</StrictMode>,
);
