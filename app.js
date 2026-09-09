/* =========================================
   MARKET | APP.JS
   ========================================= */

const products = {
  1: {
    id: 1,
    name: "کفش اسپرت مردانه مدل جدید",
    category: "کفش",
    icon: "👟",
    price: 1490000,
    oldPrice: 1800000,
    stock: 10,
    description:
      "کفش اسپرت با طراحی زیبا و راحت، مناسب استفاده روزمره و طولانی مدت."
  },

  2: {
    id: 2,
    name: "هدفون بی‌سیم با کیفیت بالا",
    category: "دیجیتال",
    icon: "🎧",
    price: 990000,
    oldPrice: 1170000,
    stock: 8,
    description:
      "هدفون بی‌سیم با کیفیت صدای مناسب و طراحی راحت برای استفاده روزانه."
  },

  3: {
    id: 3,
    name: "ساعت مچی اسپرت و روزمره",
    category: "لوازم جانبی",
    icon: "⌚",
    price: 2100000,
    oldPrice: 3000000,
    stock: 5,
    description:
      "ساعت اسپرت با طراحی جذاب، مناسب استفاده روزمره."
  },

  4: {
    id: 4,
    name: "کوله‌پشتی مناسب استفاده روزانه",
    category: "سایر",
    icon: "🎒",
    price: 1250000,
    oldPrice: 1400000,
    stock: 12,
    description:
      "کوله‌پشتی جادار و مناسب مدرسه، دانشگاه و استفاده روزانه."
  }
};


/* =========================================
   CART
   ========================================= */

let cart = JSON.parse(localStorage.getItem("marketCart")) || [];

let selectedProduct = null;
let selectedQuantity = 1;


/* ذخیره سبد */

function saveCart() {
  localStorage.setItem(
    "marketCart",
    JSON.stringify(cart)
  );
}


/* تعداد کل محصولات */

function updateCartCount() {

  const count = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartCount =
    document.getElementById("cartCount");

  if (cartCount) {
    cartCount.textContent = count;
  }
}


/* افزودن محصول */

function addProductToCart(id) {

  const product = products[id];

  if (!product) return;

  const existing = cart.find(
    item => item.id === id
  );

  if (existing) {

    if (existing.quantity < product.stock) {
      existing.quantity++;
    } else {
      alert("تعداد موجودی این محصول کافی نیست.");
      return;
    }

  } else {

    cart.push({
      id: id,
      quantity: 1
    });

  }

  saveCart();
  updateCartCount();

  alert("محصول به سبد خرید اضافه شد 🛒");
}


/* =========================================
   PRODUCT DETAILS
   ========================================= */

function openProduct(id) {

  const product = products[id];

  if (!product) return;

  selectedProduct = id;
  selectedQuantity = 1;

  document.getElementById("detailImage").textContent =
    product.icon;

  document.getElementById("detailCategory").textContent =
    product.category;

  document.getElementById("detailName").textContent =
    product.name;

  document.getElementById("detailPrice").textContent =
    formatPrice(product.price);

  document.getElementById("detailOldPrice").textContent =
    formatPrice(product.oldPrice);

  document.getElementById("detailDescription").textContent =
    product.description;

  document.getElementById("quantity").textContent =
    selectedQuantity;

  const stock = document.getElementById("detailStock");

  if (product.stock > 0) {

    stock.textContent =
      "🟢 موجود | " + product.stock + " عدد";

    stock.style.color = "#1c9c5a";

  } else {

    stock.textContent =
      "🔴 ناموجود";

    stock.style.color = "#e53935";
  }

  document
    .getElementById("productModal")
    .classList.add("show");
}


function closeProduct() {

  document
    .getElementById("productModal")
    .classList.remove("show");
}


/* تغییر تعداد */

function changeQuantity(amount) {

  if (!selectedProduct) return;

  const product =
    products[selectedProduct];

  selectedQuantity += amount;

  if (selectedQuantity < 1) {
    selectedQuantity = 1;
  }

  if (selectedQuantity > product.stock) {
    selectedQuantity = product.stock;
  }

  document.getElementById("quantity").textContent =
    selectedQuantity;
}


/* افزودن از صفحه جزئیات */

