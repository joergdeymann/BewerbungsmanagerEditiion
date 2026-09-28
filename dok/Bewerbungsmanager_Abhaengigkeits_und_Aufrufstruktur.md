# Bewerbungsmanager – Klassen-, Abhängigkeits- und Aufrufstruktur

Statische Analyse des hochgeladenen `js/`-Verzeichnisses.

**Wichtig:** Diese Analyse folgt Imports, Vererbung, `new Klasse()`, `Klasse.methode()`, `this.methode()` und lokal definierten Arrow-/Function-Ausdrücken. Dynamisch erzeugte Aufrufe können fehlen.

## Architektur auf Modulebene
js/
  - app.js
  analysis/
    - Analyzer.js → Analyzer
    extractors/
      - BenefitExtractor.js → BenefitExtractor
      - CompanyExtractor.js → CompanyExtractor
      - CompanyNameExtractor.js → CompanyNameExtractor
      - DomainExtractor.js → DomainExtractor
      - EmailExtractor.js → EmailExtractor
      - JobExtractor.js → JobExtractor
      - LocationExtractor.js → LocationExtractor
      - MoneyExtractor.js → MoneyExtractor
      - PhoneExtractor.js → PhoneExtractor
      - PostBoxExtractor.js → PostBoxExtractor
      - QualificationExtractor.js → QualificationExtractor
      - StreetExtractor.js → StreetExtractor
      - TaskExtractor.js → TaskExtractor
    parser/
      - LineParser.js → LineParser
      - ParseText.js → ParseText
      - SectionParser.js → SectionParser
      - SectionPart.js → SectionPart
      - TextCleaner.js → TextCleaner
  api/
    - UrlImporter.js → UrlImporter
  constants/
    - AddressConstants.js → AddressConstants
    - CompanyConstants.js → CompanyConstants
    - JobConstants.js → JobConstants
    - LegalFormConstants.js → LegalFormConstants
    - LocationConstants.js → LocationConstants
    - ParserConstants.js → ParserConstants
    - PostBoxConstants.js → PostBoxConstants
    - SkillAliasConstants.js → SkillAliasConstants
    - SkillConstants.js → SkillConstants
    - WebConstants.js → WebConstants
  controllers/
    - CommunicationController.js → CommunicationController
    detail/
      - CommunicationSectionController.js → CommunicationSectionController
      - ContactSectionController.js → ContactSectionController
      - DocumentsSectionController.js → DocumentsSectionController
    edit/
      - EditController.js → EditController
    overview/
      - OverviewListController.js → OverviewListController
    skills/
      - SkillsController.js → SkillsController
  core/
    - NavigationState.js → NavigationState
    - Router.js → Router
    detail/
      - CommunicationSectionEvent.js → CommunicationSectionEvent
      - ContactSectionEvent.js → ContactSectionEvent
      - DetailNavigationEvent.js → DetailNavigationEvent
      - DocumentsSectionEvent.js → DocumentsSectionEvent
      - SourcesSectionEvent.js → SourcesSectionEvent
    edit/
      - EditNavigationEvent.js → EditNavigationEvent
    overview/
      - OverviewEvent.js → OverviewEvent
      - OverviewFilterEvent.js → OverviewFilterEvent
      - OverviewListEvent.js → OverviewListEvent
    skills/
      - SkillsEvent.js → SkillsEvent
  io/
    - ImportJobPage.js
  models/
    - AddressModel.js → AddressModel
    - AppModel.js → AppModel
    - ApplicationEmailModel.js → ApplicationEmailModel
    - ApplicationHistoryModel.js → ApplicationHistoryModel
    - ApplicationModel.js → ApplicationModel
    - ApplicationPersonalModel.js → ApplicationPersonalModel
    - ApplicationPhoneModel.js → ApplicationPhoneModel
    - ApplicationPortalModel.js → ApplicationPortalModel
    - ApplicationStatusHistoryModel.js → ApplicationStatusHistoryModel
    - BenefitsModel.js → BenefitsModel
    - CapturedContentModel.js → CapturedContentModel
    - CityModel.js → CityModel
    - CompanyModel.js → CompanyModel
    - ContactModel.js → ContactModel
    - ImportedTextModel.js → ImportedTextModel
    - JobModel.js → JobModel
    - NameModel.js → NameModel
    - QualificationModel.js → QualificationModel
    - ReferenceModel.js → ReferenceModel
    - SkillListModel.js → SkillListModel
    - SkillModel.js → SkillModel
    - StreetModel.js → StreetModel
    - UploadFileModel.js → UploadFileModel
  store/
    - AppCache.js → AppCache
    - AppDB.js → AppDB
    - LocalDB.js → LocalDB
    - SkillCache.js → SkillCache
    - SkillDB.js → SkillDB
    detail/
      - ApplicationTemplate.js → ApplicationTemplate
      - BenefitsTemplate.js → BenefitsTemplate
      - CommunicationTemplate.js → CommunicationTemplate
      - CompanyTemplate.js → CompanyTemplate
      - ContactTemplate.js → ContactTemplate
      - DetailBaseTemplate.js → DetailBaseTemplate
      - DetailHeaderTemplate.js → DetailHeaderTemplate
      - DetailNavigationTemplate.js → DetailNavigationTemplate
      - JobTemplate.js → JobTemplate
      - RequirementsTemplate.js → RequirementsTemplate
      - SourcesTemplate copy.js → SourcesTemplate
      - SourcesTemplate.js
    edit/
      - BenefitsEditTemplate.js → BenefitsEditTemplate
      - CompanyEditTemplate.js → CompanyEditTemplate
      - ContactEditTemplate.js → ContactEditTemplate
      - EditHeaderTemplate.js → EditHeaderTemplate
      - EditNavigationTemplate.js → EditNavigationTemplate
      - ImportEditTemplate.js → ImportEditTemplate
      - JobEditTemplate.js → JobEditTemplate
      - RequirementsEditTemplate.js → RequirementsEditTemplate
    overview/
      - ApplicationCardTemplate.js → ApplicationCardTemplate
      - OverviewTemplate.js → OverviewTemplate
    skills/
      - SkillsTemplate.js → SkillsTemplate
    windows/
      - CallPromptTemplate.js → CallPromptTemplate
      - ContactPromptTemplate.js → ContactPromptTemplate
      - InfoPromptTemplate.js → InfoPromptTemplate
      - InputPromptTemplate.js → InputPromptTemplate
      - UrlPromptTemplate.js → UrlPromptTemplate
      - VerifyPromptTemplate.js → VerifyPromptTemplate
    detail/
      - UiCompany.js → UiCompany
      - UiContact.js → UiContact
      - UiJob.js → UiJob
    edit/
      - CompanyImageList.js → CompanyImageList
    overview/
      - OverviewFilter.js → OverviewFilter
  utils/
    - FormatUtils.js → FormatUtils
    - GlobalUtils.js → GlobalUtils
    - HtmlUtils.js → HtmlUtils
    detail/
      - DetailView.js → DetailView
    edit/
      - BaseEditTab.js → BaseEditTab
      - BenefitsEditTab.js → BenefitsEditTab
      - CompanyEditTab.js → CompanyEditTab
      - ContactEditTab.js → ContactEditTab
      - EditView.js → EditView
      - ImportEditTab.js → ImportEditTab
      - JobEditTab.js → JobEditTab
      - RequirementsEditTab.js → RequirementsEditTab
    overview/
      - OverviewView.js → OverviewView
    skills/
      - SkillsView.js → SkillsView
    windows/
      - CallPrompt.js → CallPrompt
      - ContactPrompt.js → ContactPrompt
      - InfoPrompt.js → InfoPrompt
      - InputPrompt.js → InputPrompt
      - Toast.js → Toast
      - UrlPrompt.js → UrlPrompt
      - VerifyPrompt.js → VerifyPrompt

## Vererbungsstruktur
- `DetailBaseTemplate` → `ApplicationTemplate` (`templates/detail/ApplicationTemplate.js`)
- `BaseEditTab` → `BenefitsEditTab` (`views/edit/BenefitsEditTab.js`)
- `DetailBaseTemplate` → `BenefitsTemplate` (`templates/detail/BenefitsTemplate.js`)
- `DetailBaseTemplate` → `CommunicationTemplate` (`templates/detail/CommunicationTemplate.js`)
- `BaseEditTab` → `CompanyEditTab` (`views/edit/CompanyEditTab.js`)
- `DetailBaseTemplate` → `CompanyTemplate` (`templates/detail/CompanyTemplate.js`)
- `BaseEditTab` → `ContactEditTab` (`views/edit/ContactEditTab.js`)
- `DetailBaseTemplate` → `ContactTemplate` (`templates/detail/ContactTemplate.js`)
- `DetailBaseTemplate` → `DetailHeaderTemplate` (`templates/detail/DetailHeaderTemplate.js`)
- `DetailBaseTemplate` → `DetailNavigationTemplate` (`templates/detail/DetailNavigationTemplate.js`)
- `BaseEditTab` → `ImportEditTab` (`views/edit/ImportEditTab.js`)
- `CapturedContentModel` → `ImportedTextModel` (`models/ImportedTextModel.js`)
- `BaseEditTab` → `JobEditTab` (`views/edit/JobEditTab.js`)
- `DetailBaseTemplate` → `JobTemplate` (`templates/detail/JobTemplate.js`)
- `CapturedContentModel` → `ReferenceModel` (`models/ReferenceModel.js`)
- `BaseEditTab` → `RequirementsEditTab` (`views/edit/RequirementsEditTab.js`)
- `DetailBaseTemplate` → `RequirementsTemplate` (`templates/detail/RequirementsTemplate.js`)
- `DetailBaseTemplate` → `SourcesTemplate` (`templates/detail/SourcesTemplate copy.js`)

## Klassen und ihre Abhängigkeiten
### `Analyzer`
- Datei: `analysis/Analyzer.js`
- Verwendete importierte Module:
  - `ParseText` → `analysis/parser/ParseText.js`
  - `TaskExtractor` → `analysis/extractors/TaskExtractor.js`
- Methoden:
  - `analyze()`
  - `detectSource()`

### `BenefitExtractor`
- Datei: `analysis/extractors/BenefitExtractor.js`
- Verwendete importierte Module:
  - `ParserConstants` → `constants/ParserConstants.js`
- Interne Methodenaufrufe (`this.method()`):
  - `extractBenefits()` → `containsKeyword()`
- Methoden:
  - `constructor()`
  - `extractBenefits()`
  - `containsKeyword()`

### `CompanyExtractor`
- Datei: `analysis/extractors/CompanyExtractor.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `constructor()`
  - `extractCompany()`

### `CompanyNameExtractor`
- Datei: `analysis/extractors/CompanyNameExtractor.js`
- Verwendete importierte Module:
  - `CompanyConstants` → `constants/CompanyConstants.js`
- Interne Methodenaufrufe (`this.method()`):
  - `extractCompanyName()` → `extractByContextPattern()`, `extractByFrequency()`, `extractByHeader()`, `extractBySuffix()`
  - `extractBySuffix()` → `extractNameBeforeSuffix()`
  - `extractByHeader()` → `isPhoneOrEmail()`
- Methoden:
  - `constructor()`
  - `extractCompanyName()`
  - `extractBySuffix()`
  - `extractByHeader()`
  - `extractByFrequency()`
  - `isPhoneOrEmail()`
  - `extractNameBeforeSuffix()`
  - `extractByContextPattern()`

### `DomainExtractor`
- Datei: `analysis/extractors/DomainExtractor.js`
- Verwendete importierte Module:
  - `WebConstants` → `constants/WebConstants.js`
  - `EmailExtractor` → `analysis/extractors/EmailExtractor.js`
- Interne Methodenaufrufe (`this.method()`):
  - `extractDomain()` → `extractByFrequency()`, `extractRawEmailDomain()`
- Methoden:
  - `constructor()`
  - `extractDomain()`
  - `extractRawEmailDomain()`
  - `extractByFrequency()`

### `EmailExtractor`
- Datei: `analysis/extractors/EmailExtractor.js`
- Verwendete importierte Module:
  - `CompanyConstants` → `constants/CompanyConstants.js`
- Interne Methodenaufrufe (`this.method()`):
  - `extractFirstEmail()` → `extractEmails()`
- Methoden:
  - `constructor()`
  - `extractEmails()`
  - `extractFirstEmail()`

### `JobExtractor`
- Datei: `analysis/extractors/JobExtractor.js`
- Verwendete importierte Module:
  - `MoneyExtractor` → `analysis/extractors/MoneyExtractor.js`
- Methoden:
  - `constructor()`
  - `extractJob()`

### `LocationExtractor`
- Datei: `analysis/extractors/LocationExtractor.js`
- Verwendete importierte Module:
  - `LocationConstants` → `constants/LocationConstants.js`
- Interne Methodenaufrufe (`this.method()`):
  - `extractLocation()` → `extractByKeyword()`, `extractByZipCity()`
- Methoden:
  - `constructor()`
  - `extractLocation()`
  - `extractByZipCity()`
  - `extractByKeyword()`

### `MoneyExtractor`
- Datei: `analysis/extractors/MoneyExtractor.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Interne Methodenaufrufe (`this.method()`):
  - `extractMoney()` → `extractChristmasPay()`, `extractSalary()`, `extractVacationPay()`
