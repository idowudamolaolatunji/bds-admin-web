import React, { useState } from 'react'
import Overlay from './Overlay'
import { AiOutlineClose } from 'react-icons/ai'
import { Loader } from './Loading';
import { useAuthContext } from '../../context/AuthContext';
import { toast } from 'sonner';

export default function DeleteModal({ id, closeModal, refetch }: { id: string, closeModal: () => void; refetch?: () => void }) {
    const { headers } = useAuthContext();
    const [loading, setLoading] = useState(false);

    const handleDelete = async function() {
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/products/${id}/delete`, {
                method: "DELETE",
                headers,
            });

            const data = await res.json();
            if (res.status !== 200 || data?.status !== "success") {
                throw new Error(data?.message);
            }

            toast.success("Deleted Successfully!");
            refetch && refetch()
            closeModal();
        } catch (err: any) {
            const message = err?.message == "Failed to fetch" ? "Check Internet Connection!" : err?.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

  return (
    <React.Fragment>
        <Overlay handleClose={closeModal} />
        <div className='modal basic--modal'>
            <div className="modal--head">
                <h3 className="modal--title">Delete Item</h3>
                <span onClick={closeModal}><AiOutlineClose /></span>
            </div>

            <div className="modal--body">
               <p>Are you sure you want to delete this item?</p> 

               <div className="form--actions">
                    <button type="button" className="btn--primary" onClick={closeModal}>
                        Cancel
                    </button>
                    <button type="button" onClick={handleDelete} className={`btn--secondary ${loading ? "disabled" : ""}`} disabled={loading}>
                        {loading ? <Loader /> : "Yes, Delete"}
                    </button>
                </div>
            </div>
        </div>
    </React.Fragment>
  )
}
