// Testmodus: `?dev=unlock-all` vor dem `#` in der URL schaltet alle Level frei und nutzt einen
// getrennten Speicher, damit der echte Fortschritt beim Testen nicht überschrieben wird.
export const DEV_UNLOCK = typeof location !== 'undefined' && new URLSearchParams(location.search).get('dev') === 'unlock-all';
