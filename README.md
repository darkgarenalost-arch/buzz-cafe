# Clad Whale Ecommerce Website

Premium clothing ecommerce website built with plain HTML, CSS, and JavaScript.

## Structure

- `index.html` - Home
- `pages/` - Shop, Product Details, Wishlist, Cart, Checkout, Login, Sign Up, Account, Admin Dashboard
- `css/` - Shared responsive styling
- `js/` - Storefront, admin, data, Firebase, and Razorpay scripts
- `firebase/` - Firebase configuration
- `images/` - Approved logo, hero, preview, and product assets
- `icons/`, `fonts/`, `utils/` - Organized support folders

## Firebase

Firebase is initialized from `firebase/firebase-config.js` using the supplied Clad Whale project configuration.

The admin allowlist starts with:

```txt
darkgarenalost@gmail.com
```

Additional admins can be added from the Admin Dashboard. Before production launch, mirror the `admins` collection in Firebase security rules so admin-only writes are enforced server-side.

## Razorpay

The checkout flow is ready for Razorpay. Add the live/test key in:

```txt
js/razorpay.js
```

Replace:

```js
keyId: "ADD_RAZORPAY_KEY_ID_HERE"
```

with your Razorpay Key ID. Keep Razorpay Key Secret on a server or Cloud Function, never in browser JavaScript.

## Local Preview

Run from the project root:

```bash
python -m http.server 5177 --bind 127.0.0.1
```

Then open:

```txt
http://127.0.0.1:5177/
```
