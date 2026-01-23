import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";

const AddAddressModal = ({ isOpen, onClose, onAddressAdded, addressToEdit, onAddressUpdated }) => {
    const [formData, setFormData] = useState({
        label: '',
        address_line: '',
        city: '',
        latitude: '',
        longitude: '',
        is_default: false
    });
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (addressToEdit) {
            setFormData({
                label: addressToEdit.label || '',
                address_line: addressToEdit.address_line || '',
                city: addressToEdit.city || '',
                latitude: addressToEdit.latitude || '',
                longitude: addressToEdit.longitude || '',
                is_default: addressToEdit.is_default || false
            });
        } else {
            setFormData({
                label: '',
                address_line: '',
                city: '',
                latitude: '',
                longitude: '',
                is_default: false
            });
        }
    }, [addressToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (addressToEdit) {
                await onAddressUpdated(addressToEdit.id, formData);
            } else {
                await onAddressAdded(formData);
            }
            onClose(); // Close modal on success
            setFormData({ label: '', address_line: '', city: '', latitude: '', longitude: '', is_default: false }); // Reset form
        } catch (error) {
            console.error("Failed to save address", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{addressToEdit ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="label" className="text-right text-sm font-medium">
                            Label
                        </label>
                        <Input
                            id="label"
                            name="label"
                            placeholder="Home, Work..."
                            value={formData.label}
                            onChange={handleChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="address_line" className="text-right text-sm font-medium">
                            Address
                        </label>
                        <Input
                            id="address_line"
                            name="address_line"
                            placeholder="123 Main St"
                            value={formData.address_line}
                            onChange={handleChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="city" className="text-right text-sm font-medium">
                            City
                        </label>
                        <Input
                            id="city"
                            name="city"
                            placeholder="New York"
                            value={formData.city}
                            onChange={handleChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="latitude" className="text-right text-sm font-medium">
                            Lat
                        </label>
                        <Input
                            id="latitude"
                            name="latitude"
                            placeholder="12.34"
                            value={formData.latitude}
                            onChange={handleChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="longitude" className="text-right text-sm font-medium">
                            Long
                        </label>
                        <Input
                            id="longitude"
                            name="longitude"
                            placeholder="56.78"
                            value={formData.longitude}
                            onChange={handleChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : (addressToEdit ? 'Update Address' : 'Save Address')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddAddressModal;
