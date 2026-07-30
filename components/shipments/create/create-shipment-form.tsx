"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { CalendarDays, ChevronDown, ChevronUp, MoveLeft } from "lucide-react";

const initialForm = {
  senderCompany: "GreenHaven",
  senderEmail: "logistics@greenhaven.com",
  senderPhone: "408-555-7210",
  pickupAddress: "1120 Birch Street, Portland, OR 97205, USA",
  recipientCompany: "FreshNest",
  recipientEmail: "warehouse@freshnest.com",
  recipientPhone: "786-555-4432",
  deliveryAddress: "",
  description: "Premium Garden Tool Set",
  quantity: "40",
  value: "$3,200",
  weight: "125",
  length: "80",
  width: "60",
  height: "",
  carrier: "FedEx",
  method: "",
  shipmentId: "#SH9583742",
  date: "2035-03-21",
  notes: "",
};
type FormErrors = Partial<Record<keyof typeof initialForm, string>>;

export function CreateShipmentForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function update(name: keyof typeof initialForm, value: string) {
    setForm((old) => ({ ...old, [name]: value }));
    if (value.trim()) setErrors((old) => ({ ...old, [name]: undefined }));
    setSubmitted(false);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const next: FormErrors = {};
    const required: Array<keyof typeof initialForm> = [
      "senderCompany", "senderEmail", "senderPhone", "pickupAddress", "recipientCompany",
      "recipientEmail", "recipientPhone", "deliveryAddress", "description", "quantity",
      "value", "weight", "carrier", "method", "date",
    ];
    required.forEach((name) => {
      if (!form[name].trim()) next[name] = name === "deliveryAddress" ? "Address is required." : `${fieldName(name)} is required.`;
    });
    if (form.senderEmail && !isEmail(form.senderEmail)) next.senderEmail = "Enter a valid email address.";
    if (form.recipientEmail && !isEmail(form.recipientEmail)) next.recipientEmail = "Enter a valid email address.";
    if (form.senderPhone && !isPhone(form.senderPhone)) next.senderPhone = "Enter a valid phone number.";
    if (form.recipientPhone && !isPhone(form.recipientPhone)) next.recipientPhone = "Enter a valid phone number.";
    if (form.quantity && Number(form.quantity) <= 0) next.quantity = "Quantity must be greater than zero.";
    if (form.weight && Number(form.weight) <= 0) next.weight = "Weight must be greater than zero.";
    if (!form.method) next.method = "Shipping method is required.";
    setErrors(next);
    if (!Object.keys(next).length) setSubmitted(true);
    else requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
  }

  return (
    <>
      <main className="create-shipment-page">
        <header className="create-heading">
          <div><Link href="/shipments" aria-label="Back to shipments"><MoveLeft /></Link><h1>Create New Shipment</h1></div>
          <p><b>Dashboard</b> / <b>Shipments</b> / Create New Shipment</p>
        </header>

        <form className="create-form" onSubmit={submit} noValidate>
          <h2>Shipment Form</h2>
          <section className="contact-sections">
            <FormSection title="Sender Info">
              <Field label="Company" name="senderCompany" value={form.senderCompany} update={update} error={errors.senderCompany} wide />
              <Field label="Email" name="senderEmail" type="email" value={form.senderEmail} update={update} error={errors.senderEmail} />
              <PhoneField label="Phone Number" name="senderPhone" value={form.senderPhone} update={update} error={errors.senderPhone} />
              <Field label="Pickup Address" name="pickupAddress" value={form.pickupAddress} update={update} error={errors.pickupAddress} wide />
            </FormSection>
            <FormSection title="Recipient Info">
              <Field label="Company" name="recipientCompany" value={form.recipientCompany} update={update} error={errors.recipientCompany} wide />
              <Field label="Email" name="recipientEmail" type="email" value={form.recipientEmail} update={update} error={errors.recipientEmail} />
              <PhoneField label="Phone Number" name="recipientPhone" value={form.recipientPhone} update={update} error={errors.recipientPhone} />
              <Field label="Delivery Address" name="deliveryAddress" value={form.deliveryAddress} update={update} placeholder="Street address, city, state/province, ZIP code" error={errors.deliveryAddress} wide />
            </FormSection>
          </section>

          <section className="detail-sections">
            <FormSection title="Package Details" className="package-section">
              <Field label="Item Description" name="description" value={form.description} update={update} error={errors.description} wide />
              <QuantityField value={form.quantity} error={errors.quantity} onChange={(value) => update("quantity", value)} />
              <Field label="Value" name="value" value={form.value} update={update} error={errors.value} />
              <div className="weight-field"><Field label="Weight" name="weight" type="number" value={form.weight} update={update} error={errors.weight} /><label><span>Units</span><div className="unit-select"><select aria-label="Weight unit"><option>Kg</option><option>Lb</option></select><ChevronDown /></div></label></div>
              <div className="dimensions"><span>Dimensions</span>{(["length","width","height"] as const).map((name) => <label key={name}><input aria-label={`${name} in centimeters`} inputMode="decimal" placeholder={name === "height" ? "ex. 20" : undefined} value={form[name]} onChange={(e) => update(name, e.target.value)} /><small>cm</small></label>)}</div>
              <div className="dimension-labels"><span>Length</span><span>Width</span><span>Height</span></div>
            </FormSection>

            <FormSection title="Shipping Details" className="shipping-section">
              <fieldset className="freight-types"><legend>Freight Type</legend>{["Road Freight","Rail Freight","Ocean Freight","Air Freight"].map((item, index) => <label key={item}><input type="radio" name="freight" defaultChecked={index === 0} />{item}</label>)}</fieldset>
              <div className="shipping-fields">
                <SelectField label="Carrier" value={form.carrier} onChange={(value) => update("carrier", value)} options={["FedEx","DHL","UPS","USPS"]} error={errors.carrier} />
                <SelectField label="Shipping Method" value={form.method} onChange={(value) => update("method", value)} options={["","Standard","Express","Priority"]} placeholder="Select Method" error={errors.method} />
                <Field label="Shipment ID" name="shipmentId" value={form.shipmentId} update={update} disabled hint="Auto-generated" />
                <DateField value={form.date} error={errors.date} onChange={(value) => update("date", value)} />
              </div>
              <Field label="Notes" name="notes" value={form.notes} update={update} placeholder="Add special delivery notes (optional)" wide />
              <div className="services-row">
                <fieldset><legend>Additional Services</legend><label><input type="checkbox" defaultChecked />Insurance Coverage</label><label><input type="checkbox" defaultChecked />Temperature Control</label><label><input type="checkbox" defaultChecked />Signature on Delivery</label><label><input type="checkbox" />Fragile Item Handling</label></fieldset>
                <fieldset><legend>Tracking &amp; Status Updates</legend><label className="switch"><input type="checkbox" defaultChecked /><i />Notify Recipient via Email/SMS</label></fieldset>
              </div>
            </FormSection>
          </section>

          {submitted && <p className="form-success" role="status">Shipment is ready to be created.</p>}
          <footer className="form-actions"><button type="button" onClick={() => { setForm(initialForm); setErrors({}); setSubmitted(false); }}>Delete Form</button><button type="submit">Submit Shipment</button></footer>
        </form>
      </main>
    </>
  );
}

