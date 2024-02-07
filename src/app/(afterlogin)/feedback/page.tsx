import FeedbackForm from "./feedback-form";

export default async function FeedbackPage() {
  return (
    <div className="p-4">
      <FeedbackForm />
    </div>
  );
}

export const Visitings = [
  "morning",
  "afternoon",
  "evening_snacks",
  "dinner",
] as const;
