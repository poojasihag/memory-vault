// import AlbumCard from "../components/AlbumCard";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
// import Templates from "../components/Templates";

const Dashboard = () => {
    const [activePage, setActivePage] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex bg-[#f3efe7] min-h-screen">

            {/* SIDEBAR */}
            <Sidebar
                open={sidebarOpen}
                active={activePage}
                setActive={setActivePage}
                onClose={() => setSidebarOpen(false)}
            />

            {/* MAIN */}
            <div className="flex-1 px-12 py-8">

                {/* HEADING */}
                <p className="text-[#8b3a3a] text-lg" style={{ fontFamily: "cursive" }}>
                    Welcome back, curator
                </p>

                <h1 className="text-4xl font-serif text-[#2d2d2d] mt-1">
                    Your Recent Collections
                </h1>

                {/* ALBUMS */}
                <div className="mt-10 grid grid-cols-3 gap-10">

                    {/* CARD 1 */}
                    <div className="bg-white p-4 shadow-md">
                        <img
                            src="https://images.unsplash.com/photo-1490750967868-88aa4486c946"
                            className="w-full h-64 object-cover"
                        />
                        <p className="text-center mt-3 text-sm">
                            Sunday in the Garden
                        </p>
                        <p className="text-center text-xs text-gray-500">
                            May 12, 1998
                        </p>
                    </div>

                    {/* CARD 2 */}
                    <div className="bg-white p-4 shadow-md">
                        <img
                            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                            className="w-full h-64 object-cover"
                        />
                        <p className="text-center mt-3 text-sm">
                            The Italian Summer
                        </p>
                        <p className="text-center text-xs text-gray-500">
                            August 2004
                        </p>
                    </div>

                    {/* CARD 3 */}
                    <div className="bg-white p-4 shadow-md">
                        <img
                            src="https://images.unsplash.com/photo-1519681393784-d120267933ba"
                            className="w-full h-64 object-cover"
                        />
                        <p className="text-center mt-3 text-sm">
                            First Drafts
                        </p>
                        <p className="text-center text-xs text-gray-500">
                            October 1995
                        </p>
                    </div>

                </div>

                {/* SECOND ROW */}
                <div className="mt-10 grid grid-cols-2 gap-10">

                    {/* BIG CARD */}
                    <div className="bg-white p-4 shadow-md flex gap-6">
                        <img
                            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                            className="w-1/2 h-64 object-cover"
                        />

                        <div>
                            <h2 className="font-serif text-lg">The Great Escape</h2>
                            <p className="text-sm text-gray-600 mt-2">
                                A weekend where time stood still...
                            </p>
                        </div>
                    </div>

                    {/* SIDE CARD */}
                    <div className="bg-white p-4 shadow-md">
                        <img
                            src="https://images.unsplash.com/photo-1492724441997-5dc865305da7"
                            className="w-full h-64 object-cover"
                        />
                        <p className="text-center mt-3 text-sm">
                            Echoes of Gold
                        </p>
                        <p className="text-center text-xs text-gray-500">
                            Winter 2010
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Dashboard;