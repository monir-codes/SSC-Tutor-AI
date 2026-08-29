import { Mail, MapPin, MessageSquare, Linkedin, Github, Globe, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";

export function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  const faqs = [
    { q: "Is this platform free?", a: "Yes, 100% free forever. We believe quality education should be accessible to all." },
    { q: "Which curriculum is followed?", a: "We strictly follow the latest Bangladesh NCTB curriculum for SSC candidates." },
    { q: "Can I suggest improvements?", a: "Absolutely! We love hearing from students. Use the contact form to share your ideas." },
    { q: "Will HSC content be added?", a: "Yes, our future vision includes expanding to HSC subjects. Stay tuned!" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <SEO 
        title="Contact Us | SSC Tutor AI Support"
        description="Get in touch with the SSC Tutor AI team for support, feedback, or suggestions. Find frequently asked questions."
        href="/contact"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact SSC Tutor AI",
            url: "https://ssc-tutor-ai.vercel.app/contact",
            description: "Contact support for SSC Tutor AI."
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(faq => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a
              }
            }))
          }
        ]}
      />
      {/* Hero */}
      <section className="bg-slate-900 py-16 sm:py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Contact Us</h1>
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
              We'd love to hear your thoughts, feedback, and ideas.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Contact Info */}
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                Get in Touch
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-bn">
                তোমার মতামত এই প্ল্যাটফর্মকে সবার জন্য আরো নিখুঁত করতে সাহায্য করে। যেকোনো প্রশ্ন বা পরামর্শ থাকলে নির্দ্বিধায় আমাদের জানাও।
              </p>
              
              <div className="space-y-5">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 mr-4 shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Email us at</p>
                    <a href="mailto:Monir.webdev@gmail.com" className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      Monir.webdev@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 mr-4 shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Location</p>
                    <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                      Dhaka, Bangladesh
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4">Connect with the Creator</h3>
              <div className="flex space-x-3">
                <a href="https://www.linkedin.com/in/moniruzzaman-rumman/" target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all hover:bg-[#0A66C2] hover:text-white">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="https://github.com/monir-codes/" target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-900 hover:text-white">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://monir-uzzaman.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all hover:bg-primary-600 hover:text-white">
                  <Globe className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <form onSubmit={handleSubmit} className="rounded-3xl bg-white dark:bg-slate-950 p-6 sm:p-10 shadow-xl border border-slate-200 dark:border-slate-800">
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text" id="name" required
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white text-sm sm:text-base focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email" id="email" required
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white text-sm sm:text-base focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <input
                    type="text" id="subject" required
                    value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white text-sm sm:text-base focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                  <textarea
                    id="message" rows={4} required
                    value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white text-sm sm:text-base focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit" disabled={isSubmitting}
                  className="flex w-full items-center justify-center space-x-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white px-4 py-3.5 sm:py-4 text-sm sm:text-base font-semibold transition-all shadow-md active:scale-95 disabled:opacity-70"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  {!isSubmitting && <Send className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* FAQ */}
        <div className="mt-16 sm:mt-24 max-w-3xl mx-auto text-center border-t border-slate-200 dark:border-slate-800 pt-12 sm:pt-16">
          <MessageSquare className="mx-auto h-8 w-8 text-primary-500 mb-4 sm:mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-8 sm:mb-10">Frequently Asked Questions</h2>
          <div className="text-left space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl bg-white dark:bg-slate-950 p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">{faq.q}</h3>
                <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
