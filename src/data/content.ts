export type Faq = {
  question: string;
  answer: string;
  questionBn?: string;
  answerBn?: string;
};

export const faqs: Faq[] = [
  {
    question: "How do I receive a subscription after I order?",
    questionBn: "অর্ডার করার পর সাবস্ক্রিপশন কিভাবে পাবো?",
    answer:
      "After the order is placed, the subscription is delivered on WhatsApp. Delivery is usually within 30 minutes and within 4 hours. Message WhatsApp support after you order if you want it sooner.",
    answerBn:
      "অর্ডার সম্পন্ন হওয়ার পর আপনার সাবস্ক্রিপশন WhatsApp-এর মাধ্যমে ডেলিভারি করা হবে। সাধারণত ৩০ মিনিট থেকে ৪ ঘণ্টার মধ্যে ডেলিভারি সম্পন্ন হয়। দ্রুত ডেলিভারির জন্য অর্ডারের পর WhatsApp সাপোর্টে যোগাযোগ করুন।",
  },
  {
    question: "Which payment methods can I use?",
    questionBn: "পেমেন্ট কোন মাধ্যমে করা যায়?",
    answer: "bKash, Nagad, Rocket, Visa, and Mastercard. Pick the method at checkout and keep your transaction ID.",
    answerBn: "bKash, Nagad, Rocket, Visa, এবং Mastercard। চেকআউটে মাধ্যম বেছে ট্রানজ্যাকশন আইডি রাখুন।",
  },
  {
    question: "What if the subscription does not work?",
    questionBn: "সাবস্ক্রিপশন কাজ না করলে কী করব?",
    answer:
      "Message support on WhatsApp with your order ID. We try a replacement first. If it still fails inside the warranty window on the refund policy, the order is refunded.",
    answerBn:
      "অর্ডার নম্বরসহ WhatsApp সাপোর্টে লিখুন। আগে রিপ্লেসমেন্ট দেখা হয়। ওয়ারেন্টি সময়ের মধ্যে ঠিক না হলে রিফান্ড নীতি অনুযায়ী টাকা ফেরত।",
  },
  {
    question: "Is every product activated on my own account?",
    questionBn: "সব সাবস্ক্রিপশন কি আমার নিজের অ্যাকাউন্টে?",
    answer:
      "No. The option name says what you receive. Gift cards and license keys are redeemed on an account you own. Streaming combos are usually a profile our team delivers. Read that label before you pay.",
    answerBn:
      "না। অপশনের নামে লেখা থাকে আপনি কী পাবেন। গিফট কার্ড ও লাইসেন্স কী নিজের অ্যাকাউন্টে রিডিম হয়। স্ট্রিমিং কম্বো সাধারণত আমাদের দেওয়া প্রোফাইল। টাকা দেওয়ার আগে সেই লেবেল পড়ুন।",
  },
  {
    question: "Can I cancel an order?",
    answer:
      "Yes, if it has not been delivered yet. Message support with the order ID. After a code is revealed or a profile is delivered, the sale follows the refund policy.",
  },
  {
    question: "Do you ship outside Bangladesh?",
    answer:
      "Delivery is digital, on WhatsApp. Payment instructions on this shop are for Bangladesh wallets and cards. The product itself may be a regional code, which is written on the product page.",
  },
];

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  minutes: number;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "buy-streaming-with-bkash",
    title: "How to buy a streaming plan with bKash",
    date: "2026-09-18",
    excerpt: "Pick the device type, pay from your bKash app, and send the transaction ID so delivery can start.",
    author: "Savasaachi Desk",
    minutes: 4,
    body: [
      "A streaming order has three choices that change the price: which apps you want, which screens you will use, and how many days you need. Mobile and laptop plans are cheaper than plans that include a TV.",
      "Open the product, choose the duration, and add it to the cart. At checkout, select bKash and send the exact total to the bKash number shown on the page. The transaction ID is the proof of payment. Paste it into the order.",
      "Keep WhatsApp available on the same number you enter. That is where the profile or code arrives. If the amount or the transaction ID does not match, support will ask you to confirm before anything is delivered.",
      "Combo plans follow the same steps. The cart can hold a combo and a gift card together, and coupon SAVA10 takes 10 percent off the subtotal after you apply it.",
    ],
  },
  {
    slug: "netflix-mobile-vs-tv",
    title: "Netflix prices in Bangladesh: mobile versus TV",
    date: "2026-09-12",
    excerpt: "The mobile plan starts lower. The TV plan costs more because the profile is meant for a television as well.",
    author: "Savasaachi Desk",
    minutes: 5,
    body: [
      "On Savasaachi Flix BD the mobile, tablet, laptop, and PC profile starts at Tk 149 for 7 days and Tk 350 for a month. The TV access profile starts at Tk 199 for 7 days and Tk 450 for a month. Three-month options are listed on each product.",
      "Choose TV access if the show will be watched on a television. A mobile plan is the wrong product for a living-room screen, and support cannot turn one into the other after delivery without a new order.",
      "These are profiles arranged by the shop, not gift cards bought from Netflix. Netflix still applies its own household rules to the account behind the profile. The product page says that in the caution note. Ask on WhatsApp if you need to know who controls the login.",
      "Prime Video on this shop starts at Tk 199 for a month, down from Tk 300. A Netflix plus Prime combo is Tk 390 on mobile and laptop, or Tk 490 with TV access.",
    ],
  },
  {
    slug: "gift-card-or-profile",
    title: "Gift card, license key, or profile: what is the difference?",
    date: "2026-09-04",
    excerpt: "The label on the option is the whole product. A code for your own account is not the same thing as a shared profile.",
    author: "Savasaachi Desk",
    minutes: 4,
    body: [
      "An Apple, PlayStation, or Steam listing is a code. You redeem it on an account you already own. Region matters: a US Apple code does not redeem on every Apple Account. After the code is shown, it cannot be pulled back.",
      "A Windows or IDM listing is a license key. You install the software from the official vendor and enter the key there. The shop does not send modified installers.",
      "A streaming combo is usually a profile. You receive sign-in details, or a profile inside an account the shop manages. You do not become the owner of that account. Read the duration. A 7-day profile ends in 7 days.",
      "If a page says sold out, the button stays disabled. Choose another duration only when that pill is marked in stock.",
    ],
  },
  {
    slug: "ai-plans-in-bangladesh",
    title: "Ordering ChatGPT, Claude, Gemini, and other AI plans",
    date: "2026-08-22",
    excerpt: "AI plans use the same cart as streaming. Check whether the option is a personal account or a shared seat.",
    author: "Savasaachi Desk",
    minutes: 4,
    body: [
      "ChatGPT Plus is listed at Tk 400 for a month. Claude Pro is a personal-account month at Tk 3,300. Gemini Advanced is Tk 899 for a month. Super Grok is Tk 4,000 for a month. QuillBot starts at Tk 300.",
      "The same checkout covers them: cart, coupon, bKash or another wallet, then WhatsApp. A personal-account option needs an email you can log into. Send that email only in the WhatsApp chat after the order exists, not in a public review.",
      "Perplexity and a few other rows are in the catalog but sold out. The product page shows that state, and Add to cart stays off until a variant is available.",
      "AI access is a subscription to someone else's service. Savasaachi Flix BD is the seller of the plan, not the maker of the model.",
    ],
  },
];