- Methoden:
  - `constructor()`
  - `extractMoney()`
  - `extractSalary()`
  - `extractVacationPay()`
  - `extractChristmasPay()`

### `PhoneExtractor`
- Datei: `analysis/extractors/PhoneExtractor.js`
- Verwendete importierte Module:
  - `CompanyConstants` → `constants/CompanyConstants.js`
- Interne Methodenaufrufe (`this.method()`):
  - `extractFirstPhoneNumber()` → `extractPhoneNumbers()`
- Methoden:
  - `constructor()`
  - `extractPhoneNumbers()`
  - `extractFirstPhoneNumber()`

### `PostBoxExtractor`
- Datei: `analysis/extractors/PostBoxExtractor.js`
- Verwendete importierte Module:
  - `PostBoxConstants` → `constants/PostBoxConstants.js`
- Methoden:
  - `constructor()`
  - `extractPostbox()`
  - `extractAllPostboxes()`

### `QualificationExtractor`
- Datei: `analysis/extractors/QualificationExtractor.js`
- Verwendete importierte Module:
  - `ParserConstants` → `constants/ParserConstants.js`
  - `LineParser` → `analysis/parser/LineParser.js`
- Interne Methodenaufrufe (`this.method()`):
  - `extractQualifications()` → `matchTarget()`
- Methoden:
  - `constructor()`
  - `extractQualifications()`
  - `matchTarget()`

### `StreetExtractor`
- Datei: `analysis/extractors/StreetExtractor.js`
- Verwendete importierte Module:
  - `CompanyConstants` → `constants/CompanyConstants.js`
  - `AddressConstants` → `constants/AddressConstants.js`
- Interne Methodenaufrufe (`this.method()`):
  - `extractStreet()` → `emptyData()`, `findAnchorIndex()`, `searchAllLines()`, `searchWithinRadius()`
  - `searchWithinRadius()` → `searchLines()`
  - `searchAllLines()` → `searchLines()`
- Methoden:
  - `constructor()`
  - `extractStreet()`
  - `emptyData()`
  - `findAnchorIndex()`
  - `searchWithinRadius()`
  - `searchAllLines()`
  - `searchLines()`

### `TaskExtractor`
- Datei: `analysis/extractors/TaskExtractor.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `extract()`

### `LineParser`
- Datei: `analysis/parser/LineParser.js`
- Verwendete importierte Module:
  - `ParserConstants` → `constants/ParserConstants.js`
  - `CompanyConstants` → `constants/CompanyConstants.js`
- Methoden:
  - `constructor()`
  - `getTags()`

### `ParseText`
- Datei: `analysis/parser/ParseText.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Interne Methodenaufrufe (`this.method()`):
  - `constructor()` → `add()`
- Methoden:
  - `constructor()`
  - `add()`
  - `parse()`

### `SectionParser`
- Datei: `analysis/parser/SectionParser.js`
- Verwendete importierte Module:
  - `LineParser` → `analysis/parser/LineParser.js`
  - `SectionPart` → `analysis/parser/SectionPart.js`
- Interne Methodenaufrufe (`this.method()`):
  - `addLine()` → `addContentLine()`, `findSection()`, `startSection()`
  - `findSection()` → `matchesAllOf()`, `matchesTitles()`
  - `addLines()` → `addLine()`
  - `parse()` → `addLines()`
- Methoden:
  - `constructor()`
  - `addLine()`
  - `startSection()`
  - `addContentLine()`
  - `findSection()`
  - `matchesTitles()`
  - `matchesAllOf()`
  - `addLines()`
  - `parse()`
  - `getSections()`

### `SectionPart`
- Datei: `analysis/parser/SectionPart.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `constructor()`
  - `addHeadline()`
  - `addLine()`
  - `addTags()`

### `TextCleaner`
- Datei: `analysis/parser/TextCleaner.js`
- Verwendete importierte Module:
  - `ParserConstants` → `constants/ParserConstants.js`
- Interne Methodenaufrufe (`this.method()`):
  - `constructor()` → `removeSimilar()`, `stripBulletPrefix()`
- Lokale Funktionen innerhalb von Methoden:
  - `removeSimilar()` → `normalize()`
- Methoden:
  - `constructor()`
  - `removeInvisibleCharacters()`
  - `stripBulletPrefix()`
  - `unique()`
  - `removeSimilar()`

### `UrlImporter`
- Datei: `api/UrlImporter.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Interne Methodenaufrufe (`this.method()`):
  - `fetch()` → `getHtml()`, `htmlToText()`
- Methoden:
  - `async fetch()`
  - `async getHtml()`
  - `htmlToText()`

### `AddressConstants`
- Datei: `constants/AddressConstants.js`
- Verwendete importierte Module:
  - `GlobalUtils` → `utils/GlobalUtils.js`
- Methoden:

### `CompanyConstants`
- Datei: `constants/CompanyConstants.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:

### `JobConstants`
- Datei: `constants/JobConstants.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `static getClass()`

### `LegalFormConstants`
- Datei: `constants/LegalFormConstants.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `static list()`

### `LocationConstants`
- Datei: `constants/LocationConstants.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:

### `ParserConstants`
- Datei: `constants/ParserConstants.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:

### `PostBoxConstants`
- Datei: `constants/PostBoxConstants.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:

### `SkillAliasConstants`
- Datei: `constants/SkillAliasConstants.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `static resolve()`

### `SkillConstants`
- Datei: `constants/SkillConstants.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `static getClass()`

### `WebConstants`
- Datei: `constants/WebConstants.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:

### `CommunicationController`
- Datei: `controllers/CommunicationController.js`
- Verwendete importierte Module:
  - `ApplicationHistoryModel` → `models/ApplicationHistoryModel.js`
  - `InputPrompt` → `views/windows/InputPrompt.js`
  - `UiContact` → `ui/detail/UiContact.js`
  - `FormatUtils` → `utils/FormatUtils.js`; Aufrufe: `toGermanDateTime`
- Methoden:
  - `constructor()`
  - `async logCall()`

### `CommunicationSectionController`
- Datei: `controllers/detail/CommunicationSectionController.js`
- Verwendete importierte Module:
  - `InputPrompt` → `views/windows/InputPrompt.js`
  - `VerifyPrompt` → `views/windows/VerifyPrompt.js`
  - `ApplicationHistoryModel` → `models/ApplicationHistoryModel.js`
  - `FormatUtils` → `utils/FormatUtils.js`; Aufrufe: `toGermanDateTime`
- Interne Methodenaufrufe (`this.method()`):
  - `loadDraft()` → `draftKey()`
  - `saveDraft()` → `draftKey()`
  - `clearDraft()` → `draftKey()`
- Methoden:
  - `constructor()`
  - `addEntry()`
  - `async deleteEntry()`
  - `async editEntry()`
  - `draftKey()`
  - `loadDraft()`
  - `saveDraft()`
  - `clearDraft()`

### `ContactSectionController`
- Datei: `controllers/detail/ContactSectionController.js`
- Verwendete importierte Module:
  - `ContactPrompt` → `views/windows/ContactPrompt.js`
  - `VerifyPrompt` → `views/windows/VerifyPrompt.js`
  - `ContactModel` → `models/ContactModel.js`
  - `CommunicationController` → `controllers/CommunicationController.js`
- Interne Methodenaufrufe (`this.method()`):
  - `addContact()` → `persist()`
  - `selectContact()` → `persist()`
  - `editContact()` → `persist()`
  - `removeContact()` → `persist()`
- Methoden:
  - `constructor()`
  - `async persist()`
  - `async addContact()`
  - `async selectContact()`
  - `async editContact()`
  - `async callContact()`
  - `async removeContact()`

### `DocumentsSectionController`
- Datei: `controllers/detail/DocumentsSectionController.js`
- Verwendete importierte Module:
  - `UploadFileModel` → `models/UploadFileModel.js`
  - `VerifyPrompt` → `views/windows/VerifyPrompt.js`
  - `InfoPrompt` → `views/windows/InfoPrompt.js`
- Interne Methodenaufrufe (`this.method()`):
  - `viewFile()` → `checkAvailability()`
  - `downloadFile()` → `checkAvailability()`
  - `refreshAvailability()` → `checkAvailability()`
  - `uploadFile()` → `assign()`, `upload()`
  - `removeFile()` → `deleteOnServer()`
- Methoden:
  - `constructor()`
  - `async viewFile()`
  - `async downloadFile()`
  - `async refreshAvailability()`
  - `async checkAvailability()`
  - `async uploadFile()`
  - `assign()`
  - `async upload()`
  - `async removeFile()`
  - `async deleteOnServer()`

### `EditController`
- Datei: `controllers/edit/EditController.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `constructor()`
  - `async save()`
  - `cancel()`

### `OverviewListController`
- Datei: `controllers/overview/OverviewListController.js`
- Verwendete importierte Module:
  - `JobConstants` → `constants/JobConstants.js`
  - `CommunicationController` → `controllers/CommunicationController.js`
- Interne Methodenaufrufe (`this.method()`):
  - `executeAction()` → `getStatus()`
- Methoden:
  - `constructor()`
  - `async executeAction()`
  - `executeDecision()`
  - `getStatus()`

### `SkillsController`
- Datei: `controllers/skills/SkillsController.js`
- Verwendete importierte Module:
  - `InfoPrompt` → `views/windows/InfoPrompt.js`
- Methoden:
  - `constructor()`
  - `async setLevel()`
  - `async addSkill()`
  - `async mergeSkills()`

### `NavigationState`
- Datei: `core/NavigationState.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `static setLastDetail()`

### `Router`
- Datei: `core/Router.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Interne Methodenaufrufe (`this.method()`):
  - `start()` → `render()`
- Methoden:
  - `constructor()`
  - `start()`
  - `render()`

### `CommunicationSectionEvent`
- Datei: `events/detail/CommunicationSectionEvent.js`
- Verwendete importierte Module:
  - `CommunicationSectionController` → `controllers/detail/CommunicationSectionController.js`
- Interne Methodenaufrufe (`this.method()`):
  - `bind()` → `bindAdd()`, `bindDelete()`, `bindDraft()`, `bindEdit()`
- Lokale Funktionen innerhalb von Methoden:
  - `bindDraft()` → `persistDraft()`
- Methoden:
  - `constructor()`
  - `bind()`
  - `bindAdd()`
  - `bindEdit()`
  - `bindDelete()`
  - `bindDraft()`

### `ContactSectionEvent`
- Datei: `events/detail/ContactSectionEvent.js`
- Verwendete importierte Module:
  - `ContactSectionController` → `controllers/detail/ContactSectionController.js`
- Interne Methodenaufrufe (`this.method()`):
  - `bind()` → `bindAdd()`, `bindCall()`, `bindEdit()`, `bindRemove()`, `bindSelect()`
- Methoden:
  - `constructor()`
  - `bind()`
  - `bindCall()`
  - `bindAdd()`
  - `bindSelect()`
  - `bindEdit()`
  - `bindRemove()`

