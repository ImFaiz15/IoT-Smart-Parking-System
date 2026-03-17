import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

export function FeedbackForm() {
  const [feedback, setFeedback] = useState({ subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.subject || !feedback.message) {
      toast.error("Please fill all fields");
      return;
    }
    toast.success("Feedback submitted! Thank you.");
    setFeedback({ subject: "", message: "" });
  };

  return (
    <div className="glass-card p-5">
      <h3 className="font-display font-semibold text-foreground flex items-center gap-2 mb-3">
        <MessageSquare className="h-4 w-4 text-primary" /> Feedback
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="subject" className="text-xs">Subject</Label>
          <Input id="subject" value={feedback.subject} onChange={(e) => setFeedback({ ...feedback, subject: e.target.value })} placeholder="Issue or suggestion" />
        </div>
        <div>
          <Label htmlFor="message" className="text-xs">Message</Label>
          <Textarea id="message" value={feedback.message} onChange={(e) => setFeedback({ ...feedback, message: e.target.value })} placeholder="Tell us more..." rows={3} />
        </div>
        <Button type="submit" variant="outline" className="w-full">Submit Feedback</Button>
      </form>
    </div>
  );
}
