import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Globe,
  HelpCircle,
  Headphones,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";

const contactCards = [
  {
    id: 1,
    icon: MapPin,
    title: "Visit Our Office",
    details: [
      "TedBus Headquarters",
      "Plot No. 123, Tech Park",
      "Delhi - 110092, India",
    ],
    gradient: "from-red-600 to-orange-500",
    accentText: "text-red-600 dark:text-red-400",
    softBg: "bg-red-50 dark:bg-red-950/40",
    softBorder: "border-red-100 dark:border-red-900/50",
    glow: "group-hover:shadow-red-500/15",
  },
  {
    id: 2,
    icon: Phone,
    title: "Call Us Anytime",
    details: [
      "+91 98380 35860",
      "+91 11 4567 8900",
      "Available 24×7",
    ],
    gradient: "from-emerald-600 to-teal-500",
    accentText: "text-emerald-600 dark:text-emerald-400",
    softBg: "bg-emerald-50 dark:bg-emerald-950/40",
    softBorder: "border-emerald-100 dark:border-emerald-900/50",
    glow: "group-hover:shadow-emerald-500/15",
  },
  {
    id: 3,
    icon: Mail,
    title: "Email Support",
    details: [
      "support@tedbus.com",
      "info@tedbus.com",
      "careers@tedbus.com",
    ],
    gradient: "from-violet-600 to-purple-500",
    accentText: "text-violet-600 dark:text-violet-400",
    softBg: "bg-violet-50 dark:bg-violet-950/40",
    softBorder: "border-violet-100 dark:border-violet-900/50",
    glow: "group-hover:shadow-violet-500/15",
  },
  {
    id: 4,
    icon: Clock,
    title: "Working Hours",
    details: [
      "Mon – Fri: 9 AM – 10 PM",
      "Sat – Sun: 10 AM – 8 PM",
      "Holidays: 10 AM – 6 PM",
    ],
    gradient: "from-amber-600 to-yellow-500",
    accentText: "text-amber-600 dark:text-amber-400",
    softBg: "bg-amber-50 dark:bg-amber-950/40",
    softBorder: "border-amber-100 dark:border-amber-900/50",
    glow: "group-hover:shadow-amber-500/15",
  },
];

const faqs = [
  {
    id: 1,
    question: "How do I reset my password?",
    answer:
      "Click on Forgot Password on the login page and follow the OTP instructions sent to your registered email or phone.",
    icon: ShieldCheck,
    accentText: "text-red-600 dark:text-red-400",
    softBg: "bg-red-50 dark:bg-red-950/40",
    softBorder: "border-red-100 dark:border-red-900/50",
    dotColor: "bg-red-500",
  },
  {
    id: 2,
    question: "Can I modify my booking?",
    answer:
      "You can modify eligible bookings up to 24 hours before departure via the My Bookings section on your dashboard.",
    icon: Zap,
    accentText: "text-violet-600 dark:text-violet-400",
    softBg: "bg-violet-50 dark:bg-violet-950/40",
    softBorder: "border-violet-100 dark:border-violet-900/50",
    dotColor: "bg-violet-500",
  },
  {
    id: 3,
    question: "What is your cancellation policy?",
    answer:
      "Cancellations 24 hours before departure receive a full refund. Within 24 hours, a partial refund is issued as per the operator's policy.",
    icon: HelpCircle,
    accentText: "text-emerald-600 dark:text-emerald-400",
    softBg: "bg-emerald-50 dark:bg-emerald-950/40",
    softBorder: "border-emerald-100 dark:border-emerald-900/50",
    dotColor: "bg-emerald-500",
  },
  {
    id: 4,
    question: "How long does a refund take?",
    answer:
      "Refunds are processed within 5–7 business days to your original payment method after approval.",
    icon: Clock,
    accentText: "text-amber-600 dark:text-amber-400",
    softBg: "bg-amber-50 dark:bg-amber-950/40",
    softBorder: "border-amber-100 dark:border-amber-900/50",
    dotColor: "bg-amber-500",
  },
  {
    id: 5,
    question: "How do I contact customer support?",
    answer:
      "You can reach us 24×7 via phone, email, or the live chat option available on this page and inside the app.",
    icon: Headphones,
    accentText: "text-cyan-600 dark:text-cyan-400",
    softBg: "bg-cyan-50 dark:bg-cyan-950/40",
    softBorder: "border-cyan-100 dark:border-cyan-900/50",
    dotColor: "bg-cyan-500",
  },
  {
    id: 6,
    question: "Is my payment information secure?",
    answer:
      "Absolutely. All payments are processed through PCI-compliant, encrypted gateways. We never store your card details.",
    icon: BadgeCheck,
    accentText: "text-pink-600 dark:text-pink-400",
    softBg: "bg-pink-50 dark:bg-pink-950/40",
    softBorder: "border-pink-100 dark:border-pink-900/50",
    dotColor: "bg-pink-500",
  },
];