### `DetailNavigationEvent`
- Datei: `events/detail/DetailNavigationEvent.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Interne Methodenaufrufe (`this.method()`):
  - `bind()` → `highlight()`, `onSectionChange()`
- Methoden:
  - `constructor()`
  - `bind()`
  - `highlight()`
  - `setActiveSection()`

### `DocumentsSectionEvent`
- Datei: `events/detail/DocumentsSectionEvent.js`
- Verwendete importierte Module:
  - `DocumentsSectionController` → `controllers/detail/DocumentsSectionController.js`
- Interne Methodenaufrufe (`this.method()`):
  - `bind()` → `bindDownload()`, `bindRemove()`, `bindUploadChange()`, `bindUploadTrigger()`, `bindView()`
- Methoden:
  - `constructor()`
  - `bind()`
  - `bindDownload()`
  - `bindView()`
  - `bindUploadTrigger()`
  - `bindUploadChange()`
  - `bindRemove()`

### `SourcesSectionEvent`
- Datei: `events/detail/SourcesSectionEvent.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Interne Methodenaufrufe (`this.method()`):
  - `bind()` → `bindRowClick()`, `bindSort()`, `updateArrows()`
  - `bindSort()` → `applySort()`, `updateArrows()`
- Methoden:
  - `constructor()`
  - `bind()`
  - `bindSort()`
  - `applySort()`
  - `updateArrows()`
  - `bindRowClick()`

### `EditNavigationEvent`
- Datei: `events/edit/EditNavigationEvent.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Interne Methodenaufrufe (`this.method()`):
  - `bind()` → `showSection()`
- Methoden:
  - `bind()`
  - `showSection()`

### `OverviewEvent`
- Datei: `events/overview/OverviewEvent.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Interne Methodenaufrufe (`this.method()`):
  - `bind()` → `toggleCompact()`
- Methoden:
  - `constructor()`
  - `bind()`
  - `toggleCompact()`

### `OverviewFilterEvent`
- Datei: `events/overview/OverviewFilterEvent.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Interne Methodenaufrufe (`this.method()`):
  - `bind()` → `change()`
- Methoden:
  - `constructor()`
  - `bind()`
  - `change()`

### `OverviewListEvent`
- Datei: `events/overview/OverviewListEvent.js`
- Verwendete importierte Module:
  - `OverviewListController` → `controllers/overview/OverviewListController.js`
- Interne Methodenaufrufe (`this.method()`):
  - `bind()` → `bindAction()`, `bindDecision()`, `bindEdit()`, `bindView()`
- Methoden:
  - `constructor()`
  - `bind()`
  - `bindView()`
  - `bindEdit()`
  - `bindAction()`
  - `bindDecision()`

### `SkillsEvent`
- Datei: `events/skills/SkillsEvent.js`
- Verwendete importierte Module:
  - `SkillsController` → `controllers/skills/SkillsController.js`
- Interne Methodenaufrufe (`this.method()`):
  - `bind()` → `bindAdd()`, `bindLevel()`, `bindMerge()`, `bindSelect()`
- Methoden:
  - `constructor()`
  - `bind()`
  - `bindAdd()`
  - `bindSelect()`
  - `bindLevel()`
  - `bindMerge()`

### `AddressModel`
- Datei: `models/AddressModel.js`
- Verwendete importierte Module:
  - `StreetModel` → `models/StreetModel.js`
  - `CityModel` → `models/CityModel.js`
- Interne Methodenaufrufe (`this.method()`):
  - `text()` → `lines()`
- Methoden:
  - `constructor()`
  - `data()`
  - `lines()`
  - `text()`

### `AppModel`
- Datei: `models/AppModel.js`
- Verwendete importierte Module:
  - `CompanyModel` → `models/CompanyModel.js`
  - `ContactModel` → `models/ContactModel.js`
  - `BenefitsModel` → `models/BenefitsModel.js`
  - `ApplicationModel` → `models/ApplicationModel.js`
  - `ReferenceModel` → `models/ReferenceModel.js`
  - `JobModel` → `models/JobModel.js`
  - `QualificationModel` → `models/QualificationModel.js`
  - `ImportedTextModel` → `models/ImportedTextModel.js`
- Methoden:
  - `constructor()`
  - `data()`
  - `static fromData()`
  - `addContact()`

### `ApplicationEmailModel`
- Datei: `models/ApplicationEmailModel.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `constructor()`
  - `data()`

### `ApplicationHistoryModel`
- Datei: `models/ApplicationHistoryModel.js`
- Verwendete importierte Module:
  - `ApplicationPortalModel` → `models/ApplicationPortalModel.js`
  - `ApplicationEmailModel` → `models/ApplicationEmailModel.js`
  - `ApplicationPhoneModel` → `models/ApplicationPhoneModel.js`
  - `ApplicationPersonalModel` → `models/ApplicationPersonalModel.js`
- Methoden:
  - `constructor()`
  - `data()`

### `ApplicationModel`
- Datei: `models/ApplicationModel.js`
- Verwendete importierte Module:
  - `ApplicationStatusHistoryModel` → `models/ApplicationStatusHistoryModel.js`
  - `ApplicationHistoryModel` → `models/ApplicationHistoryModel.js`
  - `UploadFileModel` → `models/UploadFileModel.js`
- Methoden:
  - `constructor()`
  - `data()`
  - `addStatus()`

### `ApplicationPersonalModel`
- Datei: `models/ApplicationPersonalModel.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `constructor()`
  - `data()`

### `ApplicationPhoneModel`
- Datei: `models/ApplicationPhoneModel.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `constructor()`
  - `data()`

### `ApplicationPortalModel`
- Datei: `models/ApplicationPortalModel.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `constructor()`
  - `data()`

### `ApplicationStatusHistoryModel`
- Datei: `models/ApplicationStatusHistoryModel.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `constructor()`
  - `data()`

### `BenefitsModel`
- Datei: `models/BenefitsModel.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `constructor()`
  - `data()`
  - `add()`

### `CapturedContentModel`
- Datei: `models/CapturedContentModel.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `constructor()`
  - `data()`

### `CityModel`
- Datei: `models/CityModel.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `constructor()`
  - `data()`
  - `text()`

### `CompanyModel`
- Datei: `models/CompanyModel.js`
- Verwendete importierte Module:
  - `AddressModel` → `models/AddressModel.js`
- Methoden:
  - `constructor()`
  - `data()`
  - `verified()`

### `ContactModel`
- Datei: `models/ContactModel.js`
- Verwendete importierte Module:
  - `NameModel` → `models/NameModel.js`
- Methoden:
  - `constructor()`
  - `data()`

### `ImportedTextModel`
- Datei: `models/ImportedTextModel.js`
- Erbt von: `CapturedContentModel`
- Verwendete importierte Module:
  - `CapturedContentModel` → `models/CapturedContentModel.js`
- Methoden:

### `JobModel`
- Datei: `models/JobModel.js`
- Verwendete importierte Module:
  - `AddressModel` → `models/AddressModel.js`
- Methoden:
  - `constructor()`
  - `data()`

### `NameModel`
- Datei: `models/NameModel.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `constructor()`
  - `data()`
  - `full()`

### `QualificationModel`
- Datei: `models/QualificationModel.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Interne Methodenaufrufe (`this.method()`):
  - `data()` → `setArea()`
- Methoden:
  - `constructor()`
  - `data()`
  - `setArea()`
  - `add()`

### `ReferenceModel`
- Datei: `models/ReferenceModel.js`
- Erbt von: `CapturedContentModel`
- Verwendete importierte Module:
  - `CapturedContentModel` → `models/CapturedContentModel.js`
- Methoden:
  - `constructor()`
  - `data()`

### `SkillListModel`
- Datei: `models/SkillListModel.js`
- Verwendete importierte Module:
  - `SkillModel` → `models/SkillModel.js`
- Methoden:
  - `constructor()`
  - `data()`
  - `findByName()`

### `SkillModel`
- Datei: `models/SkillModel.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `constructor()`
  - `data()`
  - `matches()`
  - `static normalize()`

### `StreetModel`
- Datei: `models/StreetModel.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `constructor()`
  - `data()`
  - `text()`

### `UploadFileModel`
- Datei: `models/UploadFileModel.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `constructor()`
  - `data()`
  - `displayName()`

### `AppCache`
- Datei: `store/AppCache.js`
- Verwendete importierte Module:
  - `AppDB` → `store/AppDB.js`
- Methoden:
  - `constructor()`
  - `async load()`
  - `getAll()`
  - `getById()`
  - `async save()`
  - `async delete()`

### `AppDB`
- Datei: `store/AppDB.js`
- Verwendete importierte Module:
  - `LocalDB` → `store/LocalDB.js`; Aufrufe: `create, delete, get, updateOrAdd`
  - `AppModel` → `models/AppModel.js`
- Interne Methodenaufrufe (`this.method()`):
  - `save()` → `ensureStore()`
  - `get()` → `ensureStore()`
  - `getAll()` → `ensureStore()`
  - `delete()` → `ensureStore()`
- Methoden:
  - `constructor()`
  - `async ensureStore()`
  - `async save()`
  - `async get()`
  - `async getAll()`
  - `async delete()`

