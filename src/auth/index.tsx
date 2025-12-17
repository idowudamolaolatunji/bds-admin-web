import { useEffect, useState } from "react";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import Asterisk from "../components/elements/Asterisk";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader } from "../components/layout/Loading";
import logo from "../assets/images/logo-bds.png"

export default function index() {
	const navigate = useNavigate();
	const { handleAuthChange, auth } = useAuthContext();
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleChangeData = function (event: any) {
		const { name, value } = event?.target;

		setFormData({ ...formData, [name]: value });
	};

	async function handleSubmitLogin(e: any) {
		e.preventDefault();

		const { email, password } = formData;
		if (!email || !password) {
			return toast.error("Fill up all required field");
		}

		setLoading(true);
		try {
			const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();
			if (!data?.status || data?.status !== "success") {
				throw new Error(data?.message);
			}

			toast.success("Login successful");
			setTimeout(() => handleAuthChange(data?.data?.admin, data?.token), 1200);
		} catch (err: any) {
			toast.error(err?.message || "Something Went Wrong");
		} finally {
			setLoading(false);
		}
	}

	useEffect(
		function () {
			if (auth) {
				navigate("/");
			}
		},
		[auth],
	);

	return (
		<div className="login_main">
			<div className="login_container">
				<img src={logo} alt="logo" style={{ width: "10rem", alignSelf: "center" }} />

				<h3 className="login_heading">
					Welcome Admin👋🏿
					<br />
					Login to your account!
				</h3>

				<div className="login">
					<form className="login_form" onSubmit={handleSubmitLogin}>
						<div className="form__item">
							<label htmlFor="email" className="form__label">
								Email Address <Asterisk />
							</label>
							<input type="email" placeholder="example@admin.com" id="email" name="email" className="form__input" value={formData.email} onChange={handleChangeData} />
						</div>
						<div className="form__item">
							<label htmlFor="password" className="form__label">
								Password <Asterisk />
							</label>
							<div className="form--input-box">
								<input type={showPassword ? "text" : "password"} name="password" id="password" className="form__input" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" value={formData.password} onChange={handleChangeData} />
								<div className="form--input-icon" onClick={() => setShowPassword(!showPassword)}>
									{showPassword ? <ImEye /> : <ImEyeBlocked />}
								</div>
							</div>
						</div>
						<div className="form__item">
							<button className="form__submit" disabled={loading} type="submit">
								{loading ? <Loader color="#fff" /> : "Grant Access"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
