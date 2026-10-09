// Outils du Realm Bedrock (déploiement de l'addon sur le Realm, voir docs/design.md F10).
//
//   node realm.js publier [options]            publier l'addon de main sur le monde de la famille
//                                              (et y imposer REGLAGES_REALM : triches activées)
//       --emplacement <n>    emplacement du monde de la famille (défaut 1)
//       --ref <branche>      version de l'addon (défaut : origin/main)
//       --forcer             renvoyer même si la version est déjà là, ou si quelqu'un joue
//   node realm.js recommencer [options]        repartir de zéro : monde neuf sur la graine de scripts/graine.txt
//                                              (l'ancien est sauvegardé) + addon de main
//       --oui                sans taper RECOMMENCER ; --emplacement, --ref, --forcer : comme pour publier
//   node realm.js restaurer [options]          remettre le monde de la famille sur une sauvegarde locale
//       --fichier <mcworld>  sauvegarde à remettre (sinon : liste numérotée et choix)
//       --oui                sans demander de confirmation
//       --emplacement, --ref, --forcer : comme pour publier
//   node realm.js connexion                    se connecter au compte Microsoft, lister les Realms
//   node realm.js deconnexion                  oublier le compte (pour se connecter avec un autre)
//   node realm.js sonder [--realm <id>]        afficher les emplacements et les packs du Realm (lecture seule)
//   node realm.js tester-envoi [options]       envoyer sur l'emplacement 3 la dernière sauvegarde + l'addon de main
//       --emplacement <2|3>  emplacement de test (défaut 3, jamais l'emplacement actif)
//       --monde <fichier>    monde de départ (défaut : dernière sauvegarde de l'emplacement actif)
//       --ref <branche>      version de l'addon (défaut : origin/main)
//   node realm.js sauvegarder [options]        télécharger le monde du Realm en .mcworld
//       --realm <id>        Realm à utiliser (par défaut : le seul Realm dont tu es propriétaire)
//       --emplacement <n>   emplacement de monde 1, 2 ou 3 (par défaut : celui qui est actif)
//
// Lancé normalement par scripts\realm.ps1, qui installe Node et les dépendances.
// Utilise l'API Realms non officielle via prismarine-realms. Seules « publier », « restaurer », « recommencer » et « tester-envoi »
// écrivent sur le Realm ; « tester-envoi » jamais sur l'emplacement actif.

const fs = require('fs')
const os = require('os')
const path = require('path')
const { execFileSync } = require('child_process')
const AdmZip = require('adm-zip')
const nbt = require('prismarine-nbt')
const { Authflow } = require('prismarine-auth')
const { RealmAPI } = require('prismarine-realms')

const RACINE = path.resolve(__dirname, '..', '..')
const DOSSIER_SAUVEGARDES = path.join(RACINE, 'sauvegardes-realm')
const SAUVEGARDES_GARDEES = 10
const PACKS = [
  { dossier: 'aventure_BP', cible: 'behavior_packs', fichierMonde: 'world_behavior_packs.json' },
  { dossier: 'aventure_RP', cible: 'resource_packs', fichierMonde: 'world_resource_packs.json' }
]
// Jetons de connexion : hors du dépôt, pour ne jamais risquer de les publier.
const DOSSIER_JETONS = path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), '.cache'), 'aventure-minecraft', 'jetons')

function lireOptions (args) {
  const options = {}
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith('--')) throw new Error(`Option incomprise : ${args[i]}`)
    const nom = args[i].slice(2)
    // Option sans valeur (--forcer, --oui) : vraie.
    options[nom] = i + 1 < args.length && !args[i + 1].startsWith('--') ? args[++i] : true
  }
  return options
}

function connecter () {
  fs.mkdirSync(DOSSIER_JETONS, { recursive: true })
  // Par défaut, prismarine-auth se présente comme Minecraft pour Nintendo Switch (flux « live »).
  const authflow = new Authflow('aventure', DOSSIER_JETONS, undefined, (code) => {
    console.log('')
    console.log('=== Connexion au compte Microsoft (une seule fois) ===')
    console.log(`1. Ouvre ${code.verification_uri} dans un navigateur`)
    console.log(`2. Tape le code : ${code.user_code}`)
    console.log('3. Connecte-toi avec le compte Microsoft propriétaire du Realm')
    console.log('En attente de la connexion...')
    console.log('')
  })
  return { authflow, api: RealmAPI.from(authflow, 'bedrock') }
}

function nomEmplacements (realm) {
  if (!Array.isArray(realm.slots) || realm.slots.length === 0) return ''
  return realm.slots.map((s) => {
    let options = {}
    try { options = typeof s.options === 'string' ? JSON.parse(s.options) : (s.options || {}) } catch { }
    return `${s.slotId}${s.slotId === realm.activeSlot ? '*' : ''} « ${options.slotName || '?'} »`
  }).join(', ')
}

async function mesRealms (authflow, api) {
  // Le XUID (identifiant Xbox du compte) n'est fourni que par le jeton Xbox Live général :
  // celui du Realm ne le contient pas.
  const { userXUID } = await authflow.getXboxToken()
  if (!userXUID) throw new Error('Identifiant Xbox du compte introuvable.')
  const realms = await api.getRealms()
  return { userXUID, realms, proprietaire: realms.filter((r) => String(r.ownerUUID) === String(userXUID)) }
}