function addToCart() {

  if (!selectedProduct) return;

  const product =
    products[selectedProduct];

  const existing =
    cart.find(item => item.id === selectedProduct);

  const currentQuantity =
    existing ? existing.quantity : 0;

  if (
    currentQuantity + selectedQuantity >
    product.stock
  ) {

    alert("موجودی این محصول کافی نیست.");
    return;
  }

  if (existing) {

    existing.quantity += selectedQuantity;

  } else {

    cart.push({
      id: selectedProduct,
      quantity: selectedQuantity
    });

  }

  saveCart();
  updateCartCount();

  closeProduct();

  alert("محصول به سبد خرید اضافه شد 🛒");
}


/* =========================================
   CART MODAL
   ========================================= */

function openCart() {

  renderCart();

  document
    .getElementById("cartModal")
    .classList.add("show");
}


function closeCart() {

  document
    .getElementById("cartModal")
    .classList.remove("show");
}


/* نمایش سبد */

function renderCart() {

  const container =
    document.getElementById("cartItems");

  const totalElement =
    document.getElementById("cartTotal");

  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {

    container.innerHTML = `
      <div style="
        text-align:center;
        padding:40px 10px;
        color:#777;
      ">
        <div style="font-size:50px;">🛒</div>
        <h3 style="margin-top:10px;">
          سبد خرید خالی است
        </h3>
        <p style="margin-top:8px;">
          هنوز محصولی به سبد اضافه نکرده‌اید.
        </p>
      </div>
    `;

    totalElement.textContent =
      "۰ تومان";

    return;
  }


  let total = 0;


  cart.forEach(item => {

    const product =
      products[item.id];

    if (!product) return;

    const itemTotal =
      product.price * item.quantity;

    total += itemTotal;


    const div =
      document.createElement("div");

    div.style.cssText = `
      display:flex;
      align-items:center;
      gap:12px;
      padding:15px 0;
      border-bottom:1px solid #eee;
    `;


    div.innerHTML = `

      <div style="
        width:70px;
        height:70px;
        background:#f3f3f3;
        border-radius:12px;
        display:grid;
        place-items:center;
        font-size:35px;
        flex-shrink:0;
      ">
        ${product.icon}
      </div>

      <div style="flex:1;">

        <strong>
          ${product.name}
        </strong>

        <div style="
          color:#777;
          font-size:13px;
          margin-top:5px;
        ">
          ${formatPrice(product.price)}
        </div>

        <div style="
          display:flex;
          align-items:center;
          gap:8px;
          margin-top:10px;
        ">

          <button
            onclick="changeCartQuantity(${item.id}, 1)"
            style="
              border:0;
              width:30px;
              height:30px;
              border-radius:7px;
              cursor:pointer;
            "
          >
            +
          </button>

          <strong>
            ${item.quantity}
          </strong>

          <button
            onclick="changeCartQuantity(${item.id}, -1)"
            style="
              border:0;
              width:30px;
              height:30px;
              border-radius:7px;
              cursor:pointer;
            "
          >
            −
          </button>

        </div>

      </div>

      <button
        onclick="removeFromCart(${item.id})"
        style="
          border:0;
          background:#ffe8e8;
          color:#d33;
          padding:8px;
          border-radius:8px;
          cursor:pointer;
        "
      >
        حذف
      </button>
    `;


    container.appendChild(div);

  });


  totalElement.textContent =
    formatPrice(total);
}


/* تغییر تعداد داخل سبد */

function changeCartQuantity(id, amount) {

  const item =
    cart.find(item => item.id === id);

  const product =
    products[id];

  if (!item || !product) return;


  item.quantity += amount;


  if (item.quantity <= 0) {

    cart =
      cart.filter(item => item.id !== id);

  }


  if (item.quantity > product.stock) {

    item.quantity =
      product.stock;

  }


  saveCart();
  updateCartCount();
  renderCart();
}


/* حذف محصول */

function removeFromCart(id) {

  cart =
    cart.filter(item => item.id !== id);

  saveCart();
  updateCartCount();
  renderCart();
}


/* =========================================
   SEARCH
   ========================================= */

function searchProducts() {

  const input =
    document.getElementById("searchInput");

  if (!input) return;

  const value =
    input.value.trim().toLowerCase();

  const productElements =
    document.querySelectorAll(".product");

  if (!value) {

    productElements.forEach(product => {
      product.style.display = "";
    });

    return;
  }


  productElements.forEach(product => {

    const name =
      product.dataset.name?.toLowerCase() || "";

    const category =
      product.dataset.category?.toLowerCase() || "";

    if (
      name.includes(value) ||
      category.includes(value)
    ) {

      product.style.display = "";

    } else {

      product.style.display = "none";

    }

  });


  document
    .getElementById("products")
    ?.scrollIntoView({
      behavior: "smooth"
    });
}