### `LocalDB`
- Datei: `store/LocalDB.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `static request()`
  - `static async open()`
  - `static async create()`
  - `static async use()`
  - `static async store()`
  - `static async add()`
  - `static async update()`
  - `static async updateOrAdd()`
  - `static async delete()`
  - `static async get()`

### `SkillCache`
- Datei: `store/SkillCache.js`
- Verwendete importierte Module:
  - `SkillDB` → `store/SkillDB.js`
  - `SkillModel` → `models/SkillModel.js`
  - `SkillAliasConstants` → `constants/SkillAliasConstants.js`; Aufrufe: `resolve`
- Methoden:
  - `constructor()`
  - `async load()`
  - `getAll()`
  - `async setLevel()`
  - `async addManual()`
  - `async merge()`
  - `async syncFromApplication()`

### `SkillDB`
- Datei: `store/SkillDB.js`
- Verwendete importierte Module:
  - `LocalDB` → `store/LocalDB.js`; Aufrufe: `create, get, update`
  - `AppDB` → `store/AppDB.js`
  - `SkillListModel` → `models/SkillListModel.js`
- Interne Methodenaufrufe (`this.method()`):
  - `get()` → `ensureStore()`
  - `save()` → `ensureStore()`
- Methoden:
  - `async ensureStore()`
  - `async get()`
  - `async save()`

### `ApplicationTemplate`
- Datei: `templates/detail/ApplicationTemplate.js`
- Erbt von: `DetailBaseTemplate`
- Verwendete importierte Module:
  - `DetailBaseTemplate` → `templates/detail/DetailBaseTemplate.js`
  - `HtmlUtils` → `utils/HtmlUtils.js`; Aufrufe: `escape`
  - `FormatUtils` → `utils/FormatUtils.js`; Aufrufe: `toGermanDate`
  - `JobConstants` → `constants/JobConstants.js`
- Interne Methodenaufrufe (`this.method()`):
  - `render()` → `historyList()`, `link()`, `uploadRows()`
  - `historyList()` → `channelEntries()`, `creationEntries()`, `historyItem()`, `statusEntries()`
- Methoden:
  - `render()`
  - `historyList()`
  - `creationEntries()`
  - `channelEntries()`
  - `statusEntries()`
  - `historyItem()`
  - `uploadRows()`

### `BenefitsTemplate`
- Datei: `templates/detail/BenefitsTemplate.js`
- Erbt von: `DetailBaseTemplate`
- Verwendete importierte Module:
  - `DetailBaseTemplate` → `templates/detail/DetailBaseTemplate.js`
- Interne Methodenaufrufe (`this.method()`):
  - `render()` → `badges()`, `list()`
- Methoden:
  - `render()`

### `CommunicationTemplate`
- Datei: `templates/detail/CommunicationTemplate.js`
- Erbt von: `DetailBaseTemplate`
- Verwendete importierte Module:
  - `DetailBaseTemplate` → `templates/detail/DetailBaseTemplate.js`
  - `HtmlUtils` → `utils/HtmlUtils.js`; Aufrufe: `escape`
- Interne Methodenaufrufe (`this.method()`):
  - `render()` → `communicationList()`
  - `communicationList()` → `communicationItem()`
- Methoden:
  - `render()`
  - `communicationList()`
  - `communicationItem()`

### `CompanyTemplate`
- Datei: `templates/detail/CompanyTemplate.js`
- Erbt von: `DetailBaseTemplate`
- Verwendete importierte Module:
  - `DetailBaseTemplate` → `templates/detail/DetailBaseTemplate.js`
  - `HtmlUtils` → `utils/HtmlUtils.js`; Aufrufe: `escape`
  - `FormatUtils` → `utils/FormatUtils.js`; Aufrufe: `toGermanDate`
- Interne Methodenaufrufe (`this.method()`):
  - `render()` → `link()`, `list()`
- Methoden:
  - `render()`

### `ContactTemplate`
- Datei: `templates/detail/ContactTemplate.js`
- Erbt von: `DetailBaseTemplate`
- Verwendete importierte Module:
  - `DetailBaseTemplate` → `templates/detail/DetailBaseTemplate.js`
  - `HtmlUtils` → `utils/HtmlUtils.js`; Aufrufe: `escape`
  - `UiContact` → `ui/detail/UiContact.js`
- Interne Methodenaufrufe (`this.method()`):
  - `render()` → `contactListRows()`
- Methoden:
  - `render()`
  - `contactListRows()`

### `DetailBaseTemplate`
- Datei: `templates/detail/DetailBaseTemplate.js`
- Verwendete importierte Module:
  - `HtmlUtils` → `utils/HtmlUtils.js`; Aufrufe: `escape`
- Interne Methodenaufrufe (`this.method()`):
  - `links()` → `link()`
  - `link()` → `links()`
- Methoden:
  - `list()`
  - `badges()`
  - `links()`
  - `link()`

### `DetailHeaderTemplate`
- Datei: `templates/detail/DetailHeaderTemplate.js`
- Erbt von: `DetailBaseTemplate`
- Verwendete importierte Module:
  - `DetailBaseTemplate` → `templates/detail/DetailBaseTemplate.js`
  - `HtmlUtils` → `utils/HtmlUtils.js`; Aufrufe: `escape`
  - `JobConstants` → `constants/JobConstants.js`; Aufrufe: `getClass`
- Methoden:
  - `render()`

### `DetailNavigationTemplate`
- Datei: `templates/detail/DetailNavigationTemplate.js`
- Erbt von: `DetailBaseTemplate`
- Verwendete importierte Module:
  - `DetailBaseTemplate` → `templates/detail/DetailBaseTemplate.js`
- Methoden:
  - `render()`

### `JobTemplate`
- Datei: `templates/detail/JobTemplate.js`
- Erbt von: `DetailBaseTemplate`
- Verwendete importierte Module:
  - `DetailBaseTemplate` → `templates/detail/DetailBaseTemplate.js`
  - `HtmlUtils` → `utils/HtmlUtils.js`; Aufrufe: `escape`
  - `FormatUtils` → `utils/FormatUtils.js`; Aufrufe: `formatCurrency`
- Interne Methodenaufrufe (`this.method()`):
  - `render()` → `badges()`, `list()`, `workLocationText()`
- Methoden:
  - `render()`
  - `workLocationText()`

### `RequirementsTemplate`
- Datei: `templates/detail/RequirementsTemplate.js`
- Erbt von: `DetailBaseTemplate`
- Verwendete importierte Module:
  - `DetailBaseTemplate` → `templates/detail/DetailBaseTemplate.js`
  - `HtmlUtils` → `utils/HtmlUtils.js`; Aufrufe: `escape`
  - `SkillConstants` → `constants/SkillConstants.js`; Aufrufe: `getClass`
- Interne Methodenaufrufe (`this.method()`):
  - `render()` → `list()`, `skillBadges()`
- Methoden:
  - `render()`
  - `skillBadges()`

### `SourcesTemplate`
- Datei: `templates/detail/SourcesTemplate copy.js`
- Erbt von: `DetailBaseTemplate`
- Verwendete importierte Module:
  - `DetailBaseTemplate` → `templates/detail/DetailBaseTemplate.js`
  - `HtmlUtils` → `utils/HtmlUtils.js`; Aufrufe: `escape`
- Interne Methodenaufrufe (`this.method()`):
  - `render()` → `link()`, `sourceRows()`
  - `sourceRows()` → `link()`
- Methoden:
  - `render()`
  - `sourceRows()`

### `BenefitsEditTemplate`
- Datei: `templates/edit/BenefitsEditTemplate.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `render()`

### `CompanyEditTemplate`
- Datei: `templates/edit/CompanyEditTemplate.js`
- Verwendete importierte Module:
  - `LegalFormConstants` → `constants/LegalFormConstants.js`; Aufrufe: `list`
- Methoden:
  - `render()`

### `ContactEditTemplate`
- Datei: `templates/edit/ContactEditTemplate.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `render()`

### `EditHeaderTemplate`
- Datei: `templates/edit/EditHeaderTemplate.js`
- Verwendete importierte Module:
  - `HtmlUtils` → `utils/HtmlUtils.js`; Aufrufe: `escape`
- Methoden:
  - `render()`

### `EditNavigationTemplate`
- Datei: `templates/edit/EditNavigationTemplate.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `render()`

### `ImportEditTemplate`
- Datei: `templates/edit/ImportEditTemplate.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Interne Methodenaufrufe (`this.method()`):
  - `render()` → `bookmarkletHref()`
- Methoden:
  - `render()`
  - `bookmarkletHref()`

### `JobEditTemplate`
- Datei: `templates/edit/JobEditTemplate.js`
- Verwendete importierte Module:
  - `JobConstants` → `constants/JobConstants.js`
- Methoden:
  - `render()`

### `RequirementsEditTemplate`
- Datei: `templates/edit/RequirementsEditTemplate.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `render()`

### `ApplicationCardTemplate`
- Datei: `templates/overview/ApplicationCardTemplate.js`
- Verwendete importierte Module:
  - `JobConstants` → `constants/JobConstants.js`; Aufrufe: `getClass`
  - `FormatUtils` → `utils/FormatUtils.js`; Aufrufe: `toGermanDate`
  - `HtmlUtils` → `utils/HtmlUtils.js`; Aufrufe: `escape`
- Interne Methodenaufrufe (`this.method()`):
  - `create()` → `prepareData()`
  - `prepareData()` → `createActions()`, `createCity()`, `createCompany()`, `createJob()`, `createStatus()`, `getStatus()`
  - `createActions()` → `createActionButton()`, `createDecisionButtons()`, `getAction()`
- Methoden:
  - `create()`
  - `prepareData()`
  - `createStatus()`
  - `createCompany()`
  - `createJob()`
  - `createCity()`
  - `createActions()`
  - `createActionButton()`
  - `createDecisionButtons()`
  - `getAction()`
  - `getStatus()`

### `OverviewTemplate`
- Datei: `templates/overview/OverviewTemplate.js`
- Verwendete importierte Module:
  - `JobConstants` → `constants/JobConstants.js`
- Interne Methodenaufrufe (`this.method()`):
  - `create()` → `createHeader()`, `createList()`
  - `createHeader()` → `createEmploymentTypeOptions()`, `createStatusOptions()`, `createWorkModelOptions()`
- Methoden:
  - `create()`
  - `createHeader()`
  - `createStatusOptions()`
  - `createWorkModelOptions()`
  - `createEmploymentTypeOptions()`
  - `createList()`

### `SkillsTemplate`
- Datei: `templates/skills/SkillsTemplate.js`
- Verwendete importierte Module:
  - `HtmlUtils` → `utils/HtmlUtils.js`; Aufrufe: `escape`
  - `SkillConstants` → `constants/SkillConstants.js`; Aufrufe: `getClass`
- Interne Methodenaufrufe (`this.method()`):
  - `render()` → `badgeList()`, `detail()`
  - `detail()` → `levelBadge()`
- Methoden:
  - `render()`
  - `badgeList()`
  - `detail()`
  - `levelBadge()`

### `CallPromptTemplate`
- Datei: `templates/windows/CallPromptTemplate.js`
- Verwendete importierte Module:
  - `HtmlUtils` → `utils/HtmlUtils.js`; Aufrufe: `escape`
- Interne Methodenaufrufe (`this.method()`):
  - `create()` → `createLink()`
- Methoden:
  - `create()`
  - `createLink()`

### `ContactPromptTemplate`
- Datei: `templates/windows/ContactPromptTemplate.js`
- Verwendete importierte Module:
  - `HtmlUtils` → `utils/HtmlUtils.js`; Aufrufe: `escape`
- Methoden:
  - `create()`

### `InfoPromptTemplate`
- Datei: `templates/windows/InfoPromptTemplate.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `create()`

### `InputPromptTemplate`
- Datei: `templates/windows/InputPromptTemplate.js`
- Verwendete importierte Module:
  - `HtmlUtils` → `utils/HtmlUtils.js`; Aufrufe: `escape`
  - `FormatUtils` → `utils/FormatUtils.js`; Aufrufe: `toGermanDateTime`
- Interne Methodenaufrufe (`this.method()`):
  - `create()` → `createContactLine()`
  - `createContactLine()` → `createEmailLink()`, `createLink()`
- Methoden:
  - `create()`
  - `createContactLine()`
  - `createEmailLink()`
  - `createLink()`

### `UrlPromptTemplate`
- Datei: `templates/windows/UrlPromptTemplate.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `create()`

### `VerifyPromptTemplate`
- Datei: `templates/windows/VerifyPromptTemplate.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `create()`

### `UiCompany`
- Datei: `ui/detail/UiCompany.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `constructor()`
  - `toHTML()`
  - `fromHTML()`

### `UiContact`
- Datei: `ui/detail/UiContact.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `constructor()`
  - `name()`
  - `role()`
  - `email()`
  - `phone()`

### `UiJob`
- Datei: `ui/detail/UiJob.js`
- Verwendete importierte Module:
  - `UiCompany` → `ui/detail/UiCompany.js`
- Methoden:
  - `constructor()`
  - `toHTML()`
  - `fromHTML()`

### `CompanyImageList`
- Datei: `ui/edit/CompanyImageList.js`
- Verwendete importierte Module:
  - `HtmlUtils` → `utils/HtmlUtils.js`; Aufrufe: `escape`
- Interne Methodenaufrufe (`this.method()`):
  - `setImages()` → `render()`
  - `render()` → `render()`, `row()`
- Methoden:
  - `constructor()`
  - `setImages()`
  - `getImages()`
  - `getMainImageIndex()`
  - `render()`
  - `row()`

### `OverviewFilter`
- Datei: `ui/overview/OverviewFilter.js`
- Verwendete importierte Module:
  - `JobConstants` → `constants/JobConstants.js`
- Interne Methodenaufrufe (`this.method()`):
  - `getApplications()` → `matches()`, `sort()`
  - `matches()` → `matchesEmploymentType()`, `matchesSearch()`, `matchesStatus()`, `matchesWorkModel()`
  - `matchesStatus()` → `getStatus()`
  - `sort()` → `getCompanyName()`
- Methoden:
  - `constructor()`
  - `getApplications()`
  - `matches()`
  - `matchesSearch()`
  - `matchesStatus()`
  - `matchesWorkModel()`
  - `matchesEmploymentType()`
  - `sort()`
  - `getStatus()`
  - `getCompanyName()`

### `FormatUtils`
- Datei: `utils/FormatUtils.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `static toGermanDate()`
  - `static toGermanDateTime()`
  - `static formatCurrency()`

### `GlobalUtils`
- Datei: `utils/GlobalUtils.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `static escapeRegExp()`

### `HtmlUtils`
- Datei: `utils/HtmlUtils.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Methoden:
  - `static escape()`

### `DetailView`
- Datei: `views/detail/DetailView.js`
- Verwendete importierte Module:
  - `CompanyTemplate` → `templates/detail/CompanyTemplate.js`
  - `ContactTemplate` → `templates/detail/ContactTemplate.js`
  - `JobTemplate` → `templates/detail/JobTemplate.js`
  - `RequirementsTemplate` → `templates/detail/RequirementsTemplate.js`
  - `BenefitsTemplate` → `templates/detail/BenefitsTemplate.js`
  - `SourcesTemplate` → `templates/detail/SourcesTemplate.js`
  - `ApplicationTemplate` → `templates/detail/ApplicationTemplate.js`
  - `CommunicationTemplate` → `templates/detail/CommunicationTemplate.js`
  - `DetailHeaderTemplate` → `templates/detail/DetailHeaderTemplate.js`
  - `DetailNavigationTemplate` → `templates/detail/DetailNavigationTemplate.js`
  - `DetailNavigationEvent` → `events/detail/DetailNavigationEvent.js`
  - `CommunicationSectionEvent` → `events/detail/CommunicationSectionEvent.js`
  - `ContactSectionEvent` → `events/detail/ContactSectionEvent.js`
  - `SourcesSectionEvent` → `events/detail/SourcesSectionEvent.js`
  - `DocumentsSectionEvent` → `events/detail/DocumentsSectionEvent.js`
  - `VerifyPrompt` → `views/windows/VerifyPrompt.js`
  - `NavigationState` → `core/NavigationState.js`; Aufrufe: `setLastDetail`
