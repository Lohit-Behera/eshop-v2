import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Address } from "@/feature/addressSlice";

export default function ShippingAddress({
  onUpdateAddress,
}: {
  onUpdateAddress: (address: Address) => void;
}) {
  const allAddresses = useSelector(
    (state: RootState) => state.address.allAddresses.data
  );

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    allAddresses.find((addr) => addr.isDefault)?._id || null
  );
  const [shippingMethod, setShippingMethod] = useState("standard");

  useEffect(() => {
    if (!selectedAddressId && allAddresses.length > 0) {
      setSelectedAddressId(allAddresses[0]._id);
    }
  }, [allAddresses]);

  useEffect(() => {
    onUpdateAddress(
      allAddresses.find((addr) => addr._id === selectedAddressId)!
    );
  }, [selectedAddressId]);

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    onUpdateAddress(allAddresses.find((addr) => addr._id === addressId)!);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {allAddresses.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Saved Addresses</h3>
            <Button variant="outline" size="sm" asChild>
              <Link to="/profile">Manage Addresses</Link>
            </Button>
          </div>
          <RadioGroup
            value={selectedAddressId || ""}
            onValueChange={handleAddressSelect}
            className="space-y-3"
          >
            {allAddresses.map((addr) => (
              <Card
                key={addr._id}
                className={`border ${
                  selectedAddressId === addr._id
                    ? "border-primary"
                    : "border-border"
                }`}
              >
                <CardContent className="p-3 md:p-4 flex items-start gap-2 md:gap-3">
                  <RadioGroupItem
                    value={addr._id}
                    id={addr._id}
                    className="mt-1"
                  />
                  <Label htmlFor={addr._id} className="flex-1 cursor-pointer">
                    <div className="flex flex-wrap justify-between gap-1">
                      <span className="font-medium text-sm md:text-base">
                        {addr.name}
                      </span>
                      {addr.type && (
                        <span className="text-xs bg-muted px-2 py-1 rounded-full">
                          {addr.type}
                        </span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      {addr.addressLine1}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {addr.city}, {addr.state}, {addr.pinCode}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {addr.country}
                    </p>
                    {addr.phone && (
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Phone: {addr.phone}
                      </p>
                    )}
                    {addr.isDefault && (
                      <div className="flex items-center gap-1 text-primary text-xs mt-2">
                        <Check className="h-3 w-3" />
                        <span>Default Address</span>
                      </div>
                    )}
                  </Label>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            No saved addresses found.
          </p>
          <Button variant="outline" size="sm" className="mt-2" asChild>
            <Link to="/profile">Manage Addresses</Link>
          </Button>
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-medium mb-3">Shipping Method</h3>
        <RadioGroup
          defaultValue={shippingMethod}
          onValueChange={setShippingMethod}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 border p-3 md:p-4 rounded-md">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard" className="flex-1 cursor-pointer">
              <div className="flex justify-between flex-wrap sm:flex-nowrap">
                <span className="text-sm md:text-base">Standard Shipping</span>
                <span className="text-sm md:text-base">₹329.98</span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">
                Delivery in 3-5 business days
              </p>
            </Label>
          </div>
          <div className="flex items-center space-x-2 border p-3 md:p-4 rounded-md">
            <RadioGroupItem value="express" id="express" />
            <Label htmlFor="express" className="flex-1 cursor-pointer">
              <div className="flex justify-between flex-wrap sm:flex-nowrap">
                <span className="text-sm md:text-base">Express Shipping</span>
                <span className="text-sm md:text-base">₹649.99</span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">
                Delivery in 1-2 business days
              </p>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </motion.div>
  );
}
