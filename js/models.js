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
window.PLA_COST_PER_KG = 20.00;

window.MODELS = [
  // ── TEMPLATE: copy this block to add a model ──────────────
  {
    id: "example-model-1",
    name: "Example Model 1",
    description: "Short description of what this model is.",
    image: "assets/images/example-model-1.jpg",
    glb: "assets/glb/example-model-1.glb",
    stl: "assets/stl/example-model-1.stl",
    printTimeHours: 2.5,
    plaGrams: 45,
    boughtMaterials: [
      { name: "Magnet (6×3mm)", cost: 0.50, quantity: 2 },
      { name: "M3 Screw", cost: 0.10, quantity: 4 },
    ],
  },
  // ── END TEMPLATE ──────────────────────────────────────────

  // ── TEMPLATE: copy this block to add a model ──────────────
  {
    id: "example-model-2",
    name: "Example Model 2",
    description: "Another printed item with no bought materials.",
    image: "assets/images/example-model-2.jpg",
    glb: "assets/glb/example-model-2.glb",
    stl: "assets/stl/example-model-2.stl",
    printTimeHours: 1.25,
    plaGrams: 20,
    boughtMaterials: [],
  },
  // ── END TEMPLATE ──────────────────────────────────────────

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