- Interne Methodenaufrufe (`this.method()`):
  - `render()` → `bindDelete()`, `showSection()`
  - `showSection()` → `bindSectionEvents()`, `getTemplate()`
  - `bindSectionEvents()` → `showSection()`
- Methoden:
  - `constructor()`
  - `render()`
  - `bindDelete()`
  - `showSection()`
  - `getTemplate()`
  - `bindSectionEvents()`

### `BaseEditTab`
- Datei: `views/edit/BaseEditTab.js`
- Verwendete importierte Module:
  - `HtmlUtils` → `utils/HtmlUtils.js`; Aufrufe: `escape`
- Interne Methodenaufrufe (`this.method()`):
  - `list()` → `get()`
- Methoden:
  - `constructor()`
  - `get()`
  - `set()`
  - `list()`
  - `escapeAttribute()`

### `BenefitsEditTab`
- Datei: `views/edit/BenefitsEditTab.js`
- Erbt von: `BaseEditTab`
- Verwendete importierte Module:
  - `BaseEditTab` → `views/edit/BaseEditTab.js`
  - `BenefitsEditTemplate` → `templates/edit/BenefitsEditTemplate.js`
- Interne Methodenaufrufe (`this.method()`):
  - `init()` → `set()`
  - `applyAnalysis()` → `set()`
  - `save()` → `list()`
- Methoden:
  - `render()`
  - `init()`
  - `applyAnalysis()`
  - `save()`

### `CompanyEditTab`
- Datei: `views/edit/CompanyEditTab.js`
- Erbt von: `BaseEditTab`
- Verwendete importierte Module:
  - `BaseEditTab` → `views/edit/BaseEditTab.js`
  - `CompanyEditTemplate` → `templates/edit/CompanyEditTemplate.js`
  - `CompanyImageList` → `ui/edit/CompanyImageList.js`
- Interne Methodenaufrufe (`this.method()`):
  - `init()` → `set()`
  - `applyAnalysis()` → `set()`
  - `save()` → `get()`, `list()`
- Methoden:
  - `render()`
  - `init()`
  - `applyAnalysis()`
  - `save()`

### `ContactEditTab`
- Datei: `views/edit/ContactEditTab.js`
- Erbt von: `BaseEditTab`
- Verwendete importierte Module:
  - `BaseEditTab` → `views/edit/BaseEditTab.js`
  - `ContactEditTemplate` → `templates/edit/ContactEditTemplate.js`
  - `ContactTemplate` → `templates/detail/ContactTemplate.js`
  - `ContactSectionEvent` → `events/detail/ContactSectionEvent.js`
- Interne Methodenaufrufe (`this.method()`):
  - `init()` → `renderContactSection()`
  - `renderContactSection()` → `renderContactSection()`
- Methoden:
  - `constructor()`
  - `render()`
  - `init()`
  - `renderContactSection()`
  - `applyAnalysis()`
  - `save()`

### `EditView`
- Datei: `views/edit/EditView.js`
- Verwendete importierte Module:
  - `AppModel` → `models/AppModel.js`
  - `EditHeaderTemplate` → `templates/edit/EditHeaderTemplate.js`
  - `EditNavigationTemplate` → `templates/edit/EditNavigationTemplate.js`
  - `EditNavigationEvent` → `events/edit/EditNavigationEvent.js`
  - `EditController` → `controllers/edit/EditController.js`
  - `ImportEditTab` → `views/edit/ImportEditTab.js`
  - `CompanyEditTab` → `views/edit/CompanyEditTab.js`
  - `ContactEditTab` → `views/edit/ContactEditTab.js`
  - `JobEditTab` → `views/edit/JobEditTab.js`
  - `RequirementsEditTab` → `views/edit/RequirementsEditTab.js`
  - `BenefitsEditTab` → `views/edit/BenefitsEditTab.js`
- Interne Methodenaufrufe (`this.method()`):
  - `render()` → `applyAnalysisToAllTabs()`, `bindActions()`
- Methoden:
  - `constructor()`
  - `render()`
  - `applyAnalysisToAllTabs()`
  - `bindActions()`

### `ImportEditTab`
- Datei: `views/edit/ImportEditTab.js`
- Erbt von: `BaseEditTab`
- Verwendete importierte Module:
  - `BaseEditTab` → `views/edit/BaseEditTab.js`
  - `ImportEditTemplate` → `templates/edit/ImportEditTemplate.js`
  - `ImportedTextModel` → `models/ImportedTextModel.js`
  - `Toast` → `views/windows/Toast.js`; Aufrufe: `show`
  - `UrlPrompt` → `views/windows/UrlPrompt.js`
  - `UrlImporter` → `api/UrlImporter.js`
  - `Analyzer` → `analysis/Analyzer.js`
- Interne Methodenaufrufe (`this.method()`):
  - `init()` → `commitIfChanged()`, `fetchFromUrl()`, `renderHistory()`, `set()`
  - `commitIfChanged()` → `addHistoryEntry()`, `get()`, `renderHistory()`, `runCombinedAnalysis()`, `set()`
  - `fetchFromUrl()` → `addHistoryEntry()`
  - `addHistoryEntry()` → `renderHistory()`, `runCombinedAnalysis()`
  - `runCombinedAnalysis()` → `applyAnalysisToAllTabs()`
  - `editEntry()` → `renderHistory()`, `set()`
  - `removeEntry()` → `renderHistory()`, `runCombinedAnalysis()`, `set()`
  - `renderHistory()` → `editEntry()`, `escapeAttribute()`, `formatDate()`, `preview()`, `removeEntry()`
- Methoden:
  - `render()`
  - `init()`
  - `commitIfChanged()`
  - `async fetchFromUrl()`
  - `addHistoryEntry()`
  - `runCombinedAnalysis()`
  - `editEntry()`
  - `removeEntry()`
  - `renderHistory()`
  - `preview()`
  - `formatDate()`
  - `applyAnalysis()`
  - `save()`

### `JobEditTab`
- Datei: `views/edit/JobEditTab.js`
- Erbt von: `BaseEditTab`
- Verwendete importierte Module:
  - `BaseEditTab` → `views/edit/BaseEditTab.js`
  - `JobEditTemplate` → `templates/edit/JobEditTemplate.js`
- Interne Methodenaufrufe (`this.method()`):
  - `init()` → `set()`
  - `save()` → `get()`, `list()`
- Methoden:
  - `render()`
  - `init()`
  - `applyAnalysis()`
  - `save()`

### `RequirementsEditTab`
- Datei: `views/edit/RequirementsEditTab.js`
- Erbt von: `BaseEditTab`
- Verwendete importierte Module:
  - `BaseEditTab` → `views/edit/BaseEditTab.js`
  - `RequirementsEditTemplate` → `templates/edit/RequirementsEditTemplate.js`
- Interne Methodenaufrufe (`this.method()`):
  - `init()` → `set()`
  - `save()` → `list()`
- Methoden:
  - `render()`
  - `init()`
  - `applyAnalysis()`
  - `save()`

### `OverviewView`
- Datei: `views/overview/OverviewView.js`
- Verwendete importierte Module:
  - `JobConstants` → `constants/JobConstants.js`
  - `OverviewTemplate` → `templates/overview/OverviewTemplate.js`
  - `ApplicationCardTemplate` → `templates/overview/ApplicationCardTemplate.js`
  - `OverviewFilter` → `ui/overview/OverviewFilter.js`
  - `OverviewEvent` → `events/overview/OverviewEvent.js`
  - `OverviewFilterEvent` → `events/overview/OverviewFilterEvent.js`
  - `OverviewListEvent` → `events/overview/OverviewListEvent.js`
- Interne Methodenaufrufe (`this.method()`):
  - `render()` → `draw()`
  - `draw()` → `getFilters()`
- Methoden:
  - `constructor()`
  - `render()`
  - `draw()`
  - `getStatus()`
  - `getCompanyName()`
  - `getFilters()`

### `SkillsView`
- Datei: `views/skills/SkillsView.js`
- Verwendete importierte Module:
  - `SkillsTemplate` → `templates/skills/SkillsTemplate.js`
  - `SkillsEvent` → `events/skills/SkillsEvent.js`
- Interne Methodenaufrufe (`this.method()`):
  - `render()` → `draw()`
  - `draw()` → `draw()`
- Methoden:
  - `constructor()`
  - `render()`
  - `draw()`

### `CallPrompt`
- Datei: `views/windows/CallPrompt.js`
- Verwendete importierte Module:
  - `CallPromptTemplate` → `templates/windows/CallPromptTemplate.js`
- Lokale Funktionen innerhalb von Methoden:
  - `show()` → `close()`, `onEscape()`
- Methoden:
  - `constructor()`
  - `show()`

### `ContactPrompt`
- Datei: `views/windows/ContactPrompt.js`
- Verwendete importierte Module:
  - `ContactPromptTemplate` → `templates/windows/ContactPromptTemplate.js`
- Lokale Funktionen innerhalb von Methoden:
  - `show()` → `onEscape()`, `submit()`
- Methoden:
  - `constructor()`
  - `show()`

### `InfoPrompt`
- Datei: `views/windows/InfoPrompt.js`
- Verwendete importierte Module:
  - `InfoPromptTemplate` → `templates/windows/InfoPromptTemplate.js`
- Lokale Funktionen innerhalb von Methoden:
  - `show()` → `close()`, `onEscape()`
- Methoden:
  - `constructor()`
  - `show()`

### `InputPrompt`
- Datei: `views/windows/InputPrompt.js`
- Verwendete importierte Module:
  - `InputPromptTemplate` → `templates/windows/InputPromptTemplate.js`
- Methoden:
  - `constructor()`
  - `show()`

### `Toast`
- Datei: `views/windows/Toast.js`
- Verwendete importierte Module: keine lokalen Imports erkannt
- Interne Methodenaufrufe (`this.method()`):
  - `show()` → `stack()`
- Lokale Funktionen innerhalb von Methoden:
  - `show()` → `remove()`
- Methoden:
  - `static show()`
  - `static stack()`

### `UrlPrompt`
- Datei: `views/windows/UrlPrompt.js`
- Verwendete importierte Module:
  - `UrlPromptTemplate` → `templates/windows/UrlPromptTemplate.js`
- Lokale Funktionen innerhalb von Methoden:
  - `show()` → `onEscape()`, `submit()`
- Methoden:
  - `constructor()`
  - `show()`

### `VerifyPrompt`
- Datei: `views/windows/VerifyPrompt.js`
- Verwendete importierte Module:
  - `VerifyPromptTemplate` → `templates/windows/VerifyPromptTemplate.js`
- Methoden:
  - `constructor()`

## Umgekehrte Abhängigkeiten – wer verwendet wen?
### `AddressConstants`
- `StreetExtractor` verwendet `AddressConstants` aus `analysis/extractors/StreetExtractor.js`

### `AddressModel`
- `CompanyModel` verwendet `AddressModel` aus `models/CompanyModel.js`
- `JobModel` verwendet `AddressModel` aus `models/JobModel.js`

### `Analyzer`
- `ImportEditTab` verwendet `Analyzer` aus `views/edit/ImportEditTab.js`

### `AppDB`
- `AppCache` verwendet `AppDB` aus `store/AppCache.js`
- `SkillDB` verwendet `AppDB` aus `store/SkillDB.js`

### `AppModel`
- `AppDB` verwendet `AppModel` aus `store/AppDB.js`
- `EditView` verwendet `AppModel` aus `views/edit/EditView.js`

### `ApplicationCardTemplate`
- `OverviewView` verwendet `ApplicationCardTemplate` aus `views/overview/OverviewView.js`

### `ApplicationEmailModel`
- `ApplicationHistoryModel` verwendet `ApplicationEmailModel` aus `models/ApplicationHistoryModel.js`

### `ApplicationHistoryModel`
- `ApplicationModel` verwendet `ApplicationHistoryModel` aus `models/ApplicationModel.js`
- `CommunicationController` verwendet `ApplicationHistoryModel` aus `controllers/CommunicationController.js`
- `CommunicationSectionController` verwendet `ApplicationHistoryModel` aus `controllers/detail/CommunicationSectionController.js`