async function connexion () {
  const { authflow, api } = connecter()
  const { userXUID, realms, proprietaire } = await mesRealms(authflow, api)
  console.log(`Connexion OK (identifiant Xbox du compte : ${userXUID}). ${realms.length} Realm(s) visible(s) :`)
  for (const r of realms) {
    const role = proprietaire.includes(r) ? 'tu es propriétaire' : `invité, propriétaire ${r.owner || '?'} (${r.ownerUUID})`
    console.log(`  - ${r.name} (id ${r.id}, ${role}, ${r.state === 'OPEN' ? 'ouvert' : r.state}, emplacement actif ${r.activeSlot})`)
    const emplacements = nomEmplacements(r)
    if (emplacements) console.log(`      emplacements : ${emplacements}`)
  }
  for (const r of proprietaire) {
    try {
      const sauvegardes = await api.getRealmBackups(r.id, r.activeSlot)
      console.log(`  Sauvegardes gardées par Microsoft pour « ${r.name} » : ${sauvegardes.length}`)
    } catch (e) {
      console.log(`  Sauvegardes de « ${r.name} » illisibles : ${e.message}`)
    }
  }
  if (proprietaire.length === 0) console.log(`ATTENTION : ${AIDE_COMPTE}`)
}

const AIDE_COMPTE = 'aucun Realm dont ce compte est propriétaire. Vérifie sur la Switch (Minecraft > Paramètres > Compte) ' +
  'le compte Microsoft utilisé, puis lance « deconnexion » et reconnecte-toi avec ce compte-là.'

function choisirRealm (proprietaire, idDemande) {
  if (idDemande) {
    const r = proprietaire.find((x) => String(x.id) === String(idDemande))
    if (!r) throw new Error(`Aucun Realm dont tu es propriétaire avec l'id ${idDemande}.`)
    return r
  }
  if (proprietaire.length === 1) return proprietaire[0]
  if (proprietaire.length === 0) throw new Error(AIDE_COMPTE.charAt(0).toUpperCase() + AIDE_COMPTE.slice(1))
  throw new Error(`Plusieurs Realms : choisis avec --realm <id> (${proprietaire.map((r) => `${r.name} = ${r.id}`).join(', ')}).`)
}

function horodatage () {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}h${p(d.getMinutes())}`
}

function nomFichier (texte) {
  return texte.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9-]+/g, '-').replace(/^-|-$/g, '') || 'realm'
}

// Graine de la carte de la famille : scripts/graine.txt, seule source, lue aussi par install-server.
function graineFamille () {
  return fs.readFileSync(path.join(RACINE, 'scripts', 'graine.txt'), 'utf8').trim()
}

// level.dat de Bedrock : en-tête de 8 octets (version, longueur) puis NBT petit-boutiste.
function lireLevelDat (donnees) {
  const avecEntete = donnees.length >= 8 && donnees.readInt32LE(4) === donnees.length - 8
  const parsed = nbt.parseUncompressed(avecEntete ? donnees.subarray(8) : donnees, 'little')
  return { version: avecEntete ? donnees.readInt32LE(0) : 10, parsed }
}

const versLong = (texte) => {
  const n = BigInt(texte)
  return [Number(BigInt.asIntN(32, n >> 32n)), Number(BigInt.asIntN(32, n & 0xffffffffn))]
}
const depuisLong = (v) => Array.isArray(v) ? String((BigInt(v[0]) << 32n) | BigInt(v[1] >>> 0)) : String(v)

function lireCle (zip, base, nom) {
  const e = zip.getEntry(base + nom)
  return e ? e.getData() : null
}

function baseDuMonde (zip) {
  const levelDat = zip.getEntries().map((e) => e.entryName).filter((n) => /(^|\/)level\.dat$/.test(n)).sort((a, b) => a.length - b.length)[0]
  if (!levelDat) throw new Error('Le monde ne contient pas de level.dat.')
  return levelDat.slice(0, -'level.dat'.length)
}

// Graine d'un .mcworld (lue dans son level.dat), ou '?' si illisible.
function graineDuMonde (buffer) {
  try {
    const zip = new AdmZip(buffer)
    const { parsed } = lireLevelDat(lireCle(zip, baseDuMonde(zip), 'level.dat'))
    return parsed.value.RandomSeed ? depuisLong(parsed.value.RandomSeed.value) : '?'
  } catch {
    return '?'
  }
}

// Graine que le Realm garde dans les réglages d'un emplacement (« RandomSeed »). Le JSON la lit en
// nombre à virgule (précision perdue sur les grandes graines) : la comparaison est approchée.
function graineReglageRealm (detail, emplacement) {
  const slot = (detail.slots || []).find((sl) => sl.slotId === emplacement)
  const reglage = slot && (slot.settings || []).find((x) => x.name === 'RandomSeed')
  if (!reglage || reglage.value === null || reglage.value === undefined) return 'inconnue'
  const famille = Number(graineFamille()) === Number(reglage.value)
  return `≈ ${reglage.value}${famille ? ' (carte de la famille)' : ' (PAS la carte de la famille)'}`
}

// Avertit si un monde n'est pas sur la carte de la famille. Renvoie true s'il l'est.
function verifierGraine (buffer, contexte) {
  const graine = graineDuMonde(buffer)
  if (graine === graineFamille()) return true
  console.log(`⚠ ${contexte} n'est pas sur la carte de la famille (graine ${graine}, attendue ${graineFamille()}, voir scripts/graine.txt). « Recommencer le Realm » crée un monde neuf sur la bonne carte.`)
  return false
}

// Version écrite par le jeu ou le Realm : [1, 2, 0], "[1,2,0]", "1.2.0"... → "1.2.0".
function texteVersion (v) {
  if (Array.isArray(v)) return v.join('.')
  if (typeof v === 'string') {
    try { const t = JSON.parse(v); if (Array.isArray(t)) return t.join('.') } catch { }
    return v
  }
  return v === undefined || v === null ? '?' : String(v)
}

