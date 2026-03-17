import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-display font-bold text-foreground">Contact Us</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Mail, label: "Email", value: "support@iotsps.com" },
          { icon: Phone, label: "Phone", value: "+91 9560544527" },
          { icon: MapPin, label: "Location", value: "Gurgaon, India" },
        ].map((item) => (
          <div key={item.label} className="glass-card p-4 text-center">
            <item.icon className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-sm font-medium text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="c-name">Name</Label>
            <Input id="c-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
          </div>
          <div>
            <Label htmlFor="c-email">Email</Label>
            <Input id="c-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
          </div>
        </div>
        <div>
          <Label htmlFor="c-msg">Message</Label>
          <Textarea id="c-msg" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" rows={4} />
        </div>
        <Button type="submit">Send Message</Button>
      </form>
    </div>
  );
}