### `ApplicationModel`
- `AppModel` verwendet `ApplicationModel` aus `models/AppModel.js`

### `ApplicationPersonalModel`
- `ApplicationHistoryModel` verwendet `ApplicationPersonalModel` aus `models/ApplicationHistoryModel.js`

### `ApplicationPhoneModel`
- `ApplicationHistoryModel` verwendet `ApplicationPhoneModel` aus `models/ApplicationHistoryModel.js`

### `ApplicationPortalModel`
- `ApplicationHistoryModel` verwendet `ApplicationPortalModel` aus `models/ApplicationHistoryModel.js`

### `ApplicationStatusHistoryModel`
- `ApplicationModel` verwendet `ApplicationStatusHistoryModel` aus `models/ApplicationModel.js`

### `ApplicationTemplate`
- `DetailView` verwendet `ApplicationTemplate` aus `views/detail/DetailView.js`

### `BaseEditTab`
- `BenefitsEditTab` verwendet `BaseEditTab` aus `views/edit/BenefitsEditTab.js`
- `CompanyEditTab` verwendet `BaseEditTab` aus `views/edit/CompanyEditTab.js`
- `ContactEditTab` verwendet `BaseEditTab` aus `views/edit/ContactEditTab.js`
- `ImportEditTab` verwendet `BaseEditTab` aus `views/edit/ImportEditTab.js`
- `JobEditTab` verwendet `BaseEditTab` aus `views/edit/JobEditTab.js`
- `RequirementsEditTab` verwendet `BaseEditTab` aus `views/edit/RequirementsEditTab.js`

### `BenefitsEditTab`
- `EditView` verwendet `BenefitsEditTab` aus `views/edit/EditView.js`

### `BenefitsEditTemplate`
- `BenefitsEditTab` verwendet `BenefitsEditTemplate` aus `views/edit/BenefitsEditTab.js`

### `BenefitsModel`
- `AppModel` verwendet `BenefitsModel` aus `models/AppModel.js`

### `BenefitsTemplate`
- `DetailView` verwendet `BenefitsTemplate` aus `views/detail/DetailView.js`

### `CallPromptTemplate`
- `CallPrompt` verwendet `CallPromptTemplate` aus `views/windows/CallPrompt.js`

### `CapturedContentModel`
- `ImportedTextModel` verwendet `CapturedContentModel` aus `models/ImportedTextModel.js`
- `ReferenceModel` verwendet `CapturedContentModel` aus `models/ReferenceModel.js`

### `CityModel`
- `AddressModel` verwendet `CityModel` aus `models/AddressModel.js`

### `CommunicationController`
- `ContactSectionController` verwendet `CommunicationController` aus `controllers/detail/ContactSectionController.js`
- `OverviewListController` verwendet `CommunicationController` aus `controllers/overview/OverviewListController.js`

### `CommunicationSectionController`
- `CommunicationSectionEvent` verwendet `CommunicationSectionController` aus `events/detail/CommunicationSectionEvent.js`

### `CommunicationSectionEvent`
- `DetailView` verwendet `CommunicationSectionEvent` aus `views/detail/DetailView.js`

### `CommunicationTemplate`
- `DetailView` verwendet `CommunicationTemplate` aus `views/detail/DetailView.js`

### `CompanyConstants`
- `CompanyNameExtractor` verwendet `CompanyConstants` aus `analysis/extractors/CompanyNameExtractor.js`
- `EmailExtractor` verwendet `CompanyConstants` aus `analysis/extractors/EmailExtractor.js`
- `LineParser` verwendet `CompanyConstants` aus `analysis/parser/LineParser.js`
- `PhoneExtractor` verwendet `CompanyConstants` aus `analysis/extractors/PhoneExtractor.js`
- `StreetExtractor` verwendet `CompanyConstants` aus `analysis/extractors/StreetExtractor.js`

### `CompanyEditTab`
- `EditView` verwendet `CompanyEditTab` aus `views/edit/EditView.js`

### `CompanyEditTemplate`
- `CompanyEditTab` verwendet `CompanyEditTemplate` aus `views/edit/CompanyEditTab.js`

### `CompanyImageList`
- `CompanyEditTab` verwendet `CompanyImageList` aus `views/edit/CompanyEditTab.js`

### `CompanyModel`
- `AppModel` verwendet `CompanyModel` aus `models/AppModel.js`

### `CompanyTemplate`
- `DetailView` verwendet `CompanyTemplate` aus `views/detail/DetailView.js`

### `ContactEditTab`
- `EditView` verwendet `ContactEditTab` aus `views/edit/EditView.js`

### `ContactEditTemplate`
- `ContactEditTab` verwendet `ContactEditTemplate` aus `views/edit/ContactEditTab.js`

### `ContactModel`
- `AppModel` verwendet `ContactModel` aus `models/AppModel.js`
- `ContactSectionController` verwendet `ContactModel` aus `controllers/detail/ContactSectionController.js`

### `ContactPrompt`
- `ContactSectionController` verwendet `ContactPrompt` aus `controllers/detail/ContactSectionController.js`

### `ContactPromptTemplate`
- `ContactPrompt` verwendet `ContactPromptTemplate` aus `views/windows/ContactPrompt.js`

### `ContactSectionController`
- `ContactSectionEvent` verwendet `ContactSectionController` aus `events/detail/ContactSectionEvent.js`

### `ContactSectionEvent`
- `ContactEditTab` verwendet `ContactSectionEvent` aus `views/edit/ContactEditTab.js`
- `DetailView` verwendet `ContactSectionEvent` aus `views/detail/DetailView.js`

### `ContactTemplate`
- `ContactEditTab` verwendet `ContactTemplate` aus `views/edit/ContactEditTab.js`
- `DetailView` verwendet `ContactTemplate` aus `views/detail/DetailView.js`

### `DetailBaseTemplate`
- `ApplicationTemplate` verwendet `DetailBaseTemplate` aus `templates/detail/ApplicationTemplate.js`
- `BenefitsTemplate` verwendet `DetailBaseTemplate` aus `templates/detail/BenefitsTemplate.js`
- `CommunicationTemplate` verwendet `DetailBaseTemplate` aus `templates/detail/CommunicationTemplate.js`
- `CompanyTemplate` verwendet `DetailBaseTemplate` aus `templates/detail/CompanyTemplate.js`
- `ContactTemplate` verwendet `DetailBaseTemplate` aus `templates/detail/ContactTemplate.js`
- `DetailHeaderTemplate` verwendet `DetailBaseTemplate` aus `templates/detail/DetailHeaderTemplate.js`
- `DetailNavigationTemplate` verwendet `DetailBaseTemplate` aus `templates/detail/DetailNavigationTemplate.js`
- `JobTemplate` verwendet `DetailBaseTemplate` aus `templates/detail/JobTemplate.js`
- `RequirementsTemplate` verwendet `DetailBaseTemplate` aus `templates/detail/RequirementsTemplate.js`
- `SourcesTemplate` verwendet `DetailBaseTemplate` aus `templates/detail/SourcesTemplate copy.js`

### `DetailHeaderTemplate`
- `DetailView` verwendet `DetailHeaderTemplate` aus `views/detail/DetailView.js`

### `DetailNavigationEvent`
- `DetailView` verwendet `DetailNavigationEvent` aus `views/detail/DetailView.js`

### `DetailNavigationTemplate`
- `DetailView` verwendet `DetailNavigationTemplate` aus `views/detail/DetailView.js`

### `DocumentsSectionController`
- `DocumentsSectionEvent` verwendet `DocumentsSectionController` aus `events/detail/DocumentsSectionEvent.js`

### `DocumentsSectionEvent`
- `DetailView` verwendet `DocumentsSectionEvent` aus `views/detail/DetailView.js`

### `EditController`
- `EditView` verwendet `EditController` aus `views/edit/EditView.js`

### `EditHeaderTemplate`
- `EditView` verwendet `EditHeaderTemplate` aus `views/edit/EditView.js`

### `EditNavigationEvent`
- `EditView` verwendet `EditNavigationEvent` aus `views/edit/EditView.js`

### `EditNavigationTemplate`
- `EditView` verwendet `EditNavigationTemplate` aus `views/edit/EditView.js`

### `EmailExtractor`
- `DomainExtractor` verwendet `EmailExtractor` aus `analysis/extractors/DomainExtractor.js`

### `FormatUtils`
- `ApplicationCardTemplate` verwendet `FormatUtils` aus `templates/overview/ApplicationCardTemplate.js`
- `ApplicationTemplate` verwendet `FormatUtils` aus `templates/detail/ApplicationTemplate.js`
- `CommunicationController` verwendet `FormatUtils` aus `controllers/CommunicationController.js`
- `CommunicationSectionController` verwendet `FormatUtils` aus `controllers/detail/CommunicationSectionController.js`
- `CompanyTemplate` verwendet `FormatUtils` aus `templates/detail/CompanyTemplate.js`
- `InputPromptTemplate` verwendet `FormatUtils` aus `templates/windows/InputPromptTemplate.js`
- `JobTemplate` verwendet `FormatUtils` aus `templates/detail/JobTemplate.js`

### `GlobalUtils`
- `AddressConstants` verwendet `GlobalUtils` aus `constants/AddressConstants.js`

### `HtmlUtils`
- `ApplicationCardTemplate` verwendet `HtmlUtils` aus `templates/overview/ApplicationCardTemplate.js`
- `ApplicationTemplate` verwendet `HtmlUtils` aus `templates/detail/ApplicationTemplate.js`
- `BaseEditTab` verwendet `HtmlUtils` aus `views/edit/BaseEditTab.js`
- `CallPromptTemplate` verwendet `HtmlUtils` aus `templates/windows/CallPromptTemplate.js`
- `CommunicationTemplate` verwendet `HtmlUtils` aus `templates/detail/CommunicationTemplate.js`
- `CompanyImageList` verwendet `HtmlUtils` aus `ui/edit/CompanyImageList.js`
- `CompanyTemplate` verwendet `HtmlUtils` aus `templates/detail/CompanyTemplate.js`
- `ContactPromptTemplate` verwendet `HtmlUtils` aus `templates/windows/ContactPromptTemplate.js`
- `ContactTemplate` verwendet `HtmlUtils` aus `templates/detail/ContactTemplate.js`
- `DetailBaseTemplate` verwendet `HtmlUtils` aus `templates/detail/DetailBaseTemplate.js`
- `DetailHeaderTemplate` verwendet `HtmlUtils` aus `templates/detail/DetailHeaderTemplate.js`
- `EditHeaderTemplate` verwendet `HtmlUtils` aus `templates/edit/EditHeaderTemplate.js`
- `InputPromptTemplate` verwendet `HtmlUtils` aus `templates/windows/InputPromptTemplate.js`
- `JobTemplate` verwendet `HtmlUtils` aus `templates/detail/JobTemplate.js`
- `RequirementsTemplate` verwendet `HtmlUtils` aus `templates/detail/RequirementsTemplate.js`
- `SkillsTemplate` verwendet `HtmlUtils` aus `templates/skills/SkillsTemplate.js`
- `SourcesTemplate` verwendet `HtmlUtils` aus `templates/detail/SourcesTemplate copy.js`

### `ImportEditTab`
- `EditView` verwendet `ImportEditTab` aus `views/edit/EditView.js`

### `ImportEditTemplate`
- `ImportEditTab` verwendet `ImportEditTemplate` aus `views/edit/ImportEditTab.js`

### `ImportedTextModel`
- `AppModel` verwendet `ImportedTextModel` aus `models/AppModel.js`
- `ImportEditTab` verwendet `ImportedTextModel` aus `views/edit/ImportEditTab.js`

### `InfoPrompt`
- `DocumentsSectionController` verwendet `InfoPrompt` aus `controllers/detail/DocumentsSectionController.js`
- `SkillsController` verwendet `InfoPrompt` aus `controllers/skills/SkillsController.js`

### `InfoPromptTemplate`
- `InfoPrompt` verwendet `InfoPromptTemplate` aus `views/windows/InfoPrompt.js`

### `InputPrompt`
- `CommunicationController` verwendet `InputPrompt` aus `controllers/CommunicationController.js`
- `CommunicationSectionController` verwendet `InputPrompt` aus `controllers/detail/CommunicationSectionController.js`

### `InputPromptTemplate`
- `InputPrompt` verwendet `InputPromptTemplate` aus `views/windows/InputPrompt.js`

