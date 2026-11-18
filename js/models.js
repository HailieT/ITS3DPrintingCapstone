/* ============================================================
   MODEL DATA — Edit this file to add or change models.
   Copy a block (from { to },) and paste it below the last one
   to add a new model. Change the values as needed.

   Fields:
     id              — unique identifier (no spaces, use dashes)
     name            — display name
     description     — short description shown under the name
     image           — path to the photo (jpg, png, etc.)
     glb             — path to the .glb 3D file
     stl             — path to the .stl download file
     printTimeHours  — print time PER UNIT in hours (e.g. 1.5 = 1h30m)
     plaGrams        — PLA weight PER UNIT in grams
     boughtMaterials — OPTIONAL array of purchased (non-printed) parts.
                       Remove the entire array (or leave []) if none.
                       Each item: { name, cost, quantity }
                       cost = price for ONE of that item
   ============================================================ */

// Update this to match the actual cost of a 1kg spool of PLA
window.PLA_COST_PER_KG = 25.00;

window.MODELS = [
  // ── FSU 175 Clicker ───────────────────────────────────────
  // Batch data: 175 units took 2401 min, 1038.94g filament,
  // 1 clicker per unit from a 90-pack ($10 on Amazon).
  {
    id: "fsu-175-clicker",
    name: "FSU 175 Clicker",
    description: "FSU-themed clicker printed in garnet PLA.",
    image: "assets/images/fsu-175-clicker.jpg",
    glb: "assets/glb/fsu-175-clicker.glb",
    stl: "assets/stl/fsu-175-clicker.stl",
    printTimeHours: 0.2287,  // 2401 min ÷ 175 ÷ 60
    plaGrams: 5.94,           // 1038.94g ÷ 175
    boughtMaterials: [
      { name: "Clicker (90-pack, $10)", cost: 0.1111, quantity: 1 },  // $10 ÷ 90
    ],
  },
  // ── END TEMPLATE ──────────────────────────────────────────

  // ── NFC Keychain ──────────────────────────────────────────
  // Batch data: 100 units took 1695 min, 111.35g filament,
  // 1 NFC sticker per unit from a 120-pack ($15.99).
  {
    id: "nfc-keychain",
    name: "NFC Keychain",
    description: "NFC-enabled keychain printed in garnet PLA.",
    image: "assets/images/nfc-keychain.jpg",
    glb: "assets/glb/nfc-keychain.glb",
    stl: "assets/stl/nfc-keychain.stl",
    printTimeHours: 0.2825,  // 1695 min ÷ 100 ÷ 60
    plaGrams: 1.1135,        // 111.35g ÷ 100
    boughtMaterials: [
      { name: "NFC Sticker (120-pack, $15.99)", cost: 0.1333, quantity: 1 },  // $15.99 ÷ 120
    ],
  },
  // ── END ───────────────────────────────────────────────────

  // ── TEMPLATE: copy this block to add a model ──────────────
  {
    id: "example-model-3",
    name: "Example Model 3",
    description: "A larger model with a single bought component.",
    image: "assets/images/example-model-3.jpg",
    glb: "assets/glb/example-model-3.glb",
    stl: "assets/stl/example-model-3.stl",
    printTimeHours: 5.75,
    plaGrams: 120,
    boughtMaterials: [
      { name: "Spring", cost: 1.25, quantity: 1 },
    ],
  },
  // ── END TEMPLATE ──────────────────────────────────────────

  // Paste new models below this line ↓↓↓


];
