/* Sample content — dental office designs. All services and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["dental"] = {
  noun: "dental office",
  kind: "Family dentistry",
  schemaType: "Dentist",
  description: "Checkups, cleanings, fillings and whitening for kids and adults. New patients welcome; book online or call us.",
  primary: ["See services", "calendar"],
  secondary: "call",
  nav: ["Services", "About", "Appointments", "Visit"],
  menu: {
    id: "services",
    eyebrow: "Services",
    heading: "Services & self-pay prices",
    intro: "Self-pay prices for patients without dental insurance. With insurance, we'll check your coverage before your visit.",
    all: "All services",
    footnote: "Your dentist explains your treatment options and costs before any work begins.",
    groups: [
      ["Checkups", [
        ["New patient exam & X-rays", "Exam, full X-rays and a treatment plan.", 129],
        ["Cleaning", "Routine cleaning and polish.", 99],
        ["Children's checkup", "Exam, cleaning and fluoride.", 89],
      ]],
      ["Treatment", [
        ["Tooth-colored filling", "Per tooth.", "From $150"],
        ["Crown", "", "From $1,050"],
        ["Emergency visit", "Same-day exam for pain or a broken tooth.", 95],
      ]],
      ["Cosmetic", [
        ["Teeth whitening", "In-office, one visit.", 350],
        ["Take-home whitening kit", "Custom trays and gel.", 225],
      ]],
    ],
  },
  about: {
    eyebrow: "About the practice",
    heading: "Calm visits, careful dentistry",
    text: [
      "{short} is a family dental office in {city}. We take time to explain what we see, show you your X-rays, and talk through options and costs before treatment.",
      "Nervous about the dentist? Tell us when you book, and we'll go at your pace.",
    ],
    highlights: [
      ["Costs explained first", "Know your options and prices before treatment."],
      ["Families welcome", "Kids and adults in the same visit."],
      ["Insurance help", "We check your coverage before you come in."],
    ],
    gallery: "Our office",
  },
  actions: {
    id: "appointments",
    eyebrow: "Appointments",
    heading: "Book a visit",
    intro: "Request an appointment online, or call us during office hours.",
    groups: [
      ["Appointments", [
        ["Request an appointment", "calendar", true, "On a real site, this opens the practice's online scheduling page."],
        ["New patient forms", "clipboard", false, "On a real site, this opens the practice's secure online forms."],
      ]],
      ["Talk to us", [
        ["Call the office", "phone", false, "tel"],
      ]],
    ],
  },
  contact: { eyebrow: "Visit", call: "Call the office", note: "Free parking and step-free access at the front entrance." },
  hours: ["mon-thu 08:00-17:00; fri 08:00-13:00", "Closed on weekends."],
  photos: {
    heroes: ["Bright, modern dental treatment chair", "Dentist checking a young patient's teeth"],
    gallery: [
      ["Sterilized instruments", "Tray of sterilized dental instruments"],
      ["Cleanings & checkups", "Dental tools laid out on a tray by a window"],
      ["Treatment rooms", "Dental treatment room with a chair and cabinets"],
    ],
  },
};