function FormSection({ title, className = "", children }: { title: string; className?: string; children: React.ReactNode }) {
  return <section className={`form-section ${className}`}><h3>{title}</h3><div className="form-section-grid">{children}</div></section>;
}

function Field({ label, name, value, update, wide, placeholder, error, type = "text", disabled, hint }: {
  label: string; name: keyof typeof initialForm; value: string; update: (name: keyof typeof initialForm, value: string) => void;
  wide?: boolean; placeholder?: string; error?: string; type?: string; disabled?: boolean; hint?: string;
}) {
  const errorId = `${name}-error`;
  return <label className={`form-field ${wide ? "wide" : ""}`}><span>{label}</span><input id={name} name={name} type={type} value={value} disabled={disabled} placeholder={placeholder} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} onChange={(e) => update(name, e.target.value)} />{error && <small id={errorId} className="field-error">{error}</small>}{hint && <small>{hint}</small>}</label>;
}

function PhoneField(props: Omit<Parameters<typeof Field>[0], "wide">) {
  const errorId = `${props.name}-error`;
  return <label className="form-field"><span>{props.label}</span><div className="phone-input"><UsFlag /><span className="phone-country"><select aria-label="Country calling code" defaultValue="+1"><option>+1</option></select><ChevronDown /></span><i className="phone-divider" /><input name={props.name} type="tel" aria-invalid={Boolean(props.error)} aria-describedby={props.error ? errorId : undefined} value={props.value} onChange={(e) => props.update(props.name, e.target.value)} /></div>{props.error && <small id={errorId} className="field-error">{props.error}</small>}</label>;
}