### `JobConstants`
- `ApplicationCardTemplate` verwendet `JobConstants` aus `templates/overview/ApplicationCardTemplate.js`
- `ApplicationTemplate` verwendet `JobConstants` aus `templates/detail/ApplicationTemplate.js`
- `DetailHeaderTemplate` verwendet `JobConstants` aus `templates/detail/DetailHeaderTemplate.js`
- `JobEditTemplate` verwendet `JobConstants` aus `templates/edit/JobEditTemplate.js`
- `OverviewFilter` verwendet `JobConstants` aus `ui/overview/OverviewFilter.js`
- `OverviewListController` verwendet `JobConstants` aus `controllers/overview/OverviewListController.js`
- `OverviewTemplate` verwendet `JobConstants` aus `templates/overview/OverviewTemplate.js`
- `OverviewView` verwendet `JobConstants` aus `views/overview/OverviewView.js`

### `JobEditTab`
- `EditView` verwendet `JobEditTab` aus `views/edit/EditView.js`

### `JobEditTemplate`
- `JobEditTab` verwendet `JobEditTemplate` aus `views/edit/JobEditTab.js`

### `JobModel`
- `AppModel` verwendet `JobModel` aus `models/AppModel.js`

### `JobTemplate`
- `DetailView` verwendet `JobTemplate` aus `views/detail/DetailView.js`

### `LegalFormConstants`
- `CompanyEditTemplate` verwendet `LegalFormConstants` aus `templates/edit/CompanyEditTemplate.js`

### `LineParser`
- `QualificationExtractor` verwendet `LineParser` aus `analysis/extractors/QualificationExtractor.js`
- `SectionParser` verwendet `LineParser` aus `analysis/parser/SectionParser.js`

### `LocalDB`
- `AppDB` verwendet `LocalDB` aus `store/AppDB.js`
- `SkillDB` verwendet `LocalDB` aus `store/SkillDB.js`

### `LocationConstants`
- `LocationExtractor` verwendet `LocationConstants` aus `analysis/extractors/LocationExtractor.js`

### `MoneyExtractor`
- `JobExtractor` verwendet `MoneyExtractor` aus `analysis/extractors/JobExtractor.js`

### `NameModel`
- `ContactModel` verwendet `NameModel` aus `models/ContactModel.js`

### `NavigationState`
- `DetailView` verwendet `NavigationState` aus `views/detail/DetailView.js`

### `OverviewEvent`
- `OverviewView` verwendet `OverviewEvent` aus `views/overview/OverviewView.js`

### `OverviewFilter`
- `OverviewView` verwendet `OverviewFilter` aus `views/overview/OverviewView.js`

### `OverviewFilterEvent`
- `OverviewView` verwendet `OverviewFilterEvent` aus `views/overview/OverviewView.js`

### `OverviewListController`
- `OverviewListEvent` verwendet `OverviewListController` aus `events/overview/OverviewListEvent.js`

### `OverviewListEvent`
- `OverviewView` verwendet `OverviewListEvent` aus `views/overview/OverviewView.js`

### `OverviewTemplate`
- `OverviewView` verwendet `OverviewTemplate` aus `views/overview/OverviewView.js`

### `ParseText`
- `Analyzer` verwendet `ParseText` aus `analysis/Analyzer.js`

### `ParserConstants`
- `BenefitExtractor` verwendet `ParserConstants` aus `analysis/extractors/BenefitExtractor.js`
- `LineParser` verwendet `ParserConstants` aus `analysis/parser/LineParser.js`
- `QualificationExtractor` verwendet `ParserConstants` aus `analysis/extractors/QualificationExtractor.js`
- `TextCleaner` verwendet `ParserConstants` aus `analysis/parser/TextCleaner.js`

### `PostBoxConstants`
- `PostBoxExtractor` verwendet `PostBoxConstants` aus `analysis/extractors/PostBoxExtractor.js`

### `QualificationModel`
- `AppModel` verwendet `QualificationModel` aus `models/AppModel.js`

### `ReferenceModel`
- `AppModel` verwendet `ReferenceModel` aus `models/AppModel.js`

### `RequirementsEditTab`
- `EditView` verwendet `RequirementsEditTab` aus `views/edit/EditView.js`

### `RequirementsEditTemplate`
- `RequirementsEditTab` verwendet `RequirementsEditTemplate` aus `views/edit/RequirementsEditTab.js`

### `RequirementsTemplate`
- `DetailView` verwendet `RequirementsTemplate` aus `views/detail/DetailView.js`

### `SectionPart`
- `SectionParser` verwendet `SectionPart` aus `analysis/parser/SectionParser.js`

### `SkillAliasConstants`
- `SkillCache` verwendet `SkillAliasConstants` aus `store/SkillCache.js`

### `SkillConstants`
- `RequirementsTemplate` verwendet `SkillConstants` aus `templates/detail/RequirementsTemplate.js`
- `SkillsTemplate` verwendet `SkillConstants` aus `templates/skills/SkillsTemplate.js`

### `SkillDB`
- `SkillCache` verwendet `SkillDB` aus `store/SkillCache.js`

### `SkillListModel`
- `SkillDB` verwendet `SkillListModel` aus `store/SkillDB.js`

### `SkillModel`
- `SkillCache` verwendet `SkillModel` aus `store/SkillCache.js`
- `SkillListModel` verwendet `SkillModel` aus `models/SkillListModel.js`

### `SkillsController`
- `SkillsEvent` verwendet `SkillsController` aus `events/skills/SkillsEvent.js`

### `SkillsEvent`
- `SkillsView` verwendet `SkillsEvent` aus `views/skills/SkillsView.js`

### `SkillsTemplate`
- `SkillsView` verwendet `SkillsTemplate` aus `views/skills/SkillsView.js`

### `SourcesSectionEvent`
- `DetailView` verwendet `SourcesSectionEvent` aus `views/detail/DetailView.js`

### `StreetModel`
- `AddressModel` verwendet `StreetModel` aus `models/AddressModel.js`

### `TaskExtractor`
- `Analyzer` verwendet `TaskExtractor` aus `analysis/Analyzer.js`

### `Toast`
- `ImportEditTab` verwendet `Toast` aus `views/edit/ImportEditTab.js`

### `UiCompany`
- `UiJob` verwendet `UiCompany` aus `ui/detail/UiJob.js`

### `UiContact`
- `CommunicationController` verwendet `UiContact` aus `controllers/CommunicationController.js`
- `ContactTemplate` verwendet `UiContact` aus `templates/detail/ContactTemplate.js`

### `UploadFileModel`
- `ApplicationModel` verwendet `UploadFileModel` aus `models/ApplicationModel.js`
- `DocumentsSectionController` verwendet `UploadFileModel` aus `controllers/detail/DocumentsSectionController.js`

### `UrlImporter`
- `ImportEditTab` verwendet `UrlImporter` aus `views/edit/ImportEditTab.js`

### `UrlPrompt`
- `ImportEditTab` verwendet `UrlPrompt` aus `views/edit/ImportEditTab.js`

### `UrlPromptTemplate`
- `UrlPrompt` verwendet `UrlPromptTemplate` aus `views/windows/UrlPrompt.js`

### `VerifyPrompt`
- `CommunicationSectionController` verwendet `VerifyPrompt` aus `controllers/detail/CommunicationSectionController.js`
- `ContactSectionController` verwendet `VerifyPrompt` aus `controllers/detail/ContactSectionController.js`
- `DetailView` verwendet `VerifyPrompt` aus `views/detail/DetailView.js`
- `DocumentsSectionController` verwendet `VerifyPrompt` aus `controllers/detail/DocumentsSectionController.js`

### `VerifyPromptTemplate`
- `VerifyPrompt` verwendet `VerifyPromptTemplate` aus `views/windows/VerifyPrompt.js`

### `WebConstants`
- `DomainExtractor` verwendet `WebConstants` aus `analysis/extractors/DomainExtractor.js`

