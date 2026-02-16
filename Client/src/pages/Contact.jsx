import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground">
            Have a question? Reach out to our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info Cards */}
          <div className="space-y-8">
            {[
              {
                icon: <Mail className="w-6 h-6 text-primary" />,
                title: "Email",
                info: "CartSyy@gmail.com",
              },
              {
                icon: <Phone className="w-6 h-6 text-primary" />,
                title: "Phone",
                info: "+91 7079839554",
              },
              {
                icon: <MapPin className="w-6 h-6 text-primary" />,
                title: "Address",
                info: "Bengaluru, Karnataka, India",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-4 glass-card hover:glow-on-hover p-4 rounded-xl shadow-md transition-all"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-primary/20 rounded-full">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.info}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="glass-card p-8 rounded-xl shadow-md hover:glow-on-hover transition-all">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                required
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none"
                required
              />

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 p-3 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover font-semibold transition-all"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