function UsFlag() {
  return <svg className="us-flag" viewBox="0 0 28 18" aria-hidden="true">
    <rect width="28" height="18" rx="1.5" fill="#fff" />
    {[0, 4, 8, 12, 16].map((y) => <rect key={y} y={y} width="28" height="2" fill="#e44b4b" />)}
    <rect width="12" height="10" rx="1" fill="#4169a9" />
    <path d="M2 2h1v1H2zm3 0h1v1H5zm3 0h1v1H8zM2 5h1v1H2zm3 0h1v1H5zm3 0h1v1H8zM2 8h1v1H2zm3 0h1v1H5zm3 0h1v1H8z" fill="#fff" />
  </svg>;
}

function SelectField({ label, value, onChange, options, placeholder, error }: { label: string; value: string; onChange: (value: string) => void; options: string[]; placeholder?: string; error?: string }) {
  return <label className="form-field"><span>{label}</span><div className="select-wrap"><select aria-label={label} value={value} aria-invalid={Boolean(error)} onChange={(e) => onChange(e.target.value)}>{options.map((option) => <option value={option} key={option}>{option || placeholder}</option>)}</select><ChevronDown /></div>{error && <small className="field-error">{error}</small>}</label>;
}

function QuantityField({ value, error, onChange }: { value: string; error?: string; onChange: (value: string) => void }) {
  const number = Number(value) || 0;
  return <label className="form-field"><span>Quantity</span><div className="quantity-input"><input aria-label="Quantity" inputMode="numeric" value={value} aria-invalid={Boolean(error)} onChange={(event) => onChange(event.target.value.replace(/\D/g, ""))} /><span><button type="button" aria-label="Increase quantity" onClick={() => onChange(String(number + 1))}><ChevronUp /></button><button type="button" aria-label="Decrease quantity" onClick={() => onChange(String(Math.max(1, number - 1)))}><ChevronDown /></button></span></div>{error && <small className="field-error">{error}</small>}</label>;
}

function DateField({ value, error, onChange }: { value: string; error?: string; onChange: (value: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  function openCalendar() {
    const input = inputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") input.showPicker();
    else { input.focus(); input.click(); }
  }
  return <div className="form-field"><span id="shipment-date-label">Shipment Date</span><div className="date-input calendar-input"><button className="calendar-trigger" type="button" onClick={openCalendar} aria-labelledby="shipment-date-label"><span>{formatDate(value)}</span><CalendarDays aria-hidden="true" /></button><input ref={inputRef} className="calendar-native-input" name="date" type="date" tabIndex={-1} aria-labelledby="shipment-date-label" aria-invalid={Boolean(error)} value={value} onChange={(event) => onChange(event.target.value)} /></div>{error && <small className="field-error">{error}</small>}</div>;
}

function formatDate(value: string) {
  if (!value) return "Select date";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(year, month - 1, day));
}

function isEmail(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function isPhone(value: string) { return /^\d{3}-\d{3}-\d{4}$/.test(value); }
function fieldName(name: keyof typeof initialForm) {
  return name.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}
