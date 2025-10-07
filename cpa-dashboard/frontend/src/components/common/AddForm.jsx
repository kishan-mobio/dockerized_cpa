"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import FormHeader from "./FormHeader";

// Optional helper to map simple rule objects to RHF rules
// rule example: { required: 'Name is required', minLength: 2, pattern: /.../, message: '...' }
const mapRulesToRHF = (rule) => {
  if (!rule) return undefined;
  const rhf = {};
  if (rule.required) {
    rhf.required =
      typeof rule.required === "string"
        ? rule.required
        : "This field is required";
  }
  if (rule.minLength) {
    rhf.minLength = {
      value: rule.minLength,
      message: rule.message || `Minimum ${rule.minLength} characters`,
    };
  }
  if (rule.maxLength) {
    rhf.maxLength = {
      value: rule.maxLength,
      message: rule.message || `Maximum ${rule.maxLength} characters`,
    };
  }
  if (rule.pattern) {
    rhf.pattern = {
      value: rule.pattern,
      message: rule.message || "Invalid value",
    };
  }
  if (typeof rule.validate === "function") {
    rhf.validate = rule.validate;
  }
  return rhf;
};

export default function AddForm({
  heading,
  subTitle,
  onBack,
  backLabel,
  title,
  fields = [],
  onSubmit,
  initialValues = {},
  onCancel,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  twoColumn = true,
  validationSchema,
  mode = "create", // "create", "edit", "view"
  onEdit, // Function to call when Edit button is clicked in view mode
}) {
  const router = useRouter();
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";

  const form = useForm({
    defaultValues: initialValues,
    resolver: validationSchema ? zodResolver(validationSchema) : undefined,
    mode: "onChange",
  });

  const handleCancel = () => {
    if (onCancel) return onCancel();
    router.back();
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const gridCols = twoColumn
    ? "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
    : "grid grid-cols-1 gap-y-4";

  const renderFieldControl = (fieldDef, fieldApi) => {
    const { type, placeholder, options = [], disabled, editable } = fieldDef;
    // If editable is explicitly false, always disable the field
    const isFieldDisabled = disabled || editable === false || isViewMode;

    switch (type) {
      case "select": {
        // Filter out empty value options
        const filteredOptions = options.filter(
          (opt) => String(opt.value) !== ""
        );
        // If no value is selected, set the first option as default
        React.useEffect(() => {
          if (
            (fieldApi.value === undefined || fieldApi.value === "") &&
            filteredOptions.length > 0
          ) {
            fieldApi.onChange(filteredOptions[0].value);
          }
        }, [fieldApi, filteredOptions]);

        const selectedOption = filteredOptions.find(
          (opt) => String(opt.value) === String(fieldApi.value)
        );
        return (
          <DropdownMenu
            options={filteredOptions}
            selected={
              selectedOption
                ? selectedOption.value
                : filteredOptions[0]?.value || ""
            }
            label={
              selectedOption
                ? selectedOption.label
                : filteredOptions[0]?.label || placeholder || "Select..."
            }
            onSelect={(val) => fieldApi.onChange(val)}
            disabled={isFieldDisabled}
            buttonClassName="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 flex justify-between items-center"
            menuClassName="w-full"
          />
        );
      }
      case "textarea":
        return (
          <Textarea
            {...fieldApi}
            placeholder={placeholder}
            disabled={isFieldDisabled}
            rows={4}
          />
        );
      case "checkbox":
        return (
          <div className="flex items-center gap-2 py-2">
            <Checkbox
              checked={!!fieldApi.value}
              onCheckedChange={(v) => fieldApi.onChange(!!v)}
              disabled={isFieldDisabled}
            />
            {placeholder && (
              <Label className="text-sm text-muted-foreground">
                {placeholder}
              </Label>
            )}
          </div>
        );
      case "number":
      case "email":
      case "password":
      case "date":
      case "text":
      default:
        return (
          <Input
            type={type || "text"}
            placeholder={placeholder}
            disabled={isFieldDisabled}
            {...fieldApi}
          />
        );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <FormHeader
        title={heading}
        subtitle={subTitle}
        onBack={onBack}
        backLabel={backLabel}
      />

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {title && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
        )}
        <div className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((vals) => onSubmit?.(vals, form))}
              className="space-y-6"
            >
              {/* Fields grid */}
              <div className={gridCols}>
                {fields.map((f) => {
                  const spanClass =
                    twoColumn && f.colSpan === 2 ? "md:col-span-2" : "";
                  const rules = mapRulesToRHF(f.validation);
                  return (
                    <div key={f.name} className={spanClass}>
                      <FormField
                        control={form.control}
                        name={f.name}
                        rules={rules}
                        render={({ field }) => (
                          <FormItem>
                            {f.label && <FormLabel>{f.label}</FormLabel>}
                            <FormControl>
                              {typeof f.render === "function"
                                ? f.render(field, form)
                                : renderFieldControl(f, field)}
                            </FormControl>
                            {f.description && (
                              <p className="text-xs text-gray-500">
                                {f.description}
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C63FF]"
                >
                  {isViewMode ? "Back" : cancelLabel}
                </Button>
                {isViewMode ? (
                  <Button
                    type="button"
                    onClick={handleEdit}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#6C63FF] border border-transparent rounded-md hover:bg-[#5A52F2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C63FF]"
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-[#6C63FF] border border-transparent rounded-md hover:bg-[#5A52F2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C63FF]"
                  >
                    {submitLabel}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
