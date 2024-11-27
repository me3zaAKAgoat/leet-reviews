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
} from "@/components/ui/alert-dialog";
import { Dispatch, SetStateAction } from "react";

export default function ConfirmAddCompany({
  companyName,
  confirmOpen,
  setConfirmOpen,
  onConfirm,
  onCancel,
}: {
  companyName: string | undefined;
  confirmOpen: boolean;
  setConfirmOpen: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently add{" "}
            <span className=" underline font-bold whitespace-nowrap">
              {companyName}
            </span>{" "}
            to the companies list? This action is irreversible and will update
            your records immediately
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
