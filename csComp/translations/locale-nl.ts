﻿module Translations {
    export class Dutch {
        public static locale        : ng.translate.ITranslationTable = {
            CANCEL_BTN              : 'Annuleren',
            OK_BTN                  : 'OK',
            MAP                     : 'Kaarten',
            MAP_LABEL               : 'Kaart',
            TABLE_LABEL             : 'Tabel',
            LAYERS                  : 'Kaartlagen',
            FILTERS                 : 'Filters',
            FILTER_INFO             : 'Momenteel zijn er geen filters geselecteerd. Klik op een icoon of gebied op de kaart, en klik op het filter icoontje (<span class="fa fa-filter"></span>) in het rechter menu om een filter toe te voegen. Dan wordt er een filter aangemaakt voor de geselecteerde eigenschap.',
            STYLES                  : 'Stijlen',
            STYLE_INFO              : 'Momenteel zijn er geen stijlen geselecteerd. Klik op een icoon of gebied op de kaart, en klik op het stijl icoontje (<span class="fa fa-eye"></span>) in het rechter menu om een stijl toe te voegen. Dan wordt er een stijl aangemaakt voor de geselecteerde eigenschap.',
            FEATURES                : 'Features',
            LEGEND                  : 'Legenda',
            SEARCH                  : 'Zoeken',
            MAP_FEATURES            : 'Kaartfeatures',
            WHITE_RED               : 'wit - rood',
            RED_WHITE               : 'rood - wit',
            GREEN_RED               : 'groen - rood',
            RED_GREEN               : 'rood - groen',
            BLUE_RED                : 'blauw - rood',
            RED_BLUE                : 'rood - blauw',
            WHITE_BLUE              : 'wit - blauw',
            BLUE_WHITE              : 'wit - groen',
            WHITE_GREEN             : 'wit - groen',
            GREEN_WHITE             : 'groen - wit',
            WHITE_ORANGE            : 'wit - oranje',
            ORANGE_WHITE            : 'oranje - wit',
            EXPERTMODE              : { 
                EXPLANATION         : 'Door meer sterren te selecteren komt er meer functionaliteit beschikbaar (3 sterren = expert mode).'
            },
            LAYER_SERVICE: {
                RELOAD_PROJECT_TITLE: 'Data wordt opnieuw geladen',
                RELOAD_PROJECT_MSG  : 'Na het wisselen van de taal moet de kaartdata opnieuw ingelezen worden. Excuses voor het ongemak.'
            },
            MCA                     : {
                DESCRIPTION         : '<h4>Toelichting MCA</h4><div style="text-align: left; margin-left:5px;"><p>Multi-Criteria Analysis (MCA) is een methode die verschillende eigenschappen van een locatie of gebied op de kaart combineerd tot een nieuwe eigenschap. Dit gaat als volgt: <ol><li>Schaal iedere eigenschap tussen 0 (geen waarde) en 1 (maximum waarde).</li><li>Weeg iedere eigenschap relatief t.o.v. de andere gekozen eigenschappen, waar een gewicht onder 0 betekent dat je de eigenschap wil vermijden, 0 wordt genegeerd, en een waarde groter dan 0 betekent dat je dit wil bereiken.</li></ol>Met andere woorden, het is een vorm van lineare regressie.</p></div>',
                INFO                : 'Momenteel zijn er geen kaartlagen geopend die multi-criteria analyses bevatten. Open hiervoor een andere kaartlaag.',
                INFO_EXPERT         : 'Momenteel zijn er geen kaartlagen geopend die multi-criteria analyses bevatten. Open een kaartlaag en maak een nieuwe MCA aan met behulp van de wizard.',
                SHOW_FEATURE_MSG    : 'Selecteer een feature op de kaart om de Multi-Criteria Analyse (MCA) resultaten in detail te bekijken.',
                TOTAL_RESULT        : 'Gecombineerd resultaat',
                DELETE_MSG          : 'Verwijder "{0}"',
                DELETE_MSG2         : 'Weet u het zeker?',
                HAS_CATEGORY        : '  Specificeer categorie? ',
                EDITOR_TITLE        : 'MCA Editor',
                MAIN_FEATURE        : 'Selecteer het type feature',
                PROPERTIES          : 'Selecteer de eigenschappen',
                INCLUDE_RANK        : '  Toon een rangorde? ',
                RANK_TITLE          : '[Titel voor de rangorde]',
                TITLE               : 'Titel... *',
                CATEGORY_MSG        : '[Categorie...]',
                TOGGLE_SPARKLINE    : 'Toon of verberg de histogram en score functie.',
                SCALE_MIN_TITLE     : '[Schaal max]',
                SCALE_MAX_TITLE     : '[Schaal min]',
                MIN_VALUE           : '[Ondergrens (\u03BC-2\u03C3)]',
                MAX_VALUE           : '[Bovengrens (\u03BC+2\u03C3)]',
                MIN_CUTOFF_VALUE    : '[Niet meewegen onder]',
                MAX_CUTOFF_VALUE    : '[Niet meewegen boven]',
                LINEAR              : 'Linear toenemende functie tussen onder- en bovengrens.',
                SIGMOID             : 'Tangentieel toenemende functie tussen onder- en bovengrens.',
                GAUSSIAN            : 'Normale verdeling tussen onder- en bovengrens.',
                ADD_MCA             : 'Maak een nieuwe MCA.',
                DELETE_MCA          : 'Verwijder de MCA.',
                EDIT_MCA            : 'Bewerk de MCA.'
            },
            PROJECTSETTINGS         : {
                TITLE               : 'Project instellingen',
                DESCRIPTION         : 'Instellingen'
            },
            SHOW5                   : 'Toon 5 regels',
            SHOW10                  : 'Toon 10 regels',
            SHOW15                  : 'Toon 15 regels',
            SHOW20                  : 'Toon 20 regels',
            SHOW25                  : 'Toon 25 regels',
            SHOW30                  : 'Toon 30 regels',
            SHOW35                  : 'Toon 35 regels',
            SHOW40                  : 'Toon 40 regels'
        }
    }
}