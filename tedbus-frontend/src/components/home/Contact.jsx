import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
 
  HelpCircle,
 
  
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
 
  
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    const formattedValue =
      name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.subject ||
      !formData.message
    ) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      setError("Please enter a valid 10 digit Indian mobile number");
      setLoading(false);
      return;
    }

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
      setTimeout(() => setSubmitted(false), 5000);
    }, 1200);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: [
        "TedBus Headquarters",
        "Plot No. 123, Tech Park",
        "Delhi - 110092, India",
      ],
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 98765 43210", "+91 11 4567 8900", "Available 24/7"],
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        "support@tedbus.com",
        "info@tedbus.com",
        "careers@tedbus.com",
      ],
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: [
        "Mon - Fri: 9 AM - 10 PM",
        "Sat - Sun: 10 AM - 8 PM",
        "Holidays: 10 AM - 6 PM",
      ],
    },
  ];

  // const socialLinks = [
  //   { icon: Facebook, name: "Facebook" },
  //   { icon: Twitter, name: "Twitter" },
  //   { icon: Instagram, name: "Instagram" },
  //   { icon: Linkedin, name: "LinkedIn" },
  //   { icon: Youtube, name: "YouTube" },
  // ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        "Click on Forgot Password on the login page and follow the OTP instructions sent to your email.",
    },
    {
      question: "Can I modify my booking?",
      answer:
        "You can modify eligible bookings up to 24 hours before departure via My Bookings.",
    },
    {
      question: "What is your cancellation policy?",
      answer:
        "Cancellations 24h before departure get full refund. Within 24h cancellation gets partial refund as per operator policy.",
    },
    {
      question: "How long does refund take?",
      answer:
        "Refunds are processed within 5-7 business days to your original payment method.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-orange-500 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black backdrop-blur">
            <MessageSquare className="h-4 w-4" />
            We are here to help
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Get in touch with TedBus
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-base font-medium leading-7 text-red-50">
            Have a question about bookings, payments or your journey? Reach out
            anytime — we are available 24×7.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Contact Info Cards */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((info) => {
            const Icon = info.icon;

            return (
              <article
                key={info.title}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-base font-black text-slate-900">
                  {info.title}
                </h3>

                <div className="mt-2 space-y-1">
                  {info.details.map((detail) => (
                    <p
                      key={detail}
                      className="text-xs font-medium leading-5 text-slate-500"
                    >
                      {detail}
                    </p>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        {/* Main Section */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Compact Form */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-black text-slate-900">
                Send us a message
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Our team usually replies within a few hours.
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50 p-3 text-sm font-bold text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {submitted && (
              <div className="mb-4 flex items-start gap-2 rounded-2xl border border-green-100 bg-green-50 p-3 text-sm font-bold text-green-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                Thank you. Your message has been sent successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />

              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
              />

              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500">
                  Subject
                </label>

                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
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

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500">
                  Message
                </label>

                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </section>

          {/* Side: Quick Contact + Social */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-black text-slate-900">
                Quick contact
              </h3>

              <div className="mt-5 space-y-4 text-sm">
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition hover:border-red-100 hover:bg-red-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Call Us
                    </p>
                    <p className="font-black text-slate-900">
                      +91 98765 43210
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:support@tedbus.com"
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition hover:border-red-100 hover:bg-red-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Email Us
                    </p>
                    <p className="font-black text-slate-900">
                      support@tedbus.com
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 text-green-700">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-green-700">
                      24×7 Support
                    </p>
                    <p className="text-sm font-bold text-green-700">
                      We are always here for you
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-black text-slate-900">
                Follow us
              </h3>

              <div className="mt-4 grid grid-cols-5 gap-2">
                {/* {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.name}
                      href="#"
                      aria-label={social.name}
                      className="flex h-11 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-500 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })} */}
              </div>
            </div>
          </aside>
        </div>

        {/* Map */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex h-72 items-center justify-center bg-slate-100">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <MapPin className="h-5 w-5" />
              </div>
              <p className="mt-3 text-base font-black text-slate-800">
                TedBus Office Location
              </p>
              <p className="text-sm font-medium text-slate-500">
                Plot No. 123, Tech Park, Delhi - 110092
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <section className="mt-14">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-1.5 text-xs font-black text-red-600">
              <HelpCircle className="h-3.5 w-3.5" />
              FAQ
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Frequently asked questions
            </h2>

            <p className="mt-3 text-sm font-medium leading-7 text-slate-500">
              Common questions about TedBus bookings and services.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {faqs.map((faq, index) => (
              <article
                key={index}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-red-100 hover:shadow-md"
              >
                <h3 className="text-base font-black text-slate-900">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-14 overflow-hidden rounded-3xl border border-red-100 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-1 shadow-xl shadow-red-500/20">
          <div className="rounded-[1.8rem] bg-white p-8 text-center">
            <h3 className="text-2xl font-black text-slate-900">
              Still have questions?
            </h3>
            <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
              Our support team is ready to help you anytime.
            </p>

            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 active:scale-95"
            >
              <MessageSquare className="h-4 w-4" />
              Start Live Chat
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

const Input = ({ label, name, value, onChange, type = "text", placeholder }) => {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
      />
    </div>
  );
};

export default Contact;