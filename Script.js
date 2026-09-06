// ==========================================
// GOOGLE APPS SCRIPT WEB APP URL
// ==========================================

const API_URL =
  'https://script.google.com/macros/s/AKfycbzJtGK9EzituwYm0ZAk_TzzCOcDmjvFWRxIU3gRW3Rp_tR71VZOBykhOBTaO6HpwurV/exec';


// 
// PAGE LOAD
// 

document.addEventListener('DOMContentLoaded', function () {

  // Set today's date
  setToday();

  // Calculate initial total
  calculateTotal();

});
// 
// SET TODAY'S DATE
// 

function setToday() {

  const today = new Date();

  const year =
    today.getFullYear();

  const month =
    String(today.getMonth() + 1).padStart(2, '0');

  const day =
    String(today.getDate()).padStart(2, '0');

  document.getElementById('date').value =
    year + '-' + month + '-' + day;

}


// ==========================================
// QUANTITY / PRICE → TOTAL
// ==========================================

document
  .getElementById('quantity')
  .addEventListener('input', calculateTotal);

document
  .getElementById('price')
  .addEventListener('input', calculateTotal);


function calculateTotal() {

  const quantity =
    Number(
      document.getElementById('quantity').value
    ) || 0;

  const price =
    Number(
      document.getElementById('price').value
    ) || 0;

  const total =
    quantity * price;

  document.getElementById('total').textContent =
    total.toFixed(2);

}


// ==========================================
// SUBMIT FORM
// ==========================================

document
  .getElementById('salesForm')
  .addEventListener('submit', async function (event) {

    event.preventDefault();


    // --------------------------------------
    // GET VALUES FROM HTML
    // --------------------------------------

    const productName =
      document.getElementById('productName').value;

    const brand =
      document.getElementById('brand').value;

    const category =
      document.getElementById('category').value;

    const quantity =
      document.getElementById('quantity').value;

    const price =
      document.getElementById('price').value;

    const date =
      document.getElementById('date').value;

    const paymentMethod =
      document.getElementById('paymentMethod').value;


    // --------------------------------------
    // VALIDATION
    // --------------------------------------

    if (!productName) {

      showMessage(
        'Please select a product.',
        false
      );

      return;
    }


    if (!brand) {

      showMessage(
        'Please select a brand.',
        false
      );

      return;
    }


    if (!category) {

      showMessage(
        'Please select a category.',
        false
      );

      return;
    }


    if (!quantity || Number(quantity) <= 0) {

      showMessage(
        'Please enter a valid quantity.',
        false
      );

      return;
    }
    if (!price || Number(price) < 0) {

      showMessage(
        'Please enter a valid price.',
        false
      );
      return;
    }
    if (!date) {

      showMessage(
        'Please select a date.',
        false
      );

      return;
    }
    if (
      !paymentMethod ||
      paymentMethod === 'Select Option'
    ) {

      showMessage(
        'Please select a payment method.',
        false
      );

      return;
    }

    // CALCULATE TOTAL //
    const total =
      Number(quantity) *
      Number(price);


    // --------------------------------------
    // DISABLE BUTTON
    // --------------------------------------

    const submitButton =
      document.getElementById('submitButton');

    submitButton.disabled = true;

    submitButton.textContent =
      'Saving...';


    // --------------------------------------
    // CREATE SALE DATA
    // --------------------------------------

    const saleData = {

      productName:
        productName,

      brand:
        brand,

      category:
        category,

      quantity:
        Number(quantity),

      price:
        Number(price),

      total:
        total,

      date:
        date,

      paymentMethod:
        paymentMethod

    };

    // SEND DATA TO GOOGLE APPS SCRIPT// 

    try {

      const response =
        await fetch(
          API_URL,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'text/plain;charset=utf-8'
            },

            body:
              JSON.stringify(saleData)
          }
        );

      const result =
        await response.json();

      // SUCCESS// 
      if (result.success) {

        showMessage(
          'Brenda you successfully made a sale for! ' +
          'Sale ID: ' +
          result.saleId +
          ' | Total: KSH. ' +
          Number(result.total).toFixed(2),
          true
        );

        // Reset form
        resetForm();

      }
      // ERROR FROM APPS SCRIPT
      // 
      else {

        showMessage(
          result.message ||
          'Unable to save the sale.',
          false
        );

      }
    } catch (error) {

      showMessage(
        'Unable to connect to the server. ' +
        'Please check your internet connection ' +
        'and Apps Script URL.',
        false
      );

      console.error(
        'Error:',
        error
      );

    }
// ENABLE BUTTON AGAIN//

    submitButton.disabled = false;

    submitButton.textContent =
      'Submit Sale';

  });
// RESET FORM//
function resetForm() {

  document
    .getElementById('salesForm')
    .reset();

  // Reset quantity
  document.getElementById('quantity').value =
    1;

  // Reset payment dropdown
  document.getElementById('paymentMethod').value =
    'Select Option';

  // Reset total
  document.getElementById('total').textContent =
    '0.00';


  // Put today's date back
  setToday();

}
// SHOW SUCCESS / ERROR MESSAGE//
function showMessage(
  text,
  success
) {

  const message =
    document.getElementById('message');

  message.textContent =
    text;

  message.className =
    'message ' +
    (success
      ? 'success'
      : 'error');

  message.style.display =
    'block';
  // Scroll to message
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  // Hide after 7 seconds
  setTimeout(function () {

    message.style.display =
      'none';

  }, 7000);

}