// Décrit le contenu d'un .mcworld : nom du monde et packs activés / embarqués.
function decrireMonde (buffer) {
  const zip = new AdmZip(buffer)
  // Le monde est normalement à la racine du zip ; on accepte aussi un dossier englobant.
  const levelDat = zip.getEntries().map((e) => e.entryName).filter((n) => /(^|\/)level\.dat$/.test(n)).sort((a, b) => a.length - b.length)[0]
  if (!levelDat) throw new Error('Le fichier téléchargé ne contient pas de level.dat : ce n\'est pas un monde.')
  const base = levelDat.slice(0, -'level.dat'.length)
  const lire = (nom) => {
    const entree = zip.getEntry(base + nom)
    return entree ? entree.getData().toString('utf8').replace(/^\uFEFF/, '') : null
  }
  const graine = graineDuMonde(buffer)
  const lignes = [`Monde : « ${(lire('levelname.txt') || '?').trim()} », graine ${graine}${graine === graineFamille() ? ' (carte de la famille)' : ' (PAS la carte de la famille)'}`]
  for (const [fichier, libelle] of [['world_behavior_packs.json', 'comportement'], ['world_resource_packs.json', 'ressources']]) {
    const actifs = JSON.parse(lire(fichier) || '[]')
    lignes.push(`Packs de ${libelle} activés : ${actifs.length ? actifs.map((p) => `${p.pack_id} v${texteVersion(p.version)}`).join(', ') : 'aucun'}`)
  }
  const embarques = zip.getEntries().filter((e) => e.entryName.startsWith(base) &&
    /^(behavior|resource)_packs\/[^/]+\/manifest\.json$/.test(e.entryName.slice(base.length)))
  for (const e of embarques) {
    try {
      const m = JSON.parse(e.getData().toString('utf8').replace(/^\uFEFF/, ''))
      lignes.push(`Pack embarqué : ${e.entryName.slice(base.length).split('/').slice(0, 2).join('/')} = ${m.header.name} v${texteVersion(m.header.version)} (${m.header.uuid})`)
    } catch {
      lignes.push(`Pack embarqué : ${e.entryName} (manifest illisible)`)
    }
  }
  if (embarques.length === 0) lignes.push('Aucun pack embarqué dans le monde.')
  return lignes
}

function nettoyerAnciennes (prefixe) {
  const fichiers = fs.readdirSync(DOSSIER_SAUVEGARDES).filter((f) => f.endsWith(`_${prefixe}.mcworld`)).sort()
  for (const f of fichiers.slice(0, Math.max(0, fichiers.length - SAUVEGARDES_GARDEES))) {
    fs.unlinkSync(path.join(DOSSIER_SAUVEGARDES, f))
    console.log(`Ancienne sauvegarde supprimée : ${f}`)
  }
}

async function sauvegarder (options) {
  const { authflow, api } = connecter()
  const { proprietaire } = await mesRealms(authflow, api)
  const realm = choisirRealm(proprietaire, options.realm)
  const emplacement = Number(options.emplacement || realm.activeSlot)
  if (![1, 2, 3].includes(emplacement)) throw new Error('L\'emplacement doit être 1, 2 ou 3.')

  await telechargerSauvegarde(api, realm, emplacement)
  console.log('')
  console.log('✅ SAUVEGARDE OK')
}

// Télécharge le monde d'un emplacement (seul l'emplacement actif se télécharge), le garde dans
// sauvegardes-realm\ (10 dernières) et l'affiche.
async function telechargerSauvegarde (api, realm, emplacement) {
  console.log(`Téléchargement du monde de « ${realm.name} », emplacement ${emplacement}...`)
  const telechargement = await api.getRealmWorldDownload(realm.id, emplacement, 'latest')
  const buffer = await telechargement.getBuffer()
  const description = decrireMonde(buffer)

  fs.mkdirSync(DOSSIER_SAUVEGARDES, { recursive: true })
  const prefixe = `${nomFichier(realm.name)}_emplacement${emplacement}`
  const fichier = path.join(DOSSIER_SAUVEGARDES, `${horodatage()}_${prefixe}.mcworld`)
  fs.writeFileSync(fichier, buffer)
  console.log(`Sauvegarde : ${fichier} (${Math.round(buffer.length / 1024)} Ko)`)
  for (const l of description) console.log(`  ${l}`)
  nettoyerAnciennes(prefixe)
  return { buffer, fichier, description }
}

