// src/faq/faqData.js
const faqData = [
    {
      id: 1,
      question: "How can you change the sequence of the gauge curves?",
      answer: "Drag en Drop te gauge where you want and this will be the sequence going forward. This is a personal setting.",
    },
    {
      id: 2,
      question: "Are there different types of users that can access Infocare?",
      answer: "Yes, there are 2 types of users:\nGuest : can see monitoring and environment and can create and follow up support tickets.\nAdministrators : has the same possibility’s as the quest but is also able to\nAdd/change/delete users\nRetrieve ILMT reports\nRetrieve Quarter reports\nChange configuration settings",
    },
    {
      id: 3,
      question: "Can I exclude tables/Indexes/Views for the comparisons between environments?",
      answer: "An administrator can exclude tables and schema’s in the configuration section. This does have a effect for all users and can be specified per environment.",
    },
    {
      id: 4,
      question: "Can I request a comparison between environments per schema?",
      answer: "No, comparisons are always made for all schema’s in the database.",
    },
    {
      id: 5,
      question: "Can I make exclusions resulting in less objects?",
      answer: "Yes, an administrator can set rules at a database level of objects that will not be counted in the objects section. These settings will be valid for all quests and is not a personal setting but and environment setting.",
    },
    {
      id: 6,
      question: "What are the values for the CPU graph?",
      answer: "The overall processor usage on this host including kernel processing time, expressed as a percentage.",
    },
    {
      id: 7,
      question: "What are the values for the CPU wait graph?",
      answer: "Time spent waiting for IO (Linux, UNIX); time spent receiving and servicing hardware interrupts (Windows), expressed in processor ticks. Reported for Windows, AIX and Linux systems only. This measurement represents the aggregate for all processors on the system.",
    },
    {
      id: 8,
      question: "What is the “SWAP” graph?",
      answer: "The number of pages swapped out to disk since system startup. Reported for AIX® and Linux® systems only.",
    },
    {
      id: 9,
      question: "What is the BP Hitratio” graph?",
      answer: "Bufferpool hitratio expressed in percentage.",
    },
    {
      id: 10,
      question: "What is the BP Read” graph?",
      answer: "Summ of all bufferpool read pages per minute.",
    },
    {
      id: 11,
      question: "What is the “TS Read” graph?",
      answer: "Indicates the total amount of time spent reading in data and index pages from the table space containers (physical) for all types of table spaces. This value is given in milliseconds.",
    },
    {
      id: 12,
      question: "What is the “TS Write” graph?",
      answer: "Cumulative elapsed time for each write to complete.",
    },
    {
      id: 13,
      question: "What does the “UID STMTS” graph represent?",
      answer: "The number of UPDATE, INSERT, MERGE and DELETE statements that were executed per interval of 15 seconds.",
    },
    {
      id: 14,
      question: "What does the “Select STMTS” graph represent?",
      answer: "The number of SQL SELECT statements that were executed per interval of 15 seconds.",
    },
    {
      id: 15,
      question: "Whats does the “Rows” graph represent?",
      answer: "The rows_returned monitor element is the number of rows that have been selected and returned to the application per interval of 15 seconds.",
    },
    {
      id: 16,
      question: "What does the “Cache” graph represent?",
      answer: "The total number of times that a requested section was not available for use and had to be loaded into the package cache. This count includes any implicit prepares performed by the system.",
    },
    {
      id: 17,
      question: "Whats does WL processing” represent?",
      answer: "The total amount of time spent working on requests. This value is reported in milliseconds.",
    },
    {
      id: 18,
      question: "Whats does the “WL Wait” graph represent?",
      answer: "The total time spent waiting within the database server. The value is in milliseconds.",
    },
    {
      id: 19,
      question: "What does the “WL Lock” graph represent?",
      answer: "The number of times that a request to lock an object timed out instead of being granted.",
    },
    {
      id: 20,
      question: "What does the “WL Deadlocks” graph represent?",
      answer: "The total number of deadlocks that have occurred per interval of 15 seconds.",
    },
  ];
  
  export default faqData;