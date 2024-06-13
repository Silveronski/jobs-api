import React, {  Suspense, lazy } from "react";
import useAuthRedirect from "../hooks/useAuthRedirect";
import AddJob from "../components/AddJob";
import Loading from "../components/Loading";
import Actions from "../components/Actions";

const Jobs = lazy(() => import("../components/Jobs"));

const Dashboard: React.FC = () => {
    useAuthRedirect();
    return (
        <section className="dashboard-container">
            <AddJob/>
            <Actions/>
            <Suspense fallback={<Loading className="loading-center"/>}>
                <Jobs/>
            </Suspense>       
        </section>
    )
}

export default Dashboard