const searchInput =
  document.getElementById("searchInput");

if (searchInput) {

  searchInput.addEventListener(
    "keydown",
    function(event) {

      if (event.key === "Enter") {
        searchProducts();
      }

    }
  );
}


/* =========================================
   CATEGORY FILTER
   ========================================= */

function filterCategory(category) {

  const productElements =
    document.querySelectorAll(".product");

  productElements.forEach(product => {

    const productCategory =
      product.dataset.category;

    if (
      category === "سایر" &&
      productCategory === "سایر"
    ) {

      product.style.display = "";

    } else if (
      productCategory === category
    ) {

      product.style.display = "";

    } else {

      product.style.display = "none";

    }

  });


  document
    .getElementById("products")
    ?.scrollIntoView({
      behavior: "smooth"
    });
}


/* نمایش همه */

function showAllProducts() {

  document
    .querySelectorAll(".product")
    .forEach(product => {

      product.style.display = "";

    });

  document
    .getElementById("products")
    ?.scrollIntoView({
      behavior: "smooth"
    });
}


/* =========================================
   LOGIN / OTP
   ========================================= */

function openLogin() {

  document
    .getElementById("loginModal")
    .classList.add("show");
}


function closeLogin() {

  document
    .getElementById("loginModal")
    .classList.remove("show");
}


/*
  این OTP فعلاً نمایشی است.
  OTP واقعی را در مرحله بک‌اند وصل می‌کنیم.
*/

let demoOTP = "";


function sendOTP() {

  const phone =
    document.getElementById("phoneInput").value.trim();

  if (!/^09\d{9}$/.test(phone)) {

    showLoginMessage(
      "شماره موبایل صحیح وارد کنید."
    );

    return;
  }


  demoOTP =
    Math.floor(
      100000 +
      Math.random() * 900000
    ).toString();


  document
    .getElementById("otpArea")
    .style.display = "block";


  showLoginMessage(
    "کد تأیید ارسال شد. برای آزمایش کد نمایش داده می‌شود: " +
    demoOTP
  );
}


function verifyOTP() {

  const otp =
    document
      .getElementById("otpInput")
      .value.trim();


  if (otp === demoOTP && demoOTP !== "") {

    localStorage.setItem(
      "marketUser",
      document
        .getElementById("phoneInput")
        .value.trim()
    );


    showLoginMessage(
      "ورود با موفقیت انجام شد ✅"
    );


    setTimeout(() => {

      closeLogin();

    }, 1200);


  } else {

    showLoginMessage(
      "کد تأیید اشتباه است."
    );

  }
}


function showLoginMessage(message) {

  const element =
    document.getElementById("loginMessage");

  if (element) {
    element.textContent = message;
  }
}


/* =========================================
   CHECKOUT
   ========================================= */

function openCheckout() {

  if (cart.length === 0) {

    alert("سبد خرید شما خالی است.");

    return;
  }


  closeCart();


  const savedPhone =
    localStorage.getItem("marketUser");


  if (savedPhone) {

    document.getElementById(
      "customerPhone"
    ).value = savedPhone;

  }


  document
    .getElementById("checkoutModal")
    .classList.add("show");
}


function closeCheckout() {

  document
    .getElementById("checkoutModal")
    .classList.remove("show");
}


function submitOrder() {

  const name =
    document
      .getElementById("customerName")
      .value.trim();


  const phone =
    document
      .getElementById("customerPhone")
      .value.trim();


  const province =
    document
      .getElementById("province")
      .value;


  const city =
    document
      .getElementById("city")
      .value.trim();


  const address =
    document
      .getElementById("address")
      .value.trim();


  const unit =
    document
      .getElementById("unit")
      .value.trim();


  const postalCode =
    document
      .getElementById("postalCode")
      .value.trim();


  if (!name) {

    alert("نام گیرنده را وارد کنید.");
    return;

  }


  if (!/^09\d{9}$/.test(phone)) {

    alert("شماره موبایل صحیح وارد کنید.");
    return;

  }


  if (!province) {

    alert("استان را انتخاب کنید.");
    return;

  }


  if (!city) {

    alert("شهر را وارد کنید.");
    return;

  }


  if (!address) {

    alert("آدرس کامل را وارد کنید.");
    return;

  }


  if (!unit) {

    alert("پلاک و واحد را وارد کنید.");
    return;

  }


  if (!/^\d{10}$/.test(postalCode)) {

    alert("کد پستی باید ۱۰ رقم باشد.");
    return;

  }


  const order = {

    id:
      "MKT-" +
      Date.now(),

    date:
      new Date().toLocaleString("fa-IR"),

    customer: {

      name,
      phone,
      province,
      city,
      address,
      unit,
      postalCode

    },

    items: [...cart],

    status:
      "در انتظار بررسی"

  };


  const orders =
    JSON.parse(
      localStorage.getItem("marketOrders")
    ) || [];


  orders.push(order);


  localStorage.setItem(
    "marketOrders",
    JSON.stringify(orders)
  );


  cart = [];

  saveCart();
  updateCartCount();


  closeCheckout();


  alert(
    "سفارش شما با موفقیت ثبت شد ✅\n\n" +
    "شماره سفارش: " +
    order.id
  );
}


