"use client"

import * as React from "react"
import { twJoin, twMerge } from "tailwind-merge"
import * as ReactAria from "react-aria-components"
import { Icon } from "@/components/Icon"
import {
  FormProvider,
  useForm,
  UseFormProps,
  DefaultValues,
  UseFormReturn,
  useController,
  ControllerRenderProps,
} from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import CountrySelect from "@modules/checkout/components/country-select"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormProps<T extends z.ZodType<any, any, any>> = UseFormProps<
  z.infer<T>
> & {
  schema: T
  onSubmit: (
    values: z.infer<T>,
    form: UseFormReturn<z.infer<T>>
  ) => void | Promise<void>
  defaultValues?: DefaultValues<z.infer<T>>
  children?:
    | React.ReactNode
    | ((form: UseFormReturn<z.infer<T>>) => React.ReactNode)

  formProps?: Omit<React.ComponentProps<"form">, "onSubmit">
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Form = <T extends z.ZodType<any, any, any>>({
  schema,
  onSubmit,
  children,
  formProps,
  ...props
}: FormProps<T>) => {
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    ...props,
  })

  const submitHandler = React.useCallback(
    (values: z.infer<T>) => {
      return onSubmit(values, form)
    },
    [onSubmit, form]
  )

  const onFormSubmit: React.FormEventHandler<HTMLFormElement> =
    React.useCallback(
      (event) => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit(submitHandler, (err) => console.error(err))(event)
      },
      [form, submitHandler]
    )

  return (
    <FormProvider {...form}>
      <form {...formProps} onSubmit={onFormSubmit}>
        <fieldset disabled={form.formState.isSubmitting}>
          {typeof children === "function" ? children(form) : children}
        </fieldset>
      </form>
    </FormProvider>
  )
}

export const getInputClassNames = ({
  uiSize = "lg",
  isVisuallyDisabled,
  isSuccess,
}: InputOwnProps): string => {
  const sizeClasses = {
    sm: "h-9 text-xs focus:pt-3.5 [&:not(:placeholder-shown)]:pt-3.5 [&:autofill]:pt-3.5",
    md: "h-12 focus:pt-3 [&:not(:placeholder-shown)]:pt-3 [&:autofill]:pt-3",
    lg: "h-14 focus:pt-4 [&:not(:placeholder-shown)]:pt-4 [&:autofill]:pt-4",
  }

  const visuallyDisabledClasses = isVisuallyDisabled
    ? "pointer-events-none bg-grayscale-50"
    : ""

  const successClasses = isSuccess ? "border-green-500 pr-7" : ""

  return twJoin(
    "peer block w-full rounded-xs transition-all outline-none px-4 placeholder:invisible border border-grayscale-200 hover:border-grayscale-500 focus:border-grayscale-500 bg-transparent disabled:pointer-events-none disabled:bg-grayscale-50 [&:autofill]:bg-clip-text aria-[invalid=true]:border-red-primary aria-[invalid=true]:focus:border-red-900 aria-[invalid=true]:hover:border-red-900",
    sizeClasses[uiSize],
    visuallyDisabledClasses,
    successClasses
  )
}

export const getPlaceholderClassNames = ({
  uiSize = "lg",
}: Pick<InputOwnProps, "uiSize">): string => {
  const sizeClasses = {
    lg: "peer-focus:top-2.5 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:autofill]:top-2.5 peer-focus:text-xs peer-[:not(:placeholder-shown)]:text-xs peer-[:autofill]:text-xs",
    md: "peer-focus:top-1 peer-[:not(:placeholder-shown)]:top-1 peer-[:autofill]:top-1 peer-focus:text-xs peer-[:not(:placeholder-shown)]:text-xs peer-[:autofill]:text-xs",
    sm: "peer-focus:top-1 peer-[:not(:placeholder-shown)]:top-1 peer-[:autofill]:top-1 text-xs peer-focus:text-2xs peer-[:not(:placeholder-shown)]:text-2xs peer-[:autofill]:text-2xs",
  }

  return twJoin(
    "absolute -translate-y-1/2 peer-placeholder-shown:top-1/2 left-4 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:autofill]:translate-y-0 peer-focus:translate-y-0 text-grayscale-400 pointer-events-none transition-all",
    sizeClasses[uiSize]
  )
}

