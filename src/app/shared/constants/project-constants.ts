export const projectConstants = {
  PERPAGING_LIMIT: 10,
  CONSUMER_DASHBOARD_REFRESH_TIME: 120, // seconds
  INBOX_REFRESH_TIME: 30, // seconds
  ALERT_REFRESH_TIME: 30, // seconds
  SMALL_DEVICE_BOUNDARY: 991,
  searchpass_criteria : {
    'start': 0,
    'return': 'title,sector,logo,place1,business_phone_no,unique_id',
    'fq': '',
    'q': '',
    'size': 10,
    'parser': 'structured', // 'q.parser'
    'options': '', // 'q.options'
    'sort': '',
    'distance': ''
  },
  myweekdays: [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ],
  myweekdaysSchedule: [
    '',
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ],
  OPEN_NOW_INTERVAL: 2, // interval which calculates the time for open now condition in search
  MY_DATE_FORMATS: {
    parse: {
      dateInput: 'L'
    },
    display: {
      dateInput: 'L',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    }
  },
  TIMEOUT_DELAY : 2000, // msec
  TIMEOUT_DELAY_SMALL : 200, // msec
  TIMEOUT_DELAY_LARGE : 4100, // msec
  TIMEOUT_DELAY_LARGE6 : 6000, // msec
  TIMEOUT_DELAY_LARGE10 : 10000, // msec
  TOOLBAR_CONFIG : [
                { name: 'document',
                  groups: [ 'mode', 'document', 'doctools' ],
                  items: [ 'Source', '-', 'NewPage', 'Preview', '-', 'Templates' ]
                },
                { name: 'clipboard',
                  groups: [ 'clipboard', 'undo' ],
                  items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ]
                },
                { name: 'editing',
                  groups: [ 'find', 'selection' ],
                  items: [ 'Find', 'Replace', '-', 'SelectAll']
                },
                { name: 'basicstyles',
                  groups: [ 'basicstyles', 'cleanup' ],
                  items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ]
                },
                { name: 'paragraph',
                  groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ],
                  items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv',
                  '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ]
                },
                { name: 'links',
                  items: [ 'Link', 'Unlink', 'Anchor' ]
                },
                { name: 'insert',
                  items: [ 'Image', 'Table', 'HorizontalRule', 'SpecialChar', 'PageBreak', 'Iframe' ]
                },
                { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
                { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
                { name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
                { name: 'others', items: [ '-' ] }

              ],
  DISPLAY_DATE_FORMAT : 'DD/MM/YYYY',
  PIPE_DISPLAY_DATE_FORMAT : 'dd/MM/y',
  PIPE_DISPLAY_DATE_FORMAT_WITH_DAY : 'E, dd/MM/y',
  PIPE_DISPLAY_TIME_FORMAT: 'h:mm a',
  PIPE_DISPLAY_DATE_TIME_FORMAT : 'dd/MM/y h:mm a' ,
  POST_DATE_FORMAT : 'YYYY-MM-DD',
  BASE_SCHEDULE: [
    {
      day: 4,
      sTime: '09:00 AM',
      eTime: '12:00 PM'
    },
    {
      day: 2,
      sTime: '09:00 AM',
      eTime: '06:00 PM'
    },
    {
      day: 3,
      sTime: '09:00 AM',
      eTime: '06:00 PM'
    },
    {
      day: 1,
      sTime: '09:00 AM',
      eTime: '06:00 PM'
    },
    {
      day: 5,
      sTime: '09:00 AM',
      eTime: '06:00 PM'
    }
    ,
    {
      day: 6,
      sTime: '09:00 AM',
      eTime: '06:00 PM'
    },
    {
      day: 7,
      sTime: '09:00 AM',
      eTime: '12:00 PM'
    }
 ],
 DEFAULT_STARTTIME: '09:00 AM',
 DEFAULT_ENDTIME: '06:00 PM',
 IMAGE_FORMATS : [
                    'image/gif',
                    'image/png',
                    'image/jpeg',
                    'image/bmp',
                    'image/webp'
                 ],
 IMAGE_MAX_SIZE : 5000000, // byte
 INTERVAL_TIME: 60000, // byte
 AUTOSUGGEST_MIN_CHAR: 3,  // minimum characters required for autosuggest
 AUTOSUGGEST_LOC_MAX_CNT: 15, // max number of locations that will be displayed in the autosuggestion
 SEARCH_DEFAULT_LOCATION: {
                            'autoname': 'All of Bangalore, Karnataka',
                            'name': 'Bangalore',
                            'lat': '12.971599',
                            'lon': '77.594563',
                            'typ' : 'state'
                          },
MAP_ZOOM: 15,
MAP_BASE_URL: 'https://www.google.com/maps/place/', // this is used to implement google map related API calls
LOCATION_BADGE_ICON : { // images to be used for the location badges
                    'physiciansemergencyservices' : {'icon': 'emergency.png', 'class': 'icon-emergency'}, // dynamic
                    'dentistemergencyservices' : {'icon': 'emergency.png', 'class': 'icon-emergency'}, // dynamic
                    'altemergencyservices' : {'icon': 'emergency.png', 'class': 'icon-emergency'}, // dynamic
                    'emergencyservices' : {'icon': 'emergency.png', 'class': 'icon-emergency'}, // dynamic
                    'traumacentre' : {'icon': 'trauma.png', 'class': 'icon-trauma'}, // dynamic
                    'firstaid' : {'icon': 'noimage.png', 'class': 'icon-first-aid'}, // dynamic
                    '24hour': {'icon': 'noimage.png', 'class': 'icon-open-time'},
                    'parkingtype': {'icon': 'noimage.png', 'class': 'icon-parking'},
                    'autopaymentoptions': {'icon': 'autopay.png', 'class': 'icon-auto-payment'},
                    'docambulance': {'icon': 'ambulance.png', 'class': 'icon-ambulance'},
                    'none': {'icon': 'noimage.png', 'class': 'icon-trauma'}
},
SOCIAL_MEDIA : [
                  { key: 'facebook', iconClass: 'fa fa-facebook-square fb', iconImg: 'facebook.png', displayName: 'Facebook'},
                  { key: 'twitter', iconClass: 'fa fa-twitter-square tw', iconImg: 'twitter.png', displayName: 'Twitter'},
                  { key: 'youtube', iconClass: 'fa fa-youtube-square ytb', iconImg: 'youtube.png', displayName: 'Youtube'},
                  { key: 'linkedin', iconClass: 'fa fa-linkedin lkd', iconImg: 'linkedin.png', displayName: 'LinkedIn'},
                  { key: 'googleplus', iconClass: 'fa fa-google-plus-square gpl', iconImg: 'googleplus.png', displayName: 'Google+'},
                  { key: 'pinterest', iconClass: 'fa fa-pinterest-square pntr', iconImg: 'pinterest.png', displayName: 'Pinterest'}
],
PRIVACY_PERMISSIONS : {
                          'all': 'Public',
                          'customersOnly': 'Customer',
                          'self': 'None'
},
TOOLTIP_CLS: 'ynwtooltipcls',
TOOLTIP_PRIVACYPHONE: 'Example : Cell Phone,  Mobile, Emergency, Main Line, others etc',
TOOLTIP_PRIVACYEMAIL: 'Example : Office Email id, Personal Email id etc',
TOOLTIP_MALE: 'Male',
TOOLTIP_FEMALE: 'Female',
VALIDATOR_BLANK_FALSE: /^((?!\s{2,}).)*$/,
VALIDATOR_BLANK: /^\s*$/,
// VALIDATOR_URL: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
VALIDATOR_URL: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
VALIDATOR_NUMBERONLY: /^\d+$/,
VALIDATOR_FLOAT: /^[+-]?([0-9]*[.])?[0-9]+$/,
VALIDATOR_PHONENUMBERCOUNT10: /^\d{10}$/,
VALIDATOR_CHARONLY: /^[a-zA-Z ]+$/,
VALIDATOR_ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
// VALIDATOR_CHARONLY: /^[a-zA-Z][a-zA-Z ]+$/,
VALIDATOR_EMAIL: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/,
VALIDATOR_MAX9: 9, // max char count
VALIDATOR_MAX10: 10, // max char count
VALIDATOR_MAX50: 50, // max char count
VALIDATOR_MAX100: 100, // max char count
VALIDATOR_MAX150: 150, // max char count
VALIDATOR_MAX200: 200, // max char count
VALIDATOR_MAX250: 250, // max char count
VALIDATOR_MAX500: 500, // max char count
WAITLIST_CANCEL_RESON: [ { title : 'No Show Up', value: 'noshowup', reasonkey: 'noShowUpCancel'},
                         {title : 'Self', value: 'self', reasonkey: 'selfCancel'},
                         {title : 'Blocked', value: 'blocked', reasonkey: 'blockedCancel'},
                         {title : 'Closing Soon', value: 'closingSoon', reasonkey: 'closingSoonCancel'},
                         {title : 'Too Full', value: 'tooFull', reasonkey: 'tooFullCancel'}],
DOMAINLIST_APIFETCH_HOURS: 1, // hours which decides whether domain list api should be execured or not
REFINE_ENUMLIST_DEFAULT_SHOW_CNT: 5,
DISTANCE_STATE: 100, // in Km
DISTANCE_CITY: 25, // in Km
DISTANCE_AREA: 5, // in Km
AUDITLOG_CNT: 10,
AUDITLOG_FILTER_CATEGORIES: [
  {
    name: 'SETTINGS',
    displayName: 'Settings',
    subcat: [
                    { name: 'LOCATION', dispName: 'Location'},
                    { name: 'QUEUE', dispName: 'Service Time Window' },
                    { name: 'SERVICE', dispName: 'Service' },
                    { name: 'HOLIDAY', dispName: 'Holiday' },
                    { name: 'WAITLIST', dispName: 'Waitlist' },
                    { name: 'PAYMENT', dispName: 'Payment' },
                    { name: 'COUPOUN', dispName: 'Coupon' },
                    { name: 'ITEM', dispName: 'Item' },
                    { name: 'ADDWORD', dispName: 'Adword' },
                    { name: 'TAX', dispName: 'Tax' },
                    { name: 'DISCOUNT', dispName: 'Discount' },
                    { name: 'ACCOUNT', dispName: 'Account' }
                   ]
  },
  {
    name: 'WAITLIST',
    displayName: 'Waitlist',
    subcat: [
                    { name: 'CANCEL', dispName: 'Cancel'},
                    { name: 'WAIT', dispName: 'Wait' },
                    { name: 'DELAY', dispName: 'Delay' },
                    { name: 'WAITLIST', dispName: 'Waitlist' },
                    { name: 'RATING', dispName: 'Rating' },
                    { name: 'BILL', dispName: 'Bill' }
                   ]
  },
  {
    name: 'LICENSE',
    displayName: 'License',
    subcat: [
                    { name: 'ADDON', dispName: 'Addon'},
                    { name: 'INVOICE', dispName: 'Invoice' },
                    { name: 'LICENSE', dispName: 'License' }
                   ]
  },
  {
    name: 'SIGNUP',
    displayName: 'Signup',
    subcat: [
                    { name: 'PROVIDER', dispName: 'Provider'},
                    { name: 'CONSUMER', dispName: 'Consumer' }
                   ]
  }
],
AUDITLOG_FILTER_ACTION: [
  { name: 'ADD', dispName: 'Add'},
  { name: 'DELETE', dispName: 'Delete'},
  { name: 'EDIT', dispName: 'Edit'},
  { name: 'COPY', dispName: 'Copy'},
  { name: 'VIEW', dispName: 'View'}
],
ALERT_CNT: 10,
BUSINESS_NAME_MAX_LENGTH: 50,
BUSINESS_DESC_MAX_LENGTH: 400
};
