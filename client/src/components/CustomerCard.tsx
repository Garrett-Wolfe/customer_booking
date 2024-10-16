"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { Mic, MicOff, Plus, MapPin, Mail, X } from "lucide-react";
import EndCallAlert from "./EndCallAlert";
import { Customer } from "../types/customer";
import { getCustomerAddressString } from "../utils/customerOperations";
import { createCustomer } from "../services/housecallProService";

export interface CustomerCardProps {
  customer: Customer;
  onCustomerUpdate: (updatedCustomer: Customer) => void;
}

export default function CustomerCard({ customer, onCustomerUpdate }: CustomerCardProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(customer.isNew);
  const [error, setError] = useState<string | null>(null);
  const [lockNewCustomer, setlockNewCustomer] = useState(false);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleHangUp = () => {
    console.log("Call ended");
  };

  const handleCreateCustomer = async () => {
    try {
      const updatedCustomer = await createCustomer(customer);
      setIsNewCustomer(false);
      setlockNewCustomer(false);
      setError(null);
      onCustomerUpdate(updatedCustomer);
    } catch (error) {
      console.error("Failed to create customer:", error);
      setError("Failed to create customer.");
      setlockNewCustomer(true);
    }
  };

  const handleDismissError = () => {
    setError(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-800 text-gray-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Customer Info</CardTitle>
        <div className="flex space-x-2">
          <EndCallAlert onHangUp={handleHangUp}></EndCallAlert>

          <Button
            size="icon"
            variant="outline"
            className={`${isMuted ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"}`}
            onClick={handleMuteToggle}
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4 flex justify-between items-start">
            <div>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleDismissError}>
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        )}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt={customer.name} />
              <AvatarFallback>
                {customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {customer.isTalking && (
              <span className="absolute inset-0 z-10 flex animate-pulse rounded-full ring-2 ring-sky-500" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">{customer.name}</h3>
            <p className="text-sm text-gray-400">{customer.phone}</p>
            {isNewCustomer ? (
              <Badge
                onClick={lockNewCustomer ? undefined : handleCreateCustomer}
                variant="outline"
                className={`flex items-center space-x-1 ${
                  lockNewCustomer ? "bg-gray-500 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-600 cursor-pointer"
                } transition-colors duration-200`}
              >
                <span className="text-white">New Customer</span>
                <Plus className="h-3 w-3 text-white" />
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-700">
                Existing Customer
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-sm flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{getCustomerAddressString(customer)}</span>
          </p>
          <p className="text-sm flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            <span>{customer.email}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
