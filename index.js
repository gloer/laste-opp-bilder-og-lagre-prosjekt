// HTML
const main = document.querySelector("main");

const skjemaBilder = document.querySelector("#skjemaBilder");
const inpBilde = document.querySelector("#inpBilde");
const inpBildetekst = document.querySelector("#inpBildetekst");
const secBilder = document.querySelector("#secBilder");

const prosjektSkjema = document.querySelector("#prosjektSkjema");
const inpTittel = document.querySelector("#inpTittel");



// Firebase
const db = firebase.database();
const storage = firebase.storage();

const bilder = db.ref("bilder");
const prosjekter = db.ref("prosjekter");

const bilderSomSkalLastesOpp = [];


function visBilde(snap) {
    const data = snap.val();

    secBilder.innerHTML += `
        <article id="${snap.key}">
            <img src="${data.url}">
            <p>${data.tekst}</p>
            <select data-url="${data.url}" data-tekst="${data.tekst}">
                <option value="">Hvordan skal bildet brukes</option>
                <option value="0">Forside</option>
                <option value="1">I artikkel</option>
                <option value="2">På siden</option>            
            </select>
        </article>
    `;
}

function lagreProsjekt(evt) {
    evt.preventDefault();
    // Nå må vi prøve å finne de bildene som er valgt.

    // Finner først alle article-elementener hvor bildene ligger
    const alleBildene = document.querySelectorAll(`#secBilder article`);

    // Her skal vi legge inn bilder som skal lagres
    const bilderSomSkalLagres = [];

    // Inni der finner vi et select-element. Kan vi sjekke verdiene til disse?
    for(const bilde of alleBildene) {

        const sel = bilde.querySelector("select");
        // Hvis det er valgt noe i select-listen, ønsker vi å ha med dette bildet
        if(sel.value) {
            const indeks = parseInt(sel.value);
            bilderSomSkalLagres[indeks] = {
                url: sel.dataset.url,
                tekst: sel.dataset.tekst
            }
            
        }
        

    }
    console.log(bilderSomSkalLagres);

    // Nå har vi endelig klart å bygge arrayet vårt, og kan lagre hele prosjektet
    // Vi kan evt. sjekke om det er valgt 3 bilder
    if(bilderSomSkalLagres.length === 3) {
        prosjekter.push({
            tittel: inpTittel.value,
            bilder: bilderSomSkalLagres
        });

        // Gir en melding om at prosjektet er lagret
        const melding = document.createElement("section");
        melding.innerText = "Prosjektet ble lagret på forsvarlig vis!!!";
        melding.classList.add("callout"); // Foundation CSS
        melding.classList.add("success"); // Foundation CSS
        main.appendChild(melding);
        melding.animate([
            {transform: "translateX(-600px)"},
            {transform: "translateX(0)"}
        ], 500);

    } else {
        // Hvis vi ikke har 3 bilder, sier vi fra
        alert("Du må velge eksakt 3 bilder til prosjektet!");
    }
    

}

function lastOppBilde(evt) {
    evt.preventDefault();

    const fil = inpBilde.files[0];
    const lagringsplass = storage.ref("bilder/" + (+new Date()) + fil.name);

    lagringsplass.put(fil)
        .then( bildeinfo => bildeinfo.ref.getDownloadURL() )
        .then( url => {
            bilder.push({
                tekst: inpBildetekst.value,
                url: url
            });

            skjemaBilder.reset(); // Nuller ut skjemaet

        } );        
        
}


// Event Listeners
skjemaBilder.addEventListener("submit", lastOppBilde);
bilder.on("child_added", visBilde);
prosjektSkjema.addEventListener("submit", lagreProsjekt);
