# Firebase Collections

## admins

Create one document where the document ID is your Firebase Auth user UID.

```json
{
  "email": "owner@example.com",
  "role": "owner",
  "createdAt": "manual"
}
```

## products

```json
{
  "name": "Orca Bite Oversized Tee",
  "slug": "orca-bite-oversized-tee",
  "category": "oversized-tees",
  "tags": ["new-arrival", "best-seller", "featured"],
  "featured": true,
  "price": 1499,
  "salePrice": 999,
  "stock": 60,
  "sizes": ["S", "M", "L", "XL", "XXL"],
  "colors": ["Black", "Off White"],
  "images": ["https://..."],
  "description": "Premium product copy.",
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}
```

## orders

Orders are created by checkout and viewed in admin.

```json
{
  "customer": {
    "name": "Customer Name",
    "phone": "9999999999",
    "whatsapp": "9999999999",
    "email": "customer@example.com",
    "address": "Full address",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "items": [],
  "paymentMethod": "COD",
  "paymentStatus": "Pending COD",
  "status": "Placed",
  "total": 1299
}
```

## coupons

```json
{
  "code": "CLADWHALE10",
  "type": "percent",
  "value": 10,
  "minCart": 999,
  "active": true
}
```

## banners

```json
{
  "title": "Clad In Black. Built To Bite.",
  "eyebrow": "Fresh drops",
  "subtitle": "Homepage banner copy.",
  "image": "https://...",
  "cta": "Shop now",
  "link": "products/",
  "position": 1,
  "active": true
}
```

## settings/site

```json
{
  "logoUrl": "https://firebasestorage.googleapis.com/...",
  "faviconUrl": "https://firebasestorage.googleapis.com/..."
}
```

