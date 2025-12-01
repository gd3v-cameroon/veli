interface supportedCountry {

    name: string;
    regex: RegExp;
}

const SupportedCountries: Array<supportedCountry> = [
  {
    name: "any",
    regex: /^\+?(\d{1,3})?[-\s.]?\d{3}[-\s.]?\d{3}[-\s.]?\d{4}$/,
  },
  {
    name: "cameroon",
    regex: /^\+?237(?:[236][0-9]|7[0-8]|6[0-9]{2})\d{6}$/,
  },
  {
    name: "ghana",
    regex: /^\+?233\d{9}$/,
  },
  {
    name: "nigeria",
    regex: /^\+?234(?:\d{4}|\(\d{3}\))\d{6}$/,
  },
  {
    name: "southafrica",
    regex: /^\+?27[678][0-9]{8}$/,
  },
  {
    name: "uganda",
    regex: /^\+?2567[0-9]{8}$/,
  },
  {
    name: "zimbabwe",
    regex: /^\+?2637[0-9]{8}$/,
  },
  {
    name: "kenya",
    regex: /^\+?2547[0-9]{8}$/,
  },
  {
    name: "tanzania",
    regex: /^\+?255(?:6|7)[0-9]{8}$/,
  },
  {
    name: "egypt",
    regex: /^\+?20(1[012569]|2)\d{8}$/,
  },
  {
    name: "algeria",
    regex: /^\+?213\s*([0-9]{8}|[0-9]{9})$/,
  },
  {
    name: "morocco",
    regex: /^\+?212(?:5|6|7)[0-9]{8}$/,
  },
  {
    name: "ivorycoast",
    regex: /^\+?225(?:[0124567][0-9]|3[012])\d{6}$/,
  },
  {
    name: "ethiopia",
    regex: /^\+?251(?:9|1|7)\d{8}$/,
  },
  {
    name: "angola",
    regex: /^\+?244[0-9]{9}$/,
  },
  {
    name: "senegal",
    regex: /^\+?221(?:7[0-9]{8}|[78][0-9]{7})$/,
  },
  {
    name: "zambia",
    regex: /^\+?260(?:9|7|6)[0-9]{7}$/,
  },
  {
    name: "malawi",
    regex: /^\+?265[0-9]{8}$/,
  },
  {
    name: "rwanda",
    regex: /^\+?2507[0-9]{8}$/,
  },

  {
    name: "botswana",
    regex: /^\+?267[0-9]{7}$/,
  },

  {
    name: "namibia",
    regex: /^\+?264(?:6[1-7]|81)[0-9]{6}$/,
  },
];


export default SupportedCountries