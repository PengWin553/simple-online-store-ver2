// function loadData() {
//     $.ajax({
//       url: "products.php"
//     }).done(function(data) {
//       try {
//         let result = JSON.parse(data);
//         if (result.res === "success") {
//           let resultBoxes = $("#resultBoxes");
//           result.data.forEach(item => {
//             let resultBox = `
//             <div class="col-md-4">
//                 <div class="card mb-3">
//                     <img src="${item.picture_url}" class="card-img-top" alt="Product Image" style="width: 300px; height: 200px; object-fit: cover;"> 
//                     <div class="card-body">
//                         <p class="card-text">Product name: ${item.name}</p>
//                         <p class="card-text">Category: ${item.category}</p>
//                         <p class="card-text">Quantity: ${item.quantity}</p>
//                         <button class="btnUpdate" id="${item.id}" name="${item.name}" data-product-category="${item.category}" data-product-quantity="${item.quantity}">EDIT</button>
//                         <button class="btnDelete" id="${item.id}">DELETE</button>
//                     </div>
//                 </div>
//             </div>`;
//             resultBoxes.append(resultBox);
//           });
//         } else {
//           alert("Failed to load product data.");
//         }
//       } catch (error) {
//         console.error("Error parsing JSON:", error);
//         alert("An unexpected error occurred. Please try again later.");
//       }
//     }).fail(function(xhr, status, error) {
//       console.error("An error occurred while fetching product data:", error);
//       alert("An error occurred while fetching product data. Please try again later.");
//     });
//   }

function loadData() {
    $.ajax({
        url: "products.php"
    }).done(function(data) {
        try {
            let result = JSON.parse(data);
            if (result.res === "success") {
                let resultBoxes = $("#resultBoxes");
                result.data.forEach(item => {
                    let resultBox = `
                      <div style="background: white;">
                        <div class=".card-columns" style="background: pink; display: flex; justify-content: center; align-items: center;">
                            <div class="card">
                                <img src="${item.picture_url}" class="card-img-top" alt="Product Image"> 
                                <div class="card-body">
                                    <p class="card-text">Product name: ${item.name}</p>
                                    <p class="card-text">Category: ${item.category}</p>
                                    <p class="card-text">Quantity: ${item.quantity}</p>
                                    <button class="btnUpdate btn btn-primary" id="${item.id}" name="${item.name}" data-product-category="${item.category}" data-product-quantity="${item.quantity}">EDIT</button>
                                    <button class="btnDelete btn btn-danger" id="${item.id}">DELETE</button>
                                </div>
                            </div>
                        </div>
                      </div>`;
                    resultBoxes.append(resultBox);
                });
            } else {
                alert("Failed to load product data.");
            }
        } catch (error) {
            console.error("Error parsing JSON:", error);
            alert("An unexpected error occurred. Please try again later.");
        }
    }).fail(function(xhr, status, error) {
        console.error("An error occurred while fetching product data:", error);
        alert("An error occurred while fetching product data. Please try again later.");
    });
}
  
  loadData();

  
  $("#btnSaveProduct").click(function() {
    var formData = new FormData($("#newProductForm")[0]);
    $.ajax({
      url: "products.create.php",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
    }).done(function(data) {
      let result = JSON.parse(data);
      if (result.res == "success") {
        location.reload();
      }
    })
  });

  $("#btnSaveCategory").click(function() {
    var categoryName = $("#categoryName").val();
    if (categoryName.trim().length > 0) {
      $.ajax({
        url: "categories.create.php",
        method: "POST",
        data: { name: categoryName },
        success: function(data) {
          var result = JSON.parse(data);
          if (result.res === "success") {
            location.reload();
          }
        }
      });
    } else {
      alert("Please enter a category name.");
    }
  });

  // Update Product
  $(document).on("click", ".btnUpdate", function() {
    var productId = $(this).attr("id");
    var productName = $(this).attr("name");
    var productCategory = $(this).data("product-category");
    var productQuantity = $(this).data("product-quantity");
    var currentPictureUrl = $(this).closest(".card").find(".card-img-top").attr("src");

    // Set values in the update modal
    $("#updateProductId").val(productId);
    $("#updateProductName").val(productName);
    $("#updateProductCategory").val(productCategory);
    $("#updateProductQuantity").val(productQuantity);
    $("#currentPicture").attr("src", currentPictureUrl);

    $("#updateModal").modal("show");
});

$("#btnUpdateProduct").click(function() {
    var productId = $("#updateProductId").val();
    var productName = $("#updateProductName").val();
    var productCategory = $("#updateProductCategory").val();
    var productQuantity = $("#updateProductQuantity").val();

    var formData = new FormData();
    var picture = $("#updatePicture")[0].files[0];

    // Append form data
    formData.append('id', productId);
    formData.append('name', productName);
    formData.append('category', productCategory);
    formData.append('quantity', productQuantity);

    // Append picture
    formData.append('picture', picture);

    if (productName.length > 0 && productCategory.length > 0 && productQuantity.length > 0) {
        $.ajax({
            url: "products.update.php",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
        }).done(function(data) {
            let result = JSON.parse(data);
            if (result.res == "success") {
                location.reload();
            }
        }).fail(function(xhr, status, error) {
            console.error("An error occurred while updating product:", error);
            alert("An error occurred while updating product. Please try again later.");
        });
    }
});

  
  
  $(document).on("click", ".btnDelete", function() {
    var productId = $(this).attr("id");
  
    if (confirm("Are you sure you want to delete this product?")) {
      $.ajax({
        url: "products.delete.php",
        type: "POST",
        data: {
          id: productId
        }
      }).done(function(data) {
        let result = JSON.parse(data);
        if (result.res == "success") {
          location.reload();
        }
      });
    }
  });
  
  function populateCategories() {
    $.ajax({
        url: "category.php",
        method: "GET",
        dataType: "json",
        success: function(data) {
            if (data.res === "success") {
                $('#category').empty();
                data.category.forEach(function(category) {
                    $('#category').append('<option value="' + category.name + '">' + category.name + '</option>');
                });
                $('#updateProductCategory').empty();
                data.category.forEach(function(category) {
                    $('#updateProductCategory').append('<option value="' + category.name + '">' + category.name + '</option>');
                });
            } else {
                alert("Failed to load categories.");
            }
        },
        error: function(xhr, status, error) {
            console.error("An error occurred while fetching categories:", error);
            alert("An error occurred while fetching categories. Please try again later.");
        }
    });
  }