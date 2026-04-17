import { useState } from "react";

const UserMenu = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-6 left-6">

            <div
                onClick={() => setOpen(!open)}
                className="bg-white px-4 py-2 shadow cursor-pointer"
            >
                Curator ID: #1021
            </div>

            {open && (
                <div className="bg-white mt-2 shadow p-3 text-sm space-y-2">
                    <p className="cursor-pointer">Switch Account</p>
                    <p className="cursor-pointer text-red-500">Logout</p>
                </div>
            )}
        </div>
    );
};

export default UserMenu;