export type Policy = {
  slug: string;
  title: string;
  updated: string;
  sections: { heading: string; paragraphs: string[] }[];
};

export const policies: Policy[] = [
  {
    slug: "delivery",
    title: "Delivery policy",
    updated: "September 2026",
    sections: [
      {
        heading: "Digital delivery",
        paragraphs: [
          "Every product in this shop is digital. Nothing is shipped by courier. Delivery means a WhatsApp message with a profile, a redeem code, or a license key.",
          "During support hours, 11:00 AM to 11:30 PM Bangladesh time, delivery is usually within 30 minutes and within 4 hours of a confirmed payment.",
        ],
      },
      {
        heading: "What we need from you",
        paragraphs: [
          "Checkout collects your name, a phone number, an email, and a transaction ID for wallet payments. If a product must be activated on your own email, support will ask for that email after the order is placed.",
          "Orders with a missing or mismatched transaction ID wait until the payment can be matched.",
        ],
      },
      {
        heading: "Weeknight cutoff",
        paragraphs: [
          "Orders placed after support hours start the next morning. The 4-hour window is counted inside support hours, not overnight.",
        ],
      },
    ],
  },
  {
    slug: "refund",
    title: "Refund and replacement",
    updated: "September 2026",
    sections: [
      {
        heading: "Before delivery",
        paragraphs: [
          "If an order has not been delivered, you can cancel it. Message support with the order ID. Wallet payments are returned to the same wallet after the payment is confirmed as ours.",
        ],
      },
      {
        heading: "Replacement first",
        paragraphs: [
          "If a profile stops working inside the duration you bought, or a code fails to redeem, contact support with the order ID and a short description. We try a replacement before a refund.",
          "The usual review window is 6 to 48 hours inside support hours.",
        ],
      },
      {
        heading: "When a refund is declined",
        paragraphs: [
          "A gift card or key that has been revealed is not refundable once it is viewed, unless the code itself is invalid.",
          "Changing your mind after a profile has been used is not a refund reason. A VPN-required service, such as Hulu, is not faulty because a VPN was not included.",
          "Region mistakes on Apple, PlayStation, or Steam codes are not refundable when the region was written on the product page.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy policy",
    updated: "September 2026",
    sections: [
      {
        heading: "What this shop stores",
        paragraphs: [
          "Checkout asks for your name, phone, email, WhatsApp number, payment method, and transaction ID. In this project those details stay in your browser so the order flow can be reviewed. A production launch should move orders to a private server and a real payment gateway.",
          "Do not send passwords for your bank, bKash PIN, or card number. The card option on checkout is a simulated approval and does not ask for a card number.",
        ],
      },
      {
        heading: "Accounts",
        paragraphs: [
          "A shop account is optional. It is stored only on this device, and the password is saved as a hash in local storage. Use a password you do not use anywhere else.",
        ],
      },
      {
        heading: "Support chat",
        paragraphs: [
          "WhatsApp messages are handled in WhatsApp. Do not send screenshots of card details or one-time passwords.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms and conditions",
    updated: "September 2026",
    sections: [
      {
        heading: "The shop",
        paragraphs: [
          "Savasaachi Flix BD sells digital subscriptions, gift cards, and license keys to customers who pay in Bangladesh. Netflix, Prime Video, Disney+, HBO, Apple, Microsoft, and every other brand named on a product belong to their owners. This shop is not those companies.",
        ],
      },
      {
        heading: "What you are buying",
        paragraphs: [
          "You are buying the option printed on the product: a duration, a device type, and either a profile, a code, or a key. Official services can change their own rules, prices, and catalogs. A seller's description does not override the service's terms.",
          "Shared profiles are not the same as an account you own. Do not change the email, password, or plan on an account you do not own.",
        ],
      },
      {
        heading: "Acceptable use",
        paragraphs: [
          "Do not use the shop to buy access for fraud, resale of revealed codes, or anything that needs stolen payment details. We do not supply cracked software.",
        ],
      },
      {
        heading: "Liability",
        paragraphs: [
          "If a delivered product fails inside the warranty described in the refund policy, the remedy is a replacement or a refund of that order. We are not liable for a streaming service removing a title, or for an account ban that follows from breaking that service's rules.",
        ],
      },
    ],
  },
];

export const heroSlides = [
  {
    kicker: "Bangladesh digital shop",
    title: "Your top entertainment picks",
    emphasis: "entertainment",
    lede: "Netflix, Prime Video, Disney+, HBO Max, and ChatGPT. Pay locally. Details arrive on WhatsApp.",
    href: "/collections/streaming",
    cta: "Shop streaming",
  },
  {
    kicker: "One checkout, more apps",
    title: "Ultimate streaming combos",
    emphasis: "combos",
    lede: "Pair Netflix with Prime, Disney+, or HBO Max. Combos start at Tk 390 for mobile and laptop.",
    href: "/collections/combos",
    cta: "Browse combos",
  },
  {
    kicker: "bKash · Nagad · Rocket · Card",
    title: "Easy and secure payments",
    emphasis: "secure",
    lede: "Send the total, paste the transaction ID, and keep the order number. Digital delivery is free.",
    href: "/checkout",
    cta: "Go to checkout",
  },
  {
    kicker: "Writing, research, images",
    title: "A quieter AI shelf",
    emphasis: "AI",
    lede: "ChatGPT Plus from Tk 400, Gemini Advanced, Claude Pro, QuillBot, and Grok in the same cart.",
    href: "/collections/ai",
    cta: "Shop AI tools",
  },
] as const;

export const sampleReviews = [
  {
    name: "Nusrat Jahan",
    product: "Apple iTunes Gift Card",
    slug: "apple-itunes-giftcard-price-in-bangladesh",
    quote:
      "The $25 code redeemed on my own Apple Account the same evening. The transaction ID step made the payment easy to match.",
  },
  {
    name: "Tanvir Ahmed",
    product: "Netflix Subscription",
    slug: "netflix-subscription-bangladesh",
    quote:
      "Mobile plan-এর প্রোফাইল WhatsApp-এ চলে এসেছে। এক স্ক্রিন, এক মাস — পেজে যা লেখা ছিল তাই পেয়েছি।",
  },
  {
    name: "Farzana Rahman",
    product: "Amazon Prime Video",
    slug: "amazon-prime-video-subscription-bangladesh",
    quote:
      "I have renewed Prime Video here twice. The 1-month option was enough, and support answered inside the stated hours.",
  },
  {
    name: "Imran Kabir",
    product: "Microsoft 365",
    slug: "microsoft-office-365-subscription",
    quote:
      "Office redeemed on my Microsoft account. I wanted my own login, and the gift-card option was the right one.",
  },
];
