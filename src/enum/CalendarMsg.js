const CalendarMsg = {
  NEVER: "NEVER",
  ALWAYS: "ALWAYS",
  DATE_FINISHED: "DATE_FINISHED"
};

CalendarMsg.values = Object.keys(CalendarMsg).map(k => CalendarMsg[k]);

export default Object.freeze(CalendarMsg);