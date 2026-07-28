"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Errors = Partial<Record<"email" | "password", string>>;

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  function validate() {
    const nextErrors: Errors = {};
    if (!email.trim()) nextErrors.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "Enter a valid email address";
    if (!password) nextErrors.password = "Password is required";
    else if (password.length < 8)
      nextErrors.password = "Password must be at least 8 characters";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    sessionStorage.setItem("shipnow-session", JSON.stringify({ email, remember }));
    router.push("/dashboard");
  }

  return (
    <main className="login-page">
      <section className="login-visual" aria-labelledby="welcome-title">
        <Brand light />
        <div className="login-photo-wrap">
          <Image
            src="/images/login-logistics.png"
            alt="Delivery van loaded with parcels and a customer tracking a delivery"
            fill
            priority
            sizes="(max-width: 767px) 0px, 50vw"
          />
        </div>
        <div className="welcome-copy">
          <h1 id="welcome-title">Welcome to ShipNow</h1>
          <p>Manage your shipments, fleet, and warehouse in one smart dashboard.</p>
        </div>
      </section>

      <section className="login-form-panel">
        <form className="login-form" onSubmit={submit} noValidate>
          <div className="form-heading">
            <Brand compact />
            <h2>Welcome Back</h2>
            <p>Log in to continue managing your logistics with ShipNow</p>
          </div>

          <div className="field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((old) => ({ ...old, email: undefined }));
              }}
              placeholder="Enter a valid email address"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && <span id="email-error" className="error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((old) => ({ ...old, password: undefined }));
                }}
                placeholder="Create a strong password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon crossed={!showPassword} />
              </button>
            </div>
            {errors.password && (
              <span id="password-error" className="error">{errors.password}</span>
            )}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span aria-hidden="true">✓</span>
              Remember Me
            </label>
            <button type="button" className="text-button">Forgot Password?</button>
          </div>

          <button className="login-button" type="submit">Login</button>
          <p className="register-copy">
            Don&apos;t have an account? <button type="button">Register</button>
          </p>
        </form>
      </section>
    </main>
  );
}

function Brand({ light = false, compact = false }) {
  return (
    <div className={`brand ${light ? "brand--light" : ""} ${compact ? "brand--compact" : ""}`}>
      <span className="brand-mark" aria-hidden="true"><i /><i /></span>
      {!compact && <span>SHIPNOW</span>}
    </div>
  );
}

function EyeIcon({ crossed }: { crossed: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" />
      <circle cx="12" cy="12" r="2.4" />
      {crossed && <path d="m4 4 16 16" />}
    </svg>
  );
}
