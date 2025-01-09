import { useState } from "react";
import Title from "../components/Title";
import { Helmet } from "react-helmet-async";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What does this platform offer?",
      answer:
        "Our platform helps users find, buy, rent, and sell properties effortlessly. With a wide variety of listings and user-friendly tools, we simplify the property management process.",
    },
    {
      question: "How do I create an account?",
      answer:
        "To create an account, click on 'Sign In' at the top right corner. You can continue with your Google account or create a new account. Fill out the form with your name, email, and a password (at least 8 characters, including letters and numbers). Verify your account through the link sent to your email, then log in to access your profile.",
    },
    {
      question: "Is this platform free to use?",
      answer: "Yes, our platform is completely free and offers unlimited access to its features.",
    },
    {
      question: "How can I contact property owners?",
      answer:
        "You can contact property owners directly through the 'Contact' button on the property details page. This will open your email app with the owner’s email address and a pre-filled subject line based on the property details.",
    },
    {
      question: "Can I edit or delete my property listings?",
      answer:
        "Yes, you can edit or delete your property listings anytime from your profile dashboard after logging in.",
    },
    {
      question: "How can I feature my property as a 'Top Property' on the homepage?",
      answer:
        "'Top Properties' on the homepage are automatically displayed based on the number of views each property receives.",
    },
    {
      question: "How do I change my password?",
      answer:
        "If you signed up using email verification (not through Google), you can change your password from your profile dashboard after logging in.",
    },
    {
      question: "How do I recover my password?",
      answer:
        "On the 'Sign In' page, click 'Forgot Password?' and follow the instructions. A recovery link will be sent to your registered email address.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10">
      <Helmet>
        <title>Frequently Asked Questions | WDA Real Estate</title>
      </Helmet>
      <Title
        title={"Frequently Asked Questions"}
        subTitle={"Discover answers to the most commonly asked questions about our real estate"}
      />
      <div className="space-y-4 mt-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-highlightGray/20 pb-4 cursor-pointer"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center text-lg text-primary">
              <span>{faq.question}</span>
              <span>{activeIndex === index ? "-" : "+"}</span>
            </div>
            {activeIndex === index && (
              <div className="mt-2 font-light text-primary">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
