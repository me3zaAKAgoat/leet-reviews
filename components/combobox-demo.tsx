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
import { Control, Controller } from "react-hook-form";

async function AddCompany(newCompany: string) {
  // Add company to the database
  const response = await fetch("/api/addCompany", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: newCompany }),
  });

  if (!response.ok) {
    throw new Error("Failed to add company");
  }
  const data = await response.json();
  console.log("Company added successfully with id: ", data.id);
  return data.id;
}

export function ComboboxDemoComponent({
  companies,
  control,
}: {
  companies: CompanyType[];
  control: Control<ReviewFormValues>;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [companies_box, setCompanies_box] = React.useState(
    companies.map((company) => ({ value: company.id, label: company.name })),
  );
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

      // should add a modal to check are you sure you want to add this new company
      //handle error tho later
      setCompanies_box((prevFrameworks) => [...prevFrameworks, newOption]);
      setValue(newOption.value);
    } else {
      setValue(currentValue === value ? "" : currentValue);
    }
    setOpen(false);
    setInputValue(""); // Reset input value after selection
    onChange(newCompany);
  };

  React.useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

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
              className=" justify-between"
            >
              {value
                ? companies_box.find((framework) => framework.value === value)
                    ?.label
                : "Select framework..."}
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
                  {companies_box.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      // onSelect={async(value)=>
                      //   {
                      //     const newValue = await handleSelect(value);
                      //     field.onChange(newValue);
                      //   }}
                      onSelect={(value) => {
                        handleSelect(value, field.onChange);
                      }}
                    >
                      {framework.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          field.value === framework.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
                {inputValue &&
                  !companies_box.some(
                    (f) => f.label.toLowerCase() === inputValue.toLowerCase(),
                  ) && (
                    <CommandItem
                      // onSelect={async () => {
                      //   const newValue = await handleSelect(`new:${inputValue}`);
                      //   field.onChange(newValue);
                      // }}
                      onSelect={() => {
                        handleSelect(`new:${inputValue}`, field.onChange);
                      }}
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Create &quot;{inputValue}&quot;
                    </CommandItem>
                  )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    />
  );
}
