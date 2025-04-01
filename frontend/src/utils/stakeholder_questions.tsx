// src/utils/stakeholder_questions.ts
export const STAKEHOLDER_QUESTIONS = {
    fellow: [
      { label: "Name", type: "auto" }
    ],
    "fellow-parent": [
      { label: "Relation", type: "dropdown", options: ["Mother", "Father", "Guardian"] },
      { label: "Occupation", type: "dropdown", options: ["Farmer", "Tailor", "Teacher", "Housewife", "Labour", "Business", "Other"] }
    ],
    student: [
      { label: "Name", type: "text" },
      { label: "Class", type: "dropdown", options: ["3", "4", "5", "6", "7", "8", "Out of school"] }
    ],
    supporter: [
      { label: "Name", type: "text" },
      { label: "Relation", type: "dropdown", options: ["Friend", "Relative", "Volunteer", "Local Leader"] }
    ]
  }   



  
  

