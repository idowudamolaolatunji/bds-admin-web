import React, { useEffect, useState } from "react";
import MultipleImageUploadInput from "../../components/layout/MultipleImageUploadInput";
import type { ImageListType } from "react-images-uploading";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { toast } from "sonner";
import { Loader } from "../../components/layout/Loading";
import { BsChevronRight } from "react-icons/bs";

export default function index() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { token, shouldKick, headers } = useAuthContext();

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: "",
		product_category: "",
		is_new: true,
		discount: 0,
		stock: 1,
		highlights: [],
		ingredients: [],
		howToUse: [],
	});
	const [categories, setCategories] = useState<{ name: string, _id: string }[]>([]);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<any>({});

    const [images, setImages] = useState<ImageListType>([]);
    const imageFiles = images.filter(img => img?.file)?.map(img => img?.file);
    const [updatedIndexes, setUpdatedIndexes] = useState<number[]>([]);


	// Fetch categories on mount
	useEffect(function () {
		fetchCategories();
	}, []);

    useEffect(function() {
        if(id && location?.state?._id) {
            const state = location?.state;

            setFormData({
                name: state?.name || "",
                description: state?.description || "",
                price: state?.price || "",
                product_category: state?.product_category?.[0]?._id || "",
                is_new: state?.is_new || true,
                discount: state?.discount || 0,
                stock: state?.stock || 1,
                highlights: state?.highlights || [""],
                ingredients: state?.ingredients || [""],
                howToUse: state?.howToUse || [""],
            });

            setImages(state?.images?.map((img: { url: string }) => (
                { data_url: img?.url }
            )))
        }
    }, [id, location])

	const fetchCategories = async () => {
		try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/category`, {
                method: "GET",
                headers
            });
            shouldKick(res);

            const data = await res.json();
            if (res.status !== 200 || data?.status !== "success") {
                throw new Error(data?.error?.message);
            }

			setCategories(data?.data?.categories);
		} catch (error) {
			console.error("Error fetching categories:", error);
		}
	};

	const handleInputChange = (e: any) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleArrayChange = (index: number, 
  value: string | { url: string; public_id: string }, 
  field: 'highlights' | 'ingredients' | 'howToUse') => {
		setFormData((prev) => ({
			...prev,
			[field]: prev[field].map((item, i) => (i === index ? value : item)),
		}));
	};

	const addArrayField = (field: 'highlights' | 'ingredients' | 'howToUse') => {
		setFormData((prev) => ({
			...prev,
			[field]: [...prev[field], ""],
		}));
	};

	const removeArrayField = (index: number, field: 'highlights' | 'ingredients' | 'howToUse') => {
		setFormData((prev) => ({
			...prev,
			[field]: prev[field].filter((_, i) => i !== index),
		}));
	};

	const validateForm = () => {
		const newErrors: any = {};

		if (!formData.name.trim()) {
			newErrors.name = "Please provide a product name";
		}

		if (!formData.price || parseFloat(formData.price) <= 0) {
			newErrors.price = "Please enter a valid price amount";
		}

		if (!formData.product_category) {
			newErrors.product_category = "Please select a category";
		}

        if(id ? images?.length < 1 : imageFiles?.length < 1) {
			newErrors.images = "Please enter at least one";
        }

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

    // MULTIPLE IMAGES ON CHANGE
    const handleOnChangeImage = function(imageList: ImageListType, addUpdateIndex: number[] | undefined) {
        setImages(imageList);
        
        if(addUpdateIndex !== undefined && addUpdateIndex.length > 0 && id) {
            setUpdatedIndexes((prev) => 
                [...new Set([...prev, addUpdateIndex[0]])].sort((a, b) => a - b)
            )
        }
    };

	const handleSubmit = async () => {
		if (!validateForm()) {
			return toast.error("Fill up all required fields");
		}

		setLoading(true);
        const { name, description, price, product_category, is_new, discount, stock, highlights, ingredients, howToUse } = formData;

		try {
            // MAKE REQUEST
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('product_category', product_category);
            formData.append('is_new', is_new.toString());
            formData.append('discount', discount.toString());
            formData.append('stock', stock.toString());
            formData.append('highlights', JSON.stringify(highlights || []));
            formData.append('ingredients', JSON.stringify(ingredients || []));
            formData.append('howToUse', JSON.stringify(howToUse || []));

            if(!id) {
                for(const image of imageFiles) {
                    formData.append("images", image as any);
                }
            } else {
                if(updatedIndexes && imageFiles) {
                    formData.append("updatedIndexes", JSON.stringify(updatedIndexes));

                    for(const image of imageFiles) {
                        formData.append("images", image as any);
                    }
                }
            }

            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/products/${id ? `${id}/edit` : "create"}`, {
                headers: { Authorization: `Bearer ${token}` },
                method: id ? "PATCH" : "POST",
                body: formData
            });
            shouldKick(res);

            const data = await res.json();
            if (data?.status !== 'success') {
                throw new Error(data?.message);
            }

			toast.success(id ? "Product Edited!" : "Product added successfully!");
            navigate("/")
		} catch (err: any) {
			toast.error(err?.message || `Failed to ${id ? "edit" : "add"} product. Please try again.`);
		} finally {
			setLoading(false);
		}
	};

	return (
        <React.Fragment>
            <div className="breadcrums" style={{ marginBottom: "1rem" }}>
                <Link to="/dashboard">Dashboard</Link>
                <BsChevronRight />

                <p className="current">{id ? "Edit Product" : "Add Product"}</p>
            </div>

            <div className="form--container">
                <div>
                    {/* Basic Information Section */}
                    <div className="form--section">
                        <h2 className="section--title">Basic Information</h2>

                        <div className="form--group" style={{ marginBottom: "2rem" }}>
                            <label className="form--label">
                                Product Name <span className="required">*</span>
                            </label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={`form--input ${errors.name ? "error" : ""}`} placeholder="Enter product name" />
                            {errors.name && <span className="error--text">{errors.name}</span>}
                        </div>

                        <div className="form--group">
                            <label className="form--label">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} className="form--textarea" placeholder="Enter product description" />
                        </div>
                    </div>

                    {/* Pricing & Inventory Section */}
                    <div className="form--section">
                        <h2 className="section--title">Pricing & Inventory</h2>

                        <div className="form--grid">
                            <div className="form--group">
                                <label className="form--label">
                                    Price <span className="required">*</span>
                                </label>
                                <input type="number" name="price" value={formData.price} onChange={handleInputChange} className={`form--input ${errors.price ? "error" : ""}`} placeholder="0.00" step="0.01" />
                                {errors.price && <span className="error--text">{errors.price}</span>}
                            </div>

                            <div className="form--group">
                                <label className="form--label">Discount (%)</label>
                                <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} className="form--input" placeholder="0" min="0" max="100" />
                            </div>

                            <div className="form--group">
                                <label className="form--label">Stock Quantity</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="form--input" placeholder="1" min="0" />
                            </div>

                            <div className="form--group">
                                <label className="form--label">
                                    Category <span className="required">*</span>
                                </label>
                                <select name="product_category" value={formData.product_category} onChange={handleInputChange} className={`form--select ${errors.product_category ? "error" : ""}`}>
                                    <option value="">Select a category</option>
                                    {categories.map((cat, i) => (
                                        <option key={i} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.product_category && <span className="error--text">{errors.product_category}</span>}
                            </div>
                        </div>

                        <div className="checkbox--group">
                            <label className="checkbox--label">
                                <input type="checkbox" name="is_new" checked={formData.is_new} onChange={handleInputChange} className="form--checkbox" />
                                Mark as New Product
                            </label>
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className="form--section">
                        <h2 className="section--title">Product Images</h2>

                        <MultipleImageUploadInput
                            handleChange={handleOnChangeImage}
                            images={images}
                            productId={id}
                        />
                        {errors.images && <span className="error--text">{errors.images}</span>}
                    </div>

                    {/* Highlights Section */}
                    <div className="form--section">
                        <h2 className="section--title">Product Highlights</h2>

                        {formData.highlights.map((highlight, index) => (
                            <div key={index} className="array--item-container">
                                <input type="text" value={highlight} onChange={(e) => handleArrayChange(index, e.target.value, "highlights")} className="form--input" style={{ flex: 1 }} placeholder="Enter a product highlight" />
                                {formData.highlights.length > 1 && (
                                    <button type="button" onClick={() => removeArrayField(index, "highlights")} className="btn--remove">
                                        Remove
                                    </button>
                                )}
                                {errors.highlights && <span className="error--text">{errors.highlights}</span>}
                            </div>
                        ))}

                        <button type="button" onClick={() => addArrayField("highlights")} className="btn--add">
                            + Add Highlight
                        </button>
                    </div>

                    {/* Ingredients Section */}
                    <div className="form--section">
                        <h2 className="section--title">Ingredients</h2>

                        {formData.ingredients.map((ingredient, index) => (
                            <div key={index} className="array--item-container">
                                <input type="text" value={ingredient} onChange={(e) => handleArrayChange(index, e.target.value, "ingredients")} className="form--input" style={{ flex: 1 }} placeholder="Enter an ingredient" />
                                {formData.ingredients.length > 1 && (
                                    <button type="button" onClick={() => removeArrayField(index, "ingredients")} className="btn--remove">
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}

                        <button type="button" onClick={() => addArrayField("ingredients")} className="btn--add">
                            + Add Ingredient
                        </button>
                    </div>

                    {/* How To Use Section */}
                    <div className="form--section">
                        <h2 className="section--title">How To Use</h2>

                        {formData.howToUse.map((step, index) => (
                            <div key={index} className="array--item-container">
                                <textarea value={step} onChange={(e) => handleArrayChange(index, e.target.value, "howToUse")} className="form--textarea" style={{ flex: 1 }} placeholder="Enter usage instruction" />
                                {formData.howToUse.length > 1 && (
                                    <button type="button" onClick={() => removeArrayField(index, "howToUse")} className="btn--remove">
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}

                        <button type="button" onClick={() => addArrayField("howToUse")} className="btn--add">
                            + Add Usage Step
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="form--actions">
                        <button
                            type="button"
                            className="btn--secondary"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                        <button type="button" onClick={handleSubmit} className={`btn--primary ${loading ? "disabled" : ""}`} disabled={loading}>
                            {loading ? <Loader color="#fff" /> : id ? "Save Changes" : "Add Product"}
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
	);
}
