const eventMeta = {
  name: process.env.EVENT_NAME || "Eventify Nexus 2026",
  tagline: "A next-gen college fest where ideas, music, and makers collide.",
  date: process.env.EVENT_DATE || "2026-09-18",
  venue: process.env.EVENT_VENUE || "Innovation Arena, Main Campus",
  heroStats: [
    { label: "Students Expected", value: "4,500+" },
    { label: "Tracks", value: "09" },
    { label: "Workshops", value: "14" }
  ],
  schedule: [
    {
      time: "09:00 AM",
      title: "Immersive Opening Keynote",
      description: "A kinetic kickoff featuring live visuals, student showcases, and the headliner welcome."
    },
    {
      time: "11:00 AM",
      title: "Innovation Sprint",
      description: "Fast-paced ideation sessions across design, AI, robotics, and media storytelling."
    },
    {
      time: "02:00 PM",
      title: "Creator Panels",
      description: "Founders, alumni, and artists share career stories, growth playbooks, and behind-the-scenes lessons."
    },
    {
      time: "06:30 PM",
      title: "Concert + Awards",
      description: "Closing performances, spotlight recognitions, and the official attendance finale."
    }
  ],
  speakers: [
    {
      name: "Aarav Mehta",
      role: "Startup Operator",
      topic: "Building campus ideas into real products"
    },
    {
      name: "Sana Kapoor",
      role: "Creative Technologist",
      topic: "Designing immersive digital experiences"
    },
    {
      name: "Dev Malhotra",
      role: "AI Researcher",
      topic: "Practical AI workflows for student builders"
    }
  ]
};

module.exports = eventMeta;
