(function () {
  var MODELS = window.MODELS;
  var PLA_COST_PER_KG = window.PLA_COST_PER_KG;
  var app = document.getElementById('app');

  function formatTime(hours) {
    var h = Math.floor(hours);
    var m = Math.round((hours - h) * 60);
    if (h === 0) return m + 'm';
    if (m === 0) return h + 'h';
    return h + 'h ' + m + 'm';
  }

  function formatMoney(n) {
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  function plaCost(grams) {
    return (grams / 1000) * PLA_COST_PER_KG;
  }

  function boughtMaterialsCost(materials) {
    if (!materials || materials.length === 0) return 0;
    return materials.reduce(function (sum, m) { return sum + m.cost * m.quantity; }, 0);
  }

  function unitCost(model) {
    return plaCost(model.plaGrams) + boughtMaterialsCost(model.boughtMaterials);
  }

  function renderModel(model) {
    var uCost = unitCost(model);

    var materialRows =
      '<tr>' +
        '<td>PLA Filament</td>' +
        '<td>' + model.plaGrams.toFixed(0) + ' g</td>' +
        '<td>' + formatMoney(plaCost(model.plaGrams)) + '</td>' +
      '</tr>';

    if (model.boughtMaterials && model.boughtMaterials.length > 0) {
      for (var i = 0; i < model.boughtMaterials.length; i++) {
        var m = model.boughtMaterials[i];
        materialRows +=
          '<tr>' +
            '<td>' + m.name + ' ×' + m.quantity + '</td>' +
            '<td>' + m.quantity + ' pc' + (m.quantity > 1 ? 's' : '') + '</td>' +
            '<td>' + formatMoney(m.cost * m.quantity) + '</td>' +
          '</tr>';
      }
    }

    return '' +
      '<article class="model-card" data-model-id="' + model.id + '">' +
        '<div class="model-visual" data-model-id="' + model.id + '">' +
          '<img src="' + model.image + '" alt="' + model.name + '" class="model-photo active" ' +
            'onerror="this.src=\'https://placehold.co/400x300?text=No+Photo\';">' +
          '<canvas class="model-glb" id="canvas-' + model.id + '"></canvas>' +
          '<button class="toggle-view" data-model-id="' + model.id + '" title="Switch view">' +
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M5 12h14M12 5l7 7-7 7"/>' +
            '</svg>' +
          '</button>' +
          '<div class="glb-loading" id="loading-' + model.id + '" style="display:none;">Loading 3D…</div>' +
        '</div>' +

        '<div class="model-info">' +
          '<h2>' + model.name + '</h2>' +
          '<p class="model-desc">' + model.description + '</p>' +

          '<div class="model-stats">' +
            '<div class="stat">' +
              '<span class="stat-label">Print Time / Unit</span>' +
              '<span class="stat-value">' + formatTime(model.printTimeHours) + '</span>' +
            '</div>' +
            '<div class="stat">' +
              '<span class="stat-label">PLA / Unit</span>' +
              '<span class="stat-value">' + model.plaGrams + ' g</span>' +
            '</div>' +
            '<div class="stat">' +
              '<span class="stat-label">Cost / Unit</span>' +
              '<span class="stat-value">' + formatMoney(uCost) + '</span>' +
            '</div>' +
          '</div>' +

          '<details class="summary-details">' +
            '<summary>Unit Cost Breakdown</summary>' +
            '<table class="cost-table">' +
              '<thead><tr><th>Material</th><th>Quantity</th><th>Cost</th></tr></thead>' +
              '<tbody>' +
                materialRows +
                '<tr class="total-row">' +
                  '<td colspan="2"><strong>Total Per Unit</strong></td>' +
                  '<td><strong>' + formatMoney(uCost) + '</strong></td>' +
                '</tr>' +
              '</tbody>' +
            '</table>' +
          '</details>' +

          '<div class="calculator">' +
            '<label for="qty-' + model.id + '">Quantity to Print</label>' +
            '<input type="number" id="qty-' + model.id + '" class="qty-input" min="1" value="1" data-model-id="' + model.id + '">' +
          '</div>' +

          '<div class="calc-results" id="results-' + model.id + '">' +
            '<div class="result-item">' +
              '<span class="result-label">Total Print Time</span>' +
              '<span class="result-value" id="time-' + model.id + '">' + formatTime(model.printTimeHours) + '</span>' +
            '</div>' +
            '<div class="result-item">' +
              '<span class="result-label">Total PLA</span>' +
              '<span class="result-value" id="pla-' + model.id + '">' + model.plaGrams + ' g (' + formatMoney(plaCost(model.plaGrams)) + ')</span>' +
            '</div>' +
            '<div class="result-item">' +
              '<span class="result-label">Total Material Cost</span>' +
              '<span class="result-value" id="cost-' + model.id + '">' + formatMoney(uCost) + '</span>' +
            '</div>' +
          '</div>' +

          '<div class="stl-downloads">' +
            model.stls.map(function (s) {
              return '' +
              '<a href="' + s.path + '" download class="stl-btn">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                  '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>' +
                '</svg>' +
                'Download ' + s.name + ' (STL)' +
              '</a>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function updateResults(model, qty) {
    if (qty < 1) qty = 1;
    var totalTime = model.printTimeHours * qty;
    var totalPla = model.plaGrams * qty;
    var totalPlaCost = plaCost(totalPla);
    var totalBought = boughtMaterialsCost(model.boughtMaterials) * qty;
    var totalCost = totalPlaCost + totalBought;

    var timeEl = document.getElementById('time-' + model.id);
    var plaEl = document.getElementById('pla-' + model.id);
    var costEl = document.getElementById('cost-' + model.id);

    if (timeEl) timeEl.textContent = formatTime(totalTime);
    if (plaEl) plaEl.textContent = totalPla + ' g (' + formatMoney(totalPlaCost) + ')';
    if (costEl) costEl.textContent = formatMoney(totalCost);
  }

  function init() {
    // Header
    app.innerHTML =
      '<header>' +
        '<div class="header-inner">' +
          '<h1>FSU ITS 3D Printing Calculator</h1>' +
          '<p class="subtitle">Select a model, enter quantity, and get print time, material usage, and cost.</p>' +
          '<div class="global-info">PLA cost: ' + formatMoney(PLA_COST_PER_KG) + ' / kg</div>' +
        '</div>' +
      '</header>' +
      '<main id="model-grid"></main>' +
      '<footer><p>FSU ITS — Internal Tool</p></footer>';

    var grid = document.getElementById('model-grid');
    grid.innerHTML = MODELS.map(renderModel).join('');

    var viewers = {};

    MODELS.forEach(function (model) {
      // Toggle button
      var toggleBtn = document.querySelector('.toggle-view[data-model-id="' + model.id + '"]');
      var visualContainer = document.querySelector('.model-visual[data-model-id="' + model.id + '"]');

      if (toggleBtn && visualContainer) {
        var showingPhoto = true;
        toggleBtn.addEventListener('click', function () {
          var photo = visualContainer.querySelector('.model-photo');
          var canvas = visualContainer.querySelector('.model-glb');
          var loading = document.getElementById('loading-' + model.id);

          if (showingPhoto) {
            // Switch to 3D
            photo.classList.remove('active');
            canvas.classList.add('active');
            toggleBtn.style.opacity = '1';
            loading.style.display = 'block';
            loading.textContent = 'Loading 3D…';
            loading.style.color = '#fff';
            if (!viewers[model.id]) {
              // Load base64 GLB data on demand via script tag (works from file://)
              if (window.GLB_DATA && window.GLB_DATA[model.id]) {
                // Already loaded, create viewer directly
                viewers[model.id] = new window.GLBViewer(canvas, model.glb);
              } else {
                // Dynamically load the base64 data script
                var script = document.createElement('script');
                script.src = 'js/glb-data/' + model.id + '.js';
                script.onload = function () {
                  viewers[model.id] = new window.GLBViewer(canvas, model.glb);
                };
                script.onerror = function () {
                  // Fallback: try loading the GLB file directly (works over HTTP)
                  viewers[model.id] = new window.GLBViewer(canvas, model.glb);
                };
                document.head.appendChild(script);
              }
            }
            showingPhoto = false;
          } else {
            // Switch back to photo — dispose 3D viewer to free resources
            photo.classList.add('active');
            canvas.classList.remove('active');
            loading.style.display = 'none';
            if (viewers[model.id]) {
              viewers[model.id].dispose();
              delete viewers[model.id];
            }
            showingPhoto = true;
          }
        });
      }

      // Quantity input
      var qtyInput = document.getElementById('qty-' + model.id);
      if (qtyInput) {
        qtyInput.addEventListener('input', function (e) {
          var val = parseInt(e.target.value, 10);
          if (isNaN(val) || val < 1) val = 1;
          updateResults(model, val);
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
