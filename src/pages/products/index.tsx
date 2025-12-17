import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { BiCollection } from "react-icons/bi";
import { GiTakeMyMoney } from "react-icons/gi";
import { LuTags } from "react-icons/lu";
import { Link } from "react-router-dom";
import CategoryModal from "../../components/layout/CategoryModal";
import { useAuthContext } from "../../context/AuthContext";
import { formatDate, formatNumber } from "../../utils/helpers";
import { Loader } from "../../components/layout/Loading";
import { MdDelete, MdEdit  } from "react-icons/md";
import DeleteModal from "../../components/layout/DeleteModal";

export default function index() {
    const { headers, shouldKick } = useAuthContext();

	const [stats, setStats] = useState({
		totalProducts: 0,
		totalInventoryWorth: 0,
		totalCategory: 0,
	});
	// const [tableData, setTableData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [tableLoading, setTableLoading] = useState(false);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [paginationDetails, setPaginationDetails] = useState({
        currentPage: 1,
        perPage: 10,
        totalCount: 0,
    });

    const [selectedId, setSelectedId] = useState(null);
    const [showDelete, setShowDelete] = useState(false);

	// Fetch dashboard stats
	useEffect(function () {
		fetchStats();
	}, []);

    useEffect(function() {
		fetchTableProducts();
    }, [searchQuery, paginationDetails.currentPage, paginationDetails.perPage]);


	const fetchStats = async function () {
		setLoading(true);

		try {
			const res = await fetch(`${import.meta.env.VITE_BASE_URL}/products/analytics/stats`, {
                method: "GET",
                headers
            });
            shouldKick(res);

            const data = await res.json();
            if (res.status !== 200 || data?.status !== "success") {
                throw new Error(data?.error?.message);
            }

			setStats(data?.data);
		} catch (error) {
			console.error("Error fetching stats:", error);
		} finally {
			setLoading(false);
        }
	};

	const fetchTableProducts = async function () {
		setTableLoading(true);
		try {
			const params = new URLSearchParams({
                page: `${searchQuery ? 1 : paginationDetails?.currentPage}`,
                ...(searchQuery && { search: searchQuery }),
            });

            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/products?${params.toString()}`, {
                method: "GET",
                headers,
            });
            shouldKick(res);

            const data = await res.json();
            if (res.status !== 200 || data?.status !== "success") {
                throw new Error(data?.message);
            }

            setProducts(data?.data?.products)
            setPaginationDetails({ ...paginationDetails, totalCount: data?.pagination?.totalItems })

			// const mockData = [
			// 	{
			// 		id: 1,
			// 		name: "Adebesi Oluchi",
			// 		email: "adebisi123@gmail.com",
			// 		phone: "+234 9045436576",
			// 		status: "Enrolled",
			// 		course: "Fullstack dev",
			// 		date: "Jan 4, 2024",
			// 	},
			// 	{
			// 		id: 2,
			// 		name: "Ama Amos",
			// 		email: "ama123@gmail.com",
			// 		phone: "+234 9045436576",
			// 		status: "Enrolled",
			// 		course: "Fullstack dev",
			// 		date: "Jan 4, 2024",
			// 	},
			// 	{
			// 		id: 3,
			// 		name: "Candi Oland",
			// 		email: "candi123@gmail.com",
			// 		phone: "+234 9045436576",
			// 		status: "Enrolled",
			// 		course: "Fullstack dev",
			// 		date: "Jan 4, 2024",
			// 	},
			// 	{
			// 		id: 4,
			// 		name: "Osando Juma",
			// 		email: "osand123@gmail.com",
			// 		phone: "+234 9045436576",
			// 		status: "Enrolled",
			// 		course: "Fullstack dev",
			// 		date: "Jan 4, 2024",
			// 	},
			// 	{
			// 		id: 5,
			// 		name: "Mari Lari",
			// 		email: "mari123@gmail.com",
			// 		phone: "+234 9045436576",
			// 		status: "Enrolled",
			// 		course: "Fullstack dev",
			// 		date: "Jan 4, 2024",
			// 	},
			// ];
			// setTableData(mockData as []);
		} catch (error) {
			console.error("Error fetching table data:", error);
		} finally {
			setTableLoading(false);
		}
	};

	const customStyle = {
		table: {
			style: {
				backgroundColor: "#ffffff",
			},
		},
		headRow: {
			style: {
				backgroundColor: "#f9fafb",
				borderBottom: "1px solid #e5e7eb",
				minHeight: "48px",
			},
		},
		headCells: {
			style: {
				fontSize: "12px",
				fontWeight: "600",
				color: "#6b7280",
				textTransform: "uppercase",
			},
		},
		rows: {
			style: {
				minHeight: "60px",
				borderBottom: "1px solid #f3f4f6",
				"&:hover": {
					backgroundColor: "#f9fafb",
				},
			},
		},
		cells: {
			style: {
				fontSize: "14px",
				color: "#374151",
			},
		},
	};

	// Table columns configuration
	const columns = [
		{
			name: "Product Name",
			selector: (row: any) => (
                <div className="table--product">
					<div className="table--product-main-img">
                        <img src={row?.images?.[0]?.url} />
                    </div>
					<div>
						<div className="table--product-name">{row.name}</div>
						<div className="table--product-des">{row.product_category?.[0]?.name}</div>
					</div>
				</div>
            ),
			sortable: true,
			minWidth: "22rem",
		},
		{
			name: "Category",
			selector: (row: any) => row.product_category?.[0]?.name,
			sortable: true,
		},
		{
			name: "Price",
			selector: (row: any) => row.formattedPrice,
			sortable: true,
		},
		{
			name: "Stock",
			selector: (row: any) => `${row.stock || 0} units`,
			sortable: true,
		},
		{
			name: "Status",
			selector: (row: any) => <span className={`table--status table--status-${row?.stock > 0 ? "in-stock" : "out-stock"}`}>● {row?.stock > 0 ? "in stock" : "out of stock"}</span>,
			sortable: true,
		},
		{
			name: "Date",
			selector: (row: any) => formatDate(row?.createdAt),
			sortable: true,
		},
		{
			name: "Actions",
			selector: (row: any) => (
                <div style={{ display: "flex", alignItems: "center", gap: "0.48rem" }}>
                    <span className="table--action-btn" onClick={() => {
                        setSelectedId(row?._id);
                        setShowDelete(true)
                    }}>
                        <MdDelete />
                    </span>

                    <Link className="table--action-btn" to={`/dashboard/edit-product/${row?._id}`} state={{ ...row }}>
                        <MdEdit  />
                    </Link>
                </div>
            ),
			button: true,
		},
	];

    const handleChangePage = function(page: number) {
        setPaginationDetails({ ...paginationDetails, currentPage: page });
    };

    const handleChangePerPage = function(newPerPage: number) {
        setPaginationDetails({ ...paginationDetails, perPage: newPerPage });
    };

    const handleCloseModal = function() {
        setSelectedId(null);
        setShowDelete(false)
    }

	return (
		<React.Fragment>
            {(selectedId && showDelete) && (
                <DeleteModal
                    id={selectedId}
                    closeModal={handleCloseModal}
                    refetch={() => {
                        fetchTableProducts();
                        fetchStats();
                    }} 
                />
            )}

            {showAddCategory && (
                <CategoryModal
                    closeModal={() => setShowAddCategory(false)}
                    refetchStats={fetchStats}
                />
            )}

			<div className="stats">
				<div className="stats--card">
					<div className="stats--card-header">
						<span className="stats--card-icon">
                            <LuTags />
                        </span>
						<h3 className="stats--card-title">Total Products</h3>
					</div>
					<p className="stats--card-value">{loading ? "---" : stats.totalProducts}</p>
				</div>

				<div className="stats--card">
					<div className="stats--card-header">
						<span className="stats--card-icon">
                            <GiTakeMyMoney />
                        </span>
						<h3 className="stats--card-title">Total Inventory Worth</h3>
					</div>
					<p className="stats--card-value">{loading ? "---" : "₦"+formatNumber(stats.totalInventoryWorth || 0)}</p>
				</div>

				<div className="stats--card">
					<div className="stats--card-header">
						<span className="stats--card-icon">
                            <BiCollection />
                        </span>
						<h3 className="stats--card-title">Total Categories</h3>
					</div>
					<p className="stats--card-value">{loading ? "---" : stats.totalCategory}</p>
				</div>
			</div>

			<div className="table--container">
				<div className="table--header">
					<h2 className="table--title">
						All Products <span className="table--count">{products?.length || 0}</span>
					</h2>
					<div className="table--actions">
						<input type="text" placeholder="Search" className="table--search" onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} />
                        
						<Link className="btn btn--primary" to="/dashboard/add-product">
							<span>+</span> Add Product
						</Link>

                        <span className="btn btn--secondary" onClick={() => setShowAddCategory(true)}>
                            <span>+</span> Add Category
                        </span>
					</div>
				</div>

				<DataTable
                    columns={columns as any}
                    data={products as []}
                    pagination
                    paginationRowsPerPageOptions={[10, 20, 30]}
                    progressPending={tableLoading}
                    highlightOnHover
                    pointerOnHover
                    customStyles={customStyle as {}}
                    progressComponent={
                        <div className="table-spinner-container">
                            <Loader />
                        </div>
                    }
                    paginationPerPage={paginationDetails?.perPage}
                    paginationDefaultPage={paginationDetails?.currentPage}
                    paginationTotalRows={paginationDetails?.totalCount}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangePerPage}
                />
			</div>
		</React.Fragment>
	);
}
