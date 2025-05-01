
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Asset, Trade } from '@/types/simulator';
import { CalendarIcon, Send } from 'lucide-react'; // Import Send icon

// Zod schema for form validation
const formSchema = z.object({
  assetId: z.string().min(1, "Asset selection is required."),
  tradeType: z.enum(['Call Option', 'Put Option']),
  strikePrice: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)), // Convert empty string to undefined, then to number
    z.number({ required_error: "Strike price is required." }).positive("Strike price must be positive.")
  ),
  expiry: z.string().min(1, "Expiry date is required."),
  quantity: z.preprocess(
    (val) => Number(val),
    z.number({ required_error: "Quantity is required." }).int().positive("Quantity must be a positive integer.")
  ),
});

type TradeFormValues = z.infer<typeof formSchema>;

interface TradeFormProps {
  assets: Asset[];
  onSubmit: (tradeDetails: Omit<Trade, 'id' | 'entryTime' | 'pnl' | 'userId' | 'currentPremium' | 'entryPremium'>) => void;
  isLoading: boolean;
}

export default function TradeForm({ assets, onSubmit, isLoading }: TradeFormProps) {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');

  const form = useForm<TradeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assetId: '',
      tradeType: 'Call Option',
      strikePrice: undefined, // Initialize as undefined
      expiry: '',
      quantity: 1,
    },
  });

   const selectedAsset = useMemo(() => assets.find(a => a.id === selectedAssetId), [assets, selectedAssetId]);


   // Update selectedAssetId when form value changes
   useEffect(() => {
     const subscription = form.watch((value, { name }) => {
       if (name === 'assetId') {
         setSelectedAssetId(value.assetId ?? '');
         // Reset strike and expiry when asset changes
         form.resetField('strikePrice');
         form.resetField('expiry');
       }
     });
     return () => subscription.unsubscribe();
   }, [form]);

  const handleFormSubmit = (values: TradeFormValues) => {
     const tradeDetails = {
        assetId: values.assetId,
        tradeType: values.tradeType,
        strikePrice: values.strikePrice,
        expiry: values.expiry,
        quantity: values.quantity,
     };
     onSubmit(tradeDetails);
     // Optionally reset form after submission, or wait for parent component
     // form.reset();
     // setSelectedAssetId('');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="grid grid-cols-2 md:grid-cols-3 gap-4 items-end">

        {/* Asset Selection */}
        <FormField
          control={form.control}
          name="assetId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Asset" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Trade Type Selection */}
        <FormField
          control={form.control}
          name="tradeType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trade Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Call Option">Call Option</SelectItem>
                  <SelectItem value="Put Option">Put Option</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Strike Price Selection */}
        <FormField
          control={form.control}
          name="strikePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Strike Price</FormLabel>
              <Select
                 onValueChange={(value) => field.onChange(Number(value))} // Ensure value is number
                 // Handle undefined/null value for the Select component
                 value={field.value !== undefined ? String(field.value) : ""}
                 disabled={!selectedAsset}
               >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Strike" />
                  </SelectTrigger>
                </FormControl>
                 <SelectContent>
                  {selectedAsset?.strikePrices.map((price) => (
                    <SelectItem key={price} value={String(price)}>
                      {price.toLocaleString('en-IN')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Expiry Date Selection */}
        <FormField
          control={form.control}
          name="expiry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!selectedAsset}>
                <FormControl>
                   <SelectTrigger>
                      <SelectValue placeholder="Select Expiry" />
                    </SelectTrigger>
                </FormControl>
                 <SelectContent>
                  {selectedAsset?.expiries.map((date) => (
                    <SelectItem key={date} value={date}>
                      {new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Quantity Input */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 10" {...field} min="1" step="1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? (
               <>
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Placing...
               </>
            ) : (
              <>
                Place Trade <Send className="ml-2 h-4 w-4" />
              </>
            )}
        </Button>
      </form>
    </Form>
  );
}
```