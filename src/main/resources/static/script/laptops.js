// Global variable to store laptops
let currentLaptopData = [];

// Load laptops into DOM
function loadLaptops(data) {
  currentLaptopData = data;
  let html = "<div class='laptop-container'>";
  data.forEach(laptop => {
    html += `
      <div class='laptop-card' data-id='${laptop.lap_id}'>
        <h3 class='card-title'>${(laptop.model_name || "").toUpperCase()}</h3>
        <p class='company'>${laptop.company?.cmpny_name || "N/A"}</p>
        <p><strong>Processor:</strong> ${laptop.processor || "N/A"}</p>
        <p><strong>Code:</strong> ${laptop.lap_code || "N/A"}</p>
        <p class='price'>₹${laptop.price || 0}</p>
        ${laptop.status ? "" : "<p class='status unavailable'>Out of Stock</p>"}
        <div class='actions'>
          <button class='button-action edit-btn' data-id='${laptop.lap_id}'>
            <span class='mdi mdi-pencil-outline mdi-24px'></span>Edit
          </button>
          <button class='button-action delete' data-id='${laptop.lap_id}' data-model='${laptop.model_name}'>
            <span class='mdi mdi-delete mdi-24px'></span>Delete
          </button>
        </div>
      </div>`;
  });
  html += "</div>";
  $("#result").html(html);
}

// Toggle clear filters button visibility
function toggleClearButton() {
  let hasInput = false;
  $('#filter-panel input, #filter-panel select').each(function () {
    const val = $(this).val();
    if (val && val.trim() !== '' && val !== '0') {
      hasInput = true;
      return false;
    }
  });
  $("#clear-filters").toggle(hasInput);
}