// Version d'un pack telle que décrite par decrireMonde (« Pack embarqué : ... vX.Y.Z (uuid) »), ou null.
function versionEmbarquee (description, pack) {
  const ligne = description.find((l) => l.startsWith('Pack embarqué') && l.includes(`(${pack.uuid})`))
  return ligne ? (ligne.match(/ v([\d.]+) \(/) || [])[1] || null : null
}

// Versions des packs déclarées sur le Realm (le Realm sort les packs du monde envoyé et les range à part).
async function versionsSurRealm (api, realmId) {
  const contenu = await api.rest.get(`/world/${realmId}/content`)
  const versions = {}
  for (const p of [...(contenu.behaviorPacks || []), ...(contenu.resourcePacks || [])]) {
    versions[p.packId] = texteVersion(p.version)
  }
  return versions
}

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Commun à « publier » et « restaurer » : Realm, emplacement de la famille, packs de l'addon ;
// refus si quelqu'un joue (sa partie depuis le téléchargement serait perdue), emplacement rendu actif
// (seul l'emplacement actif se télécharge).
async function preparer (options, action) {
  const { authflow, api } = connecter()
  const { proprietaire } = await mesRealms(authflow, api)
  const realm = choisirRealm(proprietaire, options.realm)
  const emplacement = Number(options.emplacement || 1)
  if (![1, 2, 3].includes(emplacement)) throw new Error('L\'emplacement doit être 1, 2 ou 3.')
  const ref = options.ref || 'origin/main'
  const packs = lirePacksDepuisGit(ref)
  console.log(`Addon : ${packs.map((p) => `${p.dossier} v${p.version.join('.')}`).join(', ')} (${ref})`)

  const detail = await api.rest.get(`/worlds/${realm.id}`)
  const enLigne = (detail.players || []).filter((j) => j.online)
  if (enLigne.length && !options.forcer) {
    throw new Error(`${enLigne.length} joueur(s) sur le Realm en ce moment : ${action} quand personne ne joue (sinon leur partie depuis le téléchargement serait perdue).`)
  }
  return { api, realm, emplacement, packs, detail }
}

async function activerEtFermer (api, realm, emplacement, detail) {
  if (detail.activeSlot !== emplacement) {
    console.log(`L'emplacement actif est le ${detail.activeSlot} : passage sur l'emplacement ${emplacement}.`)
    await api.rest.put(`/worlds/${realm.id}/slot/${emplacement}`)
  }
  console.log('Fermeture du Realm pendant l\'opération...')
  await api.changeRealmState(realm.id, 'close')
}

// Envoie le monde (packs déjà injectés) et vérifie que le Realm a bien l'addon à la bonne version :
// dans le monde relu ou déclaré sur le Realm (le Realm sort les packs du monde et les garde à part).
async function envoyerEtVerifier (api, realm, emplacement, monde, packs, sauvegardeAvant) {
  console.log(`Envoi du monde (${Math.round(monde.length / 1024)} Ko)...`)
  const etat = await envoyerMonde(api, realm.id, emplacement, monde)
  if (etat === 'echec') throw new Error(`Le Realm a rejeté le monde (détail ci-dessus). Le monde d'avant est sauvegardé : ${sauvegardeAvant}`)

  let manquants = packs
  for (let essai = 1; essai <= 4 && manquants.length; essai++) {
    await pause(15000)
    console.log(`Vérification (essai ${essai}/4)...`)
    try {
      const relu = decrireMonde(await (await api.getRealmWorldDownload(realm.id, emplacement, 'latest')).getBuffer())
      const surRealm = await versionsSurRealm(api, realm.id)
      manquants = packs.filter((p) => versionEmbarquee(relu, p) !== p.version.join('.') && surRealm[p.uuid] !== p.version.join('.'))
      for (const p of packs) console.log(`  ${p.dossier} : dans le monde ${versionEmbarquee(relu, p) || 'absent'}, sur le Realm ${surRealm[p.uuid] || 'absent'}`)
    } catch (e) {
      console.log(`  pas encore : ${masquer(e.message).slice(0, 200)}`)
    }
  }
  if (manquants.length) throw new Error(`Envoi non confirmé pour ${manquants.map((p) => p.dossier).join(', ')} (détail ci-dessus) : vérifie sur la Switch. Le monde d'avant est sauvegardé : ${sauvegardeAvant}`)
}

// Réglages imposés au monde de la famille à chaque publication (décision du 06/10/2026) :
// triches activées, pour que les boutons des dialogues (commandes /dialogue, /scriptevent) marchent.
const REGLAGES_REALM = { cheatsAllowed: true }

// Applique REGLAGES_REALM à l'emplacement : on renvoie sa configuration actuelle en ne changeant que
// ces réglages (POST /worlds/{id}/configuration, documentation communautaire), puis on relit.
// Un échec n'arrête pas la publication : il est signalé, et le réglage peut se faire sur la Switch.
async function appliquerReglages (api, realm, emplacement) {
  try {
    const lireOptions = (detail) => {
      const slot = (detail.slots || []).find((sl) => sl.slotId === emplacement)
      return slot ? JSON.parse(slot.options) : null
    }
    const detail = await api.rest.get(`/worlds/${realm.id}`)
    const options = lireOptions(detail)
    if (!options) throw new Error(`emplacement ${emplacement} introuvable`)
    const aChanger = Object.entries(REGLAGES_REALM).filter(([k, v]) => options[k] !== v)
    if (aChanger.length === 0) {
      console.log(`Réglages du Realm déjà en place (${Object.keys(REGLAGES_REALM).join(', ')}).`)
      return
    }
    console.log(`Réglages du Realm : ${aChanger.map(([k, v]) => `${k} → ${v}`).join(', ')}...`)
    await api.rest.post(`/worlds/${realm.id}/configuration`, {
      body: {
        description: { name: detail.name, description: detail.motd || '' },
        options: { ...options, ...REGLAGES_REALM }
      }
    })
    const relu = lireOptions(await api.rest.get(`/worlds/${realm.id}`))
    const rates = Object.entries(REGLAGES_REALM).filter(([k, v]) => !relu || relu[k] !== v)
    if (rates.length) throw new Error(`non pris en compte : ${rates.map(([k]) => k).join(', ')}`)
    console.log('Réglages du Realm appliqués.')
  } catch (e) {
    console.log(`⚠ Réglages du Realm non appliqués (${masquer(e.message).slice(0, 200)}). À faire sur la Switch : paramètres du Realm > Activer les triches.`)
  }
}

async function rouvrir (api, realm) {
  console.log('Réouverture du Realm...')
  await api.changeRealmState(realm.id, 'open')
}

// Étape 4 : publier l'addon de main sur le monde de la famille.
// Fermer le Realm, sauvegarder le monde actuel, y remplacer les packs, le renvoyer, rouvrir.
// Jamais de monde neuf : on part toujours du monde téléchargé à l'instant.
async function publier (options) {
  const { api, realm, emplacement, packs, detail } = await preparer(options, 'publie')
  await activerEtFermer(api, realm, emplacement, detail)
  try {
    const { buffer, fichier, description } = await telechargerSauvegarde(api, realm, emplacement)
    verifierGraine(buffer, 'Le monde de la famille')
    // Le Realm sort les packs du monde : la version installée se lit dans le contenu du Realm
    // (emplacement actif, ici celui de la famille), ou à défaut dans le monde.
    const surRealm = await versionsSurRealm(api, realm.id)
    const aJour = packs.every((p) => [versionEmbarquee(description, p), surRealm[p.uuid]].includes(p.version.join('.')))
    if (aJour && !options.forcer) {
      console.log('')
      console.log('✅ DÉJÀ À JOUR : le monde du Realm a déjà cette version de l\'addon, rien n\'est envoyé.')
      return
    }
    await envoyerEtVerifier(api, realm, emplacement, injecterPacks(buffer, packs), packs, fichier)
    console.log('')
    console.log(`✅ PUBLIÉ : version ${packs[0].version.join('.')} sur l'emplacement ${emplacement} de « ${realm.name} ».`)
  } finally {
    await appliquerReglages(api, realm, emplacement)
    await rouvrir(api, realm)
  }
}

function sauvegardesDe (realm, emplacement) {
  const suffixe = `_${nomFichier(realm.name)}_emplacement${emplacement}.mcworld`
  if (!fs.existsSync(DOSSIER_SAUVEGARDES)) return []
  return fs.readdirSync(DOSSIER_SAUVEGARDES).filter((f) => f.endsWith(suffixe)).sort().reverse()
    .map((f) => path.join(DOSSIER_SAUVEGARDES, f))
}

async function demander (question) {
  const rl = require('readline/promises').createInterface({ input: process.stdin, output: process.stdout })
  try { return (await rl.question(question)).trim() } finally { rl.close() }
}

// Remet le monde de la famille dans l'état d'une sauvegarde locale (sauvegardes-realm\), avec l'addon
// de main (le Realm ne garde pas les packs dans les sauvegardes). Le monde actuel est d'abord
// sauvegardé lui aussi : une restauration se défait en restaurant cette sauvegarde-là.
async function restaurer (options) {
  const { api, realm, emplacement, packs, detail } = await preparer(options, 'restaure')

  let source = options.fichier
  if (!source) {
    const liste = sauvegardesDe(realm, emplacement)
    if (liste.length === 0) throw new Error(`Aucune sauvegarde de l'emplacement ${emplacement} dans ${DOSSIER_SAUVEGARDES}.`)
    console.log('')
    console.log(`Sauvegardes du monde de la famille (emplacement ${emplacement}), la plus récente en premier :`)
    liste.forEach((f, i) => console.log(`  ${i + 1}. ${path.basename(f).slice(0, 16).replace('_', ' ')}  (${Math.round(fs.statSync(f).size / 1024)} Ko)`))
    const choix = Number(await demander('Numéro de la sauvegarde à remettre (Entrée pour annuler) : '))
    if (!Number.isInteger(choix) || choix < 1 || choix > liste.length) {
      console.log('Annulé : rien n\'a été modifié.')
      return
    }
    source = liste[choix - 1]
  }
  source = path.resolve(source)
  const monde = injecterPacks(fs.readFileSync(source), packs)
  console.log(`Sauvegarde choisie : ${source}`)
  verifierGraine(monde, 'Cette sauvegarde')
  for (const l of decrireMonde(monde)) console.log(`  ${l}`)
  if (!options.oui) {
    const reponse = await demander(`Remplacer le monde de la famille par cette sauvegarde ? Tout ce qui a été joué depuis sera perdu (O/N) : `)
    if (!/^o(ui)?$/i.test(reponse)) {
      console.log('Annulé : rien n\'a été modifié.')
      return
    }
  }

  await activerEtFermer(api, realm, emplacement, detail)
  try {
    const { fichier } = await telechargerSauvegarde(api, realm, emplacement)
    await envoyerEtVerifier(api, realm, emplacement, monde, packs, fichier)
    console.log('')
    console.log(`✅ RESTAURÉ : « ${path.basename(source)} » sur l'emplacement ${emplacement}, avec l'addon ${packs[0].version.join('.')}.`)
    console.log(`Pour revenir en arrière : restaurer la sauvegarde faite juste avant, ${path.basename(fichier)}.`)
  } finally {
    await appliquerReglages(api, realm, emplacement)
    await rouvrir(api, realm)
  }
}

// Packs de l'addon tels qu'ils sont sur une branche (par défaut origin/main), lus par git :
// pas besoin de jeton GitHub, ce sont les mêmes droits que « git pull ».
function lirePacksDepuisGit (ref) {
  const git = (args, opts = {}) => execFileSync('git', args, { cwd: RACINE, maxBuffer: 256 * 1024 * 1024, ...opts })
  if (ref.startsWith('origin/')) {
    console.log(`Récupération de ${ref}...`)
    git(['fetch', '--quiet', 'origin', ref.slice('origin/'.length)], { stdio: 'inherit' })
  }
  const archive = new AdmZip(git(['archive', '--format=zip', ref, ...PACKS.map((p) => `src/${p.dossier}`)]))
  return PACKS.map((p) => {
    const prefixe = `src/${p.dossier}/`
    const fichiers = archive.getEntries()
      .filter((e) => !e.isDirectory && e.entryName.startsWith(prefixe))
      .map((e) => ({ chemin: e.entryName.slice(prefixe.length), donnees: e.getData() }))
    const manifest = fichiers.find((f) => f.chemin === 'manifest.json')
    if (!manifest) throw new Error(`${p.dossier} : manifest.json introuvable sur ${ref}.`)
    const header = JSON.parse(manifest.donnees.toString('utf8').replace(/^﻿/, '')).header
    return { ...p, uuid: header.uuid, version: header.version, fichiers }
  })
}

// Remplace (ou ajoute) les packs de l'addon dans un .mcworld, sans toucher au reste du monde.
function injecterPacks (buffer, packs) {
  const zip = new AdmZip(buffer)
  const noms = zip.getEntries().map((e) => e.entryName)
  const levelDat = noms.filter((n) => /(^|\/)level\.dat$/.test(n)).sort((a, b) => a.length - b.length)[0]
  if (!levelDat) throw new Error('Le monde ne contient pas de level.dat.')
  const base = levelDat.slice(0, -'level.dat'.length)
  const lireJson = (nom, defaut) => {
    const e = zip.getEntry(base + nom)
    if (!e) return defaut
    try { return JSON.parse(e.getData().toString('utf8').replace(/^﻿/, '')) } catch { return defaut }
  }
  for (const pack of packs) {
    // Anciennes copies du pack : son dossier habituel et tout dossier dont le manifest a son UUID.
    const dossiers = new Set([`${base}${pack.cible}/${pack.dossier}/`])
    for (const n of noms) {
      const m = n.slice(base.length).match(/^([a-z_]+_packs\/[^/]+\/)manifest\.json$/)
      if (m && lireJson(m[0], {}).header?.uuid === pack.uuid) dossiers.add(base + m[1])
    }
    for (const n of noms) if ([...dossiers].some((d) => n.startsWith(d))) zip.deleteFile(n)
    for (const f of pack.fichiers) zip.addFile(`${base}${pack.cible}/${pack.dossier}/${f.chemin}`, f.donnees)

    const liste = lireJson(pack.fichierMonde, []).filter((x) => x.pack_id !== pack.uuid)
    liste.push({ pack_id: pack.uuid, version: pack.version })
    if (zip.getEntry(base + pack.fichierMonde)) zip.deleteFile(base + pack.fichierMonde)
    zip.addFile(base + pack.fichierMonde, Buffer.from(JSON.stringify(liste, null, 2) + '\n'))
  }
  return zip.toBuffer()
}

// Ce que dit le jeton d'envoi (un JWT) : noms des champs et valeurs courtes, pour comprendre l'envoi.
function decrireJeton (jeton) {
  try {
    const charge = JSON.parse(Buffer.from(jeton.split('.')[1], 'base64url').toString('utf8'))
    return Object.entries(charge).map(([k, v]) => `${k}=${typeof v === 'string' && v.length > 40 ? `${v.slice(0, 8)}…` : JSON.stringify(v)}`).join(', ')
  } catch {
    return 'jeton illisible'
  }
}

// Dépôt d'un monde : on demande l'adresse et le jeton, puis on dépose le fichier, comme le
// téléchargement le fait dans l'autre sens : POST du .mcworld avec le jeton (essayé le 06/10/2026,
// PUT est refusé en 405). Le Realm répond par un flux d'événements (validation, progression...).
async function envoyerMonde (api, realmId, emplacement, buffer) {
  let reponseAdresse
  try {
    reponseAdresse = await api.rest.get(`/archive/upload/world/${realmId}/${emplacement}`)
  } catch (e) {
    throw new Error(`Le Realm refuse de préparer l'envoi sur l'emplacement ${emplacement} (rien n'a été envoyé) : ${e.message}`)
  }
  const { uploadUrl, token } = reponseAdresse
  if (!uploadUrl || !token) throw new Error('Le Realm n\'a pas donné d\'adresse d\'envoi.')
  console.log(`Adresse d'envoi : ${uploadUrl}`)
  console.log(`Jeton : ${decrireJeton(token)}`)
  const reponse = await fetch(uploadUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/octet-stream', 'Content-Length': String(buffer.length) },
    body: buffer
  })
  const texte = await reponse.text()
  console.log(`POST : ${reponse.status} ${reponse.statusText}`)
  if (!reponse.ok) throw new Error(`Envoi refusé par le Realm : ${masquer(texte.slice(0, 500))}`)
  return analyserEvenements(texte)
}