/**
 * Label
 */
type InputLabelOwnProps = {
  isRequired?: boolean
}

export const InputLabel: React.FC<
  React.ComponentPropsWithRef<"label"> & InputLabelOwnProps
> = ({ isRequired, children, className, ...rest }) => (
  <ReactAria.Label
    {...rest}
    className={twMerge("mb-1 block font-semibold", className)}
  >
    {children}
    {isRequired && <span className="ml-0.5 text-orange-700">*</span>}
  </ReactAria.Label>
)

/**
 * SubLabel
 */
type InputSubLabelOwnProps = {
  type: "success" | "error"
}

export const InputSubLabel: React.FC<
  React.ComponentPropsWithRef<"p"> & InputSubLabelOwnProps
> = ({ type, children, className, ...rest }) => (
  <ReactAria.Text
    {...rest}
    className={twMerge(
      "mt-2 text-xs",
      type === "success" && "text-green-700",
      type === "error" && "text-red-primary",
      className
    )}
  >
    {children}
  </ReactAria.Text>
)

/**
 * Input
 */
export type InputOwnProps = {
  uiSize?: "sm" | "md" | "lg"
  isVisuallyDisabled?: boolean
  isSuccess?: boolean
  errorMessage?: string
  wrapperClassName?: string
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & InputOwnProps
>(
  (
    {
      uiSize = "lg",
      isVisuallyDisabled,
      isSuccess,
      errorMessage,
      wrapperClassName,
      placeholder,
      className,
      ...rest
    },
    ref
  ) => (
    <div className={twMerge("relative", wrapperClassName)}>
      <ReactAria.Input
        {...rest}
        ref={ref}
        className={twMerge(
          getInputClassNames({
            uiSize,
            isVisuallyDisabled,
            isSuccess,
          }),
          className
        )}
        placeholder={placeholder}
      />
      {placeholder && (
        <span className={getPlaceholderClassNames({ uiSize })}>
          {placeholder}
        </span>
      )}
      {isSuccess && (
        <Icon
          name="check"
          className="absolute right-0 top-1/2 mr-4 -translate-y-1/2 text-green-500 w-6 h-auto"
        />
      )}
      {errorMessage && (
        <InputSubLabel
          type="error"
          className="hidden aria-[invalid=true]:block"
        >
          {errorMessage}
        </InputSubLabel>
      )}
    </div>
  )
)

Input.displayName = "Input"

export interface InputFieldProps {
  className?: string
  name: string
  placeholder?: string
  type?: React.ComponentProps<typeof Input>["type"]
  inputProps?: Omit<
    React.ComponentProps<typeof Input>,
    "name" | "id" | "type" | keyof ControllerRenderProps
  >
}

export const InputField: React.FC<InputFieldProps> = ({
  className,
  name,
  type,
  inputProps,
  placeholder,
}) => {
  const { field, fieldState } = useController<{ __name__: string }, "__name__">(
    { name: name as "__name__" }
  )

  return (
    <div className={className}>
      <Input
        placeholder={placeholder}
        {...inputProps}
        {...field}
        value={field.value ?? ""}
        id={name}
        type={type}
        aria-invalid={Boolean(fieldState.error)}
      />
      {fieldState.error && (
        <div className="pt-2 text-red-900 text-small-regular">
          <span>{fieldState.error.message}</span>
        </div>
      )}
    </div>
  )
}

export interface CountrySelectFieldProps {
  className?: string
  name: string
  label?: string
  selectProps?: Omit<
    React.ComponentProps<typeof CountrySelect>,
    "name" | "id" | keyof ControllerRenderProps
  >
  isRequired?: boolean
  children?: React.ReactNode
}

export const CountrySelectField: React.FC<CountrySelectFieldProps> = ({
  className,
  name,
  selectProps,
  children,
}) => {
  const { field, fieldState } = useController<{ __name__: string }, "__name__">(
    { name: name as "__name__" }
  )

  return (
    <div className={className}>
      <CountrySelect
        {...selectProps}
        {...field}
        selectedKey={field.value ?? ""}
        name={name}
      >
        {children}
      </CountrySelect>
      {fieldState.error && (
        <div className="pt-2 text-red-900 text-small-regular">
          <span>{fieldState.error.message}</span>
        </div>
      )}
    </div>
  )
}
