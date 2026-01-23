import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const AccountDetailsModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (isOpen && user?.id) {
                setLoading(true);
                try {
                    const response = await axios.get(`/api/users/${user.id}/`);
                    setUserDetails(response.data);
                    setError(null);
                } catch (err) {
                    console.error("Failed to fetch user details:", err);
                    setError("Failed to load user details.");
                } finally {
                    setLoading(false);
                }
            }
        };

        if (isOpen) {
            fetchUserDetails();
        } else {
            setUserDetails(null);
            setError(null);
        }
    }, [isOpen, user]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Account Details</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {loading ? (
                        <div className="text-center py-4">Loading...</div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-4">{error}</div>
                    ) : userDetails ? (
                        <div className="grid gap-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-semibold text-right text-sm">Username:</span>
                                <span className="col-span-3 text-sm">{userDetails.username}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-semibold text-right text-sm">Email:</span>
                                <span className="col-span-3 text-sm">{userDetails.email}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-semibold text-right text-sm">Phone:</span>
                                <span className="col-span-3 text-sm">{userDetails.phone_number}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-semibold text-right text-sm">Address:</span>
                                <span className="col-span-3 text-sm">{userDetails.address}</span>
                            </div>
                        </div>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AccountDetailsModal;
