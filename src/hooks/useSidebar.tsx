import React, { useState } from 'react'
import Overlay from '../components/layout/Overlay';
import { RiCloseFill } from 'react-icons/ri';
import { Link } from "react-router-dom";
import { MENU_ITEMS } from "../utils/data";


export default function useSidebar() {
    const [animateOut, setAnimateOut] = useState(false);
    const [isShowSidemenu, setIsShowSidemenu] = useState(false);


    const handleRunCloseNanimate = function() {
        setAnimateOut(true);
        setTimeout(() => {
            setAnimateOut(false);
            setIsShowSidemenu(false);
        }, 300);
    }

    const handleToggleSidemenu = function() {
        if(!isShowSidemenu) {
            setIsShowSidemenu(true);
        } else {
            handleRunCloseNanimate();
        }
    }

    const MobileDashboadMenuUI = function() {
        return (
            <React.Fragment>
                <Overlay handleClose={handleToggleSidemenu} />

                <div className={`dashboard--sidemenu ${animateOut ? 'animate-out' : ''}`}>
                    <span className='hamburger--icon icon--box' onClick={handleToggleSidemenu}>
                        <RiCloseFill />
                    </span>

                    <div className="menu--block">
                        <span className='block--heading'>
                            <p className='heading--text'>Menu</p>
                        </span>

                        <div className="menu--list">
                            {MENU_ITEMS?.map(({ title, is_active }, i) => (
                                <Link className={`menu--item ${is_active ? "is-active" : ""}`} to="" key={i}>
                                    <p className='menu--text'>{title}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    return { MobileDashboadMenuUI, isShowSidemenu, handleToggleSidemenu }
}
