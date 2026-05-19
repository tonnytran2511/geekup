# Decision Log

## [20:15] - analyze the problem

## Read the problem then realized everything was so new to me

How could I solve this problem without knowing anything?
First option came up: Asking AI (Gemini & TRAE SOLO) to analyze and code the requirement then sketch steps to solve the problem.

---

I asked both GEMINI and TRAE SOLO with a prompt1:
[Uploading the "Product Frontend - Technical Assessment GI Summer 2026" file] "Cho mình bước từng bước làm step by step để hoàn thành yêu cầu này"

The responses:
[GEMINI's response1 for prompt1 is ./AI_prompt/GEMINI_response1.md]
[TRAE SOLO's response1 for prompt1 is ./AI_prompt/TRAE_response1.md]

I chose to do following Gemini cause I compared the two reponses, I realized `the first` step that `TRAE` told me to do (MOCK APIs) was similar to `the second` step that `GEMINI` told me to do (THIẾT KẾ MOCK API VỚI MOCKOON), which means GEMINI gave a more detailed instruction. Additionally, I did also know that I needed to create a project folder before doing anything.
=> I chose to do following GEMINI - creating folder

---

Finshing step 1, I proceeded to step 2, I asked GEMINI to explain more details about step 2 - THIẾT KẾ MOCK API VỚI MOCKOON, because I had never worked with MOCKOON before.

GEMINI prompt2:
hướng dẫn làm bước 2 một cách chi tiết

The response:
[GEMINI's response2 for prompt2 is ./AI_prompt/GEMINI_response2.md]

Then I remembered the mockoon-data.json that TRAE gave me in prompt1, and TRAE was created specially for programming so I was back to TRAE, copied the mockoon-data.json, pasted it to GEMINI and told it to check the code.

---

The code was really good, however, I want to export the mockoon-data.json by myself, by using MOCKOON, so I told GEMINI to show me step by step how to create the mockoon-data.json from MOCKOON. It told me to create routes, after finishing creating all the routes, MOCKOON created the mockoon-data.json automatically, I just came to the folder where the mockoon-data.json was stored to get it. Then I got this:

[images of the results is in ./Result_images/MOCKOON]

Step 2 - done, moving to step 3 (KHỞI TẠO VÀ XÂY DỰNG FRONTEND (REACT / VITE))

---

I asked GEMINI to check the mockoon-data.json, then, it told me to keep doing with step 3.

GEMINI prompt3:
[Uploading the code form mockoon-data.json] check the code.

The response:
[GEMINI's response3 for prompt3 is ./AI_prompt/GEMINI_response3.md]

---

when I run the terminal commands in GEMINI_response3, I encountered 1 problem while running "npx tailwindcss init -p", due to some conflicts:

"tranminhtuong@Tran-Minh-Tuongs-MacBook-Pro frontend % npx tailwindcss init -p
npm error could not determine executable to run
npm error A complete log of this run can be found in: /Users/tranminhtuong/.npm/\_logs/2026-05-18T17_04_55_488Z-debug-0.log"

Therefore, I created `tailwind.config.js` and `postcss.config.js` manually following GEMINI's instruction.

GEMINI prompt4:
[Uploading the error] fix.

The response:
[GEMINI's response4 for prompt4 is ./AI_prompt/GEMINI_response4.md]
