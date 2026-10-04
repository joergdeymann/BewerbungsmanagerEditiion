# Regel
- Jedes Model git die Daten vor und darf nur auf Anweisung oder Nachfrage geändert werden
- Halte Models, AppRecord.json, JobsInput.json, structure/Datenstruktur.md synchronisiert

# Entwicklungs-Sprint (Workflow)
- Der Button Stelle importieren im Importberereich, den ich in die Bookmarks kopieren kann, und dann anklicken kann soll die url direkt laden vorgehen wie nach der Rückgabe es Fensters welches bei "Webadresse der Stellenanzeige" angezeigt wird
- der Aufruf des Links scheint eine cookie Bestätigung zu fordern, kann man das verhindern oder übergehen ?
- Hier der text der zurückkommt:
LinkedIn and 3rd parties use essential and non-essential cookies to provide, secure, analyze and improve our Services, and to show you relevant ads (including professional and job ads) on and off LinkedIn. Learn more in our Cookie Policy.
Select Accept to consent or Reject to decline non-essential cookies for this use. You can update your choices at any time in your settings.
Accept
Reject
Sign in
Sign in with Apple
Sign in with a passkey
By clicking Continue, you agree to LinkedIn’s User Agreement, Privacy Policy, and Cookie Policy.
or
Email or phone
Password
Show
Forgot password?
Keep me logged in
Sign in
We’ve emailed a one-time link to your primary email address
Click on the link to sign in instantly to your LinkedIn account.
If you don’t see the email in your inbox, check your spam folder.
Resend email
Back
New to LinkedIn? Join now
Agree & Join LinkedIn
By clicking Continue, you agree to LinkedIn’s User Agreement, Privacy Policy, and Cookie Policy.
LinkedIn
© 2026
User Agreement
Privacy Policy
Community Guidelines
Cookie Policy
Copyright Policy
Send Feedback
Language
العربية (Arabic)
বাংলা (Bangla)
Čeština (Czech)
Dansk (Danish)
Deutsch (German)
Ελληνικά (Greek)
English (English)
Español (Spanish)
فارسی (Persian)
Suomi (Finnish)
Français (French)
हिंदी (Hindi)
Magyar (Hungarian)
Bahasa Indonesia (Indonesian)
Italiano (Italian)
עברית (Hebrew)
日本語 (Japanese)
한국어 (Korean)
मराठी (Marathi)
Bahasa Malaysia (Malay)
Nederlands (Dutch)
Norsk (Norwegian)
ਪੰਜਾਬੀ (Punjabi)
Polski (Polish)
Português (Portuguese)
Română (Romanian)
Русский (Russian)
Svenska (Swedish)
తెలుగు (Telugu)
ภาษาไทย (Thai)
Tagalog (Tagalog)
Türkçe (Turkish)
Українська (Ukrainian)
Tiếng Việt (Vietnamese)
简体中文 (Chinese (Simplified))
正體中文 (Chinese (Traditional))

- Wenn das geklärt ist:
- des weiteren soll der betreffende Bereich ohne Werbungen, und aussenstehenden Links gefiltert werden, Linkedin hat ein geteiltes Fenster
- baue ein URLParser der sich den content der URL ansieht und je nach JOB (Linkedin, Monster, und andere Jobbörsen die es gibt), den richtigen content herausholt
- die HTMLS können danach analysiert werden um weiterführende Links zur Firma zb zu finden
zb: https://www.linkedin.com/company/inside-m2m-gmbh/about/ -> hier alle Job Inforationen, 
https://www.linkedin.com/company/inside-m2m-gmbh/home/ hier übersicht derJOBS 
das wäre 2 analysen
 
