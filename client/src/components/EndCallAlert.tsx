"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PhoneOff } from "lucide-react";

export default function EndCallAlert({ onHangUp }: { onHangUp: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="outline" className="bg-gray-700 hover:bg-gray-600">
          <PhoneOff className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-800 text-gray-100">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This action will end the current call.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center gap-2 sm:justify-center">
          <AlertDialogCancel className="h-10 w-auto px-4 py-2 bg-gray-700 text-gray-100 hover:bg-gray-600 flex items-center justify-center mt-0">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onHangUp}
            className="h-10 w-auto px-4 py-2 bg-red-600 text-white hover:bg-red-700 flex items-center justify-center"
          >
            Yes, hang up
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
