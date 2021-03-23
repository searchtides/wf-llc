_ = Underscore.load();

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
  'CLIENT*' : 'Client'
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
  'CLIENT*'
];
AIRTALBE_ENDPOINT = 'https://api.airtable.com/v0';
HEADERS = {
  "Authorization" : "Bearer keyn3sqIpJVHnSva0",
  "Content-Type" : "application/json"
};
DATABASE_ID = 'appITyYZgPYYMkPMg';