import React, { useState } from "react";
import { toast } from "sonner";
import { Loader } from "./Loading";
import Overlay from "./Overlay";
import { AiOutlineClose } from "react-icons/ai";
import { useAuthContext } from "../../context/AuthContext";

export default function CategoryModal({ closeModal, refetchStats }: { closeModal: () => void; refetchStats: () => void }) {
    const { headers, shouldKick } = useAuthContext();

	const [errors, setErrors] = useState<any>({});
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
	});

	const handleInputChange = (e: any) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const validateForm = () => {
		const newErrors: any = {};

		if (!formData.name.trim()) {
			newErrors.name = "Please provide a name";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async function() {
		if (!validateForm()) {
			return toast.error("Fill up all required fields");
		}
        setLoading(true)

		try {
			// MAKE REQUEST
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/category`, {
                method: "POST",
                headers, body: JSON.stringify(formData)
            });
            shouldKick(res);

            const data = await res.json();
            if (res.status !== 201 || data?.status !== "success") {
                throw new Error(data?.error?.message);
            }

            toast.success("Success!");
            refetchStats();
            closeModal();

		} catch (err: any) {
			toast.error(err?.message || "Failed to add category.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<React.Fragment>
            <Overlay handleClose={closeModal} />
            <div className='modal basic--modal'>
                <div className="modal--head">
                    <h3 className="modal--title">Add Category</h3>
                    <span onClick={closeModal}><AiOutlineClose /></span>
                </div>

                <div className="form">
                    <div className="form--group" style={{ marginBottom: "2rem" }}>
                        <label className="form--label">
                            Category Name <span className="required">*</span>
                        </label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={`form--input ${errors.name ? "error" : ""}`} placeholder="Enter category name" />
                        {errors.name && <span className="error--text">{errors.name}</span>}
                    </div>

                    <div className="form--group">
                        <label className="form--label">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} className="form--textarea" placeholder="Enter description" />
                    </div>
                </div>

                <div className="form--actions">
                    <button type="button" className="btn--secondary" onClick={closeModal}>
                        Cancel
                    </button>
                    <button type="button" onClick={handleSubmit} className={`btn--primary ${loading ? "disabled" : ""}`} disabled={loading}>
                        {loading ? <Loader /> : "Add Category"}
                    </button>
                </div>
            </div>
		</React.Fragment>
	);
}
