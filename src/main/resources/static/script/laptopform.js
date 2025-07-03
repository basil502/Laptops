$(document).ready(function () {
  const editId = localStorage.getItem("editLaptopId");
  $("#name").focus();

  // Set form mode (Add or Update)
  if (editId) {
    $("#submit").text("Update");
    $("#title").text("Update Laptop");
    $("#clear-btn").text("✖ Cancel").show();
  } else {
    $("#submit").text("ADD");
    $("#title").text("Add New Laptop");
    $("#clear-btn").text("Clear").hide();
  }

  // Load company dropdown
  $.ajax({
    url: "/companies",
    type: "GET",
    success: function (companies) {
      const $cmpny = $("#cmpny");
      $cmpny.empty().append('<option value="" disabled selected>Select Company</option>');
      companies.forEach(company => {
        $cmpny.append(`<option value="${company.cmpny_id}">${company.cmpny_name}</option>`);
      });

      // If editing, load laptop data
      if (editId) {
        $.ajax({
          url: `/laptop/${editId}`,
          type: "GET",
          success: function (laptop) {
            $("#name").val(laptop.model_name);
            $("#lap_code").val(laptop.lap_code);
            $("#processor").val(laptop.processor);
            $("#price").val(laptop.price);
            $("#status").val(String(laptop.status));
            $("#cmpny").val(laptop.company?.cmpny_id);
            $("#display").val(laptop.display);
            $("#colour").val(laptop.colour);
            $("#memory").val(laptop.memory);
            $("#graphicsCard").val(laptop.graphicsCard);
            $("#Nostock").val(laptop.nostock);

            if (String(laptop.status) === "true") {
              $('#stock-group').show();
            } else {
              $('#stock-group').hide();
              $('#Nostock').val("");
            }
          },
          error: function () {
            alert("Error loading laptop for edit.");
          }
        });
      }
    },
    error: function () {
      alert("Error loading companies.");
    }
  });

  // Clear or Cancel button
  $("#clear-btn").click(function () {
    if (editId) {
      localStorage.removeItem("editLaptopId");
      window.location.href = "laptops.html";
    } else {
      $("#name, #lap_code, #processor, #price, #colour, #display, #memory, #graphicsCard, #Nostock").val("");
      $("#status, #cmpny").val("");
      $(".error").removeClass("error");
      $(".error-message").text("");
      $("#lap_code-check").text("").removeClass("valid invalid");
      $("#stock-group").hide();
      toggleClearButton();
    }
  });

  $("input, select").on("input change", function () {
    const id = $(this).attr("id");
    $(this).removeClass("error");
    $(`#${id}-error`).text("");
    $(this).next(".error-message").text("");
    toggleClearButton();
  });

  function toggleClearButton() {
    let hasInput = false;

    $("input, select").each(function () {
      const val = $(this).val();
      if ((typeof val === "string" && val.trim() !== "") || (Array.isArray(val) && val.length > 0)) {
        hasInput = true;
        return false;
      }
    });

    if (editId) {
      $("#clear-btn").text("✖ Cancel").show();
    } else {
      $("#clear-btn").text("Clear").toggle(hasInput);
    }
  }

  // Lap code validation
  $("#lap_code").on("input", function () {
    const code = $(this).val().trim();
    $("#lap_code-error").text("");
    $("#lap_code").removeClass("error");
    $("#lap_code-check").text("").removeClass("valid invalid");

    if (code === "") return;

    if (!/^[A-Za-z0-9]+$/.test(code)) {
      $("#lap_code-error").text("Laptop code should be alphanumeric without spaces.");
      $("#lap_code").addClass("error");
      return;
    }

    if (code.length < 5 || code.length > 20) {
      $("#lap_code-error").text("Laptop code must be between 5 and 20 characters.");
      $("#lap_code").addClass("error");
      return;
    }

    $.get("/checkLapcode", { code }, function (response) {
      const localEditId = localStorage.getItem("editLaptopId");
      if (response?.lap_id) {
        if (localEditId && response.lap_id == localEditId) {
          $("#lap_code-check").text("Code is available").removeClass("invalid").addClass("valid");
        } else {
          $("#lap_code-check").text("Code already exists").removeClass("valid").addClass("invalid");
        }
      } else {
        $("#lap_code-check").text("Code is available").removeClass("invalid").addClass("valid");
      }
    });
  });

  // Submit form
  $("#submit").click(function (e) {
    e.preventDefault();
    let isValid = true;

    const modelName = $("#name").val().trim();
    const lapCode = $("#lap_code").val().trim();
    const processor = $("#processor").val().trim();
    const price = $("#price").val().trim();
    const status = $("#status").val();
    const companyId = $("#cmpny").val();
    const colour = $("#colour").val().trim();
    const display = $("#display").val().trim();
    const memory = $("#memory").val().trim();
    const graphicsCard = $("#graphicsCard").val().trim();
    const Nostock = $("#Nostock").val().trim();

    if (!modelName || !/^[A-Za-z0-9 ]+$/.test(modelName) || modelName.length < 4) {
      $("#name").addClass("error");
      $("#name-error").text("Model name should contain more than 3 characters and only letters, numbers, and spaces.");
      isValid = false;
    }

    if (!lapCode || !/^[A-Za-z0-9]+$/.test(lapCode) || lapCode.length < 5 || lapCode.length > 20) {
      $("#lap_code").addClass("error");
      $("#lap_code-error").text("Laptop code must be 5–20 characters, alphanumeric with no spaces.");
      isValid = false;
    }

    if (!processor || !/^[A-Za-z0-9 .\-]+$/.test(processor) || processor.length < 5) {
      $("#processor").addClass("error");
      $("#processor-error").text("Processor must be at least 5 characters and may contain letters, numbers, dashes, and dots.");
      isValid = false;
    }

    if (isNaN(price) || Number(price) < 1000 || Number(price) > 1000000) {
      $("#price").addClass("error");
      $("#price-error").text("Price must be a number between 1000 and 1000000.");
      isValid = false;
    }

    if (status !== "true" && status !== "false") {
      $("#status").addClass("error");
      $("#status-error").text("Please select a valid status.");
      isValid = false;
    }

    if (status === "true") {
      if (Nostock === "") {
        $("#Nostock").addClass("error");
        $("#Nostock-error").text("No of stock is required when status is Available.");
        isValid = false;
      } else if (isNaN(Nostock) || Number(Nostock) < 1 || Number(Nostock) > 100) {
        $("#Nostock").addClass("error");
        $("#Nostock-error").text("No of stock must be a number between 1 and 100.");
        isValid = false;
      }
    }

    if (!companyId) {
      $("#cmpny").addClass("error");
      $("#cmpny-error").text("Please select a company.");
      isValid = false;
    }

    if (!colour || !/^[A-Za-z ]+$/.test(colour) || colour.length < 3) {
      $("#colour").addClass("error");
      $("#colour-error").text("Colour must contain more than 2 letters or spaces.");
      isValid = false;
    }

    if (!memory || !/^[A-Za-z0-9 .:x\-]+$/.test(memory) || memory.length < 3) {
      $("#memory").addClass("error");
      $("#memory-error").text("Memory must contain more than 3 characters (letters, numbers, dashes, dots).");
      isValid = false;
    }

    if (!graphicsCard || !/^[A-Za-z0-9 ()/\-+.,]+$/.test(graphicsCard) || graphicsCard.length < 5) {
      $("#graphicsCard").addClass("error");
      $("#graphicsCard-error").text("Graphics card must be more than 5 characters and valid.");
      isValid = false;
    }

    if (!display || !/^[A-Za-z0-9 ()/\-'",.+:]+$/.test(display) || display.length < 5) {
      $("#display").addClass("error");
      $("#display-error").text("Display must be more than 5 characters and valid.");
      isValid = false;
    }

    if (!isValid) return;

    const laptopData = {
      model_name: modelName,
      lap_code: lapCode,
      processor,
      price,
      status: status === "true",
      memory,
      graphicsCard,
      colour,
      display,
      company: { cmpny_id: companyId }
    };

    if (status === "true") {
      laptopData.nostock = Nostock;
    }

    const url = editId ? `/update/${editId}` : "/add";

    $.ajax({
      url,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(laptopData),
      success: function () {
        alert(editId ? "Laptop updated!" : "Laptop added!");
        localStorage.removeItem("editLaptopId");

        if (editId) {
          window.location.href = "laptops.html";
        } else {
          $("#name, #lap_code, #processor, #price, #display, #graphicsCard, #memory, #colour, #Nostock").val("");
          $("#status, #cmpny").val("");
          $("#lap_code-check").text("").removeClass("valid invalid");
          $("#stock-group").hide();
          toggleClearButton();
        }
      },
      error: function () {
        alert("Failed to save laptop.");
      }
    });
  });

  // Back to laptops list
  $("#laptop-btn").click(function (e) {
    e.preventDefault();
    localStorage.removeItem("editLaptopId");
    window.location.href = "laptops.html";
  });

  // Show/hide stock input
  $('#status').on('change', function () {
    const selected = $(this).val();
    if (selected === "true") {
      $('#stock-group').show();
    } else {
      $('#stock-group').hide();
      $('#Nostock').val("");
    }
  });
$("#increase-stock").click(function () {
  let current = parseInt($("#Nostock").val()) || 1;
  if (current < 100) {
    $("#Nostock").val(current + 1).trigger("input");
  }
});

$("#decrease-stock").click(function () {
  let current = parseInt($("#Nostock").val()) || 1;
  if (current > 1) {
    $("#Nostock").val(current - 1).trigger("input");
  }
});


});