// Lit le flux « event: ... / data: ... » renvoyé par l'envoi : affiche les événements autres que
// la progression, et dit si l'envoi a réussi, échoué ou si on ne sait pas.
function analyserEvenements (texte) {
  const evenements = texte.split(/\r?\n\r?\n/).map((bloc) => {
    const nom = (bloc.match(/^event:\s*(.*)$/m) || [])[1]
    const donnees = bloc.split(/\r?\n/).filter((l) => l.startsWith('data:')).map((l) => l.slice(5).trim()).join('\n')
    return nom ? { nom: nom.trim(), donnees } : null
  }).filter(Boolean)
  let derniereProgression = null
  for (const e of evenements) {
    if (/PROGRESS/i.test(e.nom)) {
      const p = (e.donnees.match(/"progress"\s*:\s*([\d.]+)/) || [])[1]
      if (p !== undefined) derniereProgression = `${e.nom} ${p} %`
      continue
    }
    console.log(`  ${e.nom} ${masquer(e.donnees).slice(0, 300)}`)
  }
  if (derniereProgression) console.log(`  (dernière progression : ${derniereProgression})`)
  const noms = evenements.map((e) => e.nom).join(' ')
  if (/FAIL|ERROR|INVALID|REJECT|CANCEL/i.test(noms)) return 'echec'
  if (/SUCCE|COMPLET|DONE|FINISH/i.test(noms)) return 'reussi'
  if (evenements.length === 0) console.log(`  Réponse brute : ${masquer(texte.slice(0, 500))}`)
  return 'inconnu'
}

