import React from 'react'
import DashboardMenu from '../layout/DashboardMenu'
import DashboardHeader from '../layout/DashboardHeader'

export default function DashboardUI({ children }: { children: React.ReactNode }) {
    return (
        <React.Fragment>
            <DashboardMenu />
                
            <main className="main--content">
                <DashboardHeader />
                {children}
            </main>
        </React.Fragment>
    )
}