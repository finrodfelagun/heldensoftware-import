// Import Heldensoftware XML Character
class HeldensoftwareImport {
    static importFromXML(xmlData) {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlData, "text/xml");

        let actorData = {};

        // Eigenschaften (Attributes)
        let eigenschaften = xmlDoc.getElementsByTagName("eigenschaft");
        for (let i = 0; i < eigenschaften.length; i++) {
            let name = eigenschaften[i].getAttribute("name").toLowerCase();
            let value = eigenschaften[i].getAttribute("value");
            actorData[`data.attributes.${name}.value`] = value;
        }

        // Talente (Skills)
        let talente = xmlDoc.getElementsByTagName("talent");
        for (let i = 0; i < talente.length; i++) {
            let talentName = talente[i].getAttribute("name").toLowerCase();
            let value = talente[i].getAttribute("value");
            actorData[`data.skills.${talentName}.value`] = value;
        }

        // Vorteile (Advantages)
        let vorteile = xmlDoc.getElementsByTagName("vorteil");
        for (let i = 0; i < vorteile.length; i++) {
            let vorteilName = vorteile[i].getAttribute("name");
            actorData[`data.advantages.${vorteilName}`] = true; // Set advantage to true
        }

        // Nachteile (Disadvantages)
        let nachteile = xmlDoc.getElementsByTagName("nachteil");
        for (let i = 0; i < nachteile.length; i++) {
            let nachteilName = nachteile[i].getAttribute("name");
            actorData[`data.disadvantages.${nachteilName}`] = true; // Set disadvantage to true
        }

        // Spezielle Fertigkeiten (Special Abilities)
        let sf = xmlDoc.getElementsByTagName("sf");
        for (let i = 0; i < sf.length; i++) {
            let sfName = sf[i].getAttribute("name");
            actorData[`data.specialAbilities.${sfName}`] = true; // Set special ability to true
        }

        // Hier kannst du den Akteur in Foundry aktualisieren oder einen neuen erstellen.
        console.log(actorData); // Ausgabe zur Überprüfung
        return actorData;
    }
}

// Funktion, um eine Datei zu importieren
function importHeldensoftwareXML(file) {
    let reader = new FileReader();
    reader.onload = function(e) {
        let xmlData = e.target.result;
        let actorData = HeldensoftwareImport.importFromXML(xmlData);

        // Neuen Charakter erstellen
        Actor.create(actorData).then(actor => {
            ui.notifications.info("Charakter erfolgreich importiert!");
        });
    };
    reader.readAsText(file);
}
Hooks.on("renderActorSheet", (app, html, data) => {
    const importButton = $(`<button class="helden-import">Import XML</button>`);
    html.closest('.window-app').find('.window-header .window-title').append(importButton);

    importButton.click(() => {
        const input = $('<input type="file" accept=".xml">');
        input.click();
        input.on("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                importHeldensoftwareXML(file);
            }
        });
    });
});