import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useAddress as useAddressQuery, useAddAddress, useUpdateAddress, useDeleteAddress } from '@/hooks/api/useAddress';

const AddressContext = createContext();

export const useAddress = () => {
    const context = useContext(AddressContext);
    if (!context) {
        throw new Error('useAddress must be used within an AddressProvider');
    }
    return context;
};

export const AddressProvider = ({ children }) => {
    const { user } = useAuth();
    const { data: addresses = [], isLoading: loading } = useAddressQuery(!!user);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const addAddressMutation = useAddAddress();
    const updateAddressMutation = useUpdateAddress();
    const deleteAddressMutation = useDeleteAddress();

    useEffect(() => {
        if (!user) {
            setSelectedAddress(null);
            return;
        }

        if (addresses.length > 0) {
            let nextSelection = null;

            if (selectedAddress) {
                const exists = addresses.find(a => a.id === selectedAddress.id);
                if (exists) nextSelection = exists;
            }

            if (!nextSelection) {
                const defaultAddr = addresses.find(addr => addr.is_default);
                nextSelection = defaultAddr || addresses[0];
            }

            if (nextSelection && (!selectedAddress || selectedAddress.id !== nextSelection.id || selectedAddress !== nextSelection)) {
                setSelectedAddress(nextSelection);
            }
        } else {
            if (selectedAddress) {
                setSelectedAddress(null);
            }
        }
    }, [addresses, user]);

    const selectAddress = (address) => {
        setSelectedAddress(address);
    };

    const addAddress = async (newAddressData) => {
        try {
            await addAddressMutation.mutateAsync(newAddressData);
        } catch (error) {
            console.error("Failed to add address", error);
            throw error;
        }
    };

    const updateAddress = async (id, updatedData) => {
        try {
            await updateAddressMutation.mutateAsync({ id, data: updatedData });
        } catch (error) {
            console.error("Failed to update address", error);
            throw error;
        }
    };

    const deleteAddress = async (id) => {
        try {
            await deleteAddressMutation.mutateAsync(id);
        } catch (error) {
            console.error("Failed to delete address", error);
            throw error;
        }
    };

    return (
        <AddressContext.Provider value={{
            addresses,
            selectedAddress,
            selectAddress,
            addAddress,
            updateAddress,
            deleteAddress,
            loading
        }}>
            {children}
        </AddressContext.Provider>
    );
};
