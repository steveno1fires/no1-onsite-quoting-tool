import { CustomerDetails } from "@/types/quote";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  data: CustomerDetails;
  onChange: (data: CustomerDetails) => void;
}

export function StepCustomer({ data, onChange }: Props) {
  const update = (field: keyof CustomerDetails, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="space-y-4 animate-slide-in">

      {/* Customer Details Section */}
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Customer Details</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName" className="text-xs font-medium">
              First Name *
            </Label>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              placeholder="John"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-xs font-medium">
              Last Name *
            </Label>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              placeholder="Smith"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="email" className="text-xs font-medium">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="john@example.com"
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-xs font-medium">
            Phone *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="07700 900000"
          />
        </div>
        <div>
          <Label htmlFor="address" className="text-xs font-medium">
            Address *
          </Label>
          <Input
            id="address"
            value={data.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="123 High Street, London"
          />
        </div>
      </div>
    </div>
  );
}
