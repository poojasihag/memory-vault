import React from "react";

export default function Archive() {
    return (
        <div
            id="archive"
            className="bg-[#efe6dc] px-10 py-20 grid md:grid-cols-2 gap-10 items-center"
        >
            {/* Left */}
            <div className="animate-fadeIn">
                <h2 className="text-4xl italic text-[#8b3a3a] mb-6">
                    A Living Archive
                </h2>

                <p className="text-gray-600 mb-6 max-w-md">
                    Beyond simple storage, we provide a space where stories breathe.
                    Organize by decade, by emotion, or by the people who matter most.
                </p>

                <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                        <span>✍️</span>
                        <div>
                            <h4 className="font-semibold">Annotate Your Life</h4>
                            <p className="text-sm text-gray-500">
                                Add handwritten-style notes and voice memos.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 items-start">
                        <span>🛡️</span>
                        <div>
                            <h4 className="font-semibold">Enduring Security</h4>
                            <p className="text-sm text-gray-500">
                                Encrypted vaults designed to last generations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right */}
            <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                <div className="col-span-2 bg-gray-300 h-44 rounded-lg shadow-md"></div>

                <div className="bg-[#8b5e3c] h-36 rounded-lg shadow-md flex items-center justify-center text-white">
                    AUTOMATIC CURATIONS
                </div>

                <div className="border-2 border-dashed border-gray-300 h-36 rounded-lg flex items-center justify-center">
                    📷
                </div>
            </div>
        </div>
    );
}