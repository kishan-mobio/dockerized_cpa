"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Save } from "lucide-react";

// Helper to map simple rule objects to RHF rules
const mapRulesToRHF = (rule) => {
  if (!rule) return undefined;
  const rhf = {};
  if (rule.required) {
    rhf.required = typeof rule.required === "string" ? rule.required : "This field is required";
  }
  if (rule.minLength) {
    rhf.minLength = { value: rule.minLength, message: rule.message || `Minimum ${rule.minLength} characters` };
  }
  if (rule.maxLength) {
    rhf.maxLength = { value: rule.maxLength, message: rule.message || `Maximum ${rule.maxLength} characters` };
  }
  if (rule.pattern) {
    rhf.pattern = { value: rule.pattern, message: rule.message || "Invalid value" };
  }
  if (typeof rule.validate === "function") {
    rhf.validate = rule.validate;
  }
  return rhf;
};

/**
 * Reusable SettingsForm component for configuration sections
 *
 * Props:
 * - fields: Array<{ name, label, type, placeholder, options?, description?, disabled?, validation? }>
 * - onSubmit: (values) => void | Promise<void>
 * - initialValues: object (default values)
 * - submitLabel?: string (default: 'Save Settings')
 * - twoColumn?: boolean (default: true)
 */
export default function SettingsForm({
  fields = [],
  onSubmit,
  initialValues = {},
  submitLabel = "Save Settings",
  twoColumn = true,
}) {
  const form = useForm({
    defaultValues: initialValues,
    mode: "onChange",
  });

  const gridCols = twoColumn
    ? "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
    : "grid grid-cols-1 gap-y-4";

  const renderFieldControl = (fieldDef, fieldApi) => {
    const { type, placeholder, options = [], disabled } = fieldDef;

    switch (type) {
      case "select":
        return (
          <Select disabled={disabled} onValueChange={fieldApi.onChange} value={fieldApi.value ?? ""}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={String(opt.value)} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "textarea":
        return (
          <Textarea
            {...fieldApi}
            placeholder={placeholder}
            disabled={disabled}
            rows={3}
          />
        );
      case "checkbox":
        return (
          <div className="flex items-center gap-2 py-2">
            <Checkbox checked={!!fieldApi.value} onCheckedChange={(v) => fieldApi.onChange(!!v)} />
            {placeholder && <span className="text-sm text-gray-700">{placeholder}</span>}
          </div>
        );
      case "number":
      case "email":
      case "password":
      case "text":
      default:
        return (
          <Input
            type={type || "text"}
            placeholder={placeholder}
            disabled={disabled}
            {...fieldApi}
          />
        );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((vals) => onSubmit?.(vals))} className="space-y-6">
        {/* Fields grid */}
        <div className={gridCols}>
          {fields.map((f) => {
            const spanClass = twoColumn && f.colSpan === 2 ? "md:col-span-2" : "";
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
                        {renderFieldControl(f, field)}
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

        {/* Submit button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-[#6C63FF] border border-transparent rounded-md hover:bg-[#5A52F2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C63FF]"
          >
            <Save className="h-4 w-4 mr-2" />
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
