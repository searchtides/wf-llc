PLACEHOLDER_TEMPLATE = '{{link placeholder}}';

TRIPPLE = ['Anchor Text', 'Target URL', 'Live Article URL'];

RECENT_DAYS = 30;

_ = Underscore.load();

CHECKLOG_URL = 'https://docs.google.com/spreadsheets/d/1rCpB6il50FoQYGWtEocDgk9lUNZIbnwcXTw4yL-nJwI/edit?usp=sharing';

LINK_STATUSES = ['LIVE', 'LIVE, BUT CORRUPTED ANCHOR', 'NOT LIVE', 'UNABLE TO CRAWL'];

FIELDS_MAP = {
  'DOMAIN' : 'Domain',
  '🔹TARGET URL (from AP Link)' : 'Target URL',
  'Anchor Text' : 'Anchor Text',
  'LIVE LINK' : 'Live Article URL',
  'DR' : 'DR',
  'CM' : 'Title',
  'Industry' : 'Domain Main Topic',
  'IP Address' : 'IP Address',
  'IP Location' : 'IP Location',
  'DF / NF' : 'Follow/NoFollow',
  'Live Link Date' : 'Date',
  'CLIENT*' : 'Client',
  'id' : 'id',
  'TEAM' : 'TEAM'
};

FIELDS = [
  'DOMAIN',
  '🔹TARGET URL (from AP Link)',
  'Anchor Text',
  'LIVE LINK',
  'DR',
  'CM',
  'Industry',
  'IP Address',
  'IP Location',
  'DF / NF',
  'Live Link Date',
  'CLIENT*',
  'TEAM'
];
AIRTALBE_ENDPOINT = 'https://api.airtable.com/v0';