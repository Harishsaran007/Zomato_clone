import React from 'react';
import { Skeleton } from "@/Components/ui/skeleton";

const RestaurantSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <Skeleton className="w-full h-40" />

            <div className="p-3 space-y-2">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-5 w-10 rounded-md" />
                </div>

                <Skeleton className="h-3 w-1/2 rounded-md" />

                <Skeleton className="h-3 w-1/4 rounded-md" />
            </div>
        </div>
    );
};

export default RestaurantSkeleton;