const quickContactItems = [
  {
    id: 1,
    href: "tel:+919838035860",
    icon: Phone,
    label: "Call Us",
    value: "+91 98380 35860",
    accentText: "text-emerald-600 dark:text-emerald-400",
    softBg: "bg-emerald-50 dark:bg-emerald-950/40",
    softBorder: "border-emerald-100 dark:border-emerald-900/50",
    hoverBorder: "hover:border-emerald-200 dark:hover:border-emerald-900/70",
    hoverBg: "hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
  },
  {
    id: 2,
    href: "mailto:support@tedbus.com",
    icon: Mail,
    label: "Email Us",
    value: "support@tedbus.com",
    accentText: "text-violet-600 dark:text-violet-400",
    softBg: "bg-violet-50 dark:bg-violet-950/40",
    softBorder: "border-violet-100 dark:border-violet-900/50",
    hoverBorder: "hover:border-violet-200 dark:hover:border-violet-900/70",
    hoverBg: "hover:bg-violet-50 dark:hover:bg-violet-950/30",
  },
  {
    id: 3,
    href: "https://wa.me/919838035860",
    icon: MessageSquare,
    label: "WhatsApp",
    value: "Chat with us",
    accentText: "text-green-600 dark:text-green-400",
    softBg: "bg-green-50 dark:bg-green-950/40",
    softBorder: "border-green-100 dark:border-green-900/50",
    hoverBorder: "hover:border-green-200 dark:hover:border-green-900/70",
    hoverBg: "hover:bg-green-50 dark:hover:bg-green-950/30",
  },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

const FormInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  icon: Icon,
  accentColor = "red",
}) => {
  const hasError = Boolean(error);

  const iconColorMap = {
    red: "text-red-600 dark:text-red-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    violet: "text-violet-600 dark:text-violet-400",
    amber: "text-amber-600 dark:text-amber-400",
    cyan: "text-cyan-600 dark:text-cyan-400",
    blue: "text-blue-600 dark:text-blue-400",
  };

  const iconBgMap = {
    red: "bg-red-50 dark:bg-red-950/40",
    emerald: "bg-emerald-50 dark:bg-emerald-950/40",
    violet: "bg-violet-50 dark:bg-violet-950/40",
    amber: "bg-amber-50 dark:bg-amber-950/40",
    cyan: "bg-cyan-50 dark:bg-cyan-950/40",
    blue: "bg-blue-50 dark:bg-blue-950/40",
  };

  return (
    <div>
      <label
        htmlFor={`contact-${name}`}
        className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <div
            className={`pointer-events-none absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg ${
              hasError
                ? "bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400"
                : `${iconBgMap[accentColor]} ${iconColorMap[accentColor]}`
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}

        <input
          id={`contact-${name}`}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={name}
          aria-invalid={hasError}
          className={`h-12 w-full rounded-xl border bg-slate-50 text-sm font-bold text-slate-900 outline-none transition focus:bg-white focus:ring-4 dark:bg-slate-800/70 dark:text-white dark:focus:bg-slate-900 ${
            Icon ? "pl-[3.25rem] pr-4" : "px-4"
          } ${
            hasError
              ? "border-red-400 ring-red-500/5 dark:border-red-800"
              : "border-slate-200 focus:border-red-500 focus:ring-red-500/10 dark:border-slate-700"
          }`}
        />
      </div>

      {hasError && (
        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-red-600 dark:text-red-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    const formattedValue =
      name === "phone"
        ? value.replace(/\D/g, "").slice(0, 10)
        : value;

    setFormData((currentData) => ({
      ...currentData,
      [name]: formattedValue,
    }));

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Please enter your full name";
    }

    if (!formData.email.trim()) {
      errors.email = "Please enter your email";
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Please enter your phone number";
    } else if (!PHONE_REGEX.test(formData.phone.trim())) {
      errors.phone =
        "Please enter a valid 10-digit Indian mobile number";
    }

    if (!formData.subject) {
      errors.subject = "Please select a subject";
    }

    if (!formData.message.trim()) {
      errors.message = "Please describe your query";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setFieldErrors({});

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      {/* Compact hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-orange-500 px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full bg-white/15 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-orange-300/25 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_40%)]" />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.06)_50%,rgba(255,255,255,0.06)_75%,transparent_75%,transparent)] [background-size:44px_44px] opacity-25" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] backdrop-blur-xl sm:text-[10px]">
            <Headphones className="h-3.5 w-3.5" />
            24×7 customer support
          </div>

          <h1 className="text-2xl font-black tracking-[-0.04em] sm:text-3xl lg:text-4xl">
            Get in touch with
            <span className="ml-2 text-white/95">TedBus Support</span>
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-xs font-medium leading-5 text-red-50/90 sm:text-sm sm:leading-6">
            Have questions about bookings, payments, refunds or your journey?
            Our team is ready to help — reach out anytime.
          </p>

          {/* Compact stats */}
          <div className="mx-auto mt-5 grid max-w-md grid-cols-3 gap-2">
            {[
              {
                icon: Users,
                value: "10K+",
                label: "Happy travellers",
              },
              {
                icon: Clock,
                value: "< 2 hrs",
                label: "Avg. response",
              },
              {
                icon: Star,
                value: "4.9★",
                label: "Support rating",
              },
            ].map((stat) => {
              const StatIcon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-xl"
                >
                  <StatIcon className="mx-auto h-3.5 w-3.5 text-white/80" />

                  <p className="mt-1 text-base font-black sm:text-lg">
                    {stat.value}
                  </p>

                  <p className="text-[7px] font-black uppercase tracking-wider text-white/60 sm:text-[8px]">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Contact info cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactCards.map((card, index) => {
            const CardIcon = card.icon;

            return (
              <article
                key={card.id}
                className={`group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 ${card.glow}`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />

                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl border shadow-sm transition-transform duration-500 group-hover:scale-110 ${card.softBg} ${card.softBorder} ${card.accentText}`}
                  >
                    <CardIcon className="h-5 w-5" />
                  </div>

                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-[9px] font-black text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-black text-slate-900 dark:text-white">
                  {card.title}
                </h3>

                <div className="mt-2.5 space-y-1.5">
                  {card.details.map((detail) => (
                    <p
                      key={detail}
                      className="text-xs font-medium leading-5 text-slate-500 dark:text-slate-400"
                    >
                      {detail}
                    </p>
                  ))}
                </div>

                <div
                  className={`pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br ${card.gradient} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-10`}
                />
              </article>
            );
          })}
        </div>

        {/* Main section */}
        <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1fr_380px]">
          {/* Contact form */}
          <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
            <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-red-50/50 p-5 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-red-950/20 sm:p-6">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-red-200/40 blur-3xl dark:bg-red-900/15" />

              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/25">
                  <Send className="h-5 w-5" />
                </div>

                <div>
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-red-600 dark:bg-red-950/40 dark:text-red-400">
                    <Sparkles className="h-3 w-3" />
                    Quick response
                  </div>

                  <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                    Send us a message
                  </h2>

                  <p className="mt-1 text-xs font-medium leading-5 text-slate-500 dark:text-slate-400 sm:text-sm">
                    Our team usually replies within 2 hours.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {submitted && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-black text-emerald-800 dark:text-emerald-300">
                      Message sent successfully!
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Thank you for contacting us. We will get back to you
                      shortly.
                    </p>
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                noValidate
                className="grid gap-4 sm:grid-cols-2"
              >
                <FormInput
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  error={fieldErrors.name}
                  icon={Users}
                  accentColor="red"
                />

                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  error={fieldErrors.email}
                  icon={Mail}
                  accentColor="violet"
                />

                <FormInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  error={fieldErrors.phone}
                  icon={Phone}
                  accentColor="emerald"
                />

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400"
                  >
                    Subject
                  </label>

                  <div className="relative">
                    <div
                      className={`pointer-events-none absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg ${
                        fieldErrors.subject
                          ? "bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400"
                          : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                      }`}
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                    </div>

                    <select
                      id="contact-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      aria-invalid={Boolean(fieldErrors.subject)}
                      className={`h-12 w-full cursor-pointer appearance-none rounded-xl border bg-slate-50 pl-[3.25rem] pr-4 text-sm font-bold text-slate-900 outline-none transition focus:bg-white focus:ring-4 dark:bg-slate-800/70 dark:text-white dark:focus:bg-slate-900 ${
                        fieldErrors.subject
                          ? "border-red-400 ring-red-500/5 dark:border-red-800"
                          : "border-slate-200 focus:border-red-500 focus:ring-red-500/10 dark:border-slate-700"
                      }`}
                    >
                      <option value="">Select subject</option>
                      <option value="booking">Booking Issue</option>
                      <option value="payment">Payment Issue</option>
                      <option value="refund">Refund Query</option>
                      <option value="technical">Technical Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {fieldErrors.subject && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-red-600 dark:text-red-400">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {fieldErrors.subject}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="contact-message"
                    className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400"
                  >
                    Your Message
                  </label>

                  <div className="relative">
                    <div
                      className={`pointer-events-none absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg ${
                        fieldErrors.message
                          ? "bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400"
                          : "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400"
                      }`}
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </div>

                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your query in detail..."
                      aria-invalid={Boolean(fieldErrors.message)}
                      className={`w-full resize-none rounded-xl border bg-slate-50 pl-[3.25rem] pr-4 pt-3.5 text-sm font-semibold leading-6 text-slate-900 outline-none transition focus:bg-white focus:ring-4 dark:bg-slate-800/70 dark:text-white dark:focus:bg-slate-900 ${
                        fieldErrors.message
                          ? "border-red-400 ring-red-500/5 dark:border-red-800"
                          : "border-slate-200 focus:border-red-500 focus:ring-red-500/10 dark:border-slate-700"
                      }`}
                    />
                  </div>

                  {fieldErrors.message && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-red-600 dark:text-red-400">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-orange-500 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-red-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-red-500/30 disabled:cursor-not-allowed disabled:opacity-70 active:translate-y-0 active:scale-[0.98]"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}

                    {loading ? "Sending message..." : "Send Message"}

                    {!loading && (
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </button>

                  <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    Your information is secure and never shared.
                  </div>
                </div>
              </form>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
              <div className="border-b border-slate-100 bg-gradient-to-r from-slate-950 to-slate-900 p-5 text-white dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-red-400 backdrop-blur">
                    <Zap className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-base font-black">Quick Contact</h3>

                    <p className="text-[10px] font-bold text-slate-400">
                      Reach us instantly
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4">
                {quickContactItems.map((item) => {
                  const ItemIcon = item.icon;

                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      target={
                        item.href.startsWith("https")
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        item.href.startsWith("https")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className={`group flex items-center gap-3 rounded-2xl border bg-slate-50 p-3 transition dark:bg-slate-800/50 ${item.softBorder} ${item.hoverBorder} ${item.hoverBg}`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm ${item.softBg} ${item.softBorder} ${item.accentText}`}
                      >
                        <ItemIcon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                          {item.label}
                        </p>

                        <p className="truncate text-sm font-black text-slate-900 dark:text-white">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 dark:border-emerald-900/50 dark:from-emerald-950/30 dark:to-teal-950/20">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                  <Headphones className="h-5 w-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-emerald-800 dark:text-emerald-300">
                      24×7 Live Support
                    </h3>

                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>
                  </div>

                  <p className="mt-1 text-xs font-medium leading-5 text-emerald-700 dark:text-emerald-400">
                    Our dedicated support team is always online to assist you
                    — day or night.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
                <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Why contact TedBus?
              </h3>

              <div className="mt-4 space-y-3">
                {[
                  {
                    text: "Fastest response in the industry",
                    color: "bg-red-500",
                  },
                  {
                    text: "Multi-language support available",
                    color: "bg-violet-500",
                  },
                  {
                    text: "Dedicated escalation team",
                    color: "bg-emerald-500",
                  },
                  {
                    text: "Issue resolved in first contact",
                    color: "bg-amber-500",
                  },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-start gap-2.5"
                  >
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.color}`}
                    />

                    <p className="text-xs font-medium leading-5 text-slate-600 dark:text-slate-400">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Map */}
        <div className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="relative flex h-64 items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-red-50/50 dark:from-slate-800/60 dark:via-slate-900 dark:to-red-950/20">
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-red-200/30 blur-3xl dark:bg-red-900/15" />

            <div className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/25">
                <MapPin className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white">
                TedBus Office Location
              </h3>

              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                Plot No. 123, Tech Park, Delhi - 110092
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <section className="mt-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/90 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-red-600 shadow-sm backdrop-blur dark:border-red-900/50 dark:bg-slate-900/80 dark:text-red-400 sm:text-xs">
              <HelpCircle className="h-4 w-4" />
              Frequently asked questions
            </div>

            <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl">
              Common questions,
              <span className="ml-2 bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                clear answers
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-7 text-slate-500 dark:text-slate-400">
              Find quick answers about TedBus bookings, payments, refunds and
              travel policies.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {faqs.map((faq, index) => {
              const FaqIcon = faq.icon;

              return (
                <article
                  key={faq.id}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm ${faq.softBg} ${faq.softBorder} ${faq.accentText}`}
                    >
                      <FaqIcon className="h-4 w-4" />
                    </div>

                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-[9px] font-black text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-4 text-sm font-black leading-5 text-slate-900 dark:text-white">
                    {faq.question}
                  </h3>

                  <p className="mt-2 min-h-[60px] text-xs font-medium leading-5 text-slate-500 dark:text-slate-400">
                    {faq.answer}
                  </p>

                  <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${faq.dotColor}`}
                    />

                    <span
                      className={`text-[9px] font-black uppercase tracking-[0.14em] ${faq.accentText}`}
                    >
                      TedBus verified answer
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-14">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl dark:border dark:border-slate-800 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-red-500/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24 left-1/4 h-52 w-52 rounded-full bg-orange-500/15 blur-3xl" />

            <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-red-400 backdrop-blur">
                <MessageSquare className="h-6 w-6" />
              </div>

              <div className="flex-1">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400">
                  Need more help?
                </p>

                <h3 className="mt-1 text-xl font-black sm:text-2xl">
                  Still have questions? Start a live chat.
                </h3>

                <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-400">
                  Our support team is available around the clock to help you
                  with anything — bookings, refunds, travel changes and more.
                </p>
              </div>

              <button
                type="button"
                className="group shrink-0 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
              >
                <MessageSquare className="h-4 w-4" />
                Start Live Chat
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;