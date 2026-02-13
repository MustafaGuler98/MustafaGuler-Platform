"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Mail, Send, Terminal, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { CyberActionButton } from "@/components/ui/cyber/CyberActionButton";

interface FormErrors {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
}

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
        allowPromo: false,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [copied, setCopied] = useState(false);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.name.trim()) newErrors.name = "Identity // Required";
        if (!formData.email.trim()) {
            newErrors.email = "Email // Required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email // Invalid Protocol";
        }
        if (!formData.subject.trim()) newErrors.subject = "Subject // Required";
        if (!formData.message.trim()) newErrors.message = "Message // Packet Empty";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, allowPromo: e.target.checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setStatus("submitting");

        try {
            const response = await apiClient.post('/contact', formData);

            if (response.isSuccess) {
                setStatus("success");
                setFormData({ name: "", email: "", subject: "", message: "", allowPromo: false });
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText("contact.mustafaguler@gmail.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center pt-32 pb-12 px-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-neon/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">

                {/* Left Side: Info & Decorative */}
                <div className="flex flex-col gap-6 self-start md:sticky md:top-32">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3 tracking-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon to-primary">
                                CONTACT
                            </span>
                            <br />
                            <span className="text-foreground">PROTOCOL</span>
                        </h1>
                        <p className="text-muted-foreground text-sm md:text-base font-mono leading-relaxed opacity-80">
                            {">"} Initiate connection...<br />
                            {">"} Whether it's a project proposal, a collaboration request, or just a digital handshake.
                        </p>
                    </div>

                    <div className="p-5 rounded-xl bg-primary/5 border border-primary/20 backdrop-blur-sm relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="flex items-center gap-4 mb-4 relative z-10">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-cyan-neon" />
                            </div>
                            <div>
                                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                    Direct Line
                                </div>
                                <div className="text-sm md:text-base font-medium text-foreground select-all">
                                    contact.mustafaguler@gmail.com
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                                "w-full gap-2 border-primary/30 hover:border-cyan-neon hover:text-cyan-neon transition-all bg-background/50 relative z-10",
                                copied && "border-green-500 text-green-500 hover:text-green-500 hover:border-green-500"
                            )}
                            onClick={copyToClipboard}
                        >
                            {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copied ? "COPIED TO CLIPBOARD" : "COPY ADDRESS"}
                        </Button>
                    </div>

                    <div className="hidden md:flex items-center text-xs font-mono text-muted-foreground opacity-60">
                        <span className="animate-pulse mr-2">{">"}</span>
                        <span>Signal trace detected in corners... Try pinging me there, probably I'll actually reply.</span>
                    </div>
                </div>

                {/* Right Side: The Form */}
                <div className="relative">
                    {/* Box Container */}
                    <div className="bg-background/40 backdrop-blur-xl border border-white/10 rounded-none md:rounded-3xl p-6 shadow-[0_0_40px_-10px_rgba(124,58,237,0.15)] relative overflow-hidden">

                        {/* Neon Border Effect */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-neon to-transparent opacity-50" />
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

                            {/* Name Field */}
                            <div className="space-y-1">
                                <label htmlFor="name" className="text-[10px] font-mono uppercase tracking-widest text-cyan-neon/80 ml-1">
                                    Identity // Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={cn(
                                        "w-full bg-[#030014]/60 border rounded-sm px-4 py-2.5 text-sm text-cyan-50 placeholder-white/10 focus:outline-none transition-all duration-300 font-mono",
                                        errors.name
                                            ? "border-red-500/50 focus:border-red-500 bg-red-900/10"
                                            : "border-white/10 focus:border-cyan-neon/70 hover:border-cyan-neon/30"
                                    )}
                                    placeholder="xX_Cyber_Ghost_Xx"
                                />
                                {errors.name && (
                                    <span className="text-[10px] text-red-400 font-mono ml-1">{errors.name}</span>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-1">
                                <label htmlFor="email" className="text-[10px] font-mono uppercase tracking-widest text-cyan-neon/80 ml-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={cn(
                                        "w-full bg-[#030014]/60 border rounded-sm px-4 py-2.5 text-sm text-cyan-50 placeholder-white/10 focus:outline-none transition-all duration-300 font-mono",
                                        errors.email
                                            ? "border-red-500/50 focus:border-red-500 bg-red-900/10"
                                            : "border-white/10 focus:border-cyan-neon/70 hover:border-cyan-neon/30"
                                    )}
                                    placeholder="not_a_bot_trust_me@hotmail.com"
                                />
                                {errors.email && (
                                    <span className="text-[10px] text-red-400 font-mono ml-1">{errors.email}</span>
                                )}
                            </div>

                            {/* Subject Field */}
                            <div className="space-y-1">
                                <label htmlFor="subject" className="text-[10px] font-mono uppercase tracking-widest text-cyan-neon/80 ml-1">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className={cn(
                                        "w-full bg-[#030014]/60 border rounded-sm px-4 py-2.5 text-sm text-cyan-50 placeholder-white/10 focus:outline-none transition-all duration-300 font-mono",
                                        errors.subject
                                            ? "border-red-500/50 focus:border-red-500 bg-red-900/10"
                                            : "border-white/10 focus:border-cyan-neon/70 hover:border-cyan-neon/30"
                                    )}
                                    placeholder="Project Proposal"
                                />
                                {errors.subject && (
                                    <span className="text-[10px] text-red-400 font-mono ml-1">{errors.subject}</span>
                                )}
                            </div>

                            {/* Message Field */}
                            <div className="space-y-1">
                                <label htmlFor="message" className="text-[10px] font-mono uppercase tracking-widest text-cyan-neon/80 ml-1">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className={cn(
                                        "w-full bg-[#030014]/60 border rounded-sm px-4 py-2.5 text-sm text-cyan-50 placeholder-white/10 focus:outline-none transition-all duration-300 resize-none font-mono",
                                        errors.message
                                            ? "border-red-500/50 focus:border-red-500 bg-red-900/10"
                                            : "border-white/10 focus:border-cyan-neon/70 hover:border-cyan-neon/30"
                                    )}
                                    placeholder="I have a billion-dollar app idea. If you code it, 50% is yours."
                                />
                                {errors.message && (
                                    <span className="text-[10px] text-red-400 font-mono ml-1">{errors.message}</span>
                                )}
                            </div>

                            {/* Checkbox */}
                            <div
                                className="flex items-start gap-3 mt-1 group cursor-pointer select-none"
                                onClick={() => setFormData(prev => ({ ...prev, allowPromo: !prev.allowPromo }))}
                            >
                                <div className="relative pt-1 pointer-events-none">
                                    <input
                                        type="checkbox"
                                        id="allowPromo"
                                        checked={formData.allowPromo}
                                        readOnly
                                        className="sr-only"
                                    />
                                    <div className={cn(
                                        "w-4 h-4 rounded-sm border transition-all duration-300 flex items-center justify-center",
                                        formData.allowPromo
                                            ? "bg-cyan-neon border-cyan-neon text-black"
                                            : "bg-transparent border-muted-foreground group-hover:border-cyan-neon"
                                    )}>
                                        {formData.allowPromo && <CheckCircle2 className="w-3 h-3" />}
                                    </div>
                                </div>
                                <label className="text-[11px] text-muted-foreground leading-snug cursor-pointer group-hover:text-cyan-neon/80 transition-colors font-mono pointer-events-none">
                                    Do you allow us to send you emails? We promise not to be annoying!
                                </label>
                            </div>

                            {/* Submit Button */}
                            <CyberActionButton
                                type="submit"
                                status={status}
                                defaultText="SEND MESSAGE"
                                submittingText="TRANSMITTING..."
                                successText="MESSAGE SENT"
                                errorText="TRANSMISSION FAILED"
                                className="mt-2 text-sm font-bold tracking-widest font-mono"
                            />

                        </form>
                    </div>

                    {/* Error Message - Appears Below or as Overlay */}
                    {status === "error" && (
                        <div className="mt-4 p-4 rounded-sm bg-red-950/40 border-l-2 border-red-500 backdrop-blur-md animate-in slide-in-from-top-2 fade-in duration-300">
                            <h3 className="text-red-400 font-bold mb-1 flex items-center gap-2 text-xs font-mono uppercase tracking-widest">
                                <Terminal className="w-3 h-3" />
                                Transmission Failed
                            </h3>
                            <p className="text-xs text-red-200/80 leading-relaxed font-mono mt-2">
                                {">"} Oops! Looks like the developer slacked off and didn't build the mail system yet.<br />
                                {">"} Please email manually at <span className="text-white font-bold select-all underline decoration-red-500/30 underline-offset-4">contact.mustafaguler@gmail.com</span><br />
                                {">"} Don't forget to remind him to get back to work!
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
