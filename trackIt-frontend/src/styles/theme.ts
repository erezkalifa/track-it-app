const theme = {
  colors: {
    // צבעי רקע - גרדיאנט סגול-ורוד
    backgroundStart: "#a5b4fc", // סגול בהיר
    backgroundEnd: "#f0abfc", // ורוד בהיר
    background: "#ffffff",

    // צבעי טקסט
    text: "#334155", // אפור כהה
    textLight: "#64748b", // אפור בינוני

    // צבעי מערכת
    primary: "#6366f1", // אינדיגו
    primaryDark: "#4f46e5",
    secondary: "#64748b",
    secondaryDark: "#475569",
    danger: "#ef4444", // אדום
    error: "#ef4444", // Adding error color
    success: "#22c55e", // ירוק
    info: "#3b82f6", // כחול
    border: "#e2e8f0", // גבול בהיר

    // צבעי סטטוס
    status: {
      draft: "#e2e8f0", // אפור בהיר
      applied: "#3b82f6", // כחול
      interview: "#eab308", // צהוב
      offer: "#22c55e", // ירוק
      rejected: "#ef4444", // אדום
      withdrawn: "#94a3b8", // אפור
      pending: "#f59e0b", // כתום
    },
  },

  gradients: {
    // גרדיאנט לרקע האפליקציה
    background: `linear-gradient(
      135deg,
      #a5b4fc 0%,
      #f0abfc 100%
    )`,

    // גרדיאנט לכפתורים
    button: `linear-gradient(
      135deg,
      #f8fafc 0%,
      #f1f5f9 100%
    )`,
  },
} as const;

export default theme;
