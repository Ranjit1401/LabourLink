// src/utils/i18n.ts

export type Language = "en" | "hi" | "mr" | "ta" | "te" | "gu" | "bn";

export const LANGUAGES: { code: Language; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English",   nativeLabel: "English"  },
  { code: "hi", label: "Hindi",     nativeLabel: "हिन्दी"   },
  { code: "mr", label: "Marathi",   nativeLabel: "मराठी"    },
  { code: "ta", label: "Tamil",     nativeLabel: "தமிழ்"    },
  { code: "te", label: "Telugu",    nativeLabel: "తెలుగు"   },
  { code: "gu", label: "Gujarati",  nativeLabel: "ગુજરાતી"  },
  { code: "bn", label: "Bengali",   nativeLabel: "বাংলা"    },
];

export type TranslationKey =
  | "home" | "connections" | "jobs" | "profile" | "signIn"
  | "availableJobs" | "noRolesFound" | "searchByRole" | "searchByCompany"
  | "refineSearch" | "skillset" | "clearFilters"
  | "carpentry" | "plumbing" | "electrical" | "hvac" | "masonry" | "painting"
  | "verifiedProfile";

type Translations = Record<TranslationKey, string>;

export const translations: Record<Language, Translations> = {
  en: {
    home: "Home", connections: "Connections", jobs: "Jobs", profile: "Profile", signIn: "Sign In",
    availableJobs: "Available Jobs", noRolesFound: "0 roles found matching your criteria.",
    searchByRole: "Search by role...", searchByCompany: "Search by company...",
    refineSearch: "Refine Search", skillset: "SKILLSET", clearFilters: "Clear Filters",
    carpentry: "Carpentry", plumbing: "Plumbing", electrical: "Electrical",
    hvac: "HVAC", masonry: "Masonry", painting: "Painting",
    verifiedProfile: "YOUR PROFILE IS VERIFIED. YOU HAVE ACCESS TO PREMIUM LISTINGS.",
  },
  hi: {
    home: "होम", connections: "कनेक्शन", jobs: "नौकरियाँ", profile: "प्रोफ़ाइल", signIn: "साइन इन",
    availableJobs: "उपलब्ध नौकरियाँ", noRolesFound: "आपके मानदंड से मेल खाती 0 भूमिकाएँ मिलीं।",
    searchByRole: "भूमिका से खोजें...", searchByCompany: "कंपनी से खोजें...",
    refineSearch: "खोज परिष्कृत करें", skillset: "कौशल", clearFilters: "फ़िल्टर साफ़ करें",
    carpentry: "बढ़ईगीरी", plumbing: "नलसाजी", electrical: "बिजली",
    hvac: "एचवीएसी", masonry: "राजमिस्त्री", painting: "पेंटिंग",
    verifiedProfile: "आपकी प्रोफ़ाइल सत्यापित है। आपके पास प्रीमियम लिस्टिंग तक पहुँच है।",
  },
  mr: {
    home: "मुख्यपृष्ठ", connections: "कनेक्शन", jobs: "नोकऱ्या", profile: "प्रोफाइल", signIn: "साइन इन",
    availableJobs: "उपलब्ध नोकऱ्या", noRolesFound: "तुमच्या निकषांशी जुळणाऱ्या 0 भूमिका आढळल्या.",
    searchByRole: "भूमिकेनुसार शोधा...", searchByCompany: "कंपनीनुसार शोधा...",
    refineSearch: "शोध परिष्कृत करा", skillset: "कौशल्यसंच", clearFilters: "फिल्टर साफ करा",
    carpentry: "सुतारकाम", plumbing: "प्लंबिंग", electrical: "विद्युत",
    hvac: "एचव्हीएसी", masonry: "गवंडीकाम", painting: "रंगकाम",
    verifiedProfile: "तुमची प्रोफाइल सत्यापित आहे. तुम्हाला प्रीमियम लिस्टिंगचा अ‍ॅक्सेस आहे.",
  },
  ta: {
    home: "முகப்பு", connections: "இணைப்புகள்", jobs: "வேலைகள்", profile: "சுயவிவரம்", signIn: "உள்நுழை",
    availableJobs: "கிடைக்கும் வேலைகள்", noRolesFound: "உங்கள் தேடலுக்கு பொருந்தும் பதவிகள் எதுவும் இல்லை.",
    searchByRole: "பதவி மூலம் தேடு...", searchByCompany: "நிறுவனம் மூலம் தேடு...",
    refineSearch: "தேடலை மேம்படுத்து", skillset: "திறன்கள்", clearFilters: "வடிகட்டிகளை அழி",
    carpentry: "தச்சுவேலை", plumbing: "குழாய் வேலை", electrical: "மின்சாரம்",
    hvac: "எச்வீஏசி", masonry: "கட்டுமானம்", painting: "வண்ணம்",
    verifiedProfile: "உங்கள் சுயவிவரம் சரிபார்க்கப்பட்டது. நீங்கள் பிரீமியம் பட்டியல்களை அணுகலாம்.",
  },
  te: {
    home: "హోమ్", connections: "కనెక్షన్లు", jobs: "ఉద్యోగాలు", profile: "ప్రొఫైల్", signIn: "సైన్ ఇన్",
    availableJobs: "అందుబాటులో ఉన్న ఉద్యోగాలు", noRolesFound: "మీ అభ్యర్థనకు సరిపడే పాత్రలు ఏవీ కనుగొనబడలేదు.",
    searchByRole: "పాత్ర ద్వారా వెతకండి...", searchByCompany: "కంపెనీ ద్వారా వెతకండి...",
    refineSearch: "శోధనను మెరుగుపరచండి", skillset: "నైపుణ్యాలు", clearFilters: "ఫిల్టర్లు క్లియర్ చేయి",
    carpentry: "వడ్రంగి పని", plumbing: "ప్లంబింగ్", electrical: "విద్యుత్",
    hvac: "హెచ్‌వీఏసీ", masonry: "రాతి పని", painting: "రంగు వేయడం",
    verifiedProfile: "మీ ప్రొఫైల్ ధృవీకరించబడింది. మీకు ప్రీమియమ్ జాబితాలకు యాక్సెస్ ఉంది.",
  },
  gu: {
    home: "હોમ", connections: "કનેક્શન્સ", jobs: "નોકરીઓ", profile: "પ્રોફાઇલ", signIn: "સાઇન ઇન",
    availableJobs: "ઉપલબ્ધ નોકરીઓ", noRolesFound: "તમારા માપદંડ સાથે મેળ ખાતી 0 ભૂમિકાઓ મળી.",
    searchByRole: "ભૂમિકા દ્વારા શોધો...", searchByCompany: "કંપની દ્વારા શોધો...",
    refineSearch: "શોધ સુધારો", skillset: "કૌશલ્ય", clearFilters: "ફિલ્ટર સાફ કરો",
    carpentry: "સુથારી", plumbing: "પ્લમ્બિંગ", electrical: "વિદ્યુત",
    hvac: "એચવીએસી", masonry: "ચણતર", painting: "રંગકામ",
    verifiedProfile: "તમારી પ્રોફાઇલ ચકાસાઈ છે. તમને પ્રીમિયમ લિસ્ટિંગ્સ ઍક્સેસ છે.",
  },
  bn: {
    home: "হোম", connections: "সংযোগ", jobs: "চাকরি", profile: "প্রোফাইল", signIn: "সাইন ইন",
    availableJobs: "উপলব্ধ চাকরি", noRolesFound: "আপনার মানদণ্ড অনুযায়ী ০টি ভূমিকা পাওয়া গেছে।",
    searchByRole: "ভূমিকা দিয়ে খুঁজুন...", searchByCompany: "কোম্পানি দিয়ে খুঁজুন...",
    refineSearch: "অনুসন্ধান পরিমার্জন করুন", skillset: "দক্ষতা", clearFilters: "ফিল্টার মুছুন",
    carpentry: "কাঠমিস্ত্রি", plumbing: "প্লাম্বিং", electrical: "বৈদ্যুতিক",
    hvac: "এইচভিএসি", masonry: "রাজমিস্ত্রি", painting: "রং করা",
    verifiedProfile: "আপনার প্রোফাইল যাচাই করা হয়েছে। আপনার প্রিমিয়াম তালিকায় অ্যাক্সেস আছে।",
  },
};

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang][key] ?? translations["en"][key];
}