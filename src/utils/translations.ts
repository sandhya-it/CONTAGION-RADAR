import { LanguageCode } from '../types';

export interface TranslationDict {
  appName: string;
  tagline: string;
  disclaimerBadge: string;
  disclaimerFull: string;
  msmeMode: string;
  commandCenter: string;
  businessHealthScore: string;
  riskLevels: {
    GREEN: string;
    YELLOW: string;
    ORANGE: string;
    RED: string;
  };
  metrics: {
    moneyWaiting: string;
    overdueAmount: string;
    daysOverdue: string;
    operatingCoverage: string;
    daysOfCash: string;
    buyerConcentration: string;
    supplierDependency: string;
    currentRisk: string;
    topWarning: string;
    downstreamAffected: string;
    recommendedActions: string;
  };
  actionFramework: {
    whatHappened: string;
    whyItMatters: string;
    whatCouldHappen: string;
    whatShouldIDo: string;
  };
  buttons: {
    simulateShock: string;
    explainMyRisk: string;
    voiceInput: string;
    generateReminder: string;
    runSimulation: string;
    applyMitigation: string;
    demoTour: string;
    addInvoice: string;
    viewGraph: string;
    withoutIntervention: string;
    withIntervention: string;
  };
  plainSummaryExample: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDict> = {
  en: {
    appName: 'CONTAGION RADAR',
    tagline: 'Predict SME Supply Chain Financial Shockwaves',
    disclaimerBadge: 'SIMULATED / MODEL OUTPUT',
    disclaimerFull:
      'Simulation results are model outputs based on configured assumptions and should not be interpreted as guaranteed financial forecasts.',
    msmeMode: 'MSME Mode (Simple)',
    commandCenter: 'Command Center (Advanced)',
    businessHealthScore: 'Business Health Score',
    riskLevels: {
      GREEN: 'Normal (Safe)',
      YELLOW: 'Warning',
      ORANGE: 'High Risk',
      RED: 'Critical Risk',
    },
    metrics: {
      moneyWaiting: 'Money Waiting to be Received',
      overdueAmount: 'Overdue Payment Amount',
      daysOverdue: 'Days Overdue',
      operatingCoverage: 'Operating Expense Runway',
      daysOfCash: 'days of cash buffer',
      buyerConcentration: 'Buyer Concentration',
      supplierDependency: 'Supplier Dependency',
      currentRisk: 'Current Risk Status',
      topWarning: 'Top Early Warning',
      downstreamAffected: 'Businesses Potentially Affected',
      recommendedActions: 'Recommended Preventive Actions',
    },
    actionFramework: {
      whatHappened: 'WHAT HAPPENED?',
      whyItMatters: 'WHY IT MATTERS?',
      whatCouldHappen: 'WHAT COULD HAPPEN?',
      whatShouldIDo: 'WHAT SHOULD I DO NOW?',
    },
    buttons: {
      simulateShock: 'Simulate Payment Shock',
      explainMyRisk: 'Explain My Risk (Voice / AI)',
      voiceInput: 'Voice Invoice Entry',
      generateReminder: 'Generate Payment Reminder',
      runSimulation: 'Run Full Network Simulation',
      applyMitigation: 'Mitigation Mode',
      demoTour: '2-Minute Judge Demo Tour',
      addInvoice: 'Add Invoice',
      viewGraph: 'View Supply Chain Graph',
      withoutIntervention: 'WITHOUT INTERVENTION',
      withIntervention: 'WITH INTERVENTION',
    },
    plainSummaryExample:
      '₹10 lakh payment is 60 days overdue from your top buyer. This is severely cutting into your daily working capital and may soon force you to delay payments to your own suppliers.',
  },

  ta: {
    appName: 'கான்டேஜியன் ரேடார் (Contagion Radar)',
    tagline: 'சிறு மற்றும் நடுத்தர வணிகங்களின் நிதி நெருக்கடி முன்னறிவிப்பு',
    disclaimerBadge: 'மாதிரி வெளியீடு / உருவகப்படுத்தப்பட்டது',
    disclaimerFull:
      'உருவகப்படுத்துதல் முடிவுகள் மாதிரி வெளியீடுகள் மட்டுமே; இவை உத்தரவாதமான நிதி கணிப்புகள் அல்ல.',
    msmeMode: 'MSME முறை (எளிய பார்வை)',
    commandCenter: 'கட்டளை மையம் (ஆய்வாளர் பார்வை)',
    businessHealthScore: 'வணிக ஆரோக்கிய மதிப்பீடு',
    riskLevels: {
      GREEN: 'இயல்பு (பாதுகாப்பானது)',
      YELLOW: 'எச்சரிக்கை',
      ORANGE: 'அதிக ஆபத்து',
      RED: 'முக்கிய ஆபத்து (தீவிரம்)',
    },
    metrics: {
      moneyWaiting: 'வர வேண்டிய நிலுவைத் தொகை',
      overdueAmount: 'காலாவதியான நிலுவைத் தொகை',
      daysOverdue: 'தாமதமான நாட்கள்',
      operatingCoverage: 'இயக்க செலவுக்கான கையிருப்பு',
      daysOfCash: 'நாட்கள் ரொக்க இருப்பு',
      buyerConcentration: 'ஒரே வாடிக்கையாளர் சார்பு',
      supplierDependency: 'வழங்குநர் சார்பு',
      currentRisk: 'தற்போதைய ஆபத்து நிலை',
      topWarning: 'முக்கிய முன்னெச்சரிக்கை',
      downstreamAffected: 'பாதிக்கப்படக்கூடிய பிற வணிகங்கள்',
      recommendedActions: 'பரிந்துரைக்கப்பட்ட தடுப்பு நடவடிக்கைகள்',
    },
    actionFramework: {
      whatHappened: 'என்ன நடந்தது?',
      whyItMatters: 'இது ஏன் முக்கியமானது?',
      whatCouldHappen: 'என்ன நேரிடலாம்?',
      whatShouldIDo: 'இப்போது நான் என்ன செய்ய வேண்டும்?',
    },
    buttons: {
      simulateShock: 'பண தாமத அதிர்வை உருவகப்படுத்து',
      explainMyRisk: 'எனது ஆபத்தை விளக்குங்கள் (குரல் / AI)',
      voiceInput: 'குரல் மூலம் ரசீது பதிவு',
      generateReminder: 'கட்டண நினைவூட்டல் உருவாக்கு',
      runSimulation: 'முழு சங்கிலி உருவகப்படுத்துதல்',
      applyMitigation: 'தடுப்பு நடவடிக்கை முறை',
      demoTour: '2 நிமிட நடுவர் செயல்விளக்கம்',
      addInvoice: 'புதிய ரசீது சேர்க்க',
      viewGraph: 'விநியோக சங்கிலி வரைபடம்',
      withoutIntervention: 'நடவடிக்கை இல்லாத நிலை',
      withIntervention: 'நடவடிக்கையுடன் கூடிய நிலை',
    },
    plainSummaryExample:
      'முக்கிய வாடிக்கையாளரிடமிருந்து ₹10 லட்சம் கட்டணம் 60 நாட்கள் தாமதமாகியுள்ளது. இது உங்கள் செயல்பாட்டு மூலதனத்தை குறைத்து உங்கள் சப்ளையர்களுக்கு பணம் வழங்குவதிலும் தாமதத்தை ஏற்படுத்தலாம்.',
  },

  hi: {
    appName: 'कंटेजियन रडार (Contagion Radar)',
    tagline: 'एमएसएमई आपूर्ति श्रृंखला वित्तीय संकट पूर्व-चेतावनी',
    disclaimerBadge: 'मॉडल आउटपुट / सिमुलेटेड',
    disclaimerFull:
      'सिमुलेशन परिणाम मॉडल आउटपुट हैं और इन्हें वित्तीय गारंटी के रूप में न समझें।',
    msmeMode: 'एमएसएमई मोड (सरल)',
    commandCenter: 'कमांड सेंटर (उन्नत)',
    businessHealthScore: 'व्यापार स्वास्थ्य स्कोर',
    riskLevels: {
      GREEN: 'सामान्य (सुरक्षित)',
      YELLOW: 'चेतावनी',
      ORANGE: 'उच्च जोखिम',
      RED: 'गंभीर संकट',
    },
    metrics: {
      moneyWaiting: 'आने वाली कुल बकाया राशि',
      overdueAmount: 'समय सीमा पार बकाया',
      daysOverdue: 'विलंब के दिन',
      operatingCoverage: 'कार्यशील पूंजी कवरेज',
      daysOfCash: 'दिनों का कैश बैकअप',
      buyerConcentration: 'खरीदार पर निर्भरता',
      supplierDependency: 'आपूर्तिकर्ता निर्भरता',
      currentRisk: 'वर्तमान जोखिम स्थिति',
      topWarning: 'शीर्ष पूर्व चेतावनी',
      downstreamAffected: 'प्रभावित होने वाले अन्य व्यवसाय',
      recommendedActions: 'सुझाए गए निवारक उपाय',
    },
    actionFramework: {
      whatHappened: 'क्या हुआ?',
      whyItMatters: 'यह महत्वपूर्ण क्यों है?',
      whatCouldHappen: 'आगे क्या हो सकता है?',
      whatShouldIDo: 'मुझे अब क्या करना चाहिए?',
    },
    buttons: {
      simulateShock: 'भुगतान झटके का सिमुलेशन करें',
      explainMyRisk: 'मेरा जोखिम समझाएं (आवाज / AI)',
      voiceInput: 'आवाज द्वारा इनवॉइस दर्ज करें',
      generateReminder: 'भुगतान रिमाइंडर बनाएं',
      runSimulation: 'नेटवर्क सिमुलेशन चलाएं',
      applyMitigation: 'निवारण मोड',
      demoTour: '2-मिनट जज डेमो टूर',
      addInvoice: 'इनवॉइस जोड़ें',
      viewGraph: 'सप्लाई चेन नेटवर्क ग्राफ',
      withoutIntervention: 'बिना किसी उपाय के',
      withIntervention: 'उपाय लागू करने के बाद',
    },
    plainSummaryExample:
      'मुख्य खरीदार से ₹10 लाख का भुगतान 60 दिनों से अटका हुआ है। इससे आपकी दैनिक कार्यशील पूंजी पर भारी दबाव पड़ रहा है और आपके अपने सप्लायर्स को भुगतान में देरी हो सकती है।',
  },

  te: {
    appName: 'కాంటేజియన్ రాడార్ (Contagion Radar)',
    tagline: 'ఎంఎస్ఎంఈ సరఫరా గొలుసు ఆర్థిక ఒత్తిడి ముందస్తు హెచ్చరిక',
    disclaimerBadge: 'మోడల్ అవుట్‌పుట్ / సిమ్యులేటెడ్',
    disclaimerFull:
      'సిమ్యులేషన్ ఫలితాలు ఊహాజనిత మోడల్ అవుట్‌పుట్‌లు మాత్రమే.',
    msmeMode: 'ఎంఎస్ఎంఈ మోడ్ (సులువు)',
    commandCenter: 'కమాండ్ సెంటర్ (విశ్లేషణ)',
    businessHealthScore: 'వ్యాపార ఆరోగ్య స్కోరు',
    riskLevels: {
      GREEN: 'సాధారణం (సురక్షితం)',
      YELLOW: 'హెచ్చరిక',
      ORANGE: 'అధిక ప్రమాదం',
      RED: 'తీవ్ర ప్రమాదం',
    },
    metrics: {
      moneyWaiting: 'రావలసిన బకాయి సొమ్ము',
      overdueAmount: 'గడువు దాటిన బకాయి',
      daysOverdue: 'ఆలస్యమైన రోజులు',
      operatingCoverage: 'నిర్వహణ నిధుల కవరేజ్',
      daysOfCash: 'రోజుల నగదు నిల్వ',
      buyerConcentration: 'ఒకే కొనుగోలుదారుపై ఆధారపడటం',
      supplierDependency: 'సరఫరాదారులపై ఆధారపడటం',
      currentRisk: 'ప్రస్తుత ప్రమాద స్థాయి',
      topWarning: 'ముఖ్య ముందస్తు హెచ్చరిక',
      downstreamAffected: 'ప్రభావితమయ్యే ఇతర వ్యాపారాలు',
      recommendedActions: 'సిఫార్సు చేయబడిన చర్యలు',
    },
    actionFramework: {
      whatHappened: 'ఏమి జరిగింది?',
      whyItMatters: 'ఇది ఎందుకు ముఖ్యం?',
      whatCouldHappen: 'ఏమి జరగవచ్చు?',
      whatShouldIDo: 'నేను ఇప్పుడు ఏమి చేయాలి?',
    },
    buttons: {
      simulateShock: 'చెల్లింపు ఒత్తిడిని సిమ్యులేట్ చేయండి',
      explainMyRisk: 'నా రిస్క్ వివరించండి',
      voiceInput: 'వాయిస్ ఇన్వాయిస్ నమోదు',
      generateReminder: 'చెల్లింపు రిమైండర్ సిద్ధం చేయండి',
      runSimulation: 'నెట్‌వర్క్ సిమ్యులేషన్',
      applyMitigation: 'నివారణ చర్యల మోడ్',
      demoTour: '2 నిమిషాల డెమో టూర్',
      addInvoice: 'ఇన్వాయిస్ జోడించండి',
      viewGraph: 'సప్లై చైన్ గ్రాఫ్',
      withoutIntervention: 'చర్యలు తీసుకోకపోతే',
      withIntervention: 'చర్యలు తీసుకున్న తర్వాత',
    },
    plainSummaryExample:
      'ప్రధాన కొనుగోలుదారు నుండి ₹10 లక్షల చెల్లింపు 60 రోజులు ఆలస్యమైంది. ఇది మీ వర్కింగ్ క్యాపిటల్‌పై ఒత్తిడి తెచ్చి మీ సప్లయర్లకు చెల్లింపులను ప్రభావితం చేయవచ్చు.',
  },

  kn: {
    appName: 'ಕಾಂಟೇಜಿಯನ್ ರಾಡಾರ್ (Contagion Radar)',
    tagline: 'ಎಂಎಸ್ಎಂಇ ಪೂರೈಕೆ ಸರಪಳಿ ಹಣಕಾಸು ಆಘಾತ ಮುನ್ಸೂಚನೆ',
    disclaimerBadge: 'ಮಾದರಿ ಔಟ್‌ಪುಟ್ / ಸಿಮ್ಯುಲೇಶನ್',
    disclaimerFull: 'ಸಿಮ್ಯುಲೇಶನ್ ಫಲಿತಾಂಶಗಳು ಮಾದರಿ ಆಧಾರಿತ ಅಂದಾಜುಗಳು ಮಾತ್ರ.',
    msmeMode: 'ಎಂಎಸ್ಎಂಇ ಮೋಡ್ (ಸರಳ)',
    commandCenter: 'ಕಮಾಂಡ್ ಸೆಂಟರ್ (ವಿಶ್ಲೇಷಣೆ)',
    businessHealthScore: 'ವ್ಯಾಪಾರ ಆರೋಗ್ಯ ಅಂಕ',
    riskLevels: {
      GREEN: 'ಸಾಮಾನ್ಯ (ಸುರಕ್ಷಿತ)',
      YELLOW: 'ಎಚ್ಚರಿಕೆ',
      ORANGE: 'ಹೆಚ್ಚಿನ ಅಪಾಯ',
      RED: 'ಗಂಭೀರ ಅಪಾಯ',
    },
    metrics: {
      moneyWaiting: 'ಬರಬೇಕಾದ ಒಟ್ಟು ಬಾಕಿ ಹಣ',
      overdueAmount: 'ಮೀರಿದ ಬಾಕಿ ಹಣ',
      daysOverdue: 'ತಡವಾದ ದಿನಗಳು',
      operatingCoverage: 'ದೈನಂದಿನ ನಿರ್ವಹಣಾ ರಕ್ಷಣೆ',
      daysOfCash: 'ದಿನಗಳ ನಗದು ಬ್ಯಾಕಪ್',
      buyerConcentration: 'ಒಬ್ಬ ಗ್ರಾಹಕನ ಮೇಲಿನ ಅವಲಂಬನೆ',
      supplierDependency: 'ಪೂರೈಕೆದಾರರ ಅವಲಂಬನೆ',
      currentRisk: 'ಪ್ರಸ್ತುತ ಅಪಾಯ ಮಟ್ಟ',
      topWarning: 'ಮುಖ್ಯ ಮುನ್ನೆಚ್ಚರಿಕೆ',
      downstreamAffected: 'ಬಾಧಿತವಾಗಬಹುದಾದ ಇತರ ಸಂಸ್ಥೆಗಳು',
      recommendedActions: 'ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮಗಳು',
    },
    actionFramework: {
      whatHappened: 'ಏನಾಯಿತು?',
      whyItMatters: 'ಇದು ಏಕೆ ಮುಖ್ಯ?',
      whatCouldHappen: 'ಮುಂದೆ ಏನಾಗಬಹುದು?',
      whatShouldIDo: 'ನಾನು ಈಗ ಏನು ಮಾಡಬೇಕು?',
    },
    buttons: {
      simulateShock: 'ಪಾವತಿ ಆಘಾತ ಸಿಮ್ಯುಲೇಶನ್',
      explainMyRisk: 'ನನ್ನ ಅಪಾಯವನ್ನು ವಿವರಿಸಿ',
      voiceInput: 'ಧ್ವನಿ ಇನ್ವಾಯ್ಸ್ ನಮೂದು',
      generateReminder: 'ಪಾವತಿ ಜ್ಞಾಪನೆ ರಚಿಸಿ',
      runSimulation: 'ನೆಟ್‌ವರ್ಕ್ ಸಿಮ್ಯುಲೇಶನ್',
      applyMitigation: 'ಪರಿಹಾರ ಕ್ರಮಗಳ ಮೋಡ್',
      demoTour: '2 ನಿಮಿಷಗಳ ಡೆಮೊ ಪ್ರವಾಸ',
      addInvoice: 'ಇನ್ವಾಯ್ಸ್ ಸೇರಿಸಿ',
      viewGraph: 'ಸಪ್ಲೈ ಚೈನ್ ನೆಟ್‌ವರ್ಕ್',
      withoutIntervention: 'ಕ್ರಮವಿಲ್ಲದ ಸ್ಥಿತಿ',
      withIntervention: 'ಕ್ರಮ ಕೈಗೊಂಡ ನಂತರ',
    },
    plainSummaryExample:
      'ಮುಖ್ಯ ಖರೀದಿದಾರರಿಂದ ₹10 ಲಕ್ಷ ಪಾವತಿ 60 ದಿನಗಳಿಂದ ಬಾಕಿಯಾಗಿದೆ. ಇದು ನಿಮ್ಮ ದೈನಂದಿನ ಕಾರ್ಯಶೀಲ ಬಂಡವಾಳದ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರಿ ಸಣ್ಣ ಸಪ್ಲೈಯರ್‌ಗಳ ಪಾವತಿಗೂ ತೊಂದರೆಯಾಗಬಹುದು.',
  },

  ml: {
    appName: 'കണ്ടേജിയൻ റഡാർ (Contagion Radar)',
    tagline: 'ചെറുകിട വ്യവസായ വിതരണ ശൃംഖല സാമ്പത്തിക പ്രതിസന്ധി മുന്നറിയിപ്പ്',
    disclaimerBadge: 'മോഡൽ ഔട്ട്പുട്ട് / സിമുലേഷൻ',
    disclaimerFull: 'സിമുലേഷൻ ഫലങ്ങൾ സാങ്കേതിക മാതൃകാ നിഗമനങ്ങൾ മാത്രമാണ്.',
    msmeMode: 'എംഎസ്എംഇ മോഡ് (ലളിതം)',
    commandCenter: 'കമാൻഡ് സെന്റർ (വിശകലനം)',
    businessHealthScore: 'ബിസിനസ് ആരോഗ്യ സ്കോർ',
    riskLevels: {
      GREEN: 'സാധാരണ (സുരക്ഷിതം)',
      YELLOW: 'മുന്നറിയിപ്പ്',
      ORANGE: 'ഉയർന്ന റിസ്ക്',
      RED: 'ഗുരുതരമായ റിസ്ക്',
    },
    metrics: {
      moneyWaiting: 'ലഭിക്കാനുള്ള ബാക്കി തുക',
      overdueAmount: 'കാലഹരണപ്പെട്ട കുടിശ്ശിക',
      daysOverdue: 'വൈകിയ ദിവസങ്ങൾ',
      operatingCoverage: 'പ്രവർത്തന മൂലധന ശേഷി',
      daysOfCash: 'ദിവസത്തെ പണ കരുതൽ',
      buyerConcentration: 'ഒറ്റ ഉപഭോക്തൃ ആശ്രിതത്വം',
      supplierDependency: 'വിതരണക്കാരുടെ ആശ്രിതത്വം',
      currentRisk: 'നിലവിലെ റിസ്ക് നില',
      topWarning: 'പ്രധാന മുന്നറിയിപ്പ്',
      downstreamAffected: 'ബാധിക്കപ്പെടാവുന്ന മറ്റ് സ്ഥാപനങ്ങൾ',
      recommendedActions: 'ശുപാർശ ചെയ്യുന്ന മുൻകരുതലുകൾ',
    },
    actionFramework: {
      whatHappened: 'എന്താണ് സംഭവിച്ചത്?',
      whyItMatters: 'എന്തുകൊണ്ട് ഇത് പ്രധാനമാണ്?',
      whatCouldHappen: 'ഇനി എന്ത് സംഭവിക്കാം?',
      whatShouldIDo: 'ഞാൻ ഇപ്പോൾ എന്ത് ചെയ്യണം?',
    },
    buttons: {
      simulateShock: 'പേയ്‌മെന്റ് ആഘാത സിമുലേഷൻ',
      explainMyRisk: 'എന്റെ റിസ്ക് വിശദീകരിക്കുക',
      voiceInput: 'വോയ്സ് ഇൻവോയ്സ് എൻട്രി',
      generateReminder: 'പേയ്‌മെന്റ് ഓർമ്മപ്പെടുത്തൽ സൃഷ്ടിക്കുക',
      runSimulation: 'നെറ്റ്‌വർക്ക് സിമുലേഷൻ',
      applyMitigation: 'പരിഹാര മാർഗ്ഗങ്ങൾ',
      demoTour: '2 മിനിറ്റ് ഡെമോ ടൂർ',
      addInvoice: 'ഇൻവോയ്സ് ചേർക്കുക',
      viewGraph: 'വിതരണ ശൃംഖല ഗ്രാഫ്',
      withoutIntervention: 'നടപടികൾ ഇല്ലാതെ',
      withIntervention: 'നടപടികൾക്ക് ശേഷം',
    },
    plainSummaryExample:
      'പ്രധാന ഉപഭോക്താവിൽ നിന്നുള്ള ₹10 ലക്ഷം രൂപ 60 ദിവസമായി മുടങ്ങിക്കിടക്കുന്നു. ഇത് പ്രവർത്തന മൂലധനത്തെ ബാധിക്കുകയും നിങ്ങളുടെ വിതരണക്കാർക്കുള്ള പേയ്‌മെന്റുകൾ വൈകിക്കുകയും ചെയ്യും.',
  },

  bn: {
    appName: 'কনটেজিয়ন রাডার (Contagion Radar)',
    tagline: 'ক্ষুদ্র ও মাঝারি সরবরাহ চেইনের আর্থিক চাপ পূর্বাভাস',
    disclaimerBadge: 'মডেল আউটপুট / সিমুলেটেড',
    disclaimerFull:
      'সিমুলেশন ফলাফল কেবল মডেলভিত্তিক অনুমান এবং আর্থিক গ্যারান্টি নয়।',
    msmeMode: 'এমএসএমই মোড (সহজ)',
    commandCenter: 'কমান্ড সেন্টার (উন্নত)',
    businessHealthScore: 'ব্যবসায়িক স্বাস্থ্য স্কোর',
    riskLevels: {
      GREEN: 'স্বাভাবিক (নিরাপদ)',
      YELLOW: 'সতর্কতা',
      ORANGE: 'উচ্চ ঝুঁকি',
      RED: 'সংকটাপন্ন ঝুঁকি',
    },
    metrics: {
      moneyWaiting: 'পাওনা মোট বকেয়া টাকা',
      overdueAmount: 'মেয়াদোত্তীর্ণ বকেয়া',
      daysOverdue: 'বিলম্বিত দিন',
      operatingCoverage: 'কার্যকরী মূলধন রানওয়ে',
      daysOfCash: 'দিনের নগদ ব্যাকআপ',
      buyerConcentration: 'একক ক্রেতার ওপর নির্ভরতা',
      supplierDependency: 'সরবরাহকারী নির্ভরতা',
      currentRisk: 'বর্তমান ঝুঁকি অবস্থা',
      topWarning: 'শীর্ষ আগাম সতর্কতা',
      downstreamAffected: 'প্রভাবিত হতে পারে এমন অন্য ব্যবসা',
      recommendedActions: 'প্রস্তাবিত সুরক্ষামূলক পদক্ষেপ',
    },
    actionFramework: {
      whatHappened: 'কি ঘটেছে?',
      whyItMatters: 'এটি কেন গুরুত্বপূর্ণ?',
      whatCouldHappen: 'সামনে কি ঘটতে পারে?',
      whatShouldIDo: 'আমার এখন কি করা উচিত?',
    },
    buttons: {
      simulateShock: 'পেমেন্ট শক সিমুলেট করুন',
      explainMyRisk: 'আমার ঝুঁকি ব্যাখ্যা করুন',
      voiceInput: 'ভয়েস ইনভয়েস এন্ট্রি',
      generateReminder: 'পেমেন্ট রিমাইন্ডার তৈরি করুন',
      runSimulation: 'নেটওয়ার্ক সিমুলেশন চালান',
      applyMitigation: 'সুরক্ষা মোড',
      demoTour: '২-মিনিট বিচারক ডেমো ট্যুর',
      addInvoice: 'ইনভয়েস যোগ করুন',
      viewGraph: 'সাপ্লাই চেইন নেটওয়ার্ক',
      withoutIntervention: 'পদক্ষেপ ছাড়া',
      withIntervention: 'পদক্ষেপ নেওয়ার পর',
    },
    plainSummaryExample:
      'প্রধান ক্রেতার কাছ থেকে ₹১০ লাখের পেমেন্ট ৬০ দিন ধরে বকেয়া রয়েছে। এটি আপনার কার্যকরী মূলধনে টান ফেলছে এবং আপনার নিজস্ব সরবরাহকারীদের পেমেন্ট আটকে যেতে পারে।',
  },
};
