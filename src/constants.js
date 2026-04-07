export const TEXT = "TEXT";
export const OPTIONS_RADIO = "OPTIONS_RADIO";
export const OPTIONS_MULTI = "OPTIONS_MULTI";

export const EQUALS_OPERATOR = "EQUALS_OPERATOR";
export const NOT_EQUALS_OPERATOR = "NOT_EQUALS_OPERATOR";
export const CONTAINS_OPERATOR = "CONTAINS_OPERATOR";
export const ONE_OF_OPERATOR = "ONE_OF_OPERATOR";
export const NOT_ONE_OF_OPERATOR = "NOT_ONE_OF_OPERATOR";

export const QUESTION_TYPES = [TEXT, OPTIONS_RADIO, OPTIONS_MULTI];

export const ADMIN_NAVIGATION = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { key: "surveys", label: "Surveys", icon: "poll", href: "/surveys" },
  { key: "students", label: "Audience", icon: "group", href: "/students" },
  { key: "profile", label: "Profile", icon: "manage_accounts", href: "/profile" },
];
