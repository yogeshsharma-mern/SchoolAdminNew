import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { apiPost, apiGet } from "../../api/apiFetch";
import apiPath from "../../api/apiPath";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import { Controller, useWatch } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import { useNavigate } from "react-router-dom";

/* ─── Google Font Injection ─────────────────────────────────────────────────── */
const FONT_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300&display=swap');

  * { font-family: 'Plus Jakarta Sans', sans-serif; }

  .font-display { font-family: 'Fraunces', serif !important; }

  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes popIn {
    from { opacity: 0; transform: translateY(20px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .animate-slide-in  { animation: slideInUp 0.3s cubic-bezier(0.4,0,0.2,1) both; }
  .animate-fade-in   { animation: fadeIn 0.25s ease both; }
  .animate-pop-in    { animation: popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }

  /* Phone input overrides for light theme */
  .light-phone .react-tel-input .form-control {
    width: 100% !important;
    height: 46px !important;
    border: 1.5px solid #e2e8f0 !important;
    border-radius: 10px !important;
    font-size: 14px !important;
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    color: #1e293b !important;
    background: #f8fafc !important;
    padding-left: 60px !important;
    box-shadow: none !important;
    transition: border-color 0.2s, box-shadow 0.2s !important;
  }
  .light-phone .react-tel-input .form-control:focus {
    border-color: #6366f1 !important;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important;
    background: #fff !important;
  }
  .light-phone .react-tel-input .flag-dropdown {
    border: 1.5px solid #e2e8f0 !important;
    border-right: none !important;
    border-radius: 10px 0 0 10px !important;
    background: #f1f5f9 !important;
  }
  .light-phone .react-tel-input .selected-flag { border-radius: 10px 0 0 10px !important; }
  .light-phone .react-tel-input .country-list {
    border-radius: 12px !important;
    box-shadow: 0 10px 40px rgba(0,0,0,0.12) !important;
    border: 1px solid #e2e8f0 !important;
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-size: 13px !important;
  }
  .light-phone .react-tel-input .country-list .country:hover { background: #f1f5f9 !important; }
  .light-phone .react-tel-input .country-list .country.highlight { background: #eef2ff !important; }

  /* Strength bar transition */
  .strength-fill { transition: width 0.4s ease, background-color 0.4s ease; }

  /* Custom scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #f1f5f9; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
`;

/* ─── Steps Config ────────────────────────────────────────────────────────── */
const STEPS = [
  { id: "personal", label: "Personal", short: "01", icon: "👤" },
  { id: "professional", label: "Professional", short: "02", icon: "💼" },
  { id: "address", label: "Address", short: "03", icon: "📍" },
  { id: "salary", label: "Salary", short: "04", icon: "💰" },
  { id: "documents", label: "Documents", short: "05", icon: "📄" },
  { id: "review", label: "Review", short: "06", icon: "✓" },
];

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function passwordStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "", bg: "", width: "0%" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label: "", color: "bg-slate-200", bg: "text-slate-400", width: "0%" },
    { label: "Weak", color: "bg-rose-400", bg: "text-rose-500", width: "25%" },
    { label: "Fair", color: "bg-amber-400", bg: "text-amber-600", width: "50%" },
    { label: "Good", color: "bg-blue-400", bg: "text-blue-600", width: "75%" },
    { label: "Strong", color: "bg-emerald-400", bg: "text-emerald-600", width: "100%" },
  ];
  return { score: s, ...map[s] };
}

/* ─── Reusable Field Components ────────────────────────────────────────────── */
function FieldLabel({ children, required }) {
  return (
    <label className="block text-xs font-700 uppercase tracking-widest text-slate-500 mb-1.5">
      {children}
      {required && <span className="text-indigo-500 ml-1">*</span>}
    </label>
  );
}

function InputField({ error, className = "", ...props }) {
  return (
    <input
      className={`w-full h-[46px] px-4 text-sm text-slate-800 bg-slate-50 border-[1.5px] rounded-[10px] outline-none transition-all duration-200
        placeholder:text-slate-400
        focus:bg-white focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100
        ${error ? "border-rose-400 bg-rose-50 focus:ring-rose-100 focus:border-rose-400" : "border-slate-200 hover:border-slate-300"}
        ${className}`}
      {...props}
    />
  );
}

function SelectField({ error, children, className = "", ...props }) {
  return (
    <select
      className={`w-full h-[46px] px-4 text-sm text-slate-800 bg-slate-50 border-[1.5px] rounded-[10px] outline-none transition-all duration-200 appearance-none cursor-pointer
        focus:bg-white focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100
        ${error ? "border-rose-400 bg-rose-50" : "border-slate-200 hover:border-slate-300"}
        ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 text-xs font-500 text-rose-500 flex items-center gap-1">
      <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 12 12" fill="currentColor">
        <circle cx="6" cy="6" r="6" opacity=".15" />
        <path d="M6 3.5v3M6 8v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      {msg}
    </p>
  );
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div className="mb-7 pb-5 border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg flex-shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="font-display text-xl font-600 text-slate-800 leading-tight">{title}</h2>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

/* ─── Toast ───────────────────────────────────────────────────────────────── */
function Toast({ toast }) {
  if (!toast) return null;
  const isSuccess = toast.type === "success";
  return (
    <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl animate-pop-in max-w-sm
      ${isSuccess ? "bg-white border border-emerald-100" : "bg-white border border-rose-100"}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm
        ${isSuccess ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
        {isSuccess ? "✓" : "✕"}
      </div>
      <p className={`text-sm font-500 ${isSuccess ? "text-slate-700" : "text-slate-700"}`}>{toast.msg}</p>
    </div>
  );
}

/* ─── Step Indicator ─────────────────────────────────────────────────────── */
function StepIndicator({ step, setStep }) {
  return (
    <div className="flex items-center justify-center mb-8 overflow-x-auto pb-1">
      {STEPS.map((s, i) => {
        const done = i < step;
        const active = i === step;
        const future = i > step;
        return (
          <React.Fragment key={s.id}>
            {i > 0 && (
              <div className={`h-px flex-1 min-w-[24px] max-w-[60px] mx-1 transition-all duration-500 ${done ? "bg-indigo-400" : "bg-slate-200"}`} />
            )}
            <button
              type="button"
              onClick={() => done && setStep(i)}
              className={`flex flex-col items-center gap-1.5 flex-shrink-0 group ${done ? "cursor-pointer" : "cursor-default"}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-700 transition-all duration-300 border-[1.5px]
                ${active ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110" : ""}
                ${done ? "bg-white border-indigo-300 text-indigo-600 hover:scale-105" : ""}
                ${future ? "bg-white border-slate-200 text-slate-400" : ""}
              `}>
                {done ? (
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : active ? s.icon : s.short}
              </div>
              <span className={`text-[10px] font-600 uppercase tracking-wider hidden sm:block transition-colors
                ${active ? "text-indigo-600" : done ? "text-indigo-400" : "text-slate-400"}`}>
                {s.label}
              </span>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── Upload Zone ─────────────────────────────────────────────────────────── */
function UploadZone({ id, label, required, preview, isCircle, onChange, onRemove, icon, accept = "image/*" }) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <label
        htmlFor={id}
        className={`relative flex flex-col items-center justify-center gap-2 border-[2px] border-dashed rounded-2xl cursor-pointer transition-all duration-200
          ${preview ? "border-indigo-300 bg-indigo-50" : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/40"}
          ${isCircle ? "p-6" : "p-6"}`}
      >
        <input type="file" id={id} accept={accept} onChange={onChange} className="hidden" />
        {preview ? (
          isCircle ? (
            <img src={preview} alt="" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" />
          ) : (
            <img src={preview} alt="" className="w-20 h-20 object-cover rounded-xl" />
          )
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-xl">
            {icon}
          </div>
        )}
        <p className="text-xs font-600 text-indigo-600">{preview ? "Change file" : "Click to upload"}</p>
        <p className="text-[11px] text-slate-400">JPG, PNG · Max 2MB</p>
      </label>
      {preview && (
        <button
          type="button"
          onClick={onRemove}
          className="mt-2 w-full text-[11px] font-600 text-rose-400 hover:text-rose-600 transition-colors"
        >
          Remove
        </button>
      )}
    </div>
  );
}

/* ─── Review Row ──────────────────────────────────────────────────────────── */
function ReviewBlock({ title, icon, children }) {
  return (
    <div className="rounded-2xl border border-slate-100 overflow-hidden mb-4">
      <div className="flex items-center gap-2.5 px-5 py-3.5 bg-slate-50 border-b border-slate-100">
        <span className="text-base">{icon}</span>
        <span className="text-xs font-700 uppercase tracking-widest text-slate-500">{title}</span>
      </div>
      <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 bg-white">
        {children}
      </div>
    </div>
  );
}

function ReviewItem({ label, value, full }) {
  return (
    <div className={full ? "col-span-2 sm:col-span-3" : ""}>
      <p className="text-[10px] font-700 uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm font-500 text-slate-800 break-words">{value || "—"}</p>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function AddTeacher() {
  const [step, setStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [aadharFront, setAadharFront] = useState(null);
  const [aadharBack, setAadharBack] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [frontPreview, setFrontPreview] = useState("");
  const [backPreview, setBackPreview] = useState("");
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [salaryCalc, setSalaryCalc] = useState({ basic: 0, allowances: 0, deductions: 0, net: 0 });
  const [toast, setToast] = useState(null);

  const queryClient = useQueryClient();
  const designationDataExample = [
    "Principal",
    "Vice Principal",
    "Headmaster",
    "Senior Teacher",
    "Assistant Teacher",
    "Primary Teacher",
    "High School Teacher",
  ];
  const qualificationOptions = [
    { value: "B.Ed", label: "B.Ed" },
    { value: "M.Ed", label: "M.Ed" },
    { value: "PhD", label: "PhD" },
    { value: "BA", label: "BA" },
    { value: "MA", label: "MA" },
    { value: "BCA", label: "BCA" },
    { value: "MCA", label: "MCA" },
    { value: "BSC", label: "BSC" },
    { value: "MSC", label: "MSC" },
    { value: "BCOM", label: "BCOM" },
    { value: "MCOM", label: "MCOM" }
  ];

  /* inject fonts */
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = FONT_STYLE;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const { register, control, handleSubmit, formState: { errors }, getValues, setValue, watch, trigger, reset } = useForm({
    defaultValues: { status: "active", salaryInfo: { basic: "", allowances: "", deductions: "", netSalary: "" } },
    mode: "onChange",
  });

  const pwValue = watch("password", "");
  const strength = passwordStrength(pwValue);

  // get api for specializations
  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => apiGet(apiPath.getAllSubjects)
  })
  const specializationOptions =
    subjects?.results?.docs?.map((item) => ({
      value: item._id,
      label: item.name,
    })) || [];
  console.log("subjects", specializationOptions);
  /* ─── API Mutation ─── */
  const mutation = useMutation({
    mutationFn: async (data) => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (["confirmPassword", "phone"].includes(k)) return;
        if (["address", "salaryInfo"].includes(k)) fd.append(k, JSON.stringify(v));
        else if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
        else if (v != null) fd.append(k, v);
      });
      fd.append("phone", phoneNumber);
      if (profilePic) fd.append("profilePic", profilePic);
      if (aadharFront) fd.append("aadharFront", aadharFront);
      if (aadharBack) fd.append("aadharBack", aadharBack);
      return apiPost(apiPath.createTeacher, fd );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["teachers"]);
      showToast("Teacher registered successfully! 🎉", "success");
      reset(); setStep(0); setPhoneNumber("");
      setProfilePic(null); setAadharFront(null); setAadharBack(null);
      setProfilePreview(""); setFrontPreview(""); setBackPreview("");
    },
    onError: (e) => showToast(e?.message || "Registration failed", "error"),
  });

  /* ─── Handlers ─── */
  const handleFile = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "profile") { setProfilePic(file); setProfilePreview(reader.result); }
      if (type === "front") { setAadharFront(file); setFrontPreview(reader.result); }
      if (type === "back") { setAadharBack(file); setBackPreview(reader.result); }
    };
    reader.readAsDataURL(file);
  };

  const handlePhone = (v) => {
    setPhoneNumber(v);
    const digits = v.replace(/\D/g, "");
    if (digits.length < 7) setPhoneError("Phone number too short");
    else if (digits.length > 15) setPhoneError("Phone number too long");
    else setPhoneError("");
  };

  const calcSalary = () => {
    const b = parseFloat(getValues("salaryInfo.basic")) || 0;
    const a = parseFloat(getValues("salaryInfo.allowances")) || 0;
    const d = parseFloat(getValues("salaryInfo.deductions")) || 0;
    setSalaryCalc({ basic: b, allowances: a, deductions: d, net: b + a - d });
    setShowSalaryModal(true);
  };

  const applySalary = () => {
    setValue("salaryInfo.netSalary", salaryCalc.net);
    setShowSalaryModal(false);
  };

  /* per-step required fields for validation */
  const stepFields = {
    0: ["name", "email", "password", "confirmPassword"],
    1: ["designation", "dateOfJoining", "specialization", "qualifications"],
    2: ["address.street", "address.city", "address.state", "address.zip", "address.country"],
    3: ["salaryInfo.basic"],
    4: [],
  };

  const goNext = async () => {
    if (step === 0 && (!phoneNumber || phoneError)) {
      setPhoneError("Valid phone number is required"); return;
    }
    const ok = await trigger(stepFields[step] || []);
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goPrev = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = (data) => {
    if (!profilePic) { showToast("Profile picture is required", "error"); return; }
    const final = {
      ...data, phone: phoneNumber,
      qualifications: typeof data.qualifications === "string"
        ? data.qualifications.split(",").map(q => q.trim()).filter(Boolean) : data.qualifications,
      specialization: typeof data.specialization === "string"
        ? data.specialization.split(",").map(s => s.trim()).filter(Boolean) : data.specialization,
    };
    delete final.confirmPassword;
    mutation.mutate(final);
  };
  const selectedCountry = useWatch({ control, name: "address.country" });
  const selectedState = useWatch({ control, name: "address.state" });
  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  const stateOptions = selectedCountry
    ? State.getStatesOfCountry(selectedCountry).map((state) => ({
      value: state.isoCode,
      label: state.name,
    }))
    : [];

  const cityOptions =
    selectedCountry && selectedState
      ? City.getCitiesOfState(selectedCountry, selectedState).map((city) => ({
        value: city.name,
        label: city.name,
      }))
      : [];


  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "42px",
      borderRadius: "8px",
      borderColor: state.isFocused ? "#cbd5f5" : "#e2e8f0",
      boxShadow: "none",
      fontSize: "14px",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#94a3b8",
    }),
  };
  const gv = (k) => getValues(k) || "";
    const navigate = useNavigate();

  /* ─── Render ─── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
      <Toast toast={toast} />

      {/* inject font */}
      <div className="md:max-w-4xl w-[100vw] mx-auto md:px-4 px-2 sm:px-6 py-10 pb-20">
   <div onClick={()=>navigate(-1)}  className="inline-flex items-center gap-2 bg-gray-100 cursor-pointer text-gray-600 text-xs font-700 uppercase tracking-widest px-4 py-2 rounded-full border border-gray-100 mb-5">
            <span>🔙</span> Back
          </div>
        {/* ── Header ── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-700 uppercase tracking-widest px-4 py-2 rounded-full border border-indigo-100 mb-5">
            <span>🏫</span> School Management
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-600 text-slate-900 leading-tight">
            Register a{" "}
            <span className="italic text-indigo-500">New Teacher</span>
          </h1>
          <p className="mt-3 text-slate-500 text-sm font-400 max-w-md mx-auto leading-relaxed">
            Complete all 6 sections to create a verified teacher account in the system.
          </p>
        </div>

        {/* ── Progress Bar (thin) ── */}
        <div className="mb-2 flex justify-between text-[10px] font-600 uppercase tracking-widest text-slate-400 px-1">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{STEPS[step].label}</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full mb-7 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* ── Step Dots ── */}
        <StepIndicator  step={step} setStep={setStep} />

        {/* ── Form Card ── */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/80 p-7 sm:p-10 relative overflow-hidden">
            {/* decorative corner */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-[80px] pointer-events-none" />

            {/* ── STEP 0 · Personal Information ── */}
            {step === 0 && (
              <div className="animate-slide-in">
                <SectionTitle icon="👤" title="Personal Information" subtitle="Basic identity and login credentials" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  <div>
                    <FieldLabel required>Full Name</FieldLabel>
                    <InputField
                      placeholder="e.g. Priya Sharma"
                      error={errors.name}
                      {...register("name", {
                        required: "Full name is required",
                        minLength: { value: 3, message: "Minimum 3 characters" },
                      })}
                    />
                    <FieldError msg={errors.name?.message} />
                  </div>

                  <div>
                    <FieldLabel required>Email Address</FieldLabel>
                    <InputField
                      type="email"
                      placeholder="teacher@school.edu.in"
                      error={errors.email}
                      {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
                      })}
                    />
                    <FieldError msg={errors.email?.message} />
                  </div>

                  {/* <div>
                    <FieldLabel required>Employee ID</FieldLabel>
                    <InputField
                      placeholder="EMP-2024-001"
                      error={errors.employeeId}
                      {...register("employeeId", {
                        required: "Employee ID is required",
                        pattern: { value: /^[A-Z0-9-]+$/, message: "Uppercase, numbers & hyphens only" },
                      })}
                    />
                    <FieldError msg={errors.employeeId?.message} />
                  </div> */}

                  <div>
                    <FieldLabel required>Phone Number</FieldLabel>
                    <div className="light-phone">
                      <PhoneInput
                        country="in"
                        value={phoneNumber}
                        onChange={handlePhone}
                        enableSearch
                        preferredCountries={["in", "us", "gb", "ca", "au"]}
                        inputProps={{ required: true }}
                        containerStyle={{ width: "100%" }}
                      />
                    </div>
                    <FieldError msg={phoneError} />
                  </div>

                  <div>
                    <FieldLabel required>Password</FieldLabel>
                    <InputField
                      type="password"
                      placeholder="Min. 6 characters"
                      error={errors.password}
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Minimum 6 characters" },
                        pattern: { value: /^(?=.*[A-Za-z])(?=.*\d)/, message: "Must include a letter and number" },
                      })}
                    />
                    {pwValue && (
                      <div className="mt-2">
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full strength-fill ${strength.color}`} style={{ width: strength.width }} />
                        </div>
                        <p className={`text-[11px] font-600 mt-1 ${strength.bg}`}>{strength.label} password</p>
                      </div>
                    )}
                    <FieldError msg={errors.password?.message} />
                  </div>

                  <div>
                    <FieldLabel required>Confirm Password</FieldLabel>
                    <InputField
                      type="password"
                      placeholder="Re-enter password"
                      error={errors.confirmPassword}
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (v) => v === getValues("password") || "Passwords do not match",
                      })}
                    />
                    <FieldError msg={errors.confirmPassword?.message} />
                  </div>

                  <div>
                    <FieldLabel>Date of Birth</FieldLabel>
                    <InputField
                      type="date"
                      error={errors.dob}
                      {...register("dob", {
                        validate: (v) => {
                          if (!v) return true;
                          const age = Math.floor((Date.now() - new Date(v)) / (365.25 * 86400000));
                          return age >= 18 || "Must be at least 18 years old";
                        },
                      })}
                    />
                    <FieldError msg={errors.dob?.message} />
                  </div>

                  <div>
                    <FieldLabel>Gender</FieldLabel>
                    <div className="relative">
                      <SelectField {...register("gender")}>
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </SelectField>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Marital Status</FieldLabel>
                    <div className="relative">
                      <SelectField {...register("maritalStatus")}>
                        <option value="">Select status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </SelectField>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* <div>
                    <FieldLabel>Blood Group</FieldLabel>
                    <div className="relative">
                      <SelectField {...register("bloodGroup")}>
                        <option value="">Select blood group</option>
                        {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </SelectField>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            )}

            {/* ── STEP 1 · Professional Details ── */}
            {step === 1 && (
              <div className="animate-slide-in">
                <SectionTitle icon="💼" title="Professional Details" subtitle="Academic qualifications and employment info" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  <div className="sm:col-span-2">
                    <FieldLabel required>Designation</FieldLabel>
                    <InputField list="designationExample"
                      placeholder="e.g. Senior Mathematics Teacher"
                      error={errors.designation}
                      {...register("designation", { required: "Designation is required" })}
                    // inputProps={{ list: "designationExample" }}
                    />
                    <datalist id="designationExample">
                      {designationDataExample.map((item, index) => (
                        <option key={index} value={item} />
                      ))}
                    </datalist>
                    <FieldError msg={errors.designation?.message} />
                  </div>

                  <div>
                    <FieldLabel>Years of Experience</FieldLabel>
                    <InputField
                      type="number"
                      placeholder="5"
                      error={errors.experience}
                      {...register("experience", {
                        min: { value: 0, message: "Cannot be negative" },
                        max: { value: 50, message: "Value seems too high" },
                      })}
                    />
                    <FieldError msg={errors.experience?.message} />
                  </div>

                  <div>
                    <FieldLabel required>Date of Joining</FieldLabel>
                    <InputField
                      type="date"
                      error={errors.dateOfJoining}
                      {...register("dateOfJoining", { required: "Date of joining is required" })}
                    />
                    <FieldError msg={errors.dateOfJoining?.message} />
                  </div>

                  <div>
                    <FieldLabel>Employment Status</FieldLabel>
                    <div className="relative">
                      <SelectField {...register("status")}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </SelectField>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* <div>
                    <FieldLabel>Disability Details</FieldLabel>
                    <InputField placeholder="If applicable (optional)" {...register("disabilityDetails")} />
                  </div> */}

                  <div className="sm:col-span-2">
                    <FieldLabel required>Specializations</FieldLabel>

                    <Controller
                      name="specialization"
                      control={control}
                      rules={{ required: "At least one specialization required" }}
                      render={({ field }) => (
                        <Select
                          options={specializationOptions}
                          isMulti
                          placeholder="Select specializations..."
                          value={specializationOptions.filter(opt =>
                            field.value?.includes(opt.value)
                          )}
                          onChange={(selected) =>
                            field.onChange(selected.map(item => item.value))
                          }
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: "42px",
                              borderRadius: "8px",
                              borderColor: errors.specialization ? "#ef4444" : "#e2e8f0",
                              boxShadow: "none",
                              "&:hover": {
                                borderColor: "#cbd5f5",
                              },
                              fontSize: "14px",
                            }),
                            multiValue: (base) => ({
                              ...base,
                              backgroundColor: "#e0e7ff",
                              borderRadius: "6px",
                            }),
                            multiValueLabel: (base) => ({
                              ...base,
                              color: "#3730a3",
                              fontWeight: 500,
                            }),
                            multiValueRemove: (base) => ({
                              ...base,
                              color: "#3730a3",
                              ":hover": {
                                backgroundColor: "#c7d2fe",
                                color: "#1e1b4b",
                              },
                            }),
                            placeholder: (base) => ({
                              ...base,
                              color: "#94a3b8",
                            }),
                          }}
                        />
                      )}
                    />

                    <FieldError msg={errors.specialization?.message} />
                  </div>

                  <div className="sm:col-span-2">
                    <FieldLabel required>Qualifications</FieldLabel>

                    <Controller
                      name="qualifications"
                      control={control}
                      rules={{ required: "At least one qualification required" }}
                      render={({ field }) => (
                        <Select
                          options={qualificationOptions}
                          isMulti
                          placeholder="e.g. B.Ed, M.Sc Mathematics, Ph.D"
                          value={qualificationOptions.filter(opt =>
                            field.value?.includes(opt.value)
                          )}
                          onChange={(selected) =>
                            field.onChange(selected.map(item => item.value))
                          }
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              minHeight: "42px",
                              borderRadius: "8px",
                              borderColor: errors.qualifications ? "#ef4444" : "#e2e8f0",
                              boxShadow: "none",
                              "&:hover": {
                                borderColor: "#cbd5f5",
                              },
                              fontSize: "14px",
                            }),
                            multiValue: (base) => ({
                              ...base,
                              backgroundColor: "#e0e7ff",
                              borderRadius: "6px",
                            }),
                            multiValueLabel: (base) => ({
                              ...base,
                              color: "#3730a3",
                              fontWeight: 500,
                            }),
                            multiValueRemove: (base) => ({
                              ...base,
                              color: "#3730a3",
                              ":hover": {
                                backgroundColor: "#c7d2fe",
                                color: "#1e1b4b",
                              },
                            }),
                            placeholder: (base) => ({
                              ...base,
                              color: "#94a3b8",
                            }),
                          }}
                        />
                      )}
                    />

                    <FieldError msg={errors.qualifications?.message} />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2 · Address ── */}
            {step === 2 && (
              <div className="animate-slide-in">
                <SectionTitle icon="📍" title="Address Details" subtitle="Current residential address of the teacher" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  <div className="sm:col-span-2">
                    <FieldLabel required>Street Address</FieldLabel>
                    <InputField
                      placeholder="123, MG Road, Apt 4B"
                      error={errors.address?.street}
                      {...register("address.street", { required: "Street address is required" })}
                    />
                    <FieldError msg={errors.address?.street?.message} />
                  </div>





                  <div>
                    <FieldLabel required>Country</FieldLabel>

                    <Controller
                      name="address.country"
                      control={control}
                      rules={{ required: "Country is required" }}
                      render={({ field }) => (
                        <Select
                          options={countryOptions}
                          placeholder="Select country"
                          styles={selectStyles}
                          value={countryOptions.find(opt => opt.value === field.value)}
                          onChange={(val) => {
                            field.onChange(val.value);
                            setValue("address.state", "");
                            setValue("address.city", "");
                          }}
                        />
                      )}
                    />

                    <FieldError msg={errors.address?.country?.message} />
                  </div>
                  <div>
                    <FieldLabel required>State</FieldLabel>

                    <Controller
                      name="address.state"
                      control={control}
                      rules={{ required: "State is required" }}
                      render={({ field }) => (
                        <Select
                          options={stateOptions}
                          placeholder="Select state"
                          styles={selectStyles}
                          isDisabled={!selectedCountry}
                          value={stateOptions.find(opt => opt.value === field.value)}
                          onChange={(val) => {
                            field.onChange(val.value);
                            setValue("address.city", "");
                          }}
                        />
                      )}
                    />

                    <FieldError msg={errors.address?.state?.message} />
                  </div>
                  <div>
                    <FieldLabel required>City</FieldLabel>

                    <Controller
                      name="address.city"
                      control={control}
                      rules={{ required: "City is required" }}
                      render={({ field }) => (
                        <Select
                          options={cityOptions}
                          placeholder="Select city"
                          styles={selectStyles}
                          isDisabled={!selectedState}
                          value={cityOptions.find(opt => opt.value === field.value)}
                          onChange={(val) => field.onChange(val.value)}
                        />
                      )}
                    />

                    <FieldError msg={errors.address?.city?.message} />
                  </div>
                  <div>
                    <FieldLabel required>PIN / ZIP Code</FieldLabel>
                    <InputField
                      placeholder="560001"
                      error={errors.address?.zip}
                      {...register("address.zip", {
                        required: "ZIP code is required",
                        pattern: {
                          value: /^[0-9]{6}$/,
                          message: "Enter a valid 6-digit PIN code",
                        },
                      })}
                    />
                    <FieldError msg={errors.address?.zip?.message} />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3 · Salary ── */}
            {step === 3 && (
              <div className="animate-slide-in">
                <SectionTitle icon="💰" title="Salary Information" subtitle="Monthly compensation and deductions breakdown" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {[
                    { key: "salaryInfo.basic", label: "Basic Salary", required: true, rules: { required: "Basic salary is required", min: { value: 0, message: "Cannot be negative" } } },
                    { key: "salaryInfo.allowances", label: "Allowances", required: false, rules: { min: { value: 0, message: "Cannot be negative" } } },
                    { key: "salaryInfo.deductions", label: "Deductions", required: false, rules: { min: { value: 0, message: "Cannot be negative" } } },
                  ].map(({ key, label, required: req, rules }) => (
                    <div key={key}>
                      <FieldLabel required={req}>{label}</FieldLabel>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-600 text-slate-400">₹</span>
                        <InputField
                          type="number"
                          placeholder="0"
                          className="!pl-8"
                          error={key === "salaryInfo.basic" ? errors.salaryInfo?.basic : undefined}
                          {...register(key, rules)}
                        />
                      </div>
                      {key === "salaryInfo.basic" && <FieldError msg={errors.salaryInfo?.basic?.message} />}
                    </div>
                  ))}

                  <div>
                    <FieldLabel>Net Salary (Calculated)</FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-600 text-indigo-400">₹</span>
                      <input
                        type="number"
                        readOnly
                        className="w-full h-[46px] pl-8 pr-4 text-sm font-700 text-indigo-600 bg-indigo-50 border-[1.5px] border-indigo-100 rounded-[10px] cursor-default"
                        {...register("salaryInfo.netSalary")}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div>
                    <p className="text-sm font-600 text-slate-700">Calculate Net Salary</p>
                    <p className="text-xs text-slate-400 mt-0.5">Basic + Allowances − Deductions</p>
                  </div>
                  <button
                    type="button"
                    onClick={calcSalary}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-600 rounded-xl transition-all duration-200 shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-200 active:scale-95"
                  >
                    <span>⚡</span> Preview Salary
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4 · Documents ── */}
            {step === 4 && (
              <div className="animate-slide-in">
                <SectionTitle icon="📄" title="Documents Upload" subtitle="Upload ID documents and profile photo" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                  <UploadZone
                    id="up-profile" label="Profile Photo" required isCircle
                    preview={profilePreview} icon="📸"
                    onChange={(e) => handleFile(e, "profile")}
                    onRemove={() => { setProfilePic(null); setProfilePreview(""); }}
                  />
                  <UploadZone
                    id="up-front" label="Aadhar Card — Front" required
                    preview={frontPreview} icon="🆔"
                    onChange={(e) => handleFile(e, "front")}
                    onRemove={() => { setAadharFront(null); setFrontPreview(""); }}
                  />
                  <UploadZone
                    id="up-back" label="Aadhar Card — Back" required
                    preview={backPreview} icon="🪪"
                    onChange={(e) => handleFile(e, "back")}
                    onRemove={() => { setAadharBack(null); setBackPreview(""); }}
                  />
                </div>

                <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-sm mt-0.5">⚠️</div>
                  <div>
                    <p className="text-sm font-600 text-amber-800 mb-1">Document Requirements</p>
                    <ul className="space-y-1">
                      {["Profile photo must be a recent passport-size image (JPEG/PNG, max 2MB).", "Aadhar card: both sides must be clear and fully readable.", "All uploaded documents will be verified by the school administration."].map((t, i) => (
                        <li key={i} className="text-xs text-amber-700 flex items-start gap-1.5">
                          <span className="mt-0.5 flex-shrink-0">•</span>{t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 5 · Review ── */}
            {step === 5 && (
              <div className="animate-slide-in">
                <SectionTitle icon="✅" title="Review & Submit" subtitle="Verify all details before creating the account" />

                <ReviewBlock title="Personal Information" icon="👤">
                  <ReviewItem label="Full Name" value={gv("name")} />
                  <ReviewItem label="Email" value={gv("email")} />
                  {/* <ReviewItem label="Employee ID"     value={gv("employeeId")} /> */}
                  <ReviewItem label="Phone" value={phoneNumber} />
                  <ReviewItem label="Date of Birth" value={gv("dob")} />
                  <ReviewItem label="Gender" value={gv("gender")} />
                  <ReviewItem label="Marital Status" value={gv("maritalStatus")} />
                  <ReviewItem label="Blood Group" value={gv("bloodGroup")} />
                </ReviewBlock>

                <ReviewBlock title="Professional Details" icon="💼">
                  <ReviewItem label="Designation" value={gv("designation")} />
                  <ReviewItem label="Experience" value={gv("experience") ? `${gv("experience")} years` : ""} />
                  <ReviewItem label="Date of Joining" value={gv("dateOfJoining")} />
                  <ReviewItem label="Status" value={gv("status")} />
                  <ReviewItem label="Specializations" value={gv("specialization")} full />
                  <ReviewItem label="Qualifications" value={gv("qualifications")} full />
                </ReviewBlock>

                <ReviewBlock title="Address" icon="📍">
                  <ReviewItem
                    label="Full Address" full
                    value={[gv("address.street"), gv("address.city"), gv("address.state"), gv("address.zip"), gv("address.country")].filter(Boolean).join(", ")}
                  />
                </ReviewBlock>

                <ReviewBlock title="Salary Details" icon="💰">
                  <ReviewItem label="Basic Salary" value={gv("salaryInfo.basic") ? `₹${Number(gv("salaryInfo.basic")).toLocaleString("en-IN")}` : ""} />
                  <ReviewItem label="Allowances" value={gv("salaryInfo.allowances") ? `₹${Number(gv("salaryInfo.allowances")).toLocaleString("en-IN")}` : ""} />
                  <ReviewItem label="Deductions" value={gv("salaryInfo.deductions") ? `₹${Number(gv("salaryInfo.deductions")).toLocaleString("en-IN")}` : ""} />
                  <ReviewItem label="Net Salary" value={gv("salaryInfo.netSalary") ? `₹${Number(gv("salaryInfo.netSalary")).toLocaleString("en-IN")}` : ""} />
                </ReviewBlock>

                {/* Documents status */}
                <div className="rounded-2xl border border-slate-100 overflow-hidden mb-5">
                  <div className="flex items-center gap-2.5 px-5 py-3.5 bg-slate-50 border-b border-slate-100">
                    <span>📄</span>
                    <span className="text-xs font-700 uppercase tracking-widest text-slate-500">Documents</span>
                  </div>
                  <div className="px-5 py-4 flex flex-wrap gap-3 bg-white">
                    {[
                      ["Profile Picture", profilePic],
                      ["Aadhar Front", aadharFront],
                      ["Aadhar Back", aadharBack],
                    ].map(([label, val]) => (
                      <span key={label}
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-600 border
                          ${val ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}>
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]
                          ${val ? 'bg-emerald-100' : 'bg-rose-100'}">
                          {val ? "✓" : "✕"}
                        </span>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-4">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 text-sm">ℹ️</div>
                  <p className="text-sm text-indigo-700 leading-relaxed">
                    <strong>Ready to submit?</strong> Once submitted, the teacher's account will be created and login credentials will be sent to their registered email address.
                  </p>
                </div>
              </div>
            )}

            {/* ── Navigation ── */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={goPrev}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-600 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 active:scale-95"
                >
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Previous
                </button>
              ) : <span />}

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-600 rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition-all duration-200 active:scale-95"
                >
                  Continue
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-600 rounded-xl shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 transition-all duration-200 active:scale-95 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".25" /><path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                      Submitting…
                    </>
                  ) : (
                    <> ✓ Submit Registration </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* ── Salary Preview Modal ── */}
      {showSalaryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowSalaryModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* modal header */}
            <div className="px-7 pt-7 pb-5 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-600 text-slate-800">Salary Breakdown</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Monthly compensation preview</p>
                </div>
                <button onClick={() => setShowSalaryModal(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors text-sm">✕</button>
              </div>
            </div>

            {/* rows */}
            <div className="px-7 py-5 space-y-3">
              {[
                { label: "Basic Salary", val: salaryCalc.basic, color: "text-slate-800", prefix: "" },
                { label: "Allowances", val: salaryCalc.allowances, color: "text-emerald-600", prefix: "+ " },
                { label: "Deductions", val: salaryCalc.deductions, color: "text-rose-500", prefix: "− " },
              ].map(({ label, val, color, prefix }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500 font-500">{label}</span>
                  <span className={`text-sm font-700 ${color}`}>{prefix}₹{val.toLocaleString("en-IN")}</span>
                </div>
              ))}

              {/* net total */}
              <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl px-5 py-4 border border-indigo-100 mt-4">
                <div>
                  <p className="text-xs font-700 uppercase tracking-widest text-indigo-400 mb-0.5">Net Salary / Month</p>
                  <p className="font-display text-3xl font-600 text-indigo-700">₹{salaryCalc.net.toLocaleString("en-IN")}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-700 uppercase tracking-widest text-slate-400 mb-0.5">Annual CTC</p>
                  <p className="text-lg font-700 text-slate-600">₹{(salaryCalc.net * 12).toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="px-7 pb-7 flex gap-3">
              <button
                type="button"
                onClick={() => setShowSalaryModal(false)}
                className="flex-1 py-2.5 text-sm font-600 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applySalary}
                className="flex-1 py-2.5 text-sm font-600 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-95"
              >
                Apply & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}