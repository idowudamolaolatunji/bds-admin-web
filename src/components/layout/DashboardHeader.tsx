import { RiMenu3Fill } from "react-icons/ri";
import useSidebar from "../../hooks/useSidebar";
import { useLocation } from "react-router-dom";


export default function DashboardHeader() {
    const { pathname } = useLocation();
	const { handleToggleSidemenu, isShowSidemenu, MobileDashboadMenuUI } = useSidebar();

    const title = pathname == "/dashboard" ? "Your dashboard" : pathname?.split("/")?.[2]?.replace("-", " ")

	return (
		<header className="header">
            <div className="header--logo">
                <button className="hamburger--icon" onClick={handleToggleSidemenu}>
                    <RiMenu3Fill />
                </button>

                <h1 className="header--title">{title}</h1>
            </div>

            {isShowSidemenu && <MobileDashboadMenuUI />}
		</header>
	);
}