function derniereSauvegarde (realm, emplacement) {
  const suffixe = `_${nomFichier(realm.name)}_emplacement${emplacement}.mcworld`
  const fichiers = fs.existsSync(DOSSIER_SAUVEGARDES) ? fs.readdirSync(DOSSIER_SAUVEGARDES).filter((f) => f.endsWith(suffixe)).sort() : []
  if (fichiers.length === 0) throw new Error(`Aucune sauvegarde de l'emplacement ${emplacement} : lance d'abord « sauvegarder ».`)
  return path.join(DOSSIER_SAUVEGARDES, fichiers[fichiers.length - 1])
}

// Étape 3 : envoie sur un emplacement de test (pas l'emplacement actif) une copie du monde
// sauvegardé, avec les packs de l'addon, puis la retélécharge pour vérifier.
async function testerEnvoi (options) {
  const { authflow, api } = connecter()
  const { proprietaire } = await mesRealms(authflow, api)
  const realm = choisirRealm(proprietaire, options.realm)
  const emplacement = Number(options.emplacement || 3)
  if (![2, 3].includes(emplacement) || emplacement === realm.activeSlot) {
    throw new Error(`Le test se fait sur l'emplacement 2 ou 3, jamais sur l'emplacement actif (${realm.activeSlot}).`)
  }
  const source = options.monde || derniereSauvegarde(realm, realm.activeSlot)
  const packs = lirePacksDepuisGit(options.ref || 'origin/main')
  console.log(`Monde de départ : ${source}`)
  console.log(`Packs : ${packs.map((p) => `${p.dossier} v${p.version.join('.')}`).join(', ')} (${options.ref || 'origin/main'})`)

  const monde = injecterPacks(fs.readFileSync(source), packs)
  for (const l of decrireMonde(monde)) console.log(`  ${l}`)
  console.log(`Envoi sur l'emplacement ${emplacement} (${Math.round(monde.length / 1024)} Ko)...`)
  const etat = await envoyerMonde(api, realm.id, emplacement, monde)
  if (etat === 'echec') throw new Error('Le Realm a rejeté le monde pendant sa validation (détail ci-dessus).')
  console.log(etat === 'reussi' ? 'Le Realm a validé le monde.' : 'Fin de l\'envoi sans verdict clair du Realm (événements ci-dessus).')

  // Le Realm peut mettre un moment à installer le monde : quelques essais espacés.
  let retour = null
  for (let essai = 1; essai <= 4 && !retour; essai++) {
    await new Promise((resolve) => setTimeout(resolve, 15000))
    console.log(`Vérification : téléchargement de l'emplacement ${emplacement} (essai ${essai}/4)...`)
    try {
      retour = await (await api.getRealmWorldDownload(realm.id, emplacement, 'latest')).getBuffer()
    } catch (e) {
      console.log(`  pas encore : ${masquer(e.message).slice(0, 200)}`)
    }
  }
  if (!retour) {
    console.log('')
    console.log(`⚠ ENVOI FAIT, MAIS NON VÉRIFIÉ : l'emplacement ${emplacement} ne se télécharge pas (peut-être tant qu'il n'est pas actif).`)
    console.log(`Sur la Switch : Realm > Modifier > choisis l'emplacement ${emplacement} et entre, puis reviens sur l'emplacement ${realm.activeSlot}.`)
    return
  }
  const description = decrireMonde(retour)
  for (const l of description) console.log(`  ${l}`)
  const manquants = packs.filter((p) => !description.some((l) => l.includes(p.uuid) && l.includes(`v${p.version.join('.')}`)))
  if (manquants.length) throw new Error(`Le monde relu sur le Realm n'a pas les packs ${manquants.map((p) => p.dossier).join(', ')}.`)
  console.log('')
  console.log(`✅ ENVOI OK sur l'emplacement ${emplacement}. Sur la Switch : Realm > Modifier > choisis l'emplacement ${emplacement} pour y jouer, puis reviens sur l'emplacement ${realm.activeSlot}.`)
}

