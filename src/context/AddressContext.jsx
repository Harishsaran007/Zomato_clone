import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProvinces, addAddress as apiAddAddress, updateAddress as apiUpdateAddress, deleteAddress as apiDeleteAddress } from '@/services/addressService';
import { useAuth } from './AuthContext';

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
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchAddresses = async () => {
        if (user) {
            setLoading(true);
            try {
                const data = await getProvinces();
                setAddresses(data);

                let nextSelection = null;

                if (selectedAddress) {
                    const exists = data.find(a => a.id === selectedAddress.id);
                    if (exists) nextSelection = exists;
                }

                if (!nextSelection) {
                    const defaultAddr = data.find(addr => addr.is_default);
                    if (defaultAddr) {
                        nextSelection = defaultAddr;
                    } else if (data.length > 0) {
                        // Fallback to first
                        nextSelection = data[0];
                    }
                }

                setSelectedAddress(nextSelection);

            } catch (error) {
                console.error("Failed to fetch addresses", error);
            } finally {
                setLoading(false);
            }
        } else {
            setAddresses([]);
            setSelectedAddress(null);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, [user]);

    const selectAddress = (address) => {
        setSelectedAddress(address);
    };

    const addAddress = async (newAddressData) => {
        try {
            await apiAddAddress(newAddressData);
            await fetchAddresses(); 
        } catch (error) {
            console.error("Failed to add address", error);
            throw error;
        }
    };

    const updateAddress = async (id, updatedData) => {
        try {
            await apiUpdateAddress(id, updatedData);
            await fetchAddresses();
        } catch (error) {
            console.error("Failed to update address", error);
            throw error;
        }
    };

    const deleteAddress = async (id) => {
        try {
            await apiDeleteAddress(id);
            await fetchAddresses();
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