/* =========================================
   HELPERS
   ========================================= */

function formatPrice(number) {

  return (
    Number(number)
      .toLocaleString("fa-IR") +
    " تومان"
  );

}


/* =========================================
   CLOSE MODALS BY BACKGROUND
   ========================================= */

document.addEventListener(
  "click",
  function(event) {

    if (
      event.target.classList.contains("modal")
    ) {

      event.target.classList.remove("show");

    }

  }
);


/* =========================================
   START
   ========================================= */

updateCartCount();
/* =========================================
   PRODUCT DETAILS
   ========================================= */

function openProduct(id) {
  const product = products[id];

  if (!product) return;

  selectedProduct = id;
  selectedQuantity = 1;

  document.getElementById("detailImage").textContent = product.icon;
  document.getElementById("detailCategory").textContent = product.category;
  document.getElementById("detailName").textContent = product.name;
  document.getElementById("detailPrice").textContent = formatPrice(product.price);
  document.getElementById("detailOldPrice").textContent = formatPrice(product.oldPrice);
  document.getElementById("detailDescription").textContent = product.description;
  document.getElementById("quantity").textContent = selectedQuantity;

  const stock = document.getElementById("detailStock");

  if (product.stock > 0) {
    stock.textContent = "🟢 موجود | " + product.stock + " عدد";
    stock.style.color = "#1c9c5a";
  } else {
    stock.textContent = "🔴 ناموجود";
    stock.style.color = "#e53935";
  }

  document.getElementById("productModal").classList.add("show");
}


function closeProduct() {
  document.getElementById("productModal").classList.remove("show");
}


function changeQuantity(amount) {
  if (!selectedProduct) return;

  const product = products[selectedProduct];

  selectedQuantity += amount;

  if (selectedQuantity < 1) {
    selectedQuantity = 1;
  }

  if (selectedQuantity > product.stock) {
    selectedQuantity = product.stock;
  }

  document.getElementById("quantity").textContent = selectedQuantity;
}


function addToCart() {
  if (!selectedProduct) return;

  const product = products[selectedProduct];

  if (product.stock <= 0) {
    alert("این محصول ناموجود است.");
    return;
  }

  const existing = cart.find(
    item => item.id === selectedProduct
  );

  const currentQuantity =
    existing ? existing.quantity : 0;

  if (
    currentQuantity + selectedQuantity >
    product.stock
  ) {
    alert("موجودی این محصول کافی نیست.");
    return;
  }

  if (existing) {
    existing.quantity += selectedQuantity;
  } else {
    cart.push({
      id: selectedProduct,
      quantity: selectedQuantity
    });
  }

  saveCart();
  updateCartCount();
  closeProduct();

  alert("محصول به سبد خرید اضافه شد 🛒");
}


/* =========================================
   CART MODAL
   ========================================= */

function openCart() {
  renderCart();

  document
    .getElementById("cartModal")
    .classList.add("show");
}


function closeCart() {
  document
    .getElementById("cartModal")
    .classList.remove("show");
}


