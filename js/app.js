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
          '<canvas class="model-glb" id="canvas-' + model.id + '" role="img" ' +
            'aria-label="Interactive 3D view of ' + model.name + '. Drag to rotate."></canvas>' +
          '<button type="button" class="toggle-view" data-model-id="' + model.id + '" ' +
            'title="Switch between photo and 3D view" aria-label="Switch between photo and 3D view of ' + model.name + '" aria-pressed="false">' +
            '<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M5 12h14M12 5l7 7-7 7"/>' +
            '</svg>' +
          '</button>' +
          '<div class="glb-loading" id="loading-' + model.id + '" role="status" style="display:none;">Loading 3D…</div>' +
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

          '<button type="button" class="add-cart-btn" data-model-id="' + model.id + '">' +
            '<span class="btn-label">Add to Cart</span><span class="sr-only"> ' + model.name + '</span>' +
          '</button>' +
        '</div>' +
      '</article>';
  }

  // ── Cart ────────────────────────────────────────────────
  var CART_KEY = 'its3d-cart';
  var cart = loadCart(); // [{ id, qty }]

  function loadCart() {
    try {
      var saved = JSON.parse(localStorage.getItem(CART_KEY));
      if (!Array.isArray(saved)) return [];
      return saved.filter(function (item) {
        return item && findModel(item.id) && item.qty >= 1;
      });
    } catch (e) {
      return [];
    }
  }

  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* storage unavailable */ }
  }

  function findModel(id) {
    for (var i = 0; i < MODELS.length; i++) {
      if (MODELS[i].id === id) return MODELS[i];
    }
    return null;
  }

  function addToCart(id, qty) {
    qty = parseInt(qty, 10);
    if (isNaN(qty) || qty < 1) qty = 1;
    var existing = cart.filter(function (item) { return item.id === id; })[0];
    if (existing) existing.qty += qty;
    else cart.push({ id: id, qty: qty });
    saveCart();
    renderCart();
    return { qty: qty, name: findModel(id).name };
  }

  function removeFromCart(id) {
    cart = cart.filter(function (item) { return item.id !== id; });
    saveCart();
    renderCart();
    announce('Removed from cart.');
  }

  // Screen reader announcements (aria-live region)
  function announce(message) {
    var el = document.getElementById('sr-status');
    if (!el) return;
    el.textContent = '';
    setTimeout(function () { el.textContent = message; }, 50);
  }

  function renderCart() {
    var count = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    document.getElementById('cart-count').textContent = count;
    document.getElementById('cart-toggle').setAttribute(
      'aria-label', 'Cart, ' + count + (count === 1 ? ' item' : ' items'));

    var body = document.getElementById('cart-items');
    var totals = document.getElementById('cart-totals');
    body.textContent = '';

    if (cart.length === 0) {
      var empty = document.createElement('p');
      empty.className = 'cart-empty';
      empty.textContent = 'Your cart is empty.';
      body.appendChild(empty);
      totals.textContent = '';
      return;
    }

    var totalTime = 0, totalPla = 0, totalCost = 0;

    cart.forEach(function (item) {
      var model = findModel(item.id);
      var time = model.printTimeHours * item.qty;
      var pla = model.plaGrams * item.qty;
      var cost = unitCost(model) * item.qty;
      totalTime += time;
      totalPla += pla;
      totalCost += cost;

      var row = document.createElement('div');
      row.className = 'cart-item';

      var info = document.createElement('div');
      var name = document.createElement('strong');
      name.textContent = model.name + ' × ' + item.qty;
      var detail = document.createElement('span');
      detail.className = 'cart-item-detail';
      detail.textContent = formatTime(time) + ' · ' + pla.toFixed(1) + ' g PLA · ' + formatMoney(cost);
      info.appendChild(name);
      info.appendChild(detail);

      var remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'cart-remove';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', 'Remove ' + model.name + ' from cart');
      remove.addEventListener('click', function () { removeFromCart(item.id); });

      row.appendChild(info);
      row.appendChild(remove);
      body.appendChild(row);
    });

    totals.textContent =
      'Total: ' + formatTime(totalTime) + ' · ' + totalPla.toFixed(1) + ' g PLA · ' + formatMoney(totalCost);
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

  // ── Layout photos (configured in js/layout-images.js) ───
  var LAYOUT = window.LAYOUT_IMAGES || {};

  function escAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function photoHtml(item, cls) {
    if (!item || !item.src) {
      return '<div class="photo-placeholder ' + cls + '" aria-hidden="true">Photo</div>';
    }
    return '<img class="layout-photo ' + cls + '" src="' + escAttr(item.src) + '" alt="' +
      escAttr(item.alt || '') + '" onerror="this.style.display=\'none\'">';
  }

  function railHtml(items, side) {
    return '<div class="side-rail side-rail-' + side + '">' +
      (items || []).map(function (it) { return photoHtml(it, 'side-photo'); }).join('') +
    '</div>';
  }

  function init() {
    // Header
    app.innerHTML =
      '<a class="skip-link" href="#model-grid">Skip to models</a>' +
      '<nav class="top-bar" aria-label="Main">' +
        '<div class="top-bar-inner">' +
          '<a class="brand" href="#top">' +
            '<span class="brand-fsu">FSU</span>' +
            '<span class="brand-divider"></span>' +
            '<span class="brand-its">Information Technology Services</span>' +
          '</a>' +
          '<ul class="nav-links">' +
            '<li><a href="#model-grid">Models</a></li>' +
          '</ul>' +
        '</div>' +
      '</nav>' +
      '<header id="top">' +
        '<div class="header-inner">' +
          '<h1>FSU ITS 3D Printing Calculator</h1>' +
          '<p class="subtitle">Select a model, enter quantity, and get print time, material usage, and cost.</p>' +
          '<div class="global-info">PLA cost: ' + formatMoney(PLA_COST_PER_KG) + ' / kg</div>' +
        '</div>' +
      '</header>' +
      '<button type="button" id="cart-toggle" class="cart-toggle" aria-label="Cart, 0 items" ' +
        'aria-expanded="false" aria-controls="cart-panel">' +
        '<span class="cart-icon"><img src="assets/images/basket.png" alt=""></span>' +
        '<span id="cart-count" class="cart-badge" aria-hidden="true">0</span>' +
      '</button>' +
      '<aside id="cart-panel" class="cart-panel" aria-labelledby="cart-title" hidden>' +
        '<h2 id="cart-title">Your Cart</h2>' +
        '<div id="cart-items"></div>' +
        '<div id="cart-totals" class="cart-totals"></div>' +
      '</aside>' +
      '<div id="sr-status" class="sr-only" role="status" aria-live="polite"></div>' +
      '<div class="page-layout">' +
        railHtml(LAYOUT.left, 'left') +
        '<main id="model-grid" tabindex="-1"></main>' +
        railHtml(LAYOUT.right, 'right') +
      '</div>' +
      '<footer>' +
        '<div class="footer-inner">' +
          '<div class="footer-col">' +
            '<h3>FSU ITS 3D Printing</h3>' +
            '<p>Browse printable models, check print time and material usage, and build a request.</p>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h3>Quick Links</h3>' +
            '<ul>' +
              '<li><a href="#top">Back to top</a></li>' +
              '<li><a href="#model-grid">Models</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h3>About</h3>' +
            '<p>Internal ITS tool. Capstone project.</p>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">&copy; ' + new Date().getFullYear() + ' Florida State University ITS. Internal use only.</div>' +
      '</footer>';

    // Banner photo becomes the header background (with a garnet overlay so text stays readable)
    if (LAYOUT.banner && LAYOUT.banner.src) {
      var headerEl = document.getElementById('top');
      headerEl.style.backgroundImage =
        'linear-gradient(rgba(61,26,34,0.7), rgba(61,26,34,0.7)), url("' + encodeURI(LAYOUT.banner.src) + '")';
      headerEl.classList.add('has-photo');
    }

    var grid = document.getElementById('model-grid');
    grid.innerHTML = MODELS.map(renderModel).join('');

    var viewers = {};

    var cartPanel = document.getElementById('cart-panel');
    var cartToggle = document.getElementById('cart-toggle');
    function setCartOpen(open) {
      cartPanel.hidden = !open;
      cartToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    cartToggle.addEventListener('click', function () {
      setCartOpen(cartPanel.hidden);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !cartPanel.hidden) {
        setCartOpen(false);
        cartToggle.focus();
      }
    });
    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('.add-cart-btn');
      if (!btn) return;
      var id = btn.getAttribute('data-model-id');
      var qtyInput = document.getElementById('qty-' + id);
      var added = addToCart(id, qtyInput ? qtyInput.value : 1);
      var label = btn.querySelector('.btn-label');
      label.textContent = 'Added ✓';
      setTimeout(function () { label.textContent = 'Add to Cart'; }, 1000);
      announce('Added ' + added.qty + ' × ' + added.name + ' to cart.');
    });
    renderCart();

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
            toggleBtn.setAttribute('aria-pressed', 'true');
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
            toggleBtn.setAttribute('aria-pressed', 'false');
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
