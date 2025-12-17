import { Link, useNavigate } from "react-router-dom";
import { MENU_ITEMS } from "../../utils/data";
import { IoLogOut } from "react-icons/io5";
import { useAuthContext } from "../../context/AuthContext";
import { toast } from "sonner";
import logo from "../../assets/images/logo-bds.png"

export default function DashboardMenu() {
    const navigate = useNavigate();
    const { auth, signout } = useAuthContext();

    const handleLogout = async function() {
        const result = await signout();
        if(!result) return toast.error("Error Logging out")

        toast.success("Success");
        navigate("/login");
    }

	return (
		<aside className="sidebar">
			<div className="sidebar--header">
				<div className="sidebar--user">
					<div className="sidebar--user-img">
						<img src={logo} alt="logo" />
					</div>
					<div>
						<div className="sidebar--user-name">Admin</div>
						<div className="sidebar--user-email">{auth?.email}</div>
					</div>
				</div>
			</div>

			<nav className="sidebar--nav">
				{MENU_ITEMS?.map(({ title, is_active, link }, i) => (
					<Link className={`menu--item ${is_active ? "is-active" : ""}`} to={link} key={i}>
						<p className="menu--text">{title}</p>
					</Link>
				))}
			</nav>

			<div className="sidebar--footer">
				<button className="menu--item" onClick={handleLogout}>
					<span className="menu--item-icon">
                        <IoLogOut />
                    </span>
					Log out
				</button>
			</div>
		</aside>
	);
}
