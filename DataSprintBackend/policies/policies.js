const policySynonyms = {
    leave: ["leave", "holiday", "vacation", "time off", "absence"],
    casual: ["casual leave", "short leave"],
    sick: ["sick leave", "medical leave", "doctor note", "illness"],
    maternity: ["maternity leave", "pregnancy leave", "childbirth leave"],
    paternity: ["paternity leave", "father leave", "dad leave"],
    
    hours: ["working hours", "office time", "shift", "duty hours"],
    attendance: ["attendance", "check in", "check out", "biometric"],
    
    remote: ["remote work", "wfh", "work from home", "home office", "telework"],
    
    travel: ["travel", "trip", "tour", "business travel", "official trip"],
    reimbursement: ["reimbursement", "claim", "expenses", "compensation"],
    
    salary: ["salary", "pay", "compensation", "wages"],
    bonus: ["bonus", "incentive", "performance pay"],
    insurance: ["insurance", "health coverage", "medical policy"],
    
    hr: ["hr", "human resources", "hr support", "hr email"],
    grievance: ["grievance", "complaint", "issue", "problem"],
    
    harassment: ["harassment", "bullying", "discrimination", "abuse"],
    
    security: ["security", "data safety", "cybersecurity", "protection"],
    password: ["password", "credentials", "login", "authentication"],
    
    resignation: ["resignation", "quit", "exit", "termination", "separation"],
    notice: ["notice period", "notice", "serving period"],
    relieving: ["relieving", "clearance", "final settlement"],
};


const policyFileMap = {
    leave: "leavePpolicy.txt",
    casual: "leavePolicy.txt",
    sick: "leavePolicy.txt",
    maternity: "leavePolicy.txt",
    paternity: "leavePolicy.txt",

    hours: "workingHours.txt",
    attendance: "workingHours.txt",

    remote: "remoteWork.txt",

    travel: "expenseTravel.txt",
    reimbursement: "expenseTravel.txt",

    salary: "benefitsCompensation.txt",
    bonus: "benefitsCompensation.txt",
    insurance: "benefitsCompensation.txt",

    hr: "emergencyHR.txt",
    grievance: "emergencyHR.txt",

    harassment: "codeOfConduct.txt",

    security: "itSecurity.txt",
    password: "itSecurity.txt",

    resignation: "resignationExit.txt",
    notice: "resignationExit.txt",
    relieving: "resignationExit.txt",
};

module.exports = {policyFileMap , policySynonyms}