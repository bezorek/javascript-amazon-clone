import { deleteOrder, getOrders } from "../data/orders.js";
import { getProduct } from "../data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { cart } from "../data/cart-class.js";

export async function renderPlacedOrderSummary() {
  const orders = await getOrders();
  let orderSummaryHTML = "";

  orders.forEach((order) => {
    const orderTimeString = dayjs(order.orderDate).format("MMMM D");

    orderSummaryHTML += `
        <div class="order-container">
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${orderTimeString}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${order.totalValue}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.orderId}</div>
              <button class="delete-order-button button-secondary js-cancel-order-button" data-order-id=${
                order.orderId
              }>Cancel Order</button>
            </div>
          </div>

          <div class="order-details-grid">
            ${generateItemsHTML(order)}
          </div>
         </div>
      `;
  });
  // zabrac product id z order zeby dotrzec do product id z produktu aby pokazac zdjecie/nazwe
  function generateItemsHTML(order) {
    let html = "";
    order.items.forEach((item) => {
      const matchingItem = getProduct(item.productId);

      html += `
            <div class="product-image-container">
            <img src="${matchingItem.image}">
            </div>
   
            <div class="product-details">
            <div class="product-name">
               ${matchingItem.name}
            </div>
            <div class="product-delivery-date">
               Arriving on: ${dayjs(item.deliveryDate).format("MMMM D")}
            </div>
            <div class="product-quantity">
               Quantity: ${item.quantity}
            </div>
            <button class="buy-again-button button-primary js-buy-again-button" data-product-id=${
              item.productId
            } data-quantity=${item.quantity}>
               <img class="buy-again-icon" src="images/icons/buy-again.png">
               <span class="buy-again-message">Buy it again</span>
            </button>
            </div>
   
            <div class="product-actions">
            <a href="tracking.html?orderId=${order.orderId}&productId=${
        item.productId
      }">
               <button class="track-package-button button-secondary">
                  Track package
               </button>
            </a>
               <dialog class="return-order-container return-modal modal-${
                 order.orderId
               }">
                  <div class="modal-container">
                     <span>Do you want to return your order (${
                       order.orderId
                     }?</span>
                     <div class="return-modal-buttons">
                        <button class="button-primary modal-button js-confirm-button-${
                          order.orderId
                        }">Yes</button>
                        <button class="button-primary modal-button close-modal-${
                          order.orderId
                        }">No</button>
                     </div>
                  </div>
               </dialog>
            </div>
         `;
    });

    return html;
  }
  document.querySelector(".js-orders-grid").innerHTML = orderSummaryHTML;
  document.querySelector(".js-cart-quantity").innerHTML =
    cart.updateCartQuantity();

  document.querySelectorAll(".js-buy-again-button").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const quantity = button.dataset.quantity;
      cart.addToCart(productId, quantity);
      document.querySelector(".js-cart-quantity").innerHTML =
        cart.updateCartQuantity();
      button.innerHTML = "Added";
      setTimeout(() => {
        button.innerHTML = `
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
            `;
      }, 1000);
    });
  });

  document.querySelector(".js-search-button").addEventListener("click", () => {
    const search = document.querySelector(".js-search-bar").value;
    window.location.href = `amazon.html?search=${search}`;
  });

  //RETURN ORDER FUNCTION

  document.querySelectorAll(".js-cancel-order-button").forEach((button) => {
    button.addEventListener("click", () => {
      // modal window to return products
      const orderId = button.dataset.orderId;
      console.log(orderId);
      const modal = document.querySelector(`.modal-${orderId}`);
      const closeButton = document.querySelector(`.close-modal-${orderId}`);
      const confirmButton = document.querySelector(
        `.js-confirm-button-${orderId}`
      );
      modal.showModal();
      document.body.classList.add("no-scroll");

      closeButton.addEventListener("click", () => {
        modal.close();
        document.body.classList.remove("no-scroll");
      });

      modal.addEventListener("click", (e) => {
        const dialogDimensions = modal.getBoundingClientRect();
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          modal.close();
          document.body.classList.remove("no-scroll");
        }
      });

      confirmButton.addEventListener(
        "click",
        () => {
          deleteOrder(orderId);
          modal.close();
        },
        { once: true }
      );
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.querySelector(".logout-button");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();

        // Wyloguj: usuń token i dane użytkownika
        localStorage.removeItem("authToken");
        localStorage.removeItem("authEmail");

        // Przekierowanie do strony logowania
        window.location.href = "login.html";
      });
    }
  });
}

renderPlacedOrderSummary();