// Masque les jetons et adresses signées : la sortie peut être copiée sans risque.
function masquer (valeur) {
  if (Array.isArray(valeur)) return valeur.map(masquer)
  if (valeur && typeof valeur === 'object') {
    return Object.fromEntries(Object.entries(valeur).map(([k, v]) =>
      /token|key|secret|sig/i.test(k) && typeof v === 'string' ? [k, `${v.slice(0, 4)}… (${v.length} car.)`] : [k, masquer(v)]))
  }
  if (typeof valeur === 'string') return valeur.replace(/([?&](sig|token|se|sp|sv|sr|skoid|sktid|skt|ske|sks|skv)=)[^&]+/gi, '$1…')
  return valeur
}

// Lecture seule : emplacements et packs du Realm. Rien n'est modifié.
async function sonder (options) {
  const { authflow, api } = connecter()
  const { proprietaire } = await mesRealms(authflow, api)
  const realm = choisirRealm(proprietaire, options.realm)
  const id = realm.id
  const routes = [
    ['Détail du Realm (emplacements)', `/worlds/${id}`],
    ['Packs du Realm', `/world/${id}/content`]
    // Pas de demande d'adresse d'envoi ici : elle met l'emplacement « en cours d'envoi » et le bloque
    // tant que rien n'y est déposé (constaté sur l'emplacement 3 le 06/10/2026).
  ]
  for (const [libelle, route] of routes) {
    console.log('')
    console.log(`=== ${libelle} : GET ${route}`)
    try {
      let reponse = await api.rest.get(route)
      if (route === `/worlds/${id}` && reponse && Array.isArray(reponse.slots)) {
        const brut = reponse
        reponse = {
          activeSlot: reponse.activeSlot,
          slots: reponse.slots.map((sl) => {
            let o = {}
            try { o = JSON.parse(sl.options) } catch { }
            return { slotId: sl.slotId, slotName: o.slotName, graine: graineReglageRealm(brut, sl.slotId), enabledPacks: o.enabledPacks, versionRef: o.versionRef }
          })
        }
      }
      console.log(JSON.stringify(masquer(reponse), null, 2))
    } catch (e) {
      console.log(`Réponse en erreur : ${masquer(e.message)}`)
    }
  }
  console.log('')
  console.log('Copie tout ce qui précède à Claude (les jetons sont masqués).')
}


function ecrireLevelDat ({ version, parsed }) {
  const corps = nbt.writeUncompressed(parsed, 'little')
  const entete = Buffer.alloc(8)
  entete.writeInt32LE(version, 0)
  entete.writeInt32LE(corps.length, 4)
  return Buffer.concat([entete, corps])
}



