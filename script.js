

const API_URL =
  'https://script.google.com/macros/s/AKfycbzJtGK9EzituwYm0ZAk_TzzCOcDmjvFWRxIU3gRW3Rp_tR71VZOBykhOBTaO6HpwurV/exec';
// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
  'DOMContentLoaded',
  function () {

    // Set today's date
    setToday();

    // Calculate initial total
    calculateTotal();


    // ======================================
    // QUANTITY / PRICE CALCULATION
    // ======================================

    const quantityInput =
      document.getElementById('quantity');

    const priceInput =
      document.getElementById('price');


    quantityInput.addEventListener(
      'input',
      calculateTotal
    );


    priceInput.addEventListener(
      'input',
      calculateTotal
    );


    // ======================================
    // FORM SUBMISSION
    // ======================================

    const salesForm =
      document.getElementById('salesForm');


    salesForm.addEventListener(
      'submit',
      submitSale
    );

  }
);


// ==========================================
// SET TODAY'S DATE
// ==========================================

function setToday() {

  const today =
    new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(
      2,
      '0'
    );

  const day =
    String(
      today.getDate()
    ).padStart(
      2,
      '0'
    );


  document
    .getElementById('date')
    .value =
    `${year}-${month}-${day}`;

}


// ==========================================
// CALCULATE TOTAL
// ==========================================

function calculateTotal() {

  const quantity =
    Number(
      document
        .getElementById('quantity')
        .value
    ) || 0;


  const price =
    Number(
      document
        .getElementById('price')
        .value
    ) || 0;


  const total =
    quantity * price;


  document
    .getElementById('total')
    .textContent =
    total.toFixed(2);

}


// ==========================================
// SUBMIT SALE
// ==========================================

async function submitSale(event) {

  event.preventDefault();


  // ========================================
  // GET FORM VALUES
  // ========================================

  const productName =
    document
      .getElementById('productName')
      .value;


  const brand =
    document
      .getElementById('brand')
      .value;


  const category =
    document
      .getElementById('category')
      .value;


  const quantity =
    document
      .getElementById('quantity')
      .value;


  const price =
    document
      .getElementById('price')
      .value;


  const date =
    document
      .getElementById('date')
      .value;


  const paymentMethod =
    document
      .getElementById('paymentMethod')
      .value;


  // ========================================
  // VALIDATION
  // ========================================

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


  if (
    !quantity ||
    Number(quantity) <= 0
  ) {

    showMessage(
      'Please enter a valid quantity.',
      false
    );

    return;

  }


  if (
    price === '' ||
    Number(price) < 0
  ) {

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


  if (!paymentMethod) {

    showMessage(
      'Please select a payment method.',
      false
    );

    return;

  }


  // ========================================
  // CALCULATE TOTAL
  // ========================================

  const total =
    Number(quantity) *
    Number(price);


  // ========================================
  // CREATE SALE DATA
  // ========================================

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


  // ========================================
  // SUBMIT BUTTON
  // ========================================

  const submitButton =
    document
      .getElementById('submitButton');


  submitButton.disabled =
    true;


  submitButton.textContent =
    'Saving...';


  // ========================================
  // SEND DATA TO GOOGLE APPS SCRIPT
  // ========================================

  try {

    const response =
      await fetch(
        API_URL,
        {

          method:
            'POST',

          headers: {

            'Content-Type':
              'text/plain;charset=utf-8'

          },

          body:
            JSON.stringify(
              saleData
            )

        }
      );


    // Check server response
    if (!response.ok) {

      throw new Error(
        `Server returned status ${response.status}`
      );

    }


    const result =
      await response.json();


    // ======================================
    // SUCCESS
    // ======================================

    if (result.success) {

      showMessage(
        'You successfully made a sale! ' +
        'Sale ID: ' +
        result.saleId +
        ' | Total: KSH. ' +
        Number(
          result.total
        ).toFixed(2),
        true
      );


      // Reset form
      resetForm();

    }


    // ======================================
    // ERROR FROM APPS SCRIPT
    // ======================================

    else {

      showMessage(
        result.message ||
        'Unable to save the sale.',
        false
      );

    }

  }


  // ========================================
  // CONNECTION ERROR
  // ========================================

  catch (error) {

    console.error(
      'Submission error:',
      error
    );


    showMessage(
      'Unable to connect to the server. ' +
      'Please check your internet connection ' +
      'and Google Apps Script deployment.',
      false
    );

  }


  // ========================================
  // ENABLE BUTTON AGAIN
  // ========================================

  finally {

    submitButton.disabled =
      false;


    submitButton.textContent =
      'Submit Sale';

  }

}


// ==========================================
// RESET FORM
// ==========================================

function resetForm() {

  const salesForm =
    document
      .getElementById('salesForm');


  salesForm.reset();


  // Reset quantity
  document
    .getElementById('quantity')
    .value =
    1;


  // Reset payment method
  document
    .getElementById('paymentMethod')
    .value =
    '';


  // Reset price
  document
    .getElementById('price')
    .value =
    '';


  // Reset total
  document
    .getElementById('total')
    .textContent =
    '0.00';


  // Set today's date again
  setToday();

}


// ==========================================
// SHOW SUCCESS / ERROR MESSAGE
// ==========================================

function showMessage(
  text,
  success
) {

  const message =
    document
      .getElementById('message');


  message.textContent =
    text;


  message.className =
    success
      ? 'message success'
      : 'message error';


  message.style.display =
    'block';


  // Scroll to message
  window.scrollTo({

    top:
      0,

    behavior:
      'smooth'

  });


  // Hide after 7 seconds
  setTimeout(
    function () {

      message.style.display =
        'none';

    },
    7000
  );

}