// Main logic
$(document).ready(function () {
  const $panel = $("#filter-panel");
  const $overlay = $("#overlay");

  // 1. INITIAL DATA LOAD
  $.ajax({
    url: "/getAll",
    type: "GET",
    success: loadLaptops,
    error: function () {
      alert("Error retrieving laptops.");
    }
  });

  $.ajax({
    url: "/companies",
    type: "GET",
    success: function (companies) {
      const $cmpny = $("#filter-company");
      $cmpny.empty().append('<option value="" selected>Select Company</option>');
      companies.forEach(company => {
        $cmpny.append(`<option value="${company.cmpny_id}">${company.cmpny_name}</option>`);
      });
    }
  });

  // 2. FILTER PANEL TOGGLE
  $("#open-filter").click(() => {
    $panel.addClass("open");
    $overlay.addClass("show");
  });

  $("#close-filter, #overlay").click(() => {
    $panel.removeClass("open");
    $overlay.removeClass("show");
  });

  // 3. FILTER EVENTS
  $("#filter-min-price, #filter-max-price").on("input", function () {
    const min = $("#filter-min-price").val();
    const max = $("#filter-max-price").val();
    $("#price-display").text(`₹${min} - ₹${max}`);
  });

  $("input, select").on("input change", toggleClearButton);

  $("#apply-filters").click(function () {
    const filters = {
      model_name: $("#filter-model").val(),
      lapCode: $("#filter-code").val(),
      processor: $("#filter-processor").val(),
      memory: $("#filter-memory").val(),
      graphicsCard: $("#filter-graphicsCard").val(),
      c_id: $("#filter-company option:selected").val(),
      status: $("#filter-status").val(),
      minPrice: $("#filter-min-price").val(),
      maxPrice: $("#filter-max-price").val(),
      sortOrder: $("input[name='sort-order']:checked").val()
    };

    if (filters.model_name?.trim()) filters.sortBy = "model_name";
    else if (filters.lapCode?.trim()) filters.sortBy = "lapCode";
    else if (filters.processor?.trim()) filters.sortBy = "processor";
    else if (filters.memory?.trim()) filters.sortBy = "memory";
    else if (filters.graphicsCard?.trim()) filters.sortBy = "graphicsCard";
    else filters.sortBy = null;

    $.ajax({
      url: "/search",
      type: "GET",
      data: filters,
      success: function (data) {
        if (!Array.isArray(data) || data.length === 0) {
          $("#result").html("<p>No data found.</p>");
        } else {
          loadLaptops(data);
        }
        $panel.removeClass("open");
        $overlay.removeClass("show");
      },
      error: function () {
        $("#result").html("<p>Error fetching laptops.</p>");
      }
    });
  });

  $("#filter-panel input").on("keypress", function (e) {
    if (e.which === 13) {
      e.preventDefault();
      $("#apply-filters").click();
    }
  });

  $("#clear-filters").click(function () {
    $("#filter-model, #filter-code, #filter-processor, #filter-company, #filter-status").val('');
    $("#filter-min-price, #filter-max-price").val(0);
    $("#price-display").text("₹0 - ₹1000000");
    toggleClearButton();
    window.location.reload();
  });

  // 4. LAPTOP CARD CLICK FOR DETAILS
  $(document).on("click", ".laptop-card", function (e) {
    if ($(e.target).closest(".edit-btn, .delete").length > 0) return;

    const cardId = $(this).data("id");
    if (!cardId) return;

    $("#details-body").html("<p>Loading...</p>");
    $("#details-overlay").fadeIn();

    $.ajax({
      url: `/laptop/${cardId}`,
      method: "GET",
      dataType: "json",
      success: function (laptop) {
        $("#details-body").html(`
          <h2 class='card-title'>${(laptop.model_name || "").toUpperCase()}</h2>
          <p class='company'>${laptop.company?.cmpny_name || "N/A"}</p>
          <p><strong>Processor:</strong> ${laptop.processor || "N/A"}</p>
          <p><strong>Code:</strong> ${laptop.lap_code || "N/A"}</p>
          <p><strong>Memory:</strong> ${laptop.memory || "N/A"}</p>
          <p><strong>Display:</strong> ${laptop.display || "N/A"}</p>
          <p><strong>Graphics:</strong> ${laptop.graphicsCard || "N/A"}</p>
          <p><strong>Colour:</strong> ${laptop.colour || "N/A"}</p>
          <p class='price'>₹${laptop.price || 0}</p>
          ${laptop.status ? "" : "<p class='status unavailable'>Out of Stock</p>"}
          <div class='actions' style='margin-top:20px;'>
            <button class='button-action edit-btn' data-id='${laptop.lap_id}'>
              <span class='mdi mdi-pencil-outline mdi-24px'></span> Edit
            </button>
            <button class='button-action delete' data-id='${laptop.lap_id}' data-model='${laptop.model_name}'>
              <span class='mdi mdi-delete mdi-24px'></span> Delete
            </button>
          </div>
        `);
      },
      error: function () {
        $("#details-body").html("<p>Error loading details. Please try again.</p>");
      }
    });
  });

  // 5. DETAIL OVERLAY CONTROL
  $("#close-details").on("click", function () {
    $("#details-overlay").fadeOut();
    $(".laptop-container").css("opacity", "1");
  });

  $("#details-overlay").on("click", function (e) {
    if (!$(e.target).closest(".details-content").length) {
      $("#details-overlay").fadeOut();
      $(".laptop-container").css("opacity", "1");
    }
  });

  // 6. EDIT / DELETE ACTIONS
  $(document).on("click", ".edit-btn", function () {
    const laptopId = $(this).data("id");
    localStorage.setItem("editLaptopId", laptopId);
    window.location.href = "laptopform.html";
  });

  $(document).on("click", ".delete", function () {
    const laptopId = $(this).data("id");
    const model = $(this).data("model");
    if (confirm(`Are you sure you want to delete "${model}"?`)) {
      $.ajax({
        url: `/delete/${laptopId}`,
        type: "DELETE",
        success: function () {
          alert("Laptop deleted successfully!");
          location.reload();
        },
        error: function () {
          alert("Error deleting laptop.");
        }
      });
    }
  });

  // 7. SORTING
  $("#sort-select").change(function () {
    const sort = $(this).val();
    if (!currentLaptopData || currentLaptopData.length === 0) return;

    let sortedData = [...currentLaptopData];
    if (sort === "price_low") {
      sortedData.sort((a, b) => a.price - b.price);
    } else if (sort === "price_high") {
      sortedData.sort((a, b) => b.price - a.price);
    }

    loadLaptops(sortedData);
  });
});