// Monde neuf à partir du level.dat d'un monde existant : graine de la famille, point d'apparition
// à recalculer par le jeu (Y = 32767, comme un monde jamais ouvert), horloge à zéro, et plus aucune
// donnée de jeu (dossier db : terrain, joueurs, progression de l'addon). Le jeu génère la carte.
function mondeNeuf (modele, graine) {
  const zip = new AdmZip(modele)
  const base = baseDuMonde(zip)
  const level = lireLevelDat(lireCle(zip, base, 'level.dat'))
  const v = level.parsed.value
  v.RandomSeed = nbt.long(versLong(graine))
  v.SpawnX = nbt.int(0)
  v.SpawnY = nbt.int(32767)
  v.SpawnZ = nbt.int(0)
  for (const cle of ['Time', 'currentTick']) if (v[cle]) v[cle] = nbt.long([0, 0])
  const neuf = new AdmZip()
  neuf.addFile('level.dat', ecrireLevelDat(level))
  neuf.addFile('levelname.txt', lireCle(zip, base, 'levelname.txt') || Buffer.from('Le Domaine oublié'))
  return neuf.toBuffer()
}

// Repartir de zéro avec la famille : le monde actuel est sauvegardé (restaurable), puis remplacé par
// un monde neuf sur la graine de la famille (scripts/graine.txt, toujours), avec l'addon de main et les
// réglages, comme une publication.
async function recommencer (options) {
  const { api, realm, emplacement, packs, detail } = await preparer(options, 'recommence')
  const graine = graineFamille()
  if (!/^-?\d+$/.test(graine)) throw new Error(`Graine invalide dans scripts/graine.txt : ${graine}`)
  console.log(`Graine du monde neuf : ${graine} (scripts/graine.txt, carte de la famille)`)
  if (!options.oui) {
    console.log('')
    console.log(`ATTENTION : le monde de l'emplacement ${emplacement} va être remplacé par un monde NEUF (domaine, quêtes et constructions repartent de zéro).`)
    console.log('Il sera d\'abord sauvegardé sur le PC : « Restaurer le Realm » permettra de revenir en arrière.')
    const reponse = await demander('Pour confirmer, tape RECOMMENCER : ')
    if (reponse !== 'RECOMMENCER') {
      console.log('Annulé : rien n\'a été modifié.')
      return
    }
  }

  await activerEtFermer(api, realm, emplacement, detail)
  try {
    const { buffer, fichier } = await telechargerSauvegarde(api, realm, emplacement)
    console.log('Fabrication du monde neuf (graine de la famille, carte générée par le jeu)...')
    const neuf = mondeNeuf(buffer, graine)
    await envoyerEtVerifier(api, realm, emplacement, injecterPacks(neuf, packs), packs, fichier)
    // Vérification de la graine : d'abord le réglage de l'emplacement sur le Realm (constaté le 06/10/2026 :
    // il prend la graine du monde envoyé), car le monde relu juste après l'envoi peut être l'ancienne copie.
    const reglage = graineReglageRealm(await api.rest.get(`/worlds/${realm.id}`), emplacement)
    console.log(`Graine retenue par le Realm pour l'emplacement ${emplacement} : ${reglage}`)
    let bonneCarte = reglage.endsWith('(carte de la famille)')
    if (!bonneCarte) {
      try {
        const relu = await (await api.getRealmWorldDownload(realm.id, emplacement, 'latest')).getBuffer()
        bonneCarte = verifierGraine(relu, 'Le monde relu sur le Realm')
      } catch (e) {
        console.log(`⚠ Graine non relue (${masquer(e.message).slice(0, 150)}) : vérifie-la sur la Switch (paramètres du monde, en bas).`)
      }
    }
    console.log('')
    if (bonneCarte) {
      console.log(`✅ NOUVEAU MONDE : l'emplacement ${emplacement} repart de zéro sur la carte de la famille, avec l'addon ${packs[0].version.join('.')}.`)
    } else {
      console.log(`⚠ MONDE NEUF ENVOYÉ, MAIS PAS SUR LA CARTE DE LA FAMILLE : le Realm a gardé sa propre graine. Addon ${packs[0].version.join('.')} installé.`)
    }
    console.log(`Pour revenir à l'ancien monde : « Restaurer le Realm », sauvegarde ${path.basename(fichier)}.`)
  } finally {
    await appliquerReglages(api, realm, emplacement)
    await rouvrir(api, realm)
  }
}

async function main () {
  const [commande, ...args] = process.argv.slice(2)
  const options = lireOptions(args)
  if (commande === 'connexion') return connexion()
  if (commande === 'sauvegarder') return sauvegarder(options)
  if (commande === 'sonder') return sonder(options)
  if (commande === 'tester-envoi') return testerEnvoi(options)
  if (commande === 'publier') return publier(options)
  if (commande === 'restaurer') return restaurer(options)
  if (commande === 'recommencer') return recommencer(options)
  if (commande === 'deconnexion') {
    fs.rmSync(DOSSIER_JETONS, { recursive: true, force: true })
    console.log('Compte oublié : la prochaine commande redemandera la connexion.')
    return
  }
  throw new Error('Commande attendue : publier, restaurer, recommencer, connexion, sauvegarder, sonder, tester-envoi ou deconnexion')
}

if (require.main === module) {
  main().catch((e) => {
    console.error('')
    console.error(`❌ ERREUR : ${e.message}`)
    process.exitCode = 1
  })
}

module.exports = { mondeNeuf, graineDuMonde, verifierGraine, graineFamille, versLong, depuisLong, texteVersion, appliquerReglages, lireOptions, decrireMonde, nomFichier, choisirRealm, injecterPacks, lirePacksDepuisGit, versionEmbarquee }