## Callback-/Funktionsübergaben
- `BenefitExtractor` (`analysis/extractors/BenefitExtractor.js`): `this.lines = lines`
- `BenefitExtractor` (`analysis/extractors/BenefitExtractor.js`): `this.benefitTags = benefitTags`
- `CompanyExtractor` (`analysis/extractors/CompanyExtractor.js`): `this.lines = lines`
- `CompanyNameExtractor` (`analysis/extractors/CompanyNameExtractor.js`): `this.lines = lines`
- `DomainExtractor` (`analysis/extractors/DomainExtractor.js`): `this.lines = lines`
- `EmailExtractor` (`analysis/extractors/EmailExtractor.js`): `this.lines = lines`
- `JobExtractor` (`analysis/extractors/JobExtractor.js`): `this.lines = lines`
- `LocationExtractor` (`analysis/extractors/LocationExtractor.js`): `this.lines = lines`
- `MoneyExtractor` (`analysis/extractors/MoneyExtractor.js`): `this.lines = lines`
- `PhoneExtractor` (`analysis/extractors/PhoneExtractor.js`): `this.lines = lines`
- `PostBoxExtractor` (`analysis/extractors/PostBoxExtractor.js`): `this.lines = lines`
- `QualificationExtractor` (`analysis/extractors/QualificationExtractor.js`): `this.lines = lines`
- `QualificationExtractor` (`analysis/extractors/QualificationExtractor.js`): `this.subFilters = subFilters`
- `StreetExtractor` (`analysis/extractors/StreetExtractor.js`): `this.lines = lines`
- `LineParser` (`analysis/parser/LineParser.js`): `this.line = line`
- `LineParser` (`analysis/parser/LineParser.js`): `this.lineLower = line`
- `SectionParser` (`analysis/parser/SectionParser.js`): `this.sectionDefinitions = sectionHeaders`
- `SectionParser` (`analysis/parser/SectionParser.js`): `this.currentSectionName = sectionName`
- `SectionPart` (`analysis/parser/SectionPart.js`): `this.name = name`
- `TextCleaner` (`analysis/parser/TextCleaner.js`): `this.text = text`
- `TextCleaner` (`analysis/parser/TextCleaner.js`): `this.lines = this`
- `CommunicationController` (`controllers/CommunicationController.js`): `this.inputPrompt = new`
- `ContactSectionController` (`controllers/detail/ContactSectionController.js`): `this.prompt = new`
- `ContactSectionController` (`controllers/detail/ContactSectionController.js`): `this.communication = new`
- `OverviewListController` (`controllers/overview/OverviewListController.js`): `this.communication = new`
- `SkillsController` (`controllers/skills/SkillsController.js`): `this.skillCache = skillCache`
- `Router` (`core/Router.js`): `this.routes = routes`
- `DetailNavigationEvent` (`events/detail/DetailNavigationEvent.js`): `this.onSectionChange = onSectionChange`
- `SourcesSectionEvent` (`events/detail/SourcesSectionEvent.js`): `this.sortAsc = false`
- `SourcesSectionEvent` (`events/detail/SourcesSectionEvent.js`): `this.sortKey = key`
- `SourcesSectionEvent` (`events/detail/SourcesSectionEvent.js`): `this.sortAsc = true`
- `AddressModel` (`models/AddressModel.js`): `this.street = new`
- `AddressModel` (`models/AddressModel.js`): `this.city = new`
- `AddressModel` (`models/AddressModel.js`): `this.postBox = raw`
- `AppModel` (`models/AppModel.js`): `this.createDate = new`
- `AppModel` (`models/AppModel.js`): `this.job = new`
- `AppModel` (`models/AppModel.js`): `this.company = new`
- `AppModel` (`models/AppModel.js`): `this.qualifications = new`
- `AppModel` (`models/AppModel.js`): `this.benefits = new`
- `AppModel` (`models/AppModel.js`): `this.createDate = raw`
- `AppModel` (`models/AppModel.js`): `this.status = raw`
- `AppModel` (`models/AppModel.js`): `this.updatedAt = raw`
- `AppModel` (`models/AppModel.js`): `this.actionHistory = raw`
- `AppModel` (`models/AppModel.js`): `this.importedRawData = raw`
- `ApplicationEmailModel` (`models/ApplicationEmailModel.js`): `this.date = raw`
- `ApplicationEmailModel` (`models/ApplicationEmailModel.js`): `this.emailTo = raw`
- `ApplicationEmailModel` (`models/ApplicationEmailModel.js`): `this.emailFrom = raw`
- `ApplicationEmailModel` (`models/ApplicationEmailModel.js`): `this.subject = raw`
- `ApplicationEmailModel` (`models/ApplicationEmailModel.js`): `this.content = raw`
- `ApplicationEmailModel` (`models/ApplicationEmailModel.js`): `this.attachments = raw`
- `ApplicationHistoryModel` (`models/ApplicationHistoryModel.js`): `this.entry = null`
- `ApplicationHistoryModel` (`models/ApplicationHistoryModel.js`): `this.channel = raw`
- `ApplicationHistoryModel` (`models/ApplicationHistoryModel.js`): `this.entry = new`
- `ApplicationModel` (`models/ApplicationModel.js`): `this.coverLetter = null`
- `ApplicationModel` (`models/ApplicationModel.js`): `this.emailCoverLetter = null`
- `ApplicationModel` (`models/ApplicationModel.js`): `this.status = raw`
- `ApplicationModel` (`models/ApplicationModel.js`): `this.appliedAt = raw`
- `ApplicationModel` (`models/ApplicationModel.js`): `this.channel = raw`
- `ApplicationModel` (`models/ApplicationModel.js`): `this.signature = raw`
- `ApplicationModel` (`models/ApplicationModel.js`): `this.coverLetter = new`
- `ApplicationModel` (`models/ApplicationModel.js`): `this.emailCoverLetter = new`
- `ApplicationModel` (`models/ApplicationModel.js`): `this.status = status`
- `ApplicationPersonalModel` (`models/ApplicationPersonalModel.js`): `this.date = raw`
- `ApplicationPersonalModel` (`models/ApplicationPersonalModel.js`): `this.address = raw`
- `ApplicationPersonalModel` (`models/ApplicationPersonalModel.js`): `this.content = raw`
- `ApplicationPhoneModel` (`models/ApplicationPhoneModel.js`): `this.date = raw`
- `ApplicationPhoneModel` (`models/ApplicationPhoneModel.js`): `this.subject = raw`
- `ApplicationPhoneModel` (`models/ApplicationPhoneModel.js`): `this.phoneTo = raw`
- `ApplicationPhoneModel` (`models/ApplicationPhoneModel.js`): `this.phoneFrom = raw`
- `ApplicationPhoneModel` (`models/ApplicationPhoneModel.js`): `this.content = raw`
- `ApplicationPortalModel` (`models/ApplicationPortalModel.js`): `this.date = raw`
- `ApplicationPortalModel` (`models/ApplicationPortalModel.js`): `this.portalName = raw`
- `ApplicationPortalModel` (`models/ApplicationPortalModel.js`): `this.website = raw`
- `ApplicationPortalModel` (`models/ApplicationPortalModel.js`): `this.username = raw`
- `ApplicationPortalModel` (`models/ApplicationPortalModel.js`): `this.password = raw`
- `ApplicationPortalModel` (`models/ApplicationPortalModel.js`): `this.information = raw`
- `ApplicationStatusHistoryModel` (`models/ApplicationStatusHistoryModel.js`): `this.date = raw`
- `ApplicationStatusHistoryModel` (`models/ApplicationStatusHistoryModel.js`): `this.status = raw`
- `ApplicationStatusHistoryModel` (`models/ApplicationStatusHistoryModel.js`): `this.reason = raw`
- `BenefitsModel` (`models/BenefitsModel.js`): `this.tags = raw`
- `BenefitsModel` (`models/BenefitsModel.js`): `this.content = raw`
- `CapturedContentModel` (`models/CapturedContentModel.js`): `this.url = raw`
- `CapturedContentModel` (`models/CapturedContentModel.js`): `this.capturedAt = raw`
- `CapturedContentModel` (`models/CapturedContentModel.js`): `this.content = raw`
- `CityModel` (`models/CityModel.js`): `this.zipCountry = raw`
- `CityModel` (`models/CityModel.js`): `this.zip = raw`
- `CityModel` (`models/CityModel.js`): `this.city = raw`
- `CityModel` (`models/CityModel.js`): `this.country = raw`
- `CompanyModel` (`models/CompanyModel.js`): `this.address = new`
- `CompanyModel` (`models/CompanyModel.js`): `this.name = raw`
- `CompanyModel` (`models/CompanyModel.js`): `this.legalForm = raw`
- `CompanyModel` (`models/CompanyModel.js`): `this.relationship = raw`
- `CompanyModel` (`models/CompanyModel.js`): `this.website = raw`
- `CompanyModel` (`models/CompanyModel.js`): `this.email = raw`
- `CompanyModel` (`models/CompanyModel.js`): `this.phone = raw`
- `CompanyModel` (`models/CompanyModel.js`): `this.verifiedAt = raw`
- `CompanyModel` (`models/CompanyModel.js`): `this.industry = raw`
- `CompanyModel` (`models/CompanyModel.js`): `this.size = raw`
- `CompanyModel` (`models/CompanyModel.js`): `this.founded = raw`
- `CompanyModel` (`models/CompanyModel.js`): `this.description = raw`
- `CompanyModel` (`models/CompanyModel.js`): `this.specialties = raw`
- `CompanyModel` (`models/CompanyModel.js`): `this.images = raw`
- `CompanyModel` (`models/CompanyModel.js`): `this.mainImageIndex = raw`
- `ContactModel` (`models/ContactModel.js`): `this.name = new`
- `ContactModel` (`models/ContactModel.js`): `this.role = raw`
- `ContactModel` (`models/ContactModel.js`): `this.img = raw`
- `ContactModel` (`models/ContactModel.js`): `this.email = raw`
- `ContactModel` (`models/ContactModel.js`): `this.phone = raw`
- `JobModel` (`models/JobModel.js`): `this.workLocation = new`
- `JobModel` (`models/JobModel.js`): `this.companyId = raw`
- `JobModel` (`models/JobModel.js`): `this.contactId = raw`
- `JobModel` (`models/JobModel.js`): `this.title = raw`
- `JobModel` (`models/JobModel.js`): `this.employmentType = raw`
- `JobModel` (`models/JobModel.js`): `this.workModel = raw`
- `JobModel` (`models/JobModel.js`): `this.salary = raw`
- `JobModel` (`models/JobModel.js`): `this.vacationPay = raw`
- `JobModel` (`models/JobModel.js`): `this.christmasPay = raw`
- `JobModel` (`models/JobModel.js`): `this.referenceNumber = raw`
- `JobModel` (`models/JobModel.js`): `this.tasks = raw`
- `JobModel` (`models/JobModel.js`): `this.tags = raw`
- `NameModel` (`models/NameModel.js`): `this.lastname = raw`
- `NameModel` (`models/NameModel.js`): `this.salutation = raw`
- `NameModel` (`models/NameModel.js`): `this.title = raw`
- `NameModel` (`models/NameModel.js`): `this.firstname = raw`
- `NameModel` (`models/NameModel.js`): `this.lastname = raw`
- `ReferenceModel` (`models/ReferenceModel.js`): `this.name = raw`
- `SkillModel` (`models/SkillModel.js`): `this.level = null`
- `SkillModel` (`models/SkillModel.js`): `this.name = raw`
- `SkillModel` (`models/SkillModel.js`): `this.level = raw`
- `SkillModel` (`models/SkillModel.js`): `this.aliases = raw`
- `StreetModel` (`models/StreetModel.js`): `this.name = raw`
- `StreetModel` (`models/StreetModel.js`): `this.houseNumber = raw`
- `UploadFileModel` (`models/UploadFileModel.js`): `this.originalName = raw`
- `UploadFileModel` (`models/UploadFileModel.js`): `this.link = raw`
- `AppCache` (`store/AppCache.js`): `this.db = new`
- `AppCache` (`store/AppCache.js`): `this.skillCache = skillCache`
- `AppCache` (`store/AppCache.js`): `this.applications = await`
- `AppCache` (`store/AppCache.js`): `this.applications = this`
- `AppDB` (`store/AppDB.js`): `this.ready = LocalDB`
- `SkillCache` (`store/SkillCache.js`): `this.db = new`
- `SkillCache` (`store/SkillCache.js`): `this.list = null`
- `SkillCache` (`store/SkillCache.js`): `this.list = await`
- `UiCompany` (`ui/detail/UiCompany.js`): `this.company = company`
- `UiCompany` (`ui/detail/UiCompany.js`): `this.companyNameField = document`
- `UiContact` (`ui/detail/UiContact.js`): `this.contact = application`
- `UiContact` (`ui/detail/UiContact.js`): `this.company = application`
- `UiJob` (`ui/detail/UiJob.js`): `this.job = job`
- `CompanyImageList` (`ui/edit/CompanyImageList.js`): `this.container = container`
- `CompanyImageList` (`ui/edit/CompanyImageList.js`): `this.mainImageIndex = mainImageIndex`
- `CompanyImageList` (`ui/edit/CompanyImageList.js`): `this.mainImageIndex = Number`
- `DetailView` (`views/detail/DetailView.js`): `this.skillCache = skillCache`
- `DetailView` (`views/detail/DetailView.js`): `this.headerTemplate = new`
- `DetailView` (`views/detail/DetailView.js`): `this.navigationTemplate = new`
- `DetailView` (`views/detail/DetailView.js`): `this.communicationEvent = new`
- `DetailView` (`views/detail/DetailView.js`): `this.contactEvent = new`
- `DetailView` (`views/detail/DetailView.js`): `this.sourcesEvent = new`
- `DetailView` (`views/detail/DetailView.js`): `this.documentsEvent = new`
- `DetailView` (`views/detail/DetailView.js`): `this.navigation = new`
- `CompanyEditTab` (`views/edit/CompanyEditTab.js`): `this.imageList = new`
- `EditView` (`views/edit/EditView.js`): `this.headerTemplate = new`
- `EditView` (`views/edit/EditView.js`): `this.navigationTemplate = new`
- `EditView` (`views/edit/EditView.js`): `this.navigationEvent = new`
- `ImportEditTab` (`views/edit/ImportEditTab.js`): `this.applyAnalysisToAllTabs = applyAnalysisToAllTabs`
- `ImportEditTab` (`views/edit/ImportEditTab.js`): `this.analyzer = new`
- `ImportEditTab` (`views/edit/ImportEditTab.js`): `this.urlPrompt = new`
- `ImportEditTab` (`views/edit/ImportEditTab.js`): `this.urlImporter = new`
- `ImportEditTab` (`views/edit/ImportEditTab.js`): `this.selectedId = null`
- `ImportEditTab` (`views/edit/ImportEditTab.js`): `this.selectedId = null`
- `ImportEditTab` (`views/edit/ImportEditTab.js`): `this.lastCommittedText = text`
- `ImportEditTab` (`views/edit/ImportEditTab.js`): `this.selectedId = id`
- `ImportEditTab` (`views/edit/ImportEditTab.js`): `this.lastCommittedText = entry`
- `ImportEditTab` (`views/edit/ImportEditTab.js`): `this.selectedId = null`
- `OverviewView` (`views/overview/OverviewView.js`): `this.template = new`
- `OverviewView` (`views/overview/OverviewView.js`): `this.cardTemplate = new`
- `OverviewView` (`views/overview/OverviewView.js`): `this.filter = new`
- `SkillsView` (`views/skills/SkillsView.js`): `this.skillCache = skillCache`
- `SkillsView` (`views/skills/SkillsView.js`): `this.template = new`
- `SkillsView` (`views/skills/SkillsView.js`): `this.selectedId = null`
- `SkillsView` (`views/skills/SkillsView.js`): `this.selectedId = selectedId`
- `CallPrompt` (`views/windows/CallPrompt.js`): `this.template = new`
- `ContactPrompt` (`views/windows/ContactPrompt.js`): `this.template = new`
- `InfoPrompt` (`views/windows/InfoPrompt.js`): `this.template = new`
- `InputPrompt` (`views/windows/InputPrompt.js`): `this.template = new`
- `UrlPrompt` (`views/windows/UrlPrompt.js`): `this.template = new`
- `VerifyPrompt` (`views/windows/VerifyPrompt.js`): `this.template = new`

## Bekannte dynamische Grenze
- Callback-Parameter wie `init(..., applyAnalysisToAllTabs)` sind keine automatisch erkennbaren Klassenmethoden. Die Analyse kennzeichnet solche Zuweisungen als Callback-/Funktionsübergabe.
- DOM-Event-Handler, String-basierte Methodennamen, `window[...]`, optionale chaining-Aufrufe und Reflection können statisch unvollständig sein.