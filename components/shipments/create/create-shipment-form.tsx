"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { CalendarDays, ChevronDown, MoveLeft } from "lucide-react";

type FormErrors = { deliveryAddress?: string; method?: string };

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
  date: "March 21, 2035",
  notes: "",
};

export function CreateShipmentForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function update(name: keyof typeof initialForm, value: string) {
    setForm((old) => ({ ...old, [name]: value }));
    if (name === "deliveryAddress" && value.trim()) setErrors((old) => ({ ...old, deliveryAddress: undefined }));
    if (name === "method" && value) setErrors((old) => ({ ...old, method: undefined }));
    setSubmitted(false);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const next: FormErrors = {};
    if (!form.deliveryAddress.trim()) next.deliveryAddress = "Address is required.";
    if (!form.method) next.method = "Shipping method is required.";
    setErrors(next);
    if (!Object.keys(next).length) setSubmitted(true);
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
              <Field label="Company" name="senderCompany" value={form.senderCompany} update={update} wide />
              <Field label="Email" name="senderEmail" value={form.senderEmail} update={update} />
              <PhoneField label="Phone Number" name="senderPhone" value={form.senderPhone} update={update} />
              <Field label="Pickup Address" name="pickupAddress" value={form.pickupAddress} update={update} wide />
            </FormSection>
            <FormSection title="Recipient Info">
              <Field label="Company" name="recipientCompany" value={form.recipientCompany} update={update} wide />
              <Field label="Email" name="recipientEmail" value={form.recipientEmail} update={update} />
              <PhoneField label="Phone Number" name="recipientPhone" value={form.recipientPhone} update={update} />
              <Field label="Delivery Address" name="deliveryAddress" value={form.deliveryAddress} update={update} placeholder="Street address, city, state/province, ZIP code" error={errors.deliveryAddress} wide />
            </FormSection>
          </section>

          <section className="detail-sections">
            <FormSection title="Package Details" className="package-section">
              <Field label="Item Description" name="description" value={form.description} update={update} wide />
              <Field label="Quantity" name="quantity" type="number" value={form.quantity} update={update} />
              <Field label="Value" name="value" value={form.value} update={update} />
              <div className="weight-field"><Field label="Weight" name="weight" value={form.weight} update={update} /><label><span>Units</span><select><option>Kg</option><option>Lb</option></select></label></div>
              <div className="dimensions"><span>Dimensions</span>{(["length","width","height"] as const).map((name) => <label key={name}><span>{name === "height" ? "ex. 20" : form[name]}</span><small>cm</small><input aria-label={name} value={form[name]} onChange={(e) => update(name, e.target.value)} /></label>)}</div>
              <div className="dimension-labels"><span>Length</span><span>Width</span><span>Height</span></div>
            </FormSection>

            <FormSection title="Shipping Details" className="shipping-section">
              <fieldset className="freight-types"><legend>Freight Type</legend>{["Road Freight","Rail Freight","Ocean Freight","Air Freight"].map((item, index) => <label key={item}><input type="radio" name="freight" defaultChecked={index === 0} />{item}</label>)}</fieldset>
              <div className="shipping-fields">
                <SelectField label="Carrier" value={form.carrier} onChange={(value) => update("carrier", value)} options={["FedEx","DHL","UPS","USPS"]} />
                <SelectField label="Shipping Method" value={form.method} onChange={(value) => update("method", value)} options={["","Standard","Express","Priority"]} placeholder="Select Method" error={errors.method} />
                <Field label="Shipment ID" name="shipmentId" value={form.shipmentId} update={update} disabled hint="Auto-generated" />
                <label className="form-field"><span>Shipment Date</span><div className="date-input"><input value={form.date} onChange={(e) => update("date", e.target.value)} /><CalendarDays /></div></label>
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
      <footer className="shipments-footer"><strong>Copyright © 2025 Peterdraw</strong><span>Privacy Policy　 Term and conditions　 Contact</span><span>◉　𝕏　◎　▻　in</span></footer>
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
  return <label className={`form-field ${wide ? "wide" : ""}`}><span>{label}</span><input type={type} value={value} disabled={disabled} placeholder={placeholder} aria-invalid={Boolean(error)} onChange={(e) => update(name, e.target.value)} />{error && <small className="field-error">{error}</small>}{hint && <small>{hint}</small>}</label>;
}

function PhoneField(props: Omit<Parameters<typeof Field>[0], "wide">) {
  return <label className="form-field"><span>{props.label}</span><div className="phone-input"><UsFlag /><span>+1⌄</span><input value={props.value} onChange={(e) => props.update(props.name, e.target.value)} /></div></label>;
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
  return <label className="form-field"><span>{label}</span><div className="select-wrap"><select value={value} aria-invalid={Boolean(error)} onChange={(e) => onChange(e.target.value)}>{options.map((option) => <option value={option} key={option}>{option || placeholder}</option>)}</select><ChevronDown /></div>{error && <small className="field-error">{error}</small>}</label>;
}
