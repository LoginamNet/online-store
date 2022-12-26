import { createEl, appendEl } from '../elements/elements';
import { ProductsData, CartData, PromoData, checkedQuerySelector } from '../../../types/exports';
import { drawProduct } from '../pruduct/drawProduct';
import { drawCartSummary } from './drawSummary';
import {
    deleteFromCart,
    checkEmptyCart,
    reduceAmount,
    increaseAmount,
    countCartTotal,
    countCartProducts,
} from './cartControls';
import './cart.css';

export function drawCartProducts(state: ProductsData[], cartState: CartData[], promoState: PromoData[]): void {
    const cartProductsContainer = checkedQuerySelector(document, '.cart-products__container');
    cartProductsContainer.innerHTML = '';

    for (let i = 0; i < cartState.length; i++) {
        drawCartProduct(state, cartState[i], i, cartState, promoState);
    }
}

function drawCartProduct(
    state: ProductsData[],
    item: CartData,
    number: number,
    cartState: CartData[],
    promoState: PromoData[]
): void {
    const cartContainer = checkedQuerySelector(document, '.cart-page__container');
    const cartProductsContainer = checkedQuerySelector(document, '.cart-products__container');

    const productContainer = createEl('cart-product__container', 'div');
    const productMainContaiter = createEl('cart-product__container_main', 'div');
    const productCartNumber = createEl('cart-product__label cart-product__number', 'span');
    const productDescriptionContainer = createEl('cart-product__container_desc', 'div');
    const productImage = createEl('cart-product__image', 'div');
    const productTitle = createEl('cart-product__title', 'span');
    const productDescription = createEl('cart-product__description', 'span');
    const productFeaturesContainer = createEl('cart-product__container_fatures', 'div');
    const productCategory = createEl('cart-product__label cart-product__category', 'span');
    const productBrand = createEl('cart-product__label cart-product__brand', 'span');
    const productRating = createEl('cart-product__label cart-product__rating', 'span');
    const productDiscount = createEl('cart-product__label cart-product__discount', 'span');
    const productAmountContainer = createEl('cart-product__container_amount', 'div');
    const productStock = createEl('cart-product__stock', 'span');
    const productDiscPrice = createEl('cart-product__price_disc', 'span');
    const productButtonsContainer = createEl('cart-product__container_buttons', 'div');
    const productAddButton = createEl('cart-product__button cart-product__button_add', 'button');
    const productBuyAmount = createEl('cart-product__amount', 'span');
    const productRemoveButton = createEl('cart-product__button cart-product__button_remove', 'button');

    appendEl(productMainContaiter, productCartNumber);
    appendEl(productMainContaiter, productImage);

    appendEl(productDescriptionContainer, productTitle);
    appendEl(productDescriptionContainer, productDescription);

    appendEl(productFeaturesContainer, productCategory);
    appendEl(productFeaturesContainer, productBrand);
    appendEl(productFeaturesContainer, productRating);
    appendEl(productFeaturesContainer, productDiscount);

    appendEl(productDescriptionContainer, productFeaturesContainer);
    appendEl(productMainContaiter, productDescriptionContainer);

    appendEl(productAmountContainer, productDiscPrice);
    appendEl(productAmountContainer, productStock);

    appendEl(productButtonsContainer, productRemoveButton);
    appendEl(productButtonsContainer, productBuyAmount);
    appendEl(productButtonsContainer, productAddButton);

    appendEl(productAmountContainer, productButtonsContainer);

    appendEl(productContainer, productMainContaiter);
    appendEl(productContainer, productAmountContainer);

    productMainContaiter.id = `${item.id}`;
    productCartNumber.textContent = (number + 1).toString();
    productImage.style.backgroundImage = `url(${item.thumbnail}`;
    productTitle.textContent = item.title;
    productDescription.textContent = item.description;
    productCategory.textContent = item.category;
    productBrand.textContent = item.brand;
    productRating.textContent = `${item.rating.toFixed(1)}`;
    productDiscount.textContent = `${item.discountPercentage}%`;
    productDiscPrice.textContent = `
        ${Math.floor(item.price * ((100 - item.discountPercentage) / 100)) * item.amount}€
    `;
    productStock.textContent = `In stock: ${item.stock}`;
    productAddButton.textContent = '+';
    productBuyAmount.textContent = `${item.amount}`;
    productRemoveButton.textContent = '-';

    productMainContaiter.addEventListener('click', () => {
        drawProduct(productMainContaiter.id, state, cartState);
    });

    productRemoveButton.addEventListener('click', () => {
        reduceAmount(
            productAddButton,
            'cart-product__button_disabled',
            productMainContaiter,
            productBuyAmount,
            cartState
        );
        deleteFromCart(productMainContaiter, cartState);
        drawCartProducts(state, cartState, promoState);
        countCartProducts(cartState);
        countCartTotal(cartState);
        drawCartSummary(cartState, promoState);
        checkEmptyCart(cartContainer, cartState);
        productDiscPrice.textContent = `
            ${Math.floor(item.price * ((100 - item.discountPercentage) / 100)) * item.amount}€
        `;
    });

    productAddButton.addEventListener('click', () => {
        increaseAmount(
            productAddButton,
            'cart-product__button_disabled',
            productMainContaiter,
            productBuyAmount,
            cartState
        );
        countCartProducts(cartState);
        countCartTotal(cartState);
        drawCartSummary(cartState, promoState);
        productDiscPrice.textContent = `
            ${Math.floor(item.price * ((100 - item.discountPercentage) / 100)) * item.amount}€
        `;
    });

    appendEl(cartProductsContainer, productContainer);
}
