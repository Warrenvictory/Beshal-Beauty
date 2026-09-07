// ==========================================
// GOOGLE APPS SCRIPT WEB APP URL
// ==========================================

const API_URL =
  'https://script.google.com/macros/s/AKfycbzJtGK9EzituwYm0ZAk_TzzCOcDmjvFWRxIU3gRW3Rp_tR71VZOBykhOBTaO6HpwurV/exec';

document.addEventListener('DOMContentLoaded', function () {

  // Set today's date
  setToday();

  // Get HTML elements
  const quantityInput = document.getElementById('quantity');
  const priceInput = document.getElementById('price');
  const salesForm = document.getElementById('salesForm');

  // Calculate when quantity changes
  quantityInput.addEventListener('input', calculateTotal);

  // Calculate when price changes
  priceInput.addEventListener('input', calculateTotal);

  // Submit form
  salesForm.addEventListener('submit', submitSale);

  // Initial calculation
  calculateTotal();

});


// ==========================================
// SET TODAY'S DATE
// ==========================================

function setToday() {

  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    today.getDate()
  ).padStart(2, '0');

  document.getElementById('date').value =
    `${year}-${month}-${day}`;

}


// ==========================================
// CALCULATE TOTAL
// ==========================================

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
// SUBMIT SALE
// ==========================================

async function submitSale(event) {

  // Stop page refresh
  event.preventDefault();


  const submitButton =
    document.getElementById('submitButton');


  // ========================================
  // GET FORM VALUES
  // ========================================

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


  // ========================================
  // VALIDATION
  // ========================================

  if (!productName) {
    showMessage('Please select a product.', false);
    return;
  }

  if (!brand) {
    showMessage('Please select a brand.', false);
    return;
  }

  if (!category) {
    showMessage('Please select a category.', false);
    return;
  }

  if (!quantity || Number(quantity) <= 0) {
    showMessage('Please enter a valid quantity.', false);
    return;
  }

  if (!price || Number(price) <= 0) {
    showMessage('Please enter a valid price.', false);
    return;
  }

  if (!date) {
    showMessage('Please select a date.', false);
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


  // ========================================
  // CALCULATE TOTAL
  // ========================================

  const total =
    Number(quantity) *
    Number(price);


  // ========================================
  // DATA TO SEND
  // ========================================

  const saleData = {

    productName: productName,

    brand: brand,

    category: category,

    quantity: Number(quantity),

    price: Number(price),

    total: total,

    date: date,

    paymentMethod: paymentMethod

  };


  // ========================================
  // DISABLE BUTTON
  // ========================================

  submitButton.disabled = true;

  submitButton.textContent =
    'Saving...';


  try {

    // ======================================
    // SEND TO GOOGLE APPS SCRIPT
    // ======================================

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


    // ======================================
    // SUCCESS
    // ======================================

    if (result.success) {

      showMessage(
        'Sale recorded successfully! ' +
        'Sale ID: ' +
        result.saleId +
        ' | Total: KSH. ' +
        Number(result.total).toFixed(2),
        true
      );


      resetForm();

    } else {

      showMessage(
        result.message ||
        'Unable to save sale.',
        false
      );

    }


  } catch (error) {

    console.error(error);

    showMessage(
      'Unable to submit sale. Check the Apps Script URL and deployment.',
      false
    );

  }


  // ========================================
  // ENABLE BUTTON
  // ========================================

  submitButton.disabled = false;

  submitButton.textContent =
    'Submit Sale';

}


// ==========================================
// RESET FORM
// ==========================================

function resetForm() {

  document
    .getElementById('salesForm')
    .reset();


  document.getElementById('quantity').value =
    1;


  document.getElementById('total').textContent =
    '0.00';


  setToday();

}


// ==========================================
// SHOW MESSAGE
// ==========================================

function showMessage(text, success) {

  const message =
    document.getElementById('message');


  message.textContent = text;


  message.className =
    success
      ? 'message success'
      : 'message error';


  message.style.display =
    'block';


  setTimeout(function () {

    message.style.display =
      'none';

  }, 7000);

}
```

