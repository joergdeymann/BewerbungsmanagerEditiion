export class LegalFormConstants {

    static FORM = {
        EINZELUNTERNEHMEN: "EINZELUNTERNEHMEN",
        EINGETRAGENER_KAUFMANN: "EINGETRAGENER_KAUFMANN",
        FREIBERUFLER: "FREIBERUFLER",
        GBR: "GBR",
        OHG: "OHG",
        KG: "KG",
        PARTG: "PARTG",
        GMBH_CO_KG: "GMBH_CO_KG",
        GMBH: "GMBH",
        UG: "UG",
        AG: "AG",
        KGAA: "KGAA",
        SE: "SE",
        EG: "EG",
        EV: "EV",
        STIFTUNG: "STIFTUNG",
        KOERPERSCHAFT: "KOERPERSCHAFT",
        SONSTIGE: "SONSTIGE"
    };

    static LABEL = {
        EINZELUNTERNEHMEN: "Einzelunternehmen",
        EINGETRAGENER_KAUFMANN: "Eingetragener Kaufmann (e.K.)",
        FREIBERUFLER: "Freiberufler",
        GBR: "Gesellschaft bürgerlichen Rechts (GbR)",
        OHG: "Offene Handelsgesellschaft (OHG)",
        KG: "Kommanditgesellschaft (KG)",
        PARTG: "Partnerschaftsgesellschaft (PartG)",
        GMBH_CO_KG: "GmbH & Co. KG",
        GMBH: "Gesellschaft mit beschränkter Haftung (GmbH)",
        UG: "Unternehmergesellschaft, haftungsbeschränkt (UG)",
        AG: "Aktiengesellschaft (AG)",
        KGAA: "Kommanditgesellschaft auf Aktien (KGaA)",
        SE: "Societas Europaea (SE)",
        EG: "Eingetragene Genossenschaft (eG)",
        EV: "Eingetragener Verein (e.V.)",
        STIFTUNG: "Stiftung",
        KOERPERSCHAFT: "Körperschaft des öffentlichen Rechts",
        SONSTIGE: "Sonstige"
    };

    static list() {
        return Object.values(this.FORM);
    }
}