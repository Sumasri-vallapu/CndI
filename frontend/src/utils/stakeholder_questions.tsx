// src/utils/stakeholder_questions.ts
export interface StakeholderQuestion {
  label: string;
  type: string;
  options?: string[];
  placeholder?: string;
}

export interface StakeholderQuestions {
  fellow: StakeholderQuestion[];
  fellow_parent: StakeholderQuestion[];
  child: StakeholderQuestion[];
  childs_parent: StakeholderQuestion[];
  supporter: StakeholderQuestion[];
  [key: string]: StakeholderQuestion[];  // Index signature
}

export const STAKEHOLDER_QUESTIONS: StakeholderQuestions = {
  fellow: [
    { label: "Name", type: "text" },
    { label: "Experience", type: "text", placeholder: "Share your experience as a fellow" }
  ],
  fellow_parent: [
    { label: "Name", type: "text" },
    { label: "Relation", type: "dropdown", options: ["Mother", "Father", "Guardian"] },
    { label: "Occupation", type: "dropdown", options: ["Farmer", "Tailor", "Teacher", "Housewife", "Labour", "Business", "Other"] },
    { label: "Feedback", type: "text", placeholder: "Share your thoughts about your child being a fellow" }
  ],
  child: [
    { label: "Name", type: "text" },
    { label: "Age", type: "text" },
    { label: "Class", type: "dropdown", options: ["3", "4", "5", "6", "7", "8", "Out of school"] },
    { label: "Experience", type: "text", placeholder: "Share your experience at the Learning Center" }
  ],
  childs_parent: [
    { label: "Name", type: "text" },
    { label: "Child's Name", type: "text" },
    { label: "Relation", type: "dropdown", options: ["Mother", "Father", "Guardian"] },
    { label: "Feedback", type: "text", placeholder: "Share your thoughts about the Learning Center" }
  ],
  supporter: [
    { label: "Name", type: "text" },
    { label: "Relation", type: "dropdown", options: ["Friend", "Relative", "Volunteer", "Local Leader"] },
    { label: "Feedback", type: "text", placeholder: "Share your thoughts about the fellow's work" }
  ]
};   



  
  

