# FSU ITS 3D Printing Calculator

Internal web tool for calculating print time, PLA usage, and material cost for 3D printed models.

## Quick Start

1. Drop your model assets into the folders under `assets/`:
   - `assets/images/` — photo (jpg, png)
   - `assets/glb/` — 3D viewable file (.glb)
   - `assets/stl/` — downloadable STL file
2. Edit `js/models.js` to add or change models.
3. Double-click `index.html` to open in your browser. No server needed.

## Adding a Model

Open `js/models.js`. Copy a template block (from `{` to `},`) and paste it into the `MODELS` array. Update the fields:

| Field | Description |
|---|---|
| `id` | Unique identifier (no spaces, use dashes) |
| `name` | Display name |
| `description` | Short text shown under the name |
| `image` | Path to photo, e.g. `assets/images/my-model.jpg` |
| `glb` | Path to .glb file, e.g. `assets/glb/my-model.glb` |
| `stl` | Path to .stl file, e.g. `assets/stl/my-model.stl` |
| `printTimeHours` | Print time **per unit** in hours (e.g. `1.5` = 1h 30m) |
| `plaGrams` | PLA weight **per unit** in grams |
| `boughtMaterials` | Optional array of purchased parts (see below) |

### Bought Materials

If a model uses non-printed parts (screws, magnets, springs, etc.), add them to the `boughtMaterials` array:

```js
boughtMaterials: [
  { name: "Magnet (6×3mm)", cost: 0.50, quantity: 2 },
  { name: "M3 Screw", cost: 0.10, quantity: 4 },
],
```

- `cost` = price for **one** of that item
- `quantity` = how many are needed per **one unit** of the print

If there are no bought materials, use an empty array: `boughtMaterials: []`

## Changing PLA Cost

At the top of `js/models.js`, update:

```js
window.PLA_COST_PER_KG = 20.00;
```

## File Structure

```
ITS3DPrintingCapstone/
├── index.html          # Main HTML page (just open this in a browser)
├── css/
│   └── styles.css       # All styling
├── js/
│   ├── models.js        # ← EDIT THIS to add/change models
│   ├── app.js           # App logic (no need to edit)
│   └── glb-viewer.js    # 3D GLB viewer (no need to edit)
└── assets/
    ├── images/          # Drop .jpg / .png photos here
    ├── glb/             # Drop .glb 3D files here
    └── stl/             # Drop .stl download files here
```

## Features

- **Photo + 3D toggle**: Click the arrow button on any model card to switch between the photo and an interactive 3D GLB viewer (rotate, zoom, auto-rotate).
- **STL download**: Each card has a download button for the STL file.
- **Quantity calculator**: Enter a quantity to instantly see total print time, PLA usage, and cost.
- **Cost breakdown**: Expand "Unit Cost Breakdown" to see the per-unit material and cost breakdown including bought materials.
- **Material cost only**: Pricing includes PLA filament and bought materials only. No markup, overhead, or labor.
- **No server needed**: Just double-click `index.html` to open it.

## Notes

- An internet connection is required on first load to fetch Three.js from the CDN (used for the 3D viewer). After that it may be cached by the browser.
- The photo placeholder comes from placehold.co if the image file is missing.
- GLB 3D model data is embedded as base64 in `js/glb-data/` so the 3D viewer works when opening the HTML file directly (no server needed). The data loads on demand only when you click the toggle arrow.

## Regenerating GLB Data

If you replace or add a `.glb` file in `assets/glb/`, regenerate the base64 data files:

```bash
python3 -c "
import base64, os
mapping = {
    'FSU175Clicker.glb': 'fsu-175-clicker',
    'NFCTag.glb': 'nfc-keychain',
    'LaptopCardHolder.glb': 'laptop-card-holder',
}
os.makedirs('js/glb-data', exist_ok=True)
for filename, model_id in mapping.items():
    with open('assets/glb/' + filename, 'rb') as f:
        data = base64.b64encode(f.read()).decode('ascii')
    with open('js/glb-data/' + model_id + '.js', 'w') as f:
        f.write('window.GLB_DATA = window.GLB_DATA || {};\n')
        f.write('window.GLB_DATA[\"' + model_id + '\"] = \"' + data + '\";\n')
    print(model_id + ' done')
"
```
