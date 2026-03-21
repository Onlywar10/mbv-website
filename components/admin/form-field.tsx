import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormFieldProps {
	name: string;
	label: string;
	type?: string;
	defaultValue?: string | number;
	placeholder?: string;
	required?: boolean;
	textarea?: boolean;
}

export function FormField({
	name,
	label,
	type = "text",
	defaultValue,
	placeholder,
	required,
	textarea,
}: FormFieldProps) {
	const id = `field-${name}`;
	return (
		<div className="space-y-2">
			<Label htmlFor={id} className="font-heading text-xs uppercase tracking-wider">
				{label}
				{required && <span className="text-rust ml-1">*</span>}
			</Label>
			{textarea ? (
				<Textarea
					id={id}
					name={name}
					defaultValue={defaultValue}
					placeholder={placeholder}
					required={required}
					rows={4}
				/>
			) : (
				<Input
					id={id}
					name={name}
					type={type}
					defaultValue={defaultValue}
					placeholder={placeholder}
					required={required}
				/>
			)}
		</div>
	);
}
