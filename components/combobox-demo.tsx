"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CompanyType, ReviewFormValues } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon, PlusIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Control, Controller, FieldError } from "react-hook-form";
import toast from "react-hot-toast";
import ConfirmAddCompany from "./confirm-add-company";

async function AddCompany(newCompany: string) {
  // Add company to the database
  const toastId = toast.loading("Loading");
  const response = await fetch("/api/addCompany", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: newCompany }),
  });

  if (!response.ok) {
    toast.error("Failed to Add Company", {
      id: toastId,
    });
    throw new Error("Failed to add company");
  }
  const data = await response.json();
  console.log("Company added successfully with id: ", data.id);
  toast.success("Company added!", {
    id: toastId,
  });
  return data.id;
}

export function ComboboxDemoComponent({
  companies,
  control,
  errors,
}: {
  companies: CompanyType[];
  control: Control<ReviewFormValues>;
  errors: FieldError | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [companies_box, setCompanies_box] = useState(
    companies.map((company) => ({ value: company.id, label: company.name })),
  );
  const [pendingNewCompany, setPendingNewCompany] = useState<{
    name: string;
    onChange: (value: string) => void;
  } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSelect = async (
    currentValue: string,
    onChange: (value: string) => void,
  ) => {
    let newCompany = currentValue;
    if (currentValue.startsWith("new:")) {
      newCompany = currentValue.replace("new:", "");
      setPendingNewCompany({
        name: newCompany,
        onChange,
      });
      setConfirmOpen(true);
      // const newId = await AddCompany(newCompany);
      // const newOption = { value: newId, label: newCompany };

      // console.log("added new company wiht id ", newId);

      // // should add a modal to check are you sure you want to add this new company
      // //handle error tho later
      // setCompanies_box([...companies_box, newOption]);
      // setValue(newOption.value);
      // onChange(newOption.value);
    } else {
      setValue(currentValue === value ? "" : currentValue);
      onChange(currentValue === value ? "" : currentValue);
      setOpen(false);
      setInputValue(""); // Reset input value after selection
    }
  };

  const handleConfirmAddCompany = async () => {
    if (pendingNewCompany) {
      try {
        const newId = await AddCompany(pendingNewCompany.name);
        const newOption = { value: newId, label: pendingNewCompany.name };

        setCompanies_box([...companies_box, newOption]);
        setValue(newOption.value);
        pendingNewCompany.onChange(newOption.value);

        setConfirmOpen(false);
        setOpen(false);
        setInputValue("");
        setPendingNewCompany(null);
      } catch (error) {
        console.error("Error adding company:", error);
        setConfirmOpen(false);
      }
    }
  };

  const handleCancelAddCompany = () => {
    setConfirmOpen(false);
    setPendingNewCompany(null);
  };

  useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  return (
    <>
      <ConfirmAddCompany
        companyName={pendingNewCompany?.name}
        confirmOpen={confirmOpen}
        setConfirmOpen={setConfirmOpen}
        onConfirm={handleConfirmAddCompany}
        onCancel={handleCancelAddCompany}
      />
      <Controller
        name="companyId"
        control={control}
        render={({ field }) => (
          <Popover modal={true} open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "justify-between",
                  errors && "border-red-500 focus-visible:ring-red-500",
                )}
              >
                {value
                  ? companies_box.find((company) => company.value === value)
                      ?.label
                  : "Select Company..."}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width]  p-0">
              <Command>
                <CommandInput
                  placeholder="Search a Company..."
                  className="h-9"
                  value={inputValue}
                  onValueChange={setInputValue}
                />
                <CommandList>
                  <CommandGroup>
                    {companies_box.map((company) => (
                      <CommandItem
                        key={company.value}
                        value={company.label}
                        onSelect={() => {
                          handleSelect(company.value, field.onChange);
                        }}
                      >
                        {company.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === company.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      handleSelect(`new:${inputValue}`, field.onChange);
                    }}
                    disabled={
                      !(
                        !!inputValue &&
                        !companies_box.find(
                          (company) => company.label === inputValue,
                        )
                      )
                    }
                    className={`${
                      !!inputValue &&
                      !companies_box.find(
                        (company) => company.label === inputValue,
                      )
                        ? ""
                        : "hidden"
                    }`}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Create &quot;{inputValue}&quot;
                  </CommandItem>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      />
    </>
  );
}
