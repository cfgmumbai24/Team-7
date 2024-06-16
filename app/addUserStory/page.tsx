"use client";

import Link from "next/link";

export default function UserStoryUpload() {
    return (
        <div>
            <Link href={`/upload-story`}/>
            <h2 className="text-2xl font-semibold mb-4 text-white text-center">
                Current User Stories:
            </h2>
        </div>
    )
}