function renderCart() {
  const container =
    document.getElementById("cartItems");

  const totalElement =
    document.getElementById("cartTotal");

  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="
        text-align:center;
        padding:40px 10px;
        color:#777;
      ">
        <div style="font-size:50px;">🛒</div>

        <h3 style="margin-top:10px;">
          سبد خرید خالی است
        </h3>

        <p style="margin-top:8px;">
          هنوز محصولی به سبد اضافه نکرده‌اید.
        </p>
      </div>
    `;

    totalElement.textContent = "۰ تومان";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const product = products[item.id];

    if (!product) return;

    const itemTotal =
      product.price * item.quantity;

    total += itemTotal;

    const div =
      document.createElement("div");

    div.style.cssText = `
      display:flex;
      align-items:center;
      gap:12px;
      padding:15px 0;
      border-bottom:1px solid #eee;
    `;

    div.innerHTML = `
      <div style="
        width:70px;
        height:70px;
        background:#f3f3f3;
        border-radius:12px;
        display:grid;
        place-items:center;
        font-size:35px;
        flex-shrink:0;
      ">
        ${product.icon}
      </div>

      <div style="flex:1;">
        <strong>${product.name}</strong>

        <div style="
          color:#777;
          font-size:13px;
          margin-top:5px;
        ">
          ${formatPrice(product.price)}
        </div>

        <div style="
          display:flex;
          align-items:center;
          gap:8px;
          margin-top:10px;
        ">

          <button
            onclick="changeCartQuantity(${item.id}, 1)"
            style="
              border:0;
              width:30px;
              height:30px;
              border-radius:7px;
              cursor:pointer;
            "
          >+</button>

          <strong>${item.quantity}</strong>

          <button
            onclick="changeCartQuantity(${item.id}, -1)"
            style="
              border:0;
              width:30px;
              height:30px;
              border-radius:7px;
              cursor:pointer;
            "
          >−</button>

        </div>
      </div>

      <button
        onclick="removeFromCart(${item.id})"
        style="
          border:0;
          background:#ffe8e8;
          color:#d33;
          padding:8px;
          border-radius:8px;
          cursor:pointer;
        "
      >
        حذف
      </button>
    `;

    container.appendChild(div);
  });

  totalElement.textContent =
    formatPrice(total);
}


function changeCartQuantity(id, amount) {
  const item = cart.find(
    item => item.id === id
  );

  const product = products[id];

  if (!item || !product) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(
      item => item.id !== id
    );
  }

  if (item.quantity > product.stock) {
    item.quantity = product.stock;
  }

  saveCart();
  updateCartCount();
  renderCart();
}


function removeFromCart(id) {
  cart = cart.filter(
    item => item.id !== id
  );

  saveCart();
  updateCartCount();
  renderCart();
}


/* =========================================
   SEARCH
   ========================================= */

function searchProducts() {
  const input =
    document.getElementById("searchInput");

  if (!input) return;

  const value =
    input.value.trim().toLowerCase();

  const productElements =
    document.querySelectorAll(".product");

  productElements.forEach(product => {
    const name =
      product.dataset.name?.toLowerCase() || "";

    const category =
      product.dataset.category?.toLowerCase() || "";

    if (
      !value ||
      name.includes(value) ||
      category.includes(value)
    ) {
      product.style.display = "";
    } else {
      product.style.display = "none";
    }
  });

  document
    .getElementById("products")
    ?.scrollIntoView({
      behavior: "smooth"
    });
}


const searchInput =
  document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener(
    "keydown",
    function(event) {
      if (event.key === "Enter") {
        searchProducts();
      }
    }
  );
                          }
/* =========================================
   CATEGORY FILTER
   ========================================= */

function filterCategory(category) {
  const productElements =
    document.querySelectorAll(".product");

  productElements.forEach(product => {
    const productCategory =
      product.dataset.category;

    if (productCategory === category) {
      product.style.display = "";
    } else {
      product.style.display = "none";
    }
  });

  document
    .getElementById("products")
    ?.scrollIntoView({
      behavior: "smooth"
    });
}


function showAllProducts() {
  document
    .querySelectorAll(".product")
    .forEach(product => {
      product.style.display = "";
    });

  document
    .getElementById("products")
    ?.scrollIntoView({
      behavior: "smooth"
    });
}


/* =========================================
   LOGIN / OTP
   ========================================= */

function openLogin() {
  const modal =
    document.getElementById("loginModal");

  if (modal) {
    modal.classList.add("show");
  }
}


function closeLogin() {
  const modal =
    document.getElementById("loginModal");

  if (modal) {
    modal.classList.remove("show");
  }
}


let demoOTP = "";


function sendOTP() {
  const phone =
    document
      .getElementById("phoneInput")
      ?.value.trim();

  if (!phone) {
    showLoginMessage(
      "لطفاً شماره موبایل را وارد کنید."
    );
    return;
  }

  if (!/^09\d{9}$/.test(phone)) {
    showLoginMessage(
      "شماره موبایل صحیح نیست."
    );
    return;
  }

  demoOTP =
    Math.floor(
      100000 +
      Math.random() * 900000
    ).toString();

  const otpArea =
    document.getElementById("otpArea");

  if (otpArea) {
    otpArea.style.display = "block";
  }

  showLoginMessage(
    "کد تأیید آزمایشی شما: " +
    demoOTP
  );
}


function verifyOTP() {
  const otp =
    document
      .getElementById("otpInput")
      ?.value.trim();

  if (!otp) {
    showLoginMessage(
      "کد تأیید را وارد کنید."
    );
    return;
  }

  if (
    otp === demoOTP &&
    demoOTP !== ""
  ) {

    const phone =
      document
        .getElementById("phoneInput")
        ?.value.trim();

    localStorage.setItem(
      "marketUser",
      phone
    );

    showLoginMessage(
      "ورود با موفقیت انجام شد ✅"
    );

    setTimeout(() => {
      closeLogin();
    }, 1000);

  } else {

    showLoginMessage(
      "کد تأیید اشتباه است."
    );

  }
}


function showLoginMessage(message) {
  const element =
    document.getElementById(
      "loginMessage"
    );

  if (element) {
    element.textContent = message;
  }
}


/* =========================================
   CHECKOUT
   ========================================= */

function openCheckout() {

  if (cart.length === 0) {
    alert(
      "سبد خرید شما خالی است."
    );
    return;
  }

  closeCart();

  const savedPhone =
    localStorage.getItem(
      "marketUser"
    );

  const phoneInput =
    document.getElementById(
      "customerPhone"
    );

  if (
    savedPhone &&
    phoneInput
  ) {
    phoneInput.value =
      savedPhone;
  }

  const modal =
    document.getElementById(
      "checkoutModal"
    );

  if (modal) {
    modal.classList.add("show");
  }
}


function closeCheckout() {

  const modal =
    document.getElementById(
      "checkoutModal"
    );

  if (modal) {
    modal.classList.remove("show");
  }
}


function submitOrder() {

  const name =
    document
      .getElementById("customerName")
      ?.value.trim();

  const phone =
    document
      .getElementById("customerPhone")
      ?.value.trim();

  const province =
    document.getElementById(
      "province"
    )?.value;

  const city =
    document
      .getElementById("city")
      ?.value.trim();

  const address =
    document
      .getElementById("address")
      ?.value.trim();

  const unit =
    document
      .getElementById("unit")
      ?.value.trim();

  const postalCode =
    document
      .getElementById("postalCode")
      ?.value.trim();


  if (!name) {
    alert("نام گیرنده را وارد کنید.");
    return;
  }

  if (!/^09\d{9}$/.test(phone)) {
    alert("شماره موبایل صحیح نیست.");
    return;
  }

  if (!province) {
    alert("استان را انتخاب کنید.");
    return;
  }

  if (!city) {
    alert("شهر را وارد کنید.");
    return;
  }

  if (!address) {
    alert("آدرس کامل را وارد کنید.");
    return;
  }

  if (!unit) {
    alert("پلاک و واحد را وارد کنید.");
    return;
  }

  if (!/^\d{10}$/.test(postalCode)) {
    alert(
      "کد پستی باید ۱۰ رقم باشد."
    );
    return;
  }


  const order = {

    id:
      "MKT-" +
      Date.now(),

    date:
      new Date().toLocaleString(
        "fa-IR"
      ),

    customer: {
      name: name,
      phone: phone,
      province: province,
      city: city,
      address: address,
      unit: unit,
      postalCode: postalCode
    },

    items: [...cart],

    status:
      "در انتظار بررسی"

  };


  const orders =
    JSON.parse(
      localStorage.getItem(
        "marketOrders"
      )
    ) || [];


  orders.push(order);


  localStorage.setItem(
    "marketOrders",
    JSON.stringify(orders)
  );


  cart = [];

  saveCart();
  updateCartCount();


  closeCheckout();


  alert(
    "سفارش با موفقیت ثبت شد ✅\n\n" +
    "شماره سفارش:\n" +
    order.id
  );
}


/* =========================================
   PRICE FORMAT
   ========================================= */

function formatPrice(number) {

  return Number(number)
    .toLocaleString("fa-IR")
    + " تومان";

}


/* =========================================
   MODAL CLOSE
   ========================================= */

document.addEventListener(
  "click",
  function(event) {

    if (
      event.target.classList.contains(
        "modal"
      )
    ) {

      event.target.classList.remove(
        "show"
      );

    }

  }
);


/* =========================================
   START MARKET
   ========================================= */

updateCartCount();
