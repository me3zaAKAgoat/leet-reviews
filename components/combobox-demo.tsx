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
import * as React from "react";
import { Control, Controller, FieldError } from "react-hook-form";
import toast from "react-hot-toast";

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
  control,
  errors,
}: {
  control: Control<ReviewFormValues>;
  errors: FieldError | undefined;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [companies, setCompanies] = React.useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [inputValue, setInputValue] = React.useState("");

  const handleSelect = async (
    currentValue: string,
    onChange: (value: string) => void,
  ) => {
    let newCompany = currentValue;
    if (currentValue.startsWith("new:")) {
      newCompany = currentValue.replace("new:", "");
      const newId = await AddCompany(newCompany);
      const newOption = { value: newId, label: newCompany };

      console.log("added new company wiht id ", newId);

      // should add a modal to check are you sure you want to add this new company
      //handle error tho later
      setCompanies([...companies, newOption]);
      setValue(newOption.value);
      onChange(newOption.value);
    } else {
      setValue(currentValue === value ? "" : currentValue);
      onChange(currentValue === value ? "" : currentValue);
    }
    setOpen(false);
    setInputValue(""); // Reset input value after selection
    // onChange(newCompany);
  };

  React.useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  React.useEffect(() => {
    fetch("/api/getCompanies")
      .then((res) => res.json())
      .then((data) =>
        setCompanies(
          data.map((company: CompanyType) => ({
            value: company.id,
            label: company.name,
          })),
        ),
      );
  }, []);

  React.useEffect(() => {
    console.log(
      inputValue,
      !companies.find((company) => company.label === inputValue),
    );
  }, [inputValue]);

  return (
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
                ? companies.find((company) => company.value === value)?.label
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
                  {companies.map((company) => (
                    <CommandItem
                      key={company.value}
                      value={company.value}
                      onSelect={(value) => {
                        handleSelect(value, field.onChange);
                      }}
                    >
                      {company.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === company.value ? "opacity-100" : "opacity-0",
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
                      !companies.find((company) => company.label === inputValue)
                    )
                  }
                  className={`${
                    !!inputValue &&
                    !companies.find((company) => company.label === inputValue)
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
  